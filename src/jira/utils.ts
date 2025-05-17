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
