import {inject, injectable} from "inversify";
import {Jira} from "@/jira/jira";
import type {Task} from "@/modules/timeline/types";
import {refineJiraData} from "@/modules/timeline/utils";

@injectable()
export class TaskRepository {
    constructor(@inject(Jira) readonly jira: Jira)
    {
    }

    async retrieveByKey(key: string): Promise<Task> {
        const [task] = await this.retrieveByJql(`key = ${key}`)
        return task;
    }

    async retrieveByKeys(keys: string[]): Promise<Task[]> {
        return await this.retrieveByJql(`key in (${keys.join(', ')})`);
    }

    async retrieveByJql(jql: string): Promise<Task[]> {
        return (await this.jira.search(jql))
            .map(refineJiraData);
    }
}
