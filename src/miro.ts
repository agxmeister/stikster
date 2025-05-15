import {injectable} from "inversify";

@injectable()
export class Miro
{
    constructor(readonly url: string, readonly token: string, readonly board: string)
    {
    }

    async addStickyNote(content: string)
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
                    fillColor: "red",
                    textAlign: "center",
                    textAlignVertical: "middle",
                },
                geometry: {
                    width: 100,
                },
                position: {
                    x: 0,
                    y: 0,
                    origin: "center",
                },
            }),
        });
    }
}
