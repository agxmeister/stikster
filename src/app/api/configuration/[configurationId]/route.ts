import {z as zod} from "zod";
import {container} from "@/container";
import {ConfigurationService, configurationDataSchema, configurationRequestPathSchema} from "@/modules/configuration";

export const GET = async (
    _: Request,
    {params}: {params: Promise<zod.infer<typeof configurationRequestPathSchema>>}
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
    {params}: {params: Promise<zod.infer<typeof configurationRequestPathSchema>>}
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

export const DELETE = async (
    _: Request,
    {params}: {params: Promise<zod.infer<typeof configurationRequestPathSchema>>}
): Promise<Response> => {
    const {configurationId} = await params;

    const configurationService = container.get(ConfigurationService);

    try {
        const configuration = await configurationService.get(configurationId);
        if (configuration) {
            await configurationService.delete(configurationId);
        }
        return Response.json(
            {
                message: `Configuration ${configurationId} has been successfully deleted.`,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                error: `Failed to delete configuration ${configurationId}.`,
                details: error,
            },
            {
                status: 500,
            }
        );
    }
}
