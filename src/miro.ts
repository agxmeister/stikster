import {injectable} from "inversify";

@injectable()
export class Miro
{
    constructor(readonly url: string, readonly token: string, readonly board: string)
    {
    }

    async addStickyNote(content: string, color: string, x: number = 0, y: number = 0): Promise<void>
    {
        await fetch(`${this.url}/boards/${this.board}/sticky_notes`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
            body: JSON.stringify({
                data: {
                    content: content,
                    shape: "square",
                },
                style: {
                    fillColor: color,
                    textAlign: "center",
                    textAlignVertical: "middle",
                },
                geometry: {
                    width: 100,
                },
                position: {
                    x: x,
                    y: y,
                    origin: "center",
                },
            }),
        });
    }

    async findStickyNotes(labels: string[]): Promise<any[]>
    {
        const result: any[] = [];

        let cursor = null;
        do {
            const response: Response = await fetch(`${this.url}/boards/${this.board}/items?type=sticky_note&limit=50&cursor=${cursor ?? ""}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                },
            });
            const json = await response.json();

            for (const stickyNote of json.data) {
                if (!labels.some((value) => stickyNote.data.content.includes(value))) {
                    continue;
                }
                result.push(stickyNote);
            }

            cursor = json.cursor;
        } while (cursor);

        return result;
    }
}
