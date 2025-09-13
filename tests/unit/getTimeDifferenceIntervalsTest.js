"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const PerDiemRequestUtils_1 = require("@libs/PerDiemRequestUtils");
describe('getTimeDifferenceIntervals', () => {
    const createMockTransaction = (startDate, endDate) => ({
        comment: {
            customUnit: {
                attributes: {
                    dates: {
                        start: startDate,
                        end: endDate,
                    },
                },
            },
        },
    });
    it('calculates hours for same-day transactions', () => {
        // Given a transaction that starts and ends on the same day
        const startDate = '2024-03-20T09:00:00Z';
        const endDate = '2024-03-20T17:00:00Z';
        const transaction = createMockTransaction(startDate, endDate);
        const result = (0, PerDiemRequestUtils_1.getTimeDifferenceIntervals)(transaction);
        // When we calculate the time difference intervals
        const expectedHours = (0, date_fns_1.differenceInMinutes)(new Date(endDate), new Date(startDate)) / 60;
        // Then we should get the correct number of hours for a single day, there should be no trip days and no last day
        expect(result).toEqual({
            firstDay: expectedHours,
            tripDays: 0,
            lastDay: undefined,
        });
    });
    it('calculates hours spanning two days', () => {
        // Given a transaction that spans across two days
        const startDate = '2024-03-20T14:00:00Z';
        const endDate = '2024-03-21T16:00:00Z';
        const transaction = createMockTransaction(startDate, endDate);
        const result = (0, PerDiemRequestUtils_1.getTimeDifferenceIntervals)(transaction);
        // When we calculate the time difference intervals
        const startDateTime = new Date(startDate);
        const firstDayDiff = (0, date_fns_1.differenceInMinutes)((0, date_fns_1.startOfDay)((0, date_fns_1.addDays)(startDateTime, 1)), startDateTime);
        const lastDayDiff = (0, date_fns_1.differenceInMinutes)(new Date(endDate), (0, date_fns_1.startOfDay)(new Date(endDate)));
        // Then we should get the correct split of hours, there should be no trip days
        expect(result).toEqual({
            firstDay: firstDayDiff / 60,
            tripDays: 0,
            lastDay: lastDayDiff / 60,
        });
    });
    it('calculates hours for multi-day trips', () => {
        // Given a transaction that spans multiple days
        const startDate = '2024-03-20T16:00:00Z';
        const endDate = '2024-03-23T14:00:00Z';
        const transaction = createMockTransaction(startDate, endDate);
        const result = (0, PerDiemRequestUtils_1.getTimeDifferenceIntervals)(transaction);
        // When we calculate the time difference intervals
        const startDateTime = new Date(startDate);
        const firstDayDiff = (0, date_fns_1.differenceInMinutes)((0, date_fns_1.startOfDay)((0, date_fns_1.addDays)(startDateTime, 1)), startDateTime);
        const tripDaysDiff = (0, date_fns_1.differenceInDays)((0, date_fns_1.startOfDay)(new Date(endDate)), (0, date_fns_1.startOfDay)((0, date_fns_1.addDays)(startDateTime, 1)));
        const lastDayDiff = (0, date_fns_1.differenceInMinutes)(new Date(endDate), (0, date_fns_1.startOfDay)(new Date(endDate)));
        // Then we should get the correct hours split, there should be trip days and last day
        expect(result).toEqual({
            firstDay: firstDayDiff / 60,
            tripDays: tripDaysDiff,
            lastDay: lastDayDiff / 60,
        });
    });
});
