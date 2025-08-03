import {inject, injectable} from "inversify";
import {ConfigurationRepository} from "@/modules/configuration/repository/ConfigurationRepository";
import type {Configuration, ConfigurationData} from "@/modules/configuration/types";

@injectable()
export class ConfigurationService
{
    constructor(@inject(ConfigurationRepository) readonly configurationRepository: ConfigurationRepository)
    {
    }

    async create(data: ConfigurationData): Promise<Configuration>
    {
        return await this.configurationRepository.create(data);
    }

    async get(id: string): Promise<Configuration | null>
    {
        return await this.configurationRepository.get(id);
    }

    async update(id: string, data: Partial<ConfigurationData>): Promise<Configuration | null>
    {
        return await this.configurationRepository.update(id, data);
    }
}
