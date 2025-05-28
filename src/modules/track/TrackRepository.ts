import {inject, injectable} from "inversify";
import {Miro} from "@/miro";
import {Task} from "@/modules/task";
import {getColor, Base, Track} from "./";

@injectable()
export class TrackRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
    }

    async create(task: Task, base: Base, column: number, row: number): Promise<Track>
    {
        const card = [];
        for (let i = 0; i < task.length; i++) {
            const leaf = await this.miro.addStickyNote(
                task.summary,
                getColor(task, i),
                base.position.x + ((column + i) * base.size.width),
                base.position.y + (row * base.size.height),
                base.size.width
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
