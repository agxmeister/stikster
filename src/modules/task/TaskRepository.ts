import {inject, injectable} from "inversify";
import {Jira} from "@/jira";

@injectable()
export class TaskRepository {
    constructor(@inject(Jira)readonly jira: Jira)
    {
    }

    async getByKeys(keys: string[]) {
        const tasks = await this.jira.getByJql(`key in (${keys.join(', ')})`);
        console.log(tasks);
    }
}
