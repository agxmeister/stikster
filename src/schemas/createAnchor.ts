import {z as zod} from "zod";

export const createAnchor = zod.object({
    label: zod.string(),
});
