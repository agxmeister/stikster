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
        const response = await fetch(`${this.url}/rest/api/2/status`, {
            method: "GET",
            headers: this.getHeaders(),
        });
        return await response.json();
    }

    async search(jql: string): Promise<any>
    {
        const fetchAll = async (nextPageToken: string|null = null): Promise<any> => {
            const response = await fetch(`${this.url}/rest/api/2/search/jql`, {
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

            if (!data.issues) {
                return [];
            }

            const statuses = await this.getStatuses();
            const tasks = data.issues.map((issue: any) => {
                return {
                    key: issue.key,
                    type: issue.fields.issuetype.name,
                    summary: issue.fields.summary,
                    url: `${this.url}/browse/${issue.key}`,
                    intervals: getIntervals(
                        getStatusChanges(issue),
                        statuses
                            .filter((status: any) => status.statusCategory.name === "In Progress")
                            .map((status: any) => status.id),
                        statuses
                            .filter((status: any) => status.statusCategory.name === "Done")
                            .map((status: any) => status.id),
                    ),
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
