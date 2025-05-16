import {injectable} from "inversify";

@injectable()
export class Jira
{
    constructor(readonly url: string, readonly username: string, readonly password: string)
    {
    }

    async search(jql: string): Promise<any>
    {
        const fetchAll = async (nextPageToken: string|null = null): Promise<any> => {
            const response = await fetch(`${this.url}/search/jql`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(
                        `${this.username}:${this.password}`
                    ).toString('base64')}`,
                },
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

            const getCompletionDate = (statusChanges: any) => statusChanges
                .sort((a: any, b: any) => a.created > b.created ? -1 : a.created < b.created ? 1 : 0)
                .find((change: any) => change.to === "10002")?.created || null;

            const tasks = data.issues.map((issue: any) => ({
                key: issue.key,
                summary: issue.fields.summary,
                completed: getCompletionDate(getStatusChanges(issue)),
            }));
            if (!data?.nextPageToken) {
                return tasks;
            } else {
                return [...tasks, ...(await fetchAll(data.nextPageToken))];
            }
        };
        return await fetchAll();
    }
}
