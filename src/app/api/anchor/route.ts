import {z as zod} from "zod";
import {container} from "@/container";
import {AnchorService, anchorRequestBodySchema} from "@/modules/visualization";

export async function POST(request: Request): Promise<Response>
{
    const data: zod.infer<typeof anchorRequestBodySchema> = await request.json();

    const anchorService = container.get(AnchorService);
    const anchor = await anchorService.create(data.boardId, data.label);
    if (!anchor) {
        return Response.json({
            error: `Failed to create anchor by label '${data.label}'.`,
        }, {
            status: 400,
        });
    }

    return Response.json(anchor);
}
