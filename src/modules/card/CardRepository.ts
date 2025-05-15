import {inject, injectable} from "inversify";
import {Miro} from "@/miro";

@injectable()
export class CardRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
    }

    async create(task: any): Promise<void>
    {
        await this.miro.addStickyNote(task.summary);
    }
}
