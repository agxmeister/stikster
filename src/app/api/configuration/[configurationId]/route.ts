import {container} from "@/container";
import {ConfigurationService} from "@/modules/configuration";

export const GET = async (
    _: Request,
    {params}: {params: Promise<{configurationId: string}>}
): Promise<Response> => {
    const {configurationId} = await params;

    const configurationService = container.get(ConfigurationService);
    const configuration = await configurationService.get(configurationId);

    if (!configuration) {
        return Response.json(
            {
                error: `Configuration ${configurationId} not found.`,
            },
            {
                status: 404,
            }
        );
    }

    return Response.json(configuration);
}
