import {configurationDataSchema} from "./schemas";
import {z as zod} from "zod";

export type Configuration = {
    id: string;
    data: ConfigurationData;
    createdAt: string;
    updatedAt?: string;
}

export type ConfigurationData = zod.infer<typeof configurationDataSchema>;
