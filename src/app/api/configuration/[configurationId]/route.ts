import {container} from "@/container";
import {ConfigurationService, configurationDataSchema} from "@/modules/configuration";

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
                error: `Configuration ${configurationId} not found or invalid.`,
            },
            {
                status: 404,
            }
        );
    }

    return Response.json(configuration);
}

export const PUT = async (
    request: Request,
    {params}: {params: Promise<{configurationId: string}>}
): Promise<Response> => {
    const {configurationId} = await params;

    const {success, error, data} = configurationDataSchema.partial().safeParse(await request.json());
    if (!success) {
        return Response.json(
            {
                error: "Configuration data doesn't match the schema.",
                details: error?.issues,
            },
            {
                status: 400,
            }
        );
    }

    const configurationService = container.get(ConfigurationService);
    const configuration = await configurationService.update(configurationId, data);

    if (!configuration) {
        return Response.json(
            {
                error: `Configuration ${configurationId} not found or invalid.`,
            },
            {
                status: 404,
            }
        );
    }

    return Response.json(configuration);
}
