import {container} from "@/container";
import {TaskRepository} from "@/modules/task/TaskRepository";
import {Miro} from "@/miro";
import {CardRepository} from "@/modules/card/CardRepository";

export async function POST(request: Request): Promise<Response>
{
    const data = await request.json();

    const taskRepository = container.get(TaskRepository);
    const task = await taskRepository.retrieveByKey(data.key);
    const cardRepository = container.get(CardRepository);
    cardRepository.create(task)


    return Response.json(task);
}
