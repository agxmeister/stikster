import {Task} from "@/modules/task";
import {inject, injectable} from "inversify";
import {CardRepository} from "@/modules/card/CardRepository";

@injectable()
export class CardService
{
    constructor(@inject(CardRepository) readonly cardRepository: CardRepository)
    {
    }

    async mapPile(tasks: Task[]): Promise<void>
    {
        let row = 0;
        for (const task of tasks.sort((a: Task, b: Task) => a.started > b.started ? 1 : a.started < b.started ? -1 : 0)) {
            await this.cardRepository.create(task, 0, row);
            row++;
        }
    }
}
