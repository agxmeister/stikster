export type Visualization = {
    id: string,
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
    label: string,
    cursor: Cursor,
}

export type Cursor = {
    boardId: string,
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
