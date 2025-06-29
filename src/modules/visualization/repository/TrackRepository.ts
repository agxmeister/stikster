import {inject, injectable} from "inversify";
import {format} from "date-fns";
import {v4 as uuid} from "uuid";
import {Miro} from "@/integrations/miro/miro";
import {Track, Leaf, Cursor, Range, getColor, moveCursor} from "@/modules/visualization";
import {getNextWorkday, getWorkday, getWorkdaysDiff} from "@/modules/timeline/utils";
import {Task} from "@/modules/timeline";
import {copyCursor} from "@/modules/visualization/utils";

@injectable()
export class TrackRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
    }

    async createByRange(range: Range, cursor: Cursor): Promise<[Track, Cursor]>
    {
        const track = {
            id: uuid(),
            leaves: [] as Leaf[],
        };

        const wordDaysCount = getWorkdaysDiff(range.begin, range.end);
        let workDay = getWorkday(range.begin, 0);
        for (let i = 0; i < wordDaysCount; i++) {
            const currentCursor = moveCursor(cursor, i, 0);
            const leaf = await this.miro.addStickyNote(
                currentCursor.boardId,
                format(workDay, 'MMM dd'),
                'gray',
                currentCursor.position.x,
                currentCursor.position.y,
                currentCursor.size.width
            );
            track.leaves.push({
                id: leaf.id,
                cursor: copyCursor(currentCursor),
            });
            workDay = getNextWorkday(workDay);
        }

        return [track, moveCursor(cursor, 0, 1)]
    }

    async createByTask(task: Task, cursor: Cursor): Promise<[Track, Cursor]>
    {
        const track = {
            id: uuid(),
            leaves: [] as Leaf[],
        };

        if (["Story", "Custom Activity"].includes(task.type)) {
            const infoCursor = moveCursor(cursor, -1, 0);
            const cost = task.cost / 3600 * 100;
            const leaf = await this.miro.addStickyNote(
                infoCursor.boardId,
                `Cost: <b>€${cost}</b><br/>Duration: <b>${task.length} days</b>`,
                'gray',
                infoCursor.position.x,
                infoCursor.position.y,
                infoCursor.size.width
            );
            track.leaves.push({
                id: leaf.id,
                cursor: copyCursor(infoCursor),
            });
        }

        for (let i = 0; i < task.length; i++) {
            const currentCursor = moveCursor(cursor, i, 0);
            const leaf = await this.miro.addStickyNote(
                currentCursor.boardId,
                `<a href="${task.url}" target="_blank">${task.key}</a><br/>${task.summary}`,
                getColor(task, i),
                currentCursor.position.x,
                currentCursor.position.y,
                currentCursor.size.width
            );
            track.leaves.push({
                id: leaf.id,
                cursor: copyCursor(currentCursor),
            });
        }

        return [track, moveCursor(cursor, 0, task.length)];
    }

    async find(boardId: string, labels: string[]): Promise<any[]>
    {
        return await this.miro.findStickyNotes(boardId, labels);
    }
}
