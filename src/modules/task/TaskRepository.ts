import {inject, injectable} from "inversify";
import {Jira} from "@/jira/jira";
import {getTask} from "@/modules/task";
import type {Task} from "@/modules/task";

@injectable()
export class TaskRepository {
    constructor(@inject(Jira)readonly jira: Jira)
    {
    }

    async retrieveByKey(key: string): Promise<Task> {
        const [task] = (await this.jira.search(`key = ${key}`)).map(getTask);
        return task;
    }

    async retrievePileByKey(key: string): Promise<Task[]> {
        return (await this.jira.search(`key in (${key}) OR parent in (${key}) OR issue in linkedIssues(${key}, "Introduces")`))
            .map(getTask);
    }

    async retrieveByKeys(keys: string[]): Promise<Task[]> {
        return (await this.jira.search(`key in (${keys.join(', ')})`)).map(getTask);
    }
}
