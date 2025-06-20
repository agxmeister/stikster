import fs from "node:fs";
import {v4 as uuid} from "uuid";
import {inject, injectable} from "inversify";
import {TaskService} from "@/modules/timeline/service/TaskService";
import type {Timeline} from "@/modules/timeline/types";

@injectable()
export class TimelineRepository
{
    constructor(@inject(TaskService) readonly taskService: TaskService)
    {
    }

    async create(taskIds: string[]): Promise<Timeline>
    {
        const now = (new Date()).toISOString();

        const branches = [];
        for (const taskId of taskIds) {
            const tasks = await this.taskService.findByFootprint(taskId);
            branches.push({
                footprint: taskId,
                begin: tasks.length > 0 ? tasks
                    .map(task => task.started)
                    .reduce((acc, begin) => begin < acc ? begin : acc) : now,
                end: tasks.length > 0 ? tasks
                    .map(task => task.completed)
                    .reduce((acc, end) => end > acc ? end : acc) : now,
                tasks: tasks,
            });
        }

        const timeline = {
            id: uuid(),
            branches: branches,
            begin: branches.length > 0 ? branches
                .map(branch => branch.begin)
                .reduce((acc, begin) => begin < acc ? begin : acc): now,
            end: branches.length > 0 ? branches
                .map(branch => branch.end)
                .reduce((acc, end) => end > acc ? end : acc): now,
        };

        await fs.promises.writeFile(`${process.env.DATA_PATH}/timelines/${timeline.id}.json`, JSON.stringify(timeline, null, 4));

        return timeline;
    }

    async get(id: string): Promise<Timeline | null>
    {
        try {
            const data = await fs.promises.readFile(`${process.env.DATA_PATH}/timelines/${id}.json`, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }
}
