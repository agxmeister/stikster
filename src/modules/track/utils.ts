import {match} from 'ts-pattern';
import {isWithinInterval, startOfDay, endOfDay} from 'date-fns';
import {getWorkday} from "@/modules/timeline/utils";
import {Cursor} from "@/modules/track";
import {Task, Interval} from "@/modules/timeline";

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
        .with({type: 'Automation Bug'}, (): color => 'red')
        .otherwise((): color => 'light_yellow');
}

export const isInProgress = (task: Task, indent: number) =>
    task.intervals.some((interval: Interval) =>
        isWithinInterval(getWorkday(task.started, indent), {
            start: startOfDay(new Date(interval.start)),
            end: endOfDay(new Date(interval.end)),
        }));

export const moveCursor = (cursor: Cursor, x: number, y: number): Cursor => ({
        ...cursor,
        position: {
            x: cursor.position.x + (x * cursor.size.width),
            y: cursor.position.y + (y * cursor.size.height),
        },
    });
