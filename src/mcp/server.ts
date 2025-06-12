import {McpServer, ResourceTemplate} from "@modelcontextprotocol/sdk/server/mcp.js";
import {container} from "@/container";
import {AnchorService, VisualizationService} from "@/modules/visualization";
import {TimelineService} from "@/modules/timeline";
import {getAnchor, createAnchor, createVisualization} from "@/modules/visualization/schemas";
import {createTimeline, getTimeline} from "@/modules/timeline/schemas";

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
        async ({anchorLabel}) => {
            const anchor = await anchorService.create(anchorLabel);
            return {
                content: [{
                    type: "text",
                    text: anchor?.id || `Failed to create anchor ${anchorLabel}`,
                }]
            };
        }
    );

    server.tool(
        "get-anchor",
        getAnchor.shape,
        async ({anchorId}) => {
            const anchor = await anchorService.get(anchorId);
            return {
                content: [{
                    type: "text",
                    text: anchor ? `Anchor with id ${anchor.id} has label ${anchor.label}.` : `Anchor with id ${anchorId} not found.`,
                }]
            };
        }
    );

    server.tool(
        "get-timeline",
        getTimeline.shape,
        async ({timelineId}) => {
            const timeline = await timelineService.get(timelineId);
            return {
                content: [{
                    type: "text",
                    text: timeline ? `Timeline with id ${timeline.id}` : `Timeline with id ${timeline} not found.`,
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
