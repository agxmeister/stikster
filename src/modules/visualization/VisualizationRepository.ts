import {inject, injectable} from "inversify";
import {Timeline} from "@/modules/timeline";
import {Anchor, AnchorService} from "@/modules/anchor";
import {Visualization} from "@/modules/visualization";
import {CardService} from "@/modules/card";

@injectable()
export class VisualizationRepository
{
    constructor(
        @inject(CardService) readonly cardService: CardService,
        @inject(AnchorService) readonly anchorService: AnchorService,
    )
    {
    }

    async create(timeline: Timeline, anchor: Anchor): Promise<Visualization>
    {
        const cards = await this.cardService.createPile(timeline.branches[0].tasks, anchor!.base);
        await this.anchorService.delete(anchor!.id);
        return {
            cards: cards,
        };
    }
}