import {z as zod} from "zod";

export const positionSchema = zod.object({
    x: zod.number(),
    y: zod.number(),
});

export const sizeSchema = zod.object({
    width: zod.number(),
    height: zod.number(),
});

export const cursorSchema = zod.object({
    position: positionSchema,
    size: sizeSchema,
});

export const siteSchema = zod.object({
    board: zod.string().describe("Miro board identifier."),
    cursor: cursorSchema,
});

export const anchorSchema = zod.object({
    id: zod.string().describe("Unique anchor identifier."),
    site: siteSchema.describe("Anchor location in Miro"),
});

export const anchorRequestPathSchema = zod.object({
    anchorId: zod.string().describe("Unique identifier of an anchor."),
});

export const anchorRequestBodySchema = zod.object({
    boardId: zod.string().describe("A unique identifier of a Miro board to look for the sticky note."),
    label: zod.string().describe("A text on a sticky note to create an anchor for."),
});

export const anchorResponseSchema = anchorSchema;
