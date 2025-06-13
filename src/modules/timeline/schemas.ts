import {z as zod} from "zod";

export const getTimeline = zod.object({
    timelineId: zod.string().describe("Timeline ID is a unique identifier for the timeline object, which is a collection of tasks grouped together for visualization purposes."),
});

export const createTimeline = zod.object({
    taskIds: zod.array(zod.string()).describe("Task IDs is an array of unique identifiers for the tasks (the keys of the Jira work items) that are grouped together in a timeline for visualization purposes."),
});
