import {container} from "@/container";
import {TaskService} from "@/modules/task";
import {CardService} from "@/modules/card";

export async function POST(request: Request): Promise<Response>
{
    const data = await request.json();

    const taskService = container.get(TaskService);
    const cardService = container.get(CardService);
    const tasks = await taskService.getPile(data.key);
    await cardService.mapPile(tasks);

    return Response.json(tasks);
}
