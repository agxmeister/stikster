import {match} from 'ts-pattern';
import {isWithinInterval, startOfDay, endOfDay} from 'date-fns';
import {getWorkday} from "@/modules/timeline/utils";
import {Task, Interval} from "@/modules/timeline";
import {Cursor} from "@/modules/visualization";

export type color =
    'gray' | 'light_yellow' | 'yellow' | 'orange' | 'light_green' | 'green' | 'dark_green' | 'cyan' | 'light_pink' |
    'pink' | 'violet' | 'red' | 'light_blue' | 'blue' | 'dark_blue' | 'black';

export const getColor = (task: Task, indent: number): color => {
    if (!isInProgress(task, indent)) {
        return "gray";
    }

    return match(task)
        .with({type: 'Story'}, (): color => 'yellow')
        .with({type: 'Custom Activity'}, (): color => 'orange')
        .with({type: 'Dev Sub-task'}, (): color => 'violet')
        .with({type: 'Dev MetaCloud Sub-task'}, (): color => 'violet')
        .with({type: 'QA Sub-task'}, (): color => 'light_pink')
        .with({type: 'Bug'}, (): color => 'red')
        .with({type: 'Automation Bug'}, (): color => 'red')
        .otherwise((): color => 'light_yellow');
}

export const isInProgress = (task: Task, indent: number) => {
    const workDay = getWorkday(task.started, indent);

    const lastInterval = task.intervals.length > 0 ?task.intervals[task.intervals.length - 1] : null;
    if (task.ongoing && lastInterval && new Date(lastInterval.end) < workDay) {
        return true;
    }

    return task.intervals.some((interval: Interval) =>
        isWithinInterval(workDay, {
            start: startOfDay(new Date(interval.start)),
            end: endOfDay(new Date(interval.end)),
        }));
}

export const copyCursor = (cursor: Cursor): Cursor => ({
    position: {
        ...cursor.position,
    },
    size: {
        ...cursor.size,
    },
});

export const moveCursor = (cursor: Cursor, x: number, y: number): Cursor => ({
    ...copyCursor(cursor),
    position: {
        x: cursor.position.x + (x * cursor.size.width),
        y: cursor.position.y + (y * cursor.size.height),
    },
});
