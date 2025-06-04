export type Visualization = {
    tracks: Track[],
}

export type Range = {
    begin: string,
    end: string,
}

export type Track = {
}

export type Anchor = {
    id: string,
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
