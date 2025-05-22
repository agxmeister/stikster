import {match} from 'ts-pattern';
import {Task} from "@/modules/task";
import {isWithinInterval, startOfDay, endOfDay} from 'date-fns';
import {getWorkday} from "@/modules/task/utils";

export type color =
    'gray' | 'light_yellow' | 'yellow' | 'orange' | 'light_green' | 'green' | 'dark_green' | 'cyan' | 'light_pink' |
    'pink' | 'violet' | 'red' | 'light_blue' | 'blue' | 'dark_blue' | 'black';

export const getColor = (task: Task, indent: number): color => {
    if (!isInProgress(task, indent)) {
        return "gray";
    }

    return match(task)
        .with({type: 'Story'}, (): color => 'yellow')
        .with({type: 'Dev Sub-task'}, (): color => 'violet')
        .with({type: 'Dev MetaCloud Sub-task'}, (): color => 'violet')
        .with({type: 'QA Sub-task'}, (): color => 'light_pink')
        .with({type: 'Bug'}, (): color => 'red')
        .otherwise((): color => 'light_yellow');
}

export const isInProgress = (task: Task, indent: number) => {
    return task.intervals.some(interval =>
        isWithinInterval(getWorkday(task.started, indent), {
            start: startOfDay(new Date(interval.start)),
            end: endOfDay(new Date(interval.end)),
        }));
    }
