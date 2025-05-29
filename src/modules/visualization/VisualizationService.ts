import {inject, injectable} from "inversify";
import {Cursor} from "@/modules/track";
import {Visualization, VisualizationRepository} from "@/modules/visualization";
import {Timeline} from "@/modules/timeline";

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
}
