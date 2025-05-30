import {inject, injectable} from "inversify";
import {getWorkdaysDiff} from "@/modules/task/utils";
import {Task} from "@/modules/task";
import {TrackRepository, Track, Cursor, moveCursor} from "./";
import {Range} from "@/modules/visualization";

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

    async createTrackByRange(range: Range, cursor: Cursor): Promise<[Track, Cursor]>
    {
        return await this.trackRepository.createByRange(range, cursor);
    }

    async createTracksByTasks(tasks: Task[], cursor: Cursor, range: Range): Promise<[Track[], Cursor]>
    {
        const tracks = [];

        let row = 0;
        for (const task of tasks.sort((a: Task, b: Task) => a.started > b.started ? 1 : a.started < b.started ? -1 : 0)) {
            const column = getWorkdaysDiff(range.begin, task.started) - 1;
            const [newTrack, _] = await this.trackRepository.createByTask(task, moveCursor(cursor, column, row));
            tracks.push(newTrack);
            row++;
        }

        return [tracks, moveCursor(cursor, 0, row)];
    }
}
