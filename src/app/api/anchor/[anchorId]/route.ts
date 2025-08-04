import {container} from "@/container";
import {AnchorService} from "@/modules/visualization";

export const GET = async (
    _: Request,
    {params}: {params: Promise<{anchorId: string}>}
): Promise<Response> => {
    const {anchorId} = await params;

    const anchorService = container.get(AnchorService);
    const anchor = await anchorService.get(anchorId);

    if (!anchor) {
        return Response.json(
            {
                error: `Anchor ${anchorId} not found.`,
            },
            {
                status: 404,
            }
        );
    }

    return Response.json(anchor);
}
