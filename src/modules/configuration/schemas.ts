import {z as zod} from "zod";

export const configurationDataSchema = zod.object({
    holidays: zod.array(zod.string())
        .describe("List of public holiday in YYYY-MM-DD format."),
    jql: zod.string()
        .describe("JQL for filtering the nested tasks."),
});

export const configurationSchema = zod.object({
    id: zod.string().describe("Unique configuration identifier."),
    data: configurationDataSchema.describe("Configuration data."),
    createdAt: zod.string().describe("Creation timestamp (ISO 8601)."),
    updatedAt: zod.string().optional().describe("Last update timestamp (ISO 8601)."),
});

export const configurationRequestPathSchema = zod.object({
    configurationId: zod.string().describe("Unique identifier of a configuration."),
});
