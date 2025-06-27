import {inject, injectable} from "inversify";
import {Miro} from "@/integrations/miro/miro";
import * as fs from "node:fs";
import {Anchor} from "@/modules/visualization";

@injectable()
export class AnchorRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
    }

    async create(boardId: string, label: string): Promise<Anchor | null> {
        const anchor = (await this.miro.findStickyNotes(boardId, [label]))
            .map((stickyNote: any) => ({
                id: stickyNote.id,
                label: label,
                cursor: {
                    boardId: boardId,
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
        await fs.promises.writeFile(`${process.env.DATA_PATH}/anchors/${anchor.id}.json`, JSON.stringify(anchor, null, 4));
        return anchor;
    }

    async get(id: string): Promise<Anchor | null>
    {
        try {
            const data = await fs.promises.readFile(`${process.env.DATA_PATH}/anchors/${id}.json`, 'utf-8');
            return JSON.parse(data) as Anchor;
        } catch (error) {
            console.error(`Error reading anchor with id ${id}:`, error);
            return null;
        }
    }

    async getList(): Promise<Anchor[]>
    {
        try {
            const files = await fs.promises.readdir(`${process.env.DATA_PATH}/anchors`);
            const anchors: Anchor[] = [];
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const data = await fs.promises.readFile(`${process.env.DATA_PATH}/anchors/${file}`, 'utf-8');
                    anchors.push(JSON.parse(data) as Anchor);
                }
            }
            return anchors;
        } catch (error) {
            console.error('Error reading anchors:', error);
            return [];
        }
    }

    async delete(boardId: string, id: string): Promise<void>
    {
        await this.miro.removeStickyNote(boardId, id);
        try {
            await fs.promises.unlink(`${process.env.DATA_PATH}/anchors/${id}.json`);
        } catch (error) {
            console.error(`Error deleting anchor with id ${id}:`, error);
        }
    }
}
