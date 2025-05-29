import {Task} from "@/modules/task";
import {inject, injectable} from "inversify";
import {getWorkdaysDiff} from "@/modules/task/utils";
import {TrackRepository, Track, Cursor, moveCursor} from "./";

@injectable()
export class TrackService
{
    constructor(@inject(TrackRepository) readonly trackRepository: TrackRepository)
    {
    }

    async find(labels: string[]): Promise<any[]>
    {
        return await this.trackRepository.find(labels);
    }

    async createTracks(tasks: Task[], cursor: Cursor): Promise<[Track[], Cursor]>
    {
        const earliestTask = tasks.reduce(
            (earliest: Task, task: Task) => earliest.started < task.started ? earliest : task
        );

        const tracks = [];

        let row = 0;
        for (const task of tasks.sort((a: Task, b: Task) => a.started > b.started ? 1 : a.started < b.started ? -1 : 0)) {
            const column = getWorkdaysDiff(earliestTask.started, task.started) - 1;
            const [newTrack, _] = await this.trackRepository.create(task, moveCursor(cursor, column, row));
            tracks.push(newTrack);
            row++;
        }

        return [tracks, moveCursor(cursor, 0, row)];
    }
}
