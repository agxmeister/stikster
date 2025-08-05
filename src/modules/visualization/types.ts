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

export type Anchor = {
    id: string,
    site: Site,
}

export type Site = {
    board: string,
    cursor: Cursor,
}

export type Cursor = {
    position: Position,
    size: Size,
}

export type Position = {
    x: number,
    y: number,
}

export type Size = {
    width: number,
    height: number,
}
