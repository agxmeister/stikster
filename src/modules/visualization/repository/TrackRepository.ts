import {inject, injectable} from "inversify";
import {format} from "date-fns";
import {Miro} from "@/miro";
import {Track, Cursor, Range, getColor, moveCursor} from "@/modules/visualization";
import {getNextWorkday, getWorkday, getWorkdaysDiff} from "@/modules/timeline/utils";
import {Task} from "@/modules/timeline";

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
                cursor.boardId,
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

    async createByTask(task: Task, cursor: Cursor): Promise<[Track, Cursor]>
    {
        const track = [];

        for (let i = 0; i < task.length; i++) {
            const leaf = await this.miro.addStickyNote(
                cursor.boardId,
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

    async find(boardId: string, labels: string[]): Promise<any[]>
    {
        return await this.miro.findStickyNotes(boardId, labels);
    }
}
