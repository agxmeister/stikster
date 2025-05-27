import {Task} from "@/modules/task";
import {inject, injectable} from "inversify";
import {CardRepository} from "@/modules/card/CardRepository";
import {getWorkdaysDiff} from "@/modules/task/utils";
import {Anchor} from "@/modules/anchor/types";
import {Base} from "@/modules/card/types";

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

    async mapPile(tasks: Task[], base: Base): Promise<void>
    {
        const earliestTask = tasks.reduce(
            (earliest: Task, task: Task) => earliest.started < task.started ? earliest : task
        );

        let row = 0;
        for (const task of tasks.sort((a: Task, b: Task) => a.started > b.started ? 1 : a.started < b.started ? -1 : 0)) {
            const column = getWorkdaysDiff(earliestTask.started, task.started) - 1;
            await this.cardRepository.create(task, base, column, row);
            row++;
        }
    }
}
