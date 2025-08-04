import {container} from "@/container";
import {VisualizationService} from "@/modules/visualization";

export const GET = async (
    _: Request,
    {params}: {params: Promise<{visualizationId: string}>}
): Promise<Response> => {
    const {visualizationId} = await params;

    const visualizationService = container.get(VisualizationService);
    const visualization = await visualizationService.get(visualizationId);

    if (!visualization) {
        return Response.json(
            {
                error: `Visualization ${visualizationId} not found.`,
            },
            {
                status: 404,
            }
        );
    }

    return Response.json(visualization);
}
