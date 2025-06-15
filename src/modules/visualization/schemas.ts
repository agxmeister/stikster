import {z as zod} from "zod";

export const createAnchor = zod.object({
    boardId: zod.string().describe("A unique identifier of a Miro board to look for the sticky note."),
    anchorLabel: zod.string().describe("A text on a sticky note to create an anchor for."),
});

export const getAnchor = zod.object({
    anchorId: zod.string().describe("Unique identifier of an anchor."),
});

export const createVisualization = zod.object({
    timelineId: zod.string().describe("Unique identifier of a timeline."),
    anchorId: zod.string().describe("Unique identifier of an anchor."),
});
