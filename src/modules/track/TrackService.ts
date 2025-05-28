import {Task} from "@/modules/task";
import {inject, injectable} from "inversify";
import {getWorkdaysDiff} from "@/modules/task/utils";
import {TrackRepository, Track, Cursor} from "./";

@injectable()
export class TrackService
{
    constructor(@inject(TrackRepository) readonly cardRepository: TrackRepository)
    {
    }

    async find(labels: string[]): Promise<any[]>
    {
        return await this.cardRepository.find(labels);
    }

    async createPile(tasks: Task[], cursor: Cursor): Promise<Track[]>
    {
        const earliestTask = tasks.reduce(
            (earliest: Task, task: Task) => earliest.started < task.started ? earliest : task
        );

        const cards = [];

        let row = 0;
        for (const task of tasks.sort((a: Task, b: Task) => a.started > b.started ? 1 : a.started < b.started ? -1 : 0)) {
            const column = getWorkdaysDiff(earliestTask.started, task.started) - 1;
            cards.push(await this.cardRepository.create(task, cursor, column, row));
            row++;
        }

        return cards
    }
}
