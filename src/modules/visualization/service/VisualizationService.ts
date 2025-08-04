import {inject, injectable} from "inversify";
import {Timeline} from "@/modules/timeline";
import {VisualizationRepository} from "@/modules/visualization/repository/VisualizationRepository";
import {Visualization, Cursor} from "@/modules/visualization";

@injectable()
export class VisualizationService
{
    constructor(@inject(VisualizationRepository) readonly visualizationRepository: VisualizationRepository)
    {
    }

    async create(timeline: Timeline, cursor: Cursor): Promise<Visualization>
    {
        return this.visualizationRepository.create(timeline, cursor);
    }

    async get(id: string): Promise<Visualization | null>
    {
        return this.visualizationRepository.get(id);
    }
}
