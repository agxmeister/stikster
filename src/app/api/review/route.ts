import {container} from "@/container";
import {TaskRepository} from "@/modules/task/TaskRepository";
import {CardRepository} from "@/modules/card/CardRepository";

export async function POST(request: Request): Promise<Response>
{
    const data = await request.json();

    const taskRepository = container.get(TaskRepository);
    const tasks = await taskRepository.retrievePileByKey(data.key);
    const cardRepository = container.get(CardRepository);
    for (const task of tasks) {
        await cardRepository.create(task);
    }

    return Response.json(tasks);
}
