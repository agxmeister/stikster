import {container} from "@/container";
import {TimelineService} from "@/modules/timeline";

export const POST = async (request: Request): Promise<Response> => {
    const data = await request.json();

    const timelineService = container.get(TimelineService);
    const timeline = await timelineService.create(data.taskIds)

    return Response.json(timeline);
}
