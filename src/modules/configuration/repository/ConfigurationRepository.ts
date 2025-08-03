import fs from "node:fs";
import {v4 as uuid} from "uuid";
import {injectable} from "inversify";
import {configurationDataSchema} from "@/modules/configuration/schemas";
import type {Configuration, ConfigurationData} from "@/modules/configuration/types";

@injectable()
export class ConfigurationRepository
{
    async create(data: ConfigurationData): Promise<Configuration>
    {
        const configuration: Configuration = {
            id: uuid(),
            data: data,
            createdAt: (new Date()).toISOString(),
        };

        await fs.promises.writeFile(
            `${process.env.DATA_PATH}/configurations/${configuration.id}.json`,
            JSON.stringify(configuration, null, 4)
        );

        return configuration;
    }

    async get(id: string): Promise<Configuration | null>
    {
        try {
            const data = await fs.promises.readFile(`${process.env.DATA_PATH}/configurations/${id}.json`, 'utf-8');
            const configuration = JSON.parse(data);
            configurationDataSchema.parse(configuration.data);
            return configuration;
        } catch (error) {
            console.error(`Error reading configuration with id ${id}:`, error);
            return null;
        }
    }

    async update(id: string, data: Partial<ConfigurationData>): Promise<Configuration | null>
    {
        const existingConfiguration = await this.get(id);
        if (!existingConfiguration) {
            return null;
        }

        const updatedConfiguration: Configuration = {
            ...existingConfiguration,
            data: {
                ...existingConfiguration.data,
                ...data,
            },
            updatedAt: (new Date()).toISOString(),
        };

        await fs.promises.writeFile(
            `${process.env.DATA_PATH}/configurations/${id}.json`,
            JSON.stringify(updatedConfiguration, null, 4)
        );

        return updatedConfiguration;
    }
}
