import {injectable} from "inversify";
import {getIntervals, getStatusChanges} from "@/integrations/jira/utils";

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

    async getChangelog(issueKey: string): Promise<any>
    {
        const getChangelogChunk = async (startAt: number = 0): Promise<any[]> => {
            const response = await fetch(`${this.url}/rest/api/2/issue/${issueKey}/changelog?startAt=${startAt}`, {
                method: "GET",
                headers: this.getHeaders(),
            });
            const data = await response.json();

            if (!data.values || data.values.length === 0) {
                return [];
            }

            return [...data.values, ...(await getChangelogChunk(startAt + data.values.length))];
        };
        return await getChangelogChunk();
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
                        "aggregatetimespent",
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
            const progressStatusIds = statuses
                .filter((status: any) => status.statusCategory.name === "In Progress")
                .map((status: any) => status.id);
            const doneStatusIds = statuses
                .filter((status: any) => status.statusCategory.name === "Done")
                .map((status: any) => status.id);
            const tasks = await Promise.all(data.issues.map(async (issue: any) => {
                const histories = issue.changelog.maxResults >= issue.changelog.total
                    ? issue.changelog.histories
                    : await this.getChangelog(issue.key);
                return {
                    key: issue.key,
                    type: issue.fields.issuetype.name,
                    summary: issue.fields.summary,
                    cost: issue.fields.aggregatetimespent,
                    url: `${this.url}/browse/${issue.key}`,
                    intervals: getIntervals(
                        getStatusChanges(histories),
                        progressStatusIds,
                        doneStatusIds,
                    ),
                    ongoing: !doneStatusIds.includes(issue.fields.status.id),
                }
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
