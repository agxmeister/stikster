import {inject, injectable} from "inversify";
import {Anchor} from "@/modules/anchor";
import {Visualization, VisualizationRepository} from "@/modules/visualization";
import {Timeline} from "@/modules/timeline";

@injectable()
export class VisualizationService
{
    constructor(@inject(VisualizationRepository) readonly visualizationRepository: VisualizationRepository)
    {
    }

    async create(timeline: Timeline, anchor: Anchor): Promise<Visualization>
    {
        return this.visualizationRepository.create(timeline, anchor);
    }
}
