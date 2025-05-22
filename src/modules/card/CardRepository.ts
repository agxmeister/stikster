import {inject, injectable} from "inversify";
import {Miro} from "@/miro";
import {Task} from "@/modules/task";
import {getColor} from "@/modules/card/utils";

@injectable()
export class CardRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
    }

    async create(task: Task, column: number, row: number): Promise<void>
    {
        for (let i = 0; i < task.length; i++) {
            await this.miro.addStickyNote(task.summary, getColor(task, i), (column + i) * 100, row * 100);
        }
    }

    async find(labels: string[]): Promise<any[]>
    {
        return await this.miro.findStickyNotes(labels);
    }
}
