import {container} from "@/container";
import {ConfigurationService} from "@/modules/configuration";

export const POST = async (request: Request): Promise<Response> => {
    const data = await request.json();

    const configurationService = container.get(ConfigurationService);
    const configuration = await configurationService.create(data);

    return Response.json(configuration);
}
