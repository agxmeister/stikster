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
                    nextPageToken: nextPageToken,
                }),
            });
            const data = await response.json();
            const tasks = data.issues.map((issue: any) => ({
                key: issue.key,
                summary: issue.fields.summary,
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
