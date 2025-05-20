import {injectable} from "inversify";

@injectable()
export class Miro
{
    constructor(readonly url: string, readonly token: string, readonly board: string)
    {
    }

    async addStickyNote(content: string, color: string, x: number = 0, y: number = 0): Promise<void>
    {
        const response = await fetch(`${this.url}/boards/${this.board}/sticky_notes`, {
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
}
