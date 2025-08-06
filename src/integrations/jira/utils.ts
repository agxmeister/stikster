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
): any => first(statusChanges).reduce((acc: any[], change: any) => {
    const isInProgress = progressStatusIds.includes(change.to);
    const isDone = doneStatusIds.includes(change.to);
    const isInProgressOrDone = isInProgress || isDone;
    const last = acc[acc.length - 1];

    if (isInProgressOrDone) {
        if (!last || ((last.final || last.interrupted) && (getDay(change.created) > getDay(last.end)))) {
            acc.push({
                start: change.created,
                end: change.created,
                final: isDone,
                interrupted: false,
            });
        } else {
            acc[acc.length - 1] = {
                ...last,
                end: change.created,
                final: isDone,
                interrupted: false,
            };
        }
    } else if (last && !last.interrupted) {
        if (last.final) {
            acc[acc.length - 1] = {
                ...last,
                final: false,
                interrupted: true,
            };
        } else {
            acc[acc.length - 1] = {
                ...last,
                end: change.created,
                final: false,
                interrupted: true,
            };
        }
    }

    return acc;
}, []).map(internal => ({
    start: internal.start,
    end: internal.end,
    final: internal.final,
}));

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
