import {z as zod} from "zod";

export const getTimeline = zod.object({
    timelineId: zod.string().describe("Unique identifier of a timeline."),
});

export const createTimeline = zod.object({
    taskIds: zod.array(zod.string()).describe("Array of unique identifiers of tasks."),
});
