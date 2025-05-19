import {eachDayOfInterval, isWeekend, format} from "date-fns";
import {Task} from "@/modules/task/types";

export const refineJiraData = (data: any): Task => ({
    ...data,
    started: data.started ?? data.completed ?? new Date(),
    length: data.started && data.completed ? getWorkdaysDiff(data.started, data.completed) : 1,
});

export const getWorkdaysDiff = (start: string, end: string) => {
    const days = eachDayOfInterval({
        start: new Date(start),
        end: new Date(end),
    });
    const holidays = [
        "2025-01-01", "2025-03-03", "2025-04-18", "2025-04-21", "2025-05-01", "2025-05-06", "2025-05-26",
        "2025-09-08", "2025-09-22", "2025-21-24", "2025-12-25", "2025-12-26",
    ];
    return days
        .filter(day => !isWeekend(day))
        .filter(day => !holidays.includes(format(day, 'yyyy-MM-dd')))
        .length;
}
