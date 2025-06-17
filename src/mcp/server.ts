import {z as zod} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {container} from "@/container";
import {AnchorService, VisualizationService} from "@/modules/visualization";
import {TimelineService} from "@/modules/timeline";
import {getAnchor, createAnchor, createVisualization} from "@/modules/visualization/schemas";
import {createTimeline, getTimeline} from "@/modules/timeline/schemas";
import {howToUse} from "@/mcp/descriptions";

export const getServer = () => {
    const server = new McpServer({
        name: "stikster",
        version: "1.0.0"
    });

    const anchorService = container.get(AnchorService);
    const timelineService = container.get(TimelineService);
    const visualizationService = container.get(VisualizationService);

    server.tool(
        "how-to-use",
        "Provides the manual on how to visualize the tasks' lifecycle.",
        zod.object({}).shape,
        async () => {
            return {
                content: [{
                    type: "text",
                    text: howToUse,
                }],
            };
        }
    );

    server.tool(
        "create-anchor",
        "Creates an anchor pointing to a sticky note with a given label.",
        createAnchor.shape,
        async ({boardId, anchorLabel}) => {
            const anchor = await anchorService.create(boardId, anchorLabel);
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
        "delete-anchor",
        "Deletes an anchor by its identity.",
        zod.object({anchorId: zod.string()}).shape,
        async ({anchorId}) => {
            const anchor = await anchorService.get(anchorId);
            if (!anchor) {
                return {
                    content: [{
                        type: "text",
                        text: `The anchor ${anchorId} does not exist or has already been removed`,
                    }],
                };
            }
            await anchorService.delete(anchor?.cursor.boardId, anchor?.id);
            return {
                content: [{
                    type: "text",
                    text: `The anchor ${anchorId} has been removed`,
                }],
            };
        }
    )

    server.tool(
        "get-anchor",
        "Retrieves an anchor by its identity.",
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
        "Creates a timeline for a set of tasks.",
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
        "Retrieves a timeline by its identity.",
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
        "Creates a visualization for a timeline at a specific anchor.",
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
