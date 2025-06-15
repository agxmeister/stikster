import {container} from "@/container";
import {AnchorService} from "@/modules/visualization";

export async function PUT(request: Request): Promise<Response>
{
    const data = await request.json();

    const anchorService = container.get(AnchorService);
    const anchor = await anchorService.create(data.boardId, data.label);
    if (!anchor) {
        return Response.json({
            error: `Failed to create anchor by label "${data.label}"`,
        }, {
            status: 400,
        });
    }

    return Response.json(anchor);
}
