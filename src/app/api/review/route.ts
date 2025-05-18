import {container} from "@/container";
import {TaskRepository} from "@/modules/task";
import {CardService} from "@/modules/card";

export async function POST(request: Request): Promise<Response>
{
    const data = await request.json();

    const taskRepository = container.get(TaskRepository);
    const tasks = await taskRepository.retrievePileByKey(data.key);
    const cardService = container.get(CardService);
    await cardService.mapPile(tasks);

    return Response.json(tasks);
}
