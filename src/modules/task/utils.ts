import {eachDayOfInterval, isWeekend} from "date-fns";
import {Task} from "@/modules/task/types";

export const getTask = (data: any): Task => ({
    ...data,
    length: countWeekdays(data.started, data.completed),
});

const countWeekdays = (start: string, end: string) => {
    const days = eachDayOfInterval({
        start: new Date(start),
        end: new Date(end),
    });
    return days.filter(day => !isWeekend(day)).length;
}
