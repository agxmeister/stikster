export type Timeline = {
    id: string,
    branches: Branch[],
    begin: string,
    end: string,
}

export type Branch = {
    footprint: string,
    tasks: Task[],
    begin: string,
    end: string,
}

export type Task = {
    key: string;
    type: string;
    summary: string;
    cost: number;
    url: string,
    intervals: Interval[];
    started: string;
    completed: string;
    length: number;
}

export type Interval = {
    start: string;
    end: string;
}
