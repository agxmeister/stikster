import {inject, injectable} from "inversify";
import {TaskRepository} from "@/modules/timeline/repository/TaskRepository";
import type {Task} from "@/modules/timeline/types";

@injectable()
export class TaskService
{
    constructor(@inject(TaskRepository) readonly taskRepository: TaskRepository)
    {
    }

    async findByFootprint(taskId: string): Promise<Task[]>
    {
        return this.taskRepository.retrieveByJql(`key in (${taskId}) OR parent in (${taskId}) OR issue in linkedIssues(${taskId}, "Introduces")`);
    }
}
