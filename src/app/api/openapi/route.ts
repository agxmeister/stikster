import {openApiDocument} from "@/openapi";

export const GET = async (
    _: Request,
): Promise<Response> => {
    return Response.json(openApiDocument);
}
