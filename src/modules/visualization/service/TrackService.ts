import {inject, injectable} from "inversify";
import {TrackRepository} from "@/modules/visualization/repository/TrackRepository";
import {Track, Cursor, Range, moveCursor} from "@/modules/visualization";
import {Task} from "@/modules/timeline";
import {getWorkdaysDiff} from "@/modules/timeline/utils";

@injectable()
export class TrackService
{
    constructor(@inject(TrackRepository) readonly trackRepository: TrackRepository)
    {
    }

    async find(boardId: string, labels: string[]): Promise<any[]>
    {
        return await this.trackRepository.find(boardId, labels);
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
