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
        description: 'should return empty array for status changes with no progress or done statuses',
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
            ongoing: true,
            final: false,
        }],
    },
    {
        description: 'should create interval for single done status change',
        statusChanges: [{ to: status.done, created: '2024-01-01T10:00:00.000Z' }],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T10:00:00.000Z',
            ongoing: false,
            final: true,
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
            ongoing: false,
            final: true,
        }],
    },
    {
        description: 'should update interval properties when merging same day changes',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.done, created: '2024-01-01T11:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T11:00:00.000Z',
            ongoing: false,
            final: true,
        }],
    },
    {
        description: 'should create separate intervals for different days',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.detailing, created: '2024-01-02T10:00:00.000Z' },
        ],
        expected: [
            {
                start: '2024-01-01T10:00:00.000Z',
                end: '2024-01-01T10:00:00.000Z',
                ongoing: true,
                final: false,
            },
            {
                start: '2024-01-02T10:00:00.000Z',
                end: '2024-01-02T10:00:00.000Z',
                ongoing: true,
                final: false,
            },
        ],
    },
    {
        description: 'should handle progress to done transition across different days',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.done, created: '2024-01-02T10:00:00.000Z' },
        ],
        expected: [
            {
                start: '2024-01-01T10:00:00.000Z',
                end: '2024-01-01T10:00:00.000Z',
                ongoing: true,
                final: false,
            },
            {
                start: '2024-01-02T10:00:00.000Z',
                end: '2024-01-02T10:00:00.000Z',
                ongoing: false,
                final: true,
            },
        ],
    },
    {
        description: 'should close interval when transitioning from progress to non-progress/non-done status',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.new, created: '2024-01-01T11:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T11:00:00.000Z',
            ongoing: false,
            final: false,
        }],
    },
    {
        description: 'should not modify final intervals when transitioning out',
        statusChanges: [
            { to: status.done, created: '2024-01-01T10:00:00.000Z' },
            { to: status.new, created: '2024-01-01T11:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T10:00:00.000Z',
            ongoing: false,
            final: true,
        }],
    },
    {
        description: 'should handle transition from progress to non-progress across different days',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.new, created: '2024-01-02T10:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-02T10:00:00.000Z',
            ongoing: false,
            final: false,
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
                ongoing: false,
                final: false,
            },
            {
                start: '2024-01-02T10:00:00.000Z',
                end: '2024-01-02T11:00:00.000Z',
                ongoing: false,
                final: true,
            },
        ],
    },
    {
        description: 'should handle workflow with multiple progress states',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.detailing, created: '2024-01-01T11:00:00.000Z' },
            { to: status.development, created: '2024-01-01T12:00:00.000Z' },
            { to: status.done, created: '2024-01-01T13:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T13:00:00.000Z',
            ongoing: false,
            final: true,
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
                ongoing: false,
                final: true,
            },
            {
                start: '2024-01-03T10:00:00.000Z',
                end: '2024-01-03T11:00:00.000Z',
                ongoing: false,
                final: true,
            },
        ],
    },
    {
        description: 'should handle task left in progress state',
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
                ongoing: false,
                final: false,
            },
            {
                start: '2024-01-03T10:00:00.000Z',
                end: '2024-01-03T10:00:00.000Z',
                ongoing: true,
                final: false,
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
            ongoing: false,
            final: true,
        }],
    },
    {
        description: 'should handle status changes with same timestamp',
        statusChanges: [
            { to: status.engaging, created: '2024-01-01T10:00:00.000Z' },
            { to: status.done, created: '2024-01-01T10:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T10:00:00.000Z',
            ongoing: false,
            final: true,
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
                ongoing: false,
                final: false,
            },
            {
                start: '2024-01-05T10:00:00.000Z',
                end: '2024-01-05T11:00:00.000Z',
                ongoing: false,
                final: true,
            },
        ],
    },
    {
        description: 'should handle all progress status IDs including development',
        statusChanges: [
            { to: status.new, created: '2024-01-01T09:00:00.000Z' },
            { to: status.development, created: '2024-01-01T10:00:00.000Z' },
            { to: status.postponed, created: '2024-01-01T11:00:00.000Z' },
        ],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T11:00:00.000Z',
            ongoing: false,
            final: true,
        }],
    },
    {
        description: 'should handle status not in progress or done arrays',
        statusChanges: [{ to: status.queuing, created: '2024-01-01T10:00:00.000Z' }],
        expected: [],
    },
    {
        description: 'should handle progress status (engaging)',
        statusChanges: [{ to: status.engaging, created: '2024-01-01T10:00:00.000Z' }],
        expected: [{
            start: '2024-01-01T10:00:00.000Z',
            end: '2024-01-01T10:00:00.000Z',
            ongoing: true,
            final: false,
        }],
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
