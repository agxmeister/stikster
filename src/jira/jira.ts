import {injectable} from "inversify";
import {getDateCompleted, getDateStarted, getIntervals, getStatusChanges} from "@/jira/utils";

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
                        "issuetype",
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

            const tasks = data.issues.map((issue: any) => {
                const statusChanges = getStatusChanges(issue);
                return {
                    key: issue.key,
                    type: issue.fields.issuetype.name,
                    summary: issue.fields.summary,
                    started: getDateStarted(statusChanges, progressStatusIds),
                    completed: getDateCompleted(statusChanges, doneStatusIds),
                    intervals: getIntervals(statusChanges, progressStatusIds, doneStatusIds),
                }
            });

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
