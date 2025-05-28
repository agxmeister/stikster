import {Task} from "@/modules/task";
import {inject, injectable} from "inversify";
import {CardRepository, Card, Base} from "@/modules/card";
import {getWorkdaysDiff} from "@/modules/task/utils";

@injectable()
export class CardService
{
    constructor(@inject(CardRepository) readonly cardRepository: CardRepository)
    {
    }

    async find(labels: string[]): Promise<any[]>
    {
        return await this.cardRepository.find(labels);
    }

    async createPile(tasks: Task[], base: Base): Promise<Card[]>
    {
        const earliestTask = tasks.reduce(
            (earliest: Task, task: Task) => earliest.started < task.started ? earliest : task
        );

        const cards = [];

        let row = 0;
        for (const task of tasks.sort((a: Task, b: Task) => a.started > b.started ? 1 : a.started < b.started ? -1 : 0)) {
            const column = getWorkdaysDiff(earliestTask.started, task.started) - 1;
            cards.push(await this.cardRepository.create(task, base, column, row));
            row++;
        }

        return cards
    }
}
