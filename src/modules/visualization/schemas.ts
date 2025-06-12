import {z as zod} from "zod";

export const createAnchor = zod.object({
    anchorLabel: zod.string(),
});

export const getAnchor = zod.object({
    anchorId: zod.string(),
});

export const createVisualization = zod.object({
    timelineId: zod.string(),
    anchorId: zod.string(),
});
