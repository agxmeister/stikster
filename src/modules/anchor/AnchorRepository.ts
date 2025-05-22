import {inject, injectable} from "inversify";
import {Miro} from "@/miro";
import {Anchor} from "@/modules/anchor/types";

@injectable()
export class AnchorRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
    }

    async create(label: string): Promise<Anchor | null> {
        return (await this.miro.findStickyNotes([label]))
            .map((stickyNote: any) => ({
                id: stickyNote.id,
                position: {
                    x: stickyNote.position.x,
                    y: stickyNote.position.y,
                }
            }))
            .reduce((_, anchor) => anchor);
    }
}
