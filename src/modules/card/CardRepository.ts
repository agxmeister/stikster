import {inject, injectable} from "inversify";
import {Miro} from "@/miro";
import {Task} from "@/modules/task";
import {getColor} from "@/modules/card/utils";
import {Base} from "@/modules/card/types";

@injectable()
export class CardRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
    }

    async create(task: Task, base: Base, column: number, row: number): Promise<void>
    {
        for (let i = 0; i < task.length; i++) {
            await this.miro.addStickyNote(
                task.summary,
                getColor(task, i),
                base.position.x + ((column + i) * base.size.width),
                base.position.y + (row * base.size.height),
                base.size.width
            );
        }
    }

    async find(labels: string[]): Promise<any[]>
    {
        return await this.miro.findStickyNotes(labels);
    }
}
