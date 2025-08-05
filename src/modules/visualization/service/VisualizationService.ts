import {inject, injectable} from "inversify";
import {Timeline} from "@/modules/timeline";
import {VisualizationRepository} from "@/modules/visualization/repository/VisualizationRepository";
import {Visualization, Cursor, Site} from "@/modules/visualization";

@injectable()
export class VisualizationService
{
    constructor(@inject(VisualizationRepository) readonly visualizationRepository: VisualizationRepository)
    {
    }

    async create(timeline: Timeline, site: Site): Promise<Visualization>
    {
        return this.visualizationRepository.create(timeline, site);
    }

    async get(id: string): Promise<Visualization | null>
    {
        return this.visualizationRepository.get(id);
    }
}
