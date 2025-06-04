import {eachDayOfInterval, isWeekend, format, addDays} from "date-fns";
import {Task} from "@/modules/timeline";

export const holidays = [
    "2025-01-01", "2025-03-03", "2025-04-18", "2025-04-21", "2025-05-01", "2025-05-06", "2025-05-26",
    "2025-09-08", "2025-09-22", "2025-21-24", "2025-12-25", "2025-12-26",
];

export const refineJiraData = (data: any): Task => {
    const started = data.intervals.length > 0 ? data.intervals[0].start : new Date();
    const completed = data.intervals.length > 0 ? data.intervals[data.intervals.length - 1].end : new Date();
    return {
        ...data,
        started: started,
        completed: completed,
        length: getWorkdaysDiff(started, completed),
    }
};

export const getWorkday = (start: string, indent: number): Date => {
    let day = new Date(start);
    for (let i = 0; i < indent; i++) {
        day = getNextWorkday(day);
    }
    return day;
}

export const getNextWorkday = (day: Date): Date => {
    let nextWorkDay = new Date(day);
    do {
        nextWorkDay = addDays(nextWorkDay, 1);
        if (isWorkday(nextWorkDay)) {
            return nextWorkDay;
        }
    } while (true);
}

export const getPreviousWorkday = (day: Date): Date => {
    let nextWorkDay = new Date(day);
    do {
        nextWorkDay = addDays(nextWorkDay, -1);
        if (isWorkday(nextWorkDay)) {
            return nextWorkDay;
        }
    } while (true);
}

export const getWorkdaysDiff = (start: string, end: string) =>
    eachDayOfInterval({
        start: new Date(start),
        end: new Date(end),
    })
        .filter(isWorkday)
        .length;

export const isWorkday = (day: Date) =>
    !isWeekend(day) && !holidays.includes(format(day, 'yyyy-MM-dd'));
