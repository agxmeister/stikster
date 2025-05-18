import {inject, injectable} from "inversify";
import {TaskRepository} from "@/modules/task/TaskRepository";
import {Task} from "@/modules/task/types";

@injectable()
export class TaskService
{
    constructor(@inject(TaskRepository) readonly taskRepository: TaskRepository)
    {
    }

    async getPile(key: string): Promise<Task[]>
    {
        return this.taskRepository.retrieveByJql(`key in (${key}) OR parent in (${key}) OR issue in linkedIssues(${key}, "Introduces")`);
    }
}
