import {z as zod} from "zod";

export const getTimeline = zod.object({
    timelineId: zod.string(),
});

export const createTimeline = zod.object({
    taskIds: zod.array(zod.string()),
});
