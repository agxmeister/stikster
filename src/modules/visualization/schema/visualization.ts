import {z as zod} from "zod";

export const visualizationPostRequestBodySchema = zod.object({
    timelineId: zod.string().describe("Unique identifier of a timeline."),
    anchorId: zod.string().describe("Unique identifier of an anchor."),
});
