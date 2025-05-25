import {inject, injectable} from "inversify";
import {Miro} from "@/miro";
import {Anchor} from "@/modules/anchor/types";
import * as fs from "node:fs";

@injectable()
export class AnchorRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
    }

    async create(label: string): Promise<Anchor | null> {
        const anchor = (await this.miro.findStickyNotes([label]))
            .map((stickyNote: any) => ({
                id: stickyNote.id,
                position: {
                    x: stickyNote.position.x,
                    y: stickyNote.position.y,
                },
                size: {
                    width: stickyNote.geometry.width,
                    height: stickyNote.geometry.height,
                },
            }))
            .reduce((_, anchor) => anchor);
        await fs.promises.writeFile(`./data/anchors/${anchor.id}.json`, JSON.stringify(anchor, null, 4));
        return anchor;
    }
}
