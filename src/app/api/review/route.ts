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
    const tasks = await taskService.getPile(data.task);
    const anchor = await anchorService.get(data.anchor);
    await cardService.mapPile(tasks, anchor!.base);

    return Response.json(tasks);
}
