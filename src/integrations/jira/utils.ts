export const getStatusChanges = (histories: any) => histories
    .reduce(
        (acc: any[], history: any) => [
            ...acc,
            ...history.items.map(
                (item: any) => ({
                    ...item,
                    created: history.created,
                })
            )],
        [],
    )
    .filter((item: any) => item.field === "status");

export const getIntervals = (
    statusChanges: any,
    progressStatusIds: string[],
    doneStatusIds: string[],
) => first(statusChanges).reduce((acc, change) => {
    const isInProgress = progressStatusIds.includes(change.to);
    const isDone = doneStatusIds.includes(change.to);
    const isInProgressOrDone = isInProgress || isDone;

    const current = acc.intervals[acc.intervals.length - 1];

    if (isInProgressOrDone) {
        if (!current || ((!acc.ongoing) && (getDay(change.created) > getDay(current.end)))) {
            acc.intervals.push({
                start: change.created,
                end: change.created,
            });
        } else {
            acc.intervals[acc.intervals.length - 1] = {
                ...current,
                end: change.created,
            };
        }
        acc.ongoing = !isDone;
        acc.idle = false;
    } else if (current && !acc.idle) {
        if (acc.ongoing) {
            acc.intervals[acc.intervals.length - 1] = {
                ...current,
                end: change.created,
            };
        }
        acc.ongoing = false;
        acc.idle = true;
    }

    return acc;
}, {
    intervals: [],
    idle: false,
    ongoing: false,
}).intervals;

export const getDateStarted = (statusChanges: any, statusIds: string[]) =>
    first(statusChanges)
        .find((change: any) => statusIds.includes(change.to))?.created || null;

export const getDateCompleted = (statusChanges: any, statusIds: string[]) =>
   last(statusChanges)
        .find((change: any) => statusIds.includes(change.to))?.created || null;

const last = (statusChanges: any[]) => statusChanges
    .sort((a: any, b: any) => a.created > b.created ? -1 : a.created < b.created ? 1 : 0);

const first = (statusChanges: any[]) => statusChanges
    .sort((a: any, b: any) => a.created > b.created ? 1 : a.created < b.created ? -1 : 0);

const getDay = (date: string) => date.split('T')[0];
