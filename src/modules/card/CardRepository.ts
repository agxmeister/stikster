import {inject, injectable} from "inversify";
import {Miro} from "@/miro";
import {Task} from "@/modules/task";

@injectable()
export class CardRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
    }

    async create(task: Task, column: number, row: number): Promise<void>
    {
        for (let i = 0; i < task.length; i++) {
            await this.miro.addStickyNote(task.summary, (column + i) * 100, row * 100);
        }
    }
}
