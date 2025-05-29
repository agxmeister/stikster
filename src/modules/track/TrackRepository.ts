import {inject, injectable} from "inversify";
import {Miro} from "@/miro";
import {Task} from "@/modules/task";
import {getColor, Track, Cursor, moveCursor} from "./";

@injectable()
export class TrackRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
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
