import {inject, injectable} from "inversify";
import {Jira} from "@/jira/jira";

@injectable()
export class TaskRepository {
    constructor(@inject(Jira)readonly jira: Jira)
    {
    }

    async retrieveByKey(key: string) {
        const [task] = await this.jira.search(`key = ${key}`);
        return task;
    }

    async retrievePileByKey(key: string) {
        return await this.jira.search(`key in (${key}) OR parent in (${key}) OR issue in linkedIssues(${key}, "Introduces")`);
    }

    async retrieveByKeys(keys: string[]) {
        return await this.jira.search(`key in (${keys.join(', ')})`);
    }
}
