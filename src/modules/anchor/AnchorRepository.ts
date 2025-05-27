import {inject, injectable} from "inversify";
import {Miro} from "@/miro";
import {Anchor} from "@/modules/anchor";
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
                base: {
                    position: {
                        x: stickyNote.position.x,
                        y: stickyNote.position.y,
                    },
                    size: {
                        width: stickyNote.geometry.width,
                        height: stickyNote.geometry.height,
                    },
                }
            }))
            .reduce((_, anchor) => anchor);
        await fs.promises.writeFile(`./data/anchors/${anchor.id}.json`, JSON.stringify(anchor, null, 4));
        return anchor;
    }

    async get(id: string): Promise<Anchor | null>
    {
        try {
            const data = await fs.promises.readFile(`./data/anchors/${id}.json`, 'utf-8');
            return JSON.parse(data) as Anchor;
        } catch (error) {
            console.error(`Error reading anchor with id ${id}:`, error);
            return null;
        }
    }

    async delete(id: string): Promise<void>
    {
        await this.miro.removeStickyNote(id);
        try {
            await fs.promises.unlink(`./data/anchors/${id}.json`);
        } catch (error) {
            console.error(`Error deleting anchor with id ${id}:`, error);
        }
    }
}
