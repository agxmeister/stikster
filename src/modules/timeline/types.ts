import {Task} from "@/modules/task";

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
