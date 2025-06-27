export const getStatusChanges = (issue: any) => issue.changelog.histories
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
    const isInProgressOrDone = [...progressStatusIds, ...doneStatusIds].includes(change.to);
    const isDone = doneStatusIds.includes(change.to);
    const last = acc[acc.length - 1];

    if (isInProgressOrDone) {
        if (!last || last.final) {
            acc.push({
                start: change.created,
                end: change.created,
                final: isDone,
            });
        } else {
            acc[acc.length - 1] = {
                ...last,
                end: change.created,
                final: isDone,
            };
        }
    } else if (last && !last.final) {
        acc[acc.length - 1] = {
            ...last,
            end: change.created,
            final: true,
        };
    }

    return acc;
}, []);

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
