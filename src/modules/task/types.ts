export type Task = {
    key: string;
    type: string;
    summary: string;
    intervals: Interval[];
    started: string;
    completed: string;
    length: number;
}

export type Interval = {
    start: string;
    end: string;
}
