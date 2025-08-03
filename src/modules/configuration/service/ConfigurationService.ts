import {inject, injectable} from "inversify";
import {ConfigurationRepository} from "@/modules/configuration/repository/ConfigurationRepository";
import type {Configuration} from "@/modules/configuration/types";

@injectable()
export class ConfigurationService
{
    constructor(@inject(ConfigurationRepository) readonly configurationRepository: ConfigurationRepository)
    {
    }

    async create(data: Record<string, any>): Promise<Configuration>
    {
        return await this.configurationRepository.create(data);
    }

    async get(id: string): Promise<Configuration | null>
    {
        return await this.configurationRepository.get(id);
    }

    async update(id: string, data: Record<string, any>): Promise<Configuration | null>
    {
        return await this.configurationRepository.update(id, data);
    }
}
