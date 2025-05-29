import {inject, injectable} from "inversify";
import {format} from "date-fns";
import {Miro} from "@/miro";
import {getNextWorkday, getWorkday, Task} from "@/modules/task";
import {Range} from "@/modules/visualization";
import {getColor, Track, Cursor, moveCursor} from "./";
import {getWorkdaysDiff} from "@/modules/task";

@injectable()
export class TrackRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
    }

    async createByRange(range: Range, cursor: Cursor): Promise<[Track, Cursor]>
    {
        const track = [];

        const wordDaysCount = getWorkdaysDiff(range.begin, range.end);
        let workDay = getWorkday(range.begin, 0);
        for (let i = 0; i < wordDaysCount; i++) {
            const leaf = await this.miro.addStickyNote(
                format(workDay, 'MMM dd'),
                'gray',
                cursor.position.x + (i * cursor.size.width),
                cursor.position.y,
                cursor.size.width
            );
            track.push(leaf);
            workDay = getNextWorkday(workDay);
        }

        return [track, moveCursor(cursor, 0, 1)]
    }

    async create(task: Task, cursor: Cursor): Promise<[Track, Cursor]>
    {
        const track = [];

        for (let i = 0; i < task.length; i++) {
            const leaf = await this.miro.addStickyNote(
                task.summary,
                getColor(task, i),
                cursor.position.x + (i * cursor.size.width),
                cursor.position.y,
                cursor.size.width
            );
            track.push(leaf);
        }

        return [track, moveCursor(cursor, 0, task.length)];
    }

    async find(labels: string[]): Promise<any[]>
    {
        return await this.miro.findStickyNotes(labels);
    }
}
