import {container} from "@/container";
import {TimelineService} from "@/modules/timeline";

export const GET = async (
    _: Request,
    {params}: {params: Promise<{timelineId: string}>}
): Promise<Response> => {
    const {timelineId} = await params;

    const timelineService = container.get(TimelineService);
    const timeline = await timelineService.get(timelineId);

    if (!timeline) {
        return Response.json(
            {
                error: `Timeline ${timelineId} not found.`,
            },
            {
                status: 404,
            }
        );
    }

    return Response.json(timeline);
}
