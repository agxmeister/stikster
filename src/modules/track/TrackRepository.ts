import {inject, injectable} from "inversify";
import {Miro} from "@/miro";
import {Task} from "@/modules/task";
import {getColor, Track, Cursor} from "./";

@injectable()
export class TrackRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
    }

    async create(task: Task, cursor: Cursor, column: number, row: number): Promise<Track>
    {
        const card = [];
        for (let i = 0; i < task.length; i++) {
            const leaf = await this.miro.addStickyNote(
                task.summary,
                getColor(task, i),
                cursor.position.x + ((column + i) * cursor.size.width),
                cursor.position.y + (row * cursor.size.height),
                cursor.size.width
            );
            card.push(leaf);
        }
        return card;
    }

    async find(labels: string[]): Promise<any[]>
    {
        return await this.miro.findStickyNotes(labels);
    }
}
