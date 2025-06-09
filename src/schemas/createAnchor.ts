import {z as zod} from "zod";

export const createAnchor = zod.object({
    label: zod.string(),
});

export const createTimeline = zod.object({
    taskIds: zod.array(zod.string()),
});

export const createVisualization = zod.object({
    timelineId: zod.string(),
    anchorId: zod.string(),
});
