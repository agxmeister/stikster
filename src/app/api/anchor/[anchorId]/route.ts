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

export const DELETE = async (
    _: Request,
    {params}: {params: Promise<{anchorId: string}>}
): Promise<Response> => {
    const {anchorId} = await params;

    const anchorService = container.get(AnchorService);
    const anchor = await anchorService.get(anchorId);

    try {
        if (anchor) {
            await anchorService.delete(anchor.id);
        }
        return Response.json(
            {
                message: `Anchor ${anchorId} has been successfully deleted.`,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                error: `Failed to delete anchor ${anchorId}.`,
                details: error,
            },
            {
                status: 500,
            }
        );
    }
}
