import {container} from "@/container";
import {TaskService} from "@/modules/task";
import {CardService} from "@/modules/card";
import {AnchorService} from "@/modules/anchor";

export async function POST(request: Request): Promise<Response>
{
    const data = await request.json();

    const taskService = container.get(TaskService);
    const cardService = container.get(CardService);
    const anchorService = container.get(AnchorService);
    const tasks = await taskService.findByFootprint(data.taskId);
    const anchor = await anchorService.get(data.anchorId);
    await cardService.mapPile(tasks, anchor!.base);
    await anchorService.delete(anchor!.id);

    return Response.json(tasks);
}
