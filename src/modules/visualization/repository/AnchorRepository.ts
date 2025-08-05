import {inject, injectable} from "inversify";
import {Miro} from "@/integrations/miro/miro";
import * as fs from "node:fs";
import {Anchor} from "@/modules/visualization";
import {v4 as uuid} from "uuid";

@injectable()
export class AnchorRepository
{
    constructor(@inject(Miro) readonly miro: Miro)
    {
    }

    async create(boardId: string, label: string): Promise<Anchor | null> {
        const stickyNotes = (await this.miro.findStickyNotes(boardId, [label]))
            .map((stickyNote: any): Anchor => ({
                id: uuid(),
                site: {
                    board: boardId,
                    cursor: {
                        position: {
                            x: stickyNote.position.x,
                            y: stickyNote.position.y,
                        },
                        size: {
                            width: stickyNote.geometry.width,
                            height: stickyNote.geometry.height,
                        },
                    },
                },
            }));
        if (stickyNotes.length === 0) {
            return null;
        }
        const anchor = stickyNotes.reduce((_, anchor) => anchor);
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

    async delete(id: string): Promise<void>
    {
        try {
            await fs.promises.unlink(`${process.env.DATA_PATH}/anchors/${id}.json`);
        } catch (error) {
            console.error(`Error deleting anchor with id ${id}:`, error);
        }
    }
}
