import {z as zod} from "zod";

export const createAnchor = zod.object({
    anchorLabel: zod.string().describe("Label is a text on a sticky note to look for. It should be unique, if possible, and descriptive enough to distinguish it from others."),
});

export const getAnchor = zod.object({
    anchorId: zod.string().describe("Anchor ID is a unique identifier for the anchor object, which describes a sticky note on a Miro board. It includes the sticky note's identity, position, and dimensions."),
});

export const createVisualization = zod.object({
    timelineId: zod.string().describe("Timeline ID is a unique identifier for the timeline object, which is a collection of tasks grouped together for visualization purposes."),
    anchorId: zod.string().describe("Anchor ID is a unique identifier for the anchor object, which describes a sticky note on a Miro board. It includes the sticky note's identity, position, and dimensions."),
});
