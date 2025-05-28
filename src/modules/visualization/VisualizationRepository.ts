import {inject, injectable} from "inversify";
import {Timeline} from "@/modules/timeline";
import {Anchor, AnchorService} from "@/modules/anchor";
import {Visualization} from "@/modules/visualization";
import {TrackService} from "@/modules/track";

@injectable()
export class VisualizationRepository
{
    constructor(
        @inject(TrackService) readonly cardService: TrackService,
        @inject(AnchorService) readonly anchorService: AnchorService,
    )
    {
    }

    async create(timeline: Timeline, anchor: Anchor): Promise<Visualization>
    {
        const tracks = await this.cardService.createPile(timeline.branches[0].tasks, anchor!.cursor);
        await this.anchorService.delete(anchor!.id);
        return {
            cards: tracks,
        };
    }
}