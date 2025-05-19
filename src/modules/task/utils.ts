import {eachDayOfInterval, isWeekend} from "date-fns";
import {Task} from "@/modules/task/types";

export const refineJiraData = (data: any): Task => ({
    ...data,
    length: getWorkdaysDiff(data.started, data.completed),
});

export const getWorkdaysDiff = (start: string, end: string) => {
    const days = eachDayOfInterval({
        start: new Date(start),
        end: new Date(end),
    });
    return days.filter(day => !isWeekend(day)).length;
}
