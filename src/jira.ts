import {injectable} from "inversify";

@injectable()
export class Jira
{
    constructor(readonly url: string, readonly username: string, readonly password: string)
    {
    }

    async getStatuses(): Promise<any>
    {
        const response = await fetch(`${this.url}/status`, {
            method: "GET",
            headers: this.getHeaders(),
        });
        return await response.json();
    }

    async search(jql: string): Promise<any>
    {
        const fetchAll = async (nextPageToken: string|null = null): Promise<any> => {
            const response = await fetch(`${this.url}/search/jql`, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    jql: jql,
                    fields: [
                        "key",
                        "summary",
                    ],
                    expand: "changelog",
                    nextPageToken: nextPageToken,
                }),
            });
            const data = await response.json();

            const statuses = await this.getStatuses();
            const progressStatusIds = statuses
                .filter((status: any) => status.statusCategory.name === "In Progress")
                .map((status: any) => status.id);
            const doneStatusIds = statuses
                .filter((status: any) => status.statusCategory.name === "Done")
                .map((status: any) => status.id);

            const getStatusChanges = (issue: any) => issue.changelog.histories
                .reduce(
                    (acc: any[], history: any) => [
                        ...acc,
                        ...history.items.map(
                            (item: any) => ({
                                ...item,
                                created: history.created,
                            })
                        )],
                    [],
                )
                .filter((item: any) => item.field === "status");

            const getDateStarted = (statusChanges: any) => statusChanges
                .sort((a: any, b: any) => a.created > b.created ? 1 : a.created < b.created ? -1 : 0)
                .find((change: any) => progressStatusIds.includes(change.to))?.created || null;

            const getDateCompleted = (statusChanges: any) => statusChanges
                .sort((a: any, b: any) => a.created > b.created ? -1 : a.created < b.created ? 1 : 0)
                .find((change: any) => doneStatusIds.includes(change.to))?.created || null;

            const tasks = data.issues.map((issue: any) => ({
                key: issue.key,
                summary: issue.fields.summary,
                started: getDateStarted(getStatusChanges(issue)),
                completed: getDateCompleted(getStatusChanges(issue)),
            }));
            if (!data?.nextPageToken) {
                return tasks;
            } else {
                return [...tasks, ...(await fetchAll(data.nextPageToken))];
            }
        };
        return await fetchAll();
    }

    getHeaders(): Record<string, any>
    {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(
                `${this.username}:${this.password}`
            ).toString('base64')}`,
        }
    }
}
