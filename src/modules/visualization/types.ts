import {z as zod} from "zod";
import {anchorSchema, siteSchema, cursorSchema, positionSchema, sizeSchema} from "./schema/anchor";

export type Visualization = {
    id: string,
    tracks: Track[],
}

export type Range = {
    begin: string,
    end: string,
}

export type Track = {
    id: string,
    leaves: Leaf[],
}

export type Leaf = {
    board: string,
    sticker: string,
}

export type Anchor = zod.infer<typeof anchorSchema>;
export type Site = zod.infer<typeof siteSchema>;
export type Cursor = zod.infer<typeof cursorSchema>;
export type Position = zod.infer<typeof positionSchema>;
export type Size = zod.infer<typeof sizeSchema>;
