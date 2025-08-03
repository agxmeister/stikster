import {z as zod} from "zod";

export const getConfiguration = zod.object({
    configurationId: zod.string().describe("Unique identifier of a configuration."),
});

export const createConfiguration = zod.object({
    data: zod.record(zod.any()).describe("Configuration data as a JSON object."),
});
