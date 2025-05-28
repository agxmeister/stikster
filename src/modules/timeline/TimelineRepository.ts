import fs from "node:fs";
import {inject, injectable} from "inversify";
import {TaskService} from "@/modules/task";
import {Timeline} from "@/modules/timeline";
import {v4 as uuid} from "uuid";

@injectable()
export class TimelineRepository
{
    constructor(@inject(TaskService) readonly taskService: TaskService)
    {
    }

    async create(taskIds: string[]): Promise<Timeline>
    {
        const branches = [];
        for (const taskId of taskIds) {
            const tasks = await this.taskService.findByFootprint(taskId);
            branches.push({
                footprint: taskId,
                begin: tasks
                    .map(task => task.started)
                    .reduce((acc, begin) => begin < acc ? begin : acc),
                end: tasks
                    .map(task => task.completed)
                    .reduce((acc, end) => end > acc ? end : acc),
                tasks: tasks,
            });
        }

        const timeline = {
            id: uuid(),
            branches: branches,
            begin: branches
                .map(branch => branch.begin)
                .reduce((acc, begin) => begin < acc ? begin : acc),
            end: branches
                .map(branch => branch.end)
                .reduce((acc, end) => end > acc ? end : acc),
        };

        await fs.promises.writeFile(`./data/timelines/${timeline.id}.json`, JSON.stringify(timeline, null, 4));

        return timeline;
    }

    async get(id: string): Promise<Timeline | null>
    {
        try {
            const data = await fs.promises.readFile(`./data/timelines/${id}.json`, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }
}
