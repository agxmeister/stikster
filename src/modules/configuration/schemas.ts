import {z as zod} from "zod";

export const configurationDataSchema = zod.object({
    holidays: zod.array(zod.string())
        .describe("List of public holiday in YYYY-MM-DD format."),
    jql: zod.string()
        .describe("JQL for filtering the nested tasks."),
});
