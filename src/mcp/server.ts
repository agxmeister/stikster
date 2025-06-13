import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
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

    server.tool(
        "create-anchor",
        "This tool creates a new anchor - the object that describes the sticky note on a Miro board. An anchor includes the sticky note's identity, position, and dimensions. The tool searches for a sticky note with the given text to create an anchor. If a proper sticky note is found, the anchor object is created.",
        createAnchor.shape,
        async ({anchorLabel}) => {
            const anchor = await anchorService.create(anchorLabel);
            return {
                content: [{
                    type: "text",
                    text: anchor ? `The anchor ${anchor.id} was created` : `Failed to create the anchor`,
                }],
                isError: !anchor,
            };
        }
    );

    server.tool(
        "get-anchor",
        "This tool retrieves an anchor by its identity. An anchor is an object that describes the sticky note on a Miro board, including its position and dimensions.",
        getAnchor.shape,
        async ({anchorId}) => {
            const anchor = await anchorService.get(anchorId);
            return {
                content: [{
                    type: "text",
                    text: anchor ? `The Anchor ${anchor.id} has label "${anchor.label}", coordinates [${anchor.cursor.position.x}, ${anchor.cursor.position.y}], and dimensions [${anchor.cursor.size.width}, ${anchor.cursor.size.height}]` : `Anchor ${anchorId} is not exists`,
                }],
                isError: !anchor,
            };
        }
    );

    server.tool(
        "create-timeline",
        "This tool creates a new timeline for the given tasks. A timeline is a collection of tasks that are grouped together for visualization purposes.",
        createTimeline.shape,
        async ({taskIds}) => {
            const timeline = await timelineService.create(taskIds);
            return {
                content: [{
                    type: "text",
                    text: timeline ? `The timeline with id ${timeline.id} has been created.` : `Failed to create the timeline`,
                }],
                isError: !timeline,
            };
        }
    );

    server.tool(
        "get-timeline",
        "This tool retrieves a timeline by its identity. A timeline is a collection of tasks that are grouped together for visualization purposes.",
        getTimeline.shape,
        async ({timelineId}) => {
            const timeline = await timelineService.get(timelineId);
            return {
                content: [{
                    type: "text",
                    text: timeline ? `Timeline with id ${timeline.id} contains tasks ${timeline.branches.map(branch => branch.footprint).join(", ")}` : `Timeline with id ${timeline} is not exists`,
                }],
                isError: !timeline,
            };
        }
    );

    server.tool(
        "create-visualization",
        "This tool creates a new visualization for the given timeline and anchor. A visualization is an object that represents the timeline and anchor on a Miro board.",
        createVisualization.shape,
        async ({timelineId, anchorId}) => {
            const timeline = await timelineService.get(timelineId);
            const anchor = await anchorService.get(anchorId);
            const visualization = await visualizationService.create(timeline!, anchor!.cursor);
            return {
                content: [{
                    type: "text",
                    text: visualization ? `The visualization has been created` : "Failed to create the visualization",
                }],
                isError: !visualization,
            };
        }
    );

    return server
}
