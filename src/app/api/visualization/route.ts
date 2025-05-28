import {container} from "@/container";
import {AnchorService} from "@/modules/anchor";
import {TimelineService} from "@/modules/timeline";
import {VisualizationService} from "@/modules/visualization";

export async function PUT(request: Request): Promise<Response>
{
    const data = await request.json();

    const timelineService = container.get(TimelineService);
    const timeline = await timelineService.get(data.timelineId);

    const anchorService = container.get(AnchorService);
    const anchor = await anchorService.get(data.anchorId);

    const visualizationService = container.get(VisualizationService);
    const visualization = await visualizationService.create(timeline!, anchor!);

    return Response.json(visualization);
}
