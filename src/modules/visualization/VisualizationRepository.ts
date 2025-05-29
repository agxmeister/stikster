import {inject, injectable} from "inversify";
import {Timeline} from "@/modules/timeline";
import {Visualization} from "@/modules/visualization";
import {TrackService, Cursor} from "@/modules/track";

@injectable()
export class VisualizationRepository
{
    constructor(@inject(TrackService) readonly cardService: TrackService)
    {
    }

    async create(timeline: Timeline, cursor: Cursor): Promise<Visualization>
    {
        const tracks = await this.cardService.createPile(timeline.branches[0].tasks, cursor);
        return {
            cards: tracks,
        };
    }
}