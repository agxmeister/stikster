import {container} from "@/container";
import {ConfigurationService, configurationDataSchema} from "@/modules/configuration";

export const POST = async (request: Request): Promise<Response> => {
    const {success, error, data} = configurationDataSchema.safeParse(await request.json());

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
    const configuration = await configurationService.create(data);

    return Response.json(configuration);
}
