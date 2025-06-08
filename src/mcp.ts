import {McpServer, ResourceTemplate} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StreamableHTTPServerTransport} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {z as zod} from "zod";
import {container} from "@/container";
import {AnchorService} from "@/modules/visualization";
import {createAnchor, createTimeline} from "@/schemas/createAnchor";
import {TimelineService} from "@/modules/timeline";

export const postMcpHandler = async (req: any, res: any): Promise<void> => {
    try {
        const server = new McpServer({
            name: "stikster",
            version: "1.0.0"
        });

        const anchorService = container.get(AnchorService);
        const timelineService = container.get(TimelineService);

        server.resource(
            "anchor",
            new ResourceTemplate("anchor://{label}", {
                list: async () => ({
                    resources: (await anchorService.getList()).map(anchor => ({
                        uri: `anchor://${anchor.id}`,
                        name: anchor.id,
                    })),
                }),
            }),
            async (uri, {label}) => ({
                contents: [{
                    uri: uri.href,
                    text: `Anchor ${label}`
                }]
            })
        );

        server.tool(
            "create-anchor",
            createAnchor.shape,
            async ({label}) => {
                const anchor = await anchorService.create(label);
                return {
                    content: [{
                        type: "text",
                        text: anchor?.id || `Failed to create anchor ${label}`,
                    }]
                };
            }
        );

        server.tool(
            "create-timeline",
            createTimeline.shape,
            async ({taskIds}) => {
                const timeline = await timelineService.create(taskIds);
                return {
                    content: [{
                        type: "text",
                        text: timeline?.id || `Failed to create timeline for tasks ${taskIds.join(", ")}`,
                    }]
                };
            }
        );

        const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        });

        res.on('close', () => {
            console.log('Request closed');
            transport.close();
            server.close();
        });

        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                },
                id: null,
            });
        }
    }
}

export const getMcpHandler = async (req: any, res: any): Promise<void> => {
    console.log('Received GET MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
}

export const deleteMcpHandler = async (req: any, res: any): Promise<void> => {
    console.log('Received DELETE MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
}
