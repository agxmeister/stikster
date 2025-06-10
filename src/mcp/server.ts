import {McpServer, ResourceTemplate} from "@modelcontextprotocol/sdk/server/mcp.js";
import {container} from "@/container";
import {AnchorService, VisualizationService} from "@/modules/visualization";
import {TimelineService} from "@/modules/timeline";
import {createAnchor, createTimeline, createVisualization} from "@/schemas/createAnchor";

export const getServer = () => {
    const server = new McpServer({
        name: "stikster",
        version: "1.0.0"
    });

    const anchorService = container.get(AnchorService);
    const timelineService = container.get(TimelineService);
    const visualizationService = container.get(VisualizationService);

    server.resource(
        "anchor",
        new ResourceTemplate("anchor://{id}", {
            list: async () => ({
                resources: (await anchorService.getList()).map(anchor => ({
                    uri: `anchor://${anchor.id}`,
                    name: `${anchor.label}`,
                })),
            }),
        }),
        async (uri, {id}) => {
            const anchor = await anchorService.get(id.toString());
            return ({
                contents: [{
                    uri: uri.href,
                    text: `Anchor with label ${anchor!.label} has id ${anchor!.id}.`
                }]
            })
        }
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

    server.tool(
        "create-visualization",
        createVisualization.shape,
        async ({timelineId, anchorId}) => {
            const timeline = await timelineService.get(timelineId);
            const anchor = await anchorService.get(anchorId);
            const visualization = await visualizationService.create(timeline!, anchor!.cursor);
            return {
                content: [{
                    type: "text",
                    text: visualization ? "Visualization has been created" : "Failed to create visualization",
                }]
            };
        }
    );

    return server
}
