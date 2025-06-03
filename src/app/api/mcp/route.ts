import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StreamableHTTPServerTransport} from "@modelcontextprotocol/sdk/server/streamableHttp.js";

export const POST = async (request: Request): Promise<Response> => {
    /*try {
        const server = new McpServer({
            name: "example-server",
            version: "1.0.0"
        });
        const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        });

        await server.connect(transport);

        const responseStream = new TransformStream();
        const writer = responseStream.writable.getWriter();

        const response = new Response(responseStream.readable, {
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
            },
        });

        const body = await request.json();

        try {
            await transport.handleRequest(request, writer, body);
        } catch (error) {
            console.error('Error in MCP transport:', error);
        } finally {
            writer.close();
            transport.close();
            server.close();
        }

        return response;
    } catch (error) {
        console.error('Error handling MCP request:', error);
        return new Response(
            JSON.stringify({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                },
                id: null,
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
        }
        );
    }*/
    return Response.json(null);
}
