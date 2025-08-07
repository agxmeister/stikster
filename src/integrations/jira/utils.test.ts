import { getIntervals } from './utils';

const status = {
    new: '1',
    queuing: '2',
    backlog: '3',
    focusing: '4',
    engaging: '5',
    detailing: '6',
    readyForDeveloping: '7',
    development: '8',
    done: '9',
    postponed: '10',
} as const;

const progressStatusIds = [status.engaging, status.detailing, status.development];
const doneStatusIds = [status.done, status.postponed];

const testCases = [
    {
        description: 'should return empty array for empty status changes',
        statusChanges: [],
        expected: [],
    },
    {
        description: 'should return empty array for idle status changes',
        statusChanges: [
            { to: status.new, created: '2024-01-01T10:00:00.000Z' },
            { to: status.backlog, created: '2024-01-01T11:00:00.000Z' },
        ],
        expected: [],
    },
    {
        description: 'should create interval for single progress status change',
        statusChanges: [{ to: status.engaging, created: '2024-01-01T10:00:00.000Z' }],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T10:00:00.000Z',
        }],
    },
    {
        description: 'should create interval for single done status change',
        statusChanges: [{ to: status.done, created: '2024-01-01T10:00:00.000Z' }],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T10:00:00.000Z',
        }],
    },
    {
        description: 'should merge multiple status changes on the same day',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.detailing, created: '2024-01-01T11:00:00.000Z' },
            { to: status.done, created: '2024-01-01T12:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T12:00:00.000Z',
        }],
    },
    {
        description: 'should merge progress status changes across different days',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.detailing, created: '2024-01-02T10:00:00.000Z' },
        ],
        expected: [
            {
                start: '2024-01-01T10:00:00.000Z',
                end: '2024-01-02T10:00:00.000Z',
            },
        ],
    },
    {
        description: 'should merge progress to done transition across different days',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.done, created: '2024-01-02T10:00:00.000Z' },
        ],
        expected: [
            {
                start: '2024-01-01T10:00:00.000Z',
                end: '2024-01-02T10:00:00.000Z',
            },
        ],
    },
    {
        description: 'should update interval when transitioning from progress to idle status on the same day',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.new, created: '2024-01-01T11:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T11:00:00.000Z',
        }],
    },
    {
        description: 'should update interval when transitioning from progress to idle status on a different day',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.new, created: '2024-01-03T11:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-03T11:00:00.000Z',
        }],
    },
    {
        description: 'should update interval only once when transitioning between idle statuses',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.new, created: '2024-01-03T11:00:00.000Z' },
            { to: status.queuing, created: '2024-01-05T11:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-03T11:00:00.000Z',
        }],
    },
    {
        description: 'should handle multiple intervals with various transitions',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.new, created: '2024-01-01T11:00:00.000Z' },
            { to: status.detailing, created: '2024-01-02T10:00:00.000Z' },
            { to: status.done, created: '2024-01-02T11:00:00.000Z' },
        ],
        expected: [
            {
                start: '2024-01-01T10:00:00.000Z',
                end: '2024-01-01T11:00:00.000Z',
            },
            {
                start: '2024-01-02T10:00:00.000Z',
                end: '2024-01-02T11:00:00.000Z',
            },
        ],
    },
    {
        description: 'should handle workflow with multiple progress states',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.detailing, created: '2024-01-02T11:00:00.000Z' },
            { to: status.development, created: '2024-01-03T12:00:00.000Z' },
            { to: status.done, created: '2024-01-04T13:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-04T13:00:00.000Z',
        }],
    },
    {
        description: 'should handle reopened tasks',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.done, created: '2024-01-01T11:00:00.000Z' },
            { to: status.detailing, created: '2024-01-03T10:00:00.000Z' },
            { to: status.postponed, created: '2024-01-03T11:00:00.000Z' },
        ],
        expected: [
            {
                start: '2024-01-01T10:00:00.000Z',
                end: '2024-01-01T11:00:00.000Z',
            },
            {
                start: '2024-01-03T10:00:00.000Z',
                end: '2024-01-03T11:00:00.000Z',
            },
        ],
    },
    {
        description: 'should handle tasks returned to the idle state and taken back to progress',
        statusChanges: [
            { to: status.new, created: '2024-01-01T09:00:00.000Z' },
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.backlog, created: '2024-01-02T10:00:00.000Z' },
            { to: status.detailing, created: '2024-01-03T10:00:00.000Z' },
        ],
        expected: [
            {
                start: '2024-01-01T10:00:00.000Z',
                end: '2024-01-02T10:00:00.000Z',
            },
            {
                start: '2024-01-03T10:00:00.000Z',
                end: '2024-01-03T10:00:00.000Z',
            },
        ],
    },
    {
        description: 'should handle unsorted status changes',
        statusChanges: [
            { to: status.done, created: '2024-01-01T12:00:00.000Z' },
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T12:00:00.000Z',
        }],
    },
    {
        description: 'should handle status changes spanning multiple days with gaps',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.new, created: '2024-01-01T11:00:00.000Z' },
            { to: status.detailing, created: '2024-01-05T10:00:00.000Z' },
            { to: status.postponed, created: '2024-01-05T11:00:00.000Z' },
        ],
        expected: [
            {
                start: '2024-01-01T10:00:00.000Z',
                end: '2024-01-01T11:00:00.000Z',
            },
            {
                start: '2024-01-05T10:00:00.000Z',
                end: '2024-01-05T11:00:00.000Z',
            },
        ],
    },
    {
        description: 'should handle reworks and interruptions',
        statusChanges: [
            { to: status.development, created: '2025-06-25T10:00:00.000Z' },
            { to: status.done, created: '2025-06-30T10:00:00.000Z' },
            { to: status.new, created: '2025-07-01T10:00:00.000Z' },
            { to: status.development, created: '2025-07-01T10:00:00.000Z' },
            { to: status.new, created: '2025-07-02T10:00:00.000Z' },
            { to: status.development, created: '2025-07-02T10:00:00.000Z' },
            { to: status.done, created: '2025-07-07T10:00:00.000Z' },
        ],
        expected: [
            {
                start: '2025-06-25T10:00:00.000Z',
                end: '2025-06-30T10:00:00.000Z',
            },
            {
                start: '2025-07-01T10:00:00.000Z',
                end: '2025-07-07T10:00:00.000Z',
            },
        ],
    },
];

describe('getIntervals', () => {
    test.each(testCases)(
        '$description',
        ({ statusChanges, expected }) => {
            const result = getIntervals(statusChanges, progressStatusIds, doneStatusIds);
            expect(result).toEqual(expected);
        }
    );
});
