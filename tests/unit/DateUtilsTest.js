"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const react_native_onyx_1 = require("react-native-onyx");
const DateUtils_1 = require("@libs/DateUtils");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@src/libs/Log');
const LOCALE = CONST_1.default.LOCALES.EN;
const UTC = 'UTC';
describe('DateUtils', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            initialKeyStates: {
                [ONYXKEYS_1.default.SESSION]: {
                    accountID: 999,
                },
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: {
                    '999': {
                        accountID: 999,
                        timezone: {
                            // UTC is not recognized as a valid timezone but
                            // in these tests we want to use it to avoid issues
                            // because of daylight saving time
                            selected: UTC,
                        },
                    },
                },
            },
        });
        return (0, waitForBatchedUpdates_1.default)();
    });
    beforeEach(() => {
        IntlStore_1.default.load(LOCALE);
        return (0, waitForBatchedUpdates_1.default)();
    });
    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
        react_native_onyx_1.default.clear();
    });
    const datetime = '2022-11-07 00:00:00';
    const timezone = 'America/Los_Angeles';
    it('getZoneAbbreviation should show zone abbreviation from the datetime', () => {
        const zoneAbbreviation = DateUtils_1.default.getZoneAbbreviation(datetime, timezone);
        expect(zoneAbbreviation).toBe('GMT-8');
    });
    it('formatToLongDateWithWeekday should return a long date with a weekday', () => {
        const formattedDate = DateUtils_1.default.formatToLongDateWithWeekday(datetime);
        expect(formattedDate).toBe('Monday, November 7, 2022');
    });
    it('formatToDayOfWeek should return a weekday', () => {
        const weekDay = DateUtils_1.default.formatToDayOfWeek(new Date(datetime));
        expect(weekDay).toBe('Monday');
    });
    it('formatToLocalTime should return a date in a local format', () => {
        const localTime = DateUtils_1.default.formatToLocalTime(datetime);
        expect(localTime).toBe('12:00 AM');
    });
    it('should return a date object with the formatted datetime when calling getLocalDateFromDatetime', () => {
        const localDate = DateUtils_1.default.getLocalDateFromDatetime(LOCALE, datetime, timezone);
        expect((0, date_fns_tz_1.format)(localDate, CONST_1.default.DATE.FNS_TIMEZONE_FORMAT_STRING, { timeZone: timezone })).toEqual('2022-11-06T16:00:00-08:00');
    });
    it('should fallback to current date when getLocalDateFromDatetime is failing', () => {
        const localDate = DateUtils_1.default.getLocalDateFromDatetime(LOCALE, 'InvalidTimezone', undefined);
        expect(localDate.getTime()).not.toBeNaN();
    });
    it.only('should return the date in calendar time when calling datetimeToCalendarTime', () => {
        const today = (0, date_fns_1.setMinutes)((0, date_fns_1.setHours)(new Date(), 14), 32).toString();
        expect(DateUtils_1.default.datetimeToCalendarTime(LOCALE, today, UTC, false)).toBe('Today at 2:32 PM');
        const tomorrow = (0, date_fns_1.addDays)((0, date_fns_1.setMinutes)((0, date_fns_1.setHours)(new Date(), 14), 32), 1).toString();
        expect(DateUtils_1.default.datetimeToCalendarTime(LOCALE, tomorrow, UTC, false)).toBe('Tomorrow at 2:32 PM');
        const yesterday = (0, date_fns_1.setMinutes)((0, date_fns_1.setHours)((0, date_fns_1.subDays)(new Date(), 1), 7), 43).toString();
        expect(DateUtils_1.default.datetimeToCalendarTime(LOCALE, yesterday, UTC, false)).toBe('Yesterday at 7:43 AM');
        const date = (0, date_fns_1.setMinutes)((0, date_fns_1.setHours)(new Date('2022-11-05'), 10), 17).toString();
        expect(DateUtils_1.default.datetimeToCalendarTime(LOCALE, date, UTC, false)).toBe('Nov 5, 2022 at 10:17 AM');
        const todayLowercaseDate = (0, date_fns_1.setMinutes)((0, date_fns_1.setHours)(new Date(), 14), 32).toString();
        expect(DateUtils_1.default.datetimeToCalendarTime(LOCALE, todayLowercaseDate, UTC, false, true)).toBe('today at 2:32 PM');
    });
    it('should update timezone if automatic and selected timezone do not match', async () => {
        jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => ({
            resolvedOptions: () => ({ timeZone: 'America/Chicago' }),
        }));
        react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { '999': { accountID: 999, timezone: { selected: 'Europe/London', automatic: true } } });
        await (0, waitForBatchedUpdates_1.default)();
        const result = DateUtils_1.default.getCurrentTimezone({ selected: 'Europe/London', automatic: true });
        expect(result).toEqual({
            selected: 'America/Chicago',
            automatic: true,
        });
    });
    it('should not update timezone if automatic and selected timezone match', async () => {
        jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => ({
            resolvedOptions: () => ({ timeZone: UTC }),
        }));
        react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { '999': { accountID: 999, timezone: { selected: 'Europe/London', automatic: true } } });
        await (0, waitForBatchedUpdates_1.default)();
        const result = DateUtils_1.default.getCurrentTimezone({ selected: 'Europe/London', automatic: true });
        expect(result).toEqual({
            selected: UTC,
            automatic: true,
        });
    });
    it('canUpdateTimezone should return true when lastUpdatedTimezoneTime is more than 5 minutes ago', () => {
        // Use fake timers to control the current time
        jest.useFakeTimers();
        jest.setSystemTime((0, date_fns_1.addMinutes)(new Date(), 6));
        const isUpdateTimezoneAllowed = DateUtils_1.default.canUpdateTimezone();
        expect(isUpdateTimezoneAllowed).toBe(true);
    });
    it('canUpdateTimezone should return false when lastUpdatedTimezoneTime is less than 5 minutes ago', () => {
        // Use fake timers to control the current time
        jest.useFakeTimers();
        DateUtils_1.default.setTimezoneUpdated();
        jest.setSystemTime((0, date_fns_1.addMinutes)(new Date(), 4));
        const isUpdateTimezoneAllowed = DateUtils_1.default.canUpdateTimezone();
        expect(isUpdateTimezoneAllowed).toBe(false);
    });
    it('should return the date in calendar time when calling datetimeToRelative', () => {
        const aFewSecondsAgo = (0, date_fns_1.subSeconds)(new Date(), 10).toString();
        expect(DateUtils_1.default.datetimeToRelative(LOCALE, aFewSecondsAgo, UTC)).toBe('less than a minute ago');
        const aMinuteAgo = (0, date_fns_1.subMinutes)(new Date(), 1).toString();
        expect(DateUtils_1.default.datetimeToRelative(LOCALE, aMinuteAgo, UTC)).toBe('1 minute ago');
        const anHourAgo = (0, date_fns_1.subHours)(new Date(), 1).toString();
        expect(DateUtils_1.default.datetimeToRelative(LOCALE, anHourAgo, UTC)).toBe('about 1 hour ago');
    });
    it('subtractMillisecondsFromDateTime should subtract milliseconds from a given date and time', () => {
        const initialDateTime = '2023-07-18T10:30:00Z';
        const millisecondsToSubtract = 5000; // 5 seconds
        const expectedDateTime = '2023-07-18 10:29:55.000';
        const result = DateUtils_1.default.subtractMillisecondsFromDateTime(initialDateTime, millisecondsToSubtract);
        expect(result).toBe(expectedDateTime);
    });
    describe('Date Comparison Functions', () => {
        const today = new Date();
        const tomorrow = (0, date_fns_1.addDays)(today, 1);
        const yesterday = (0, date_fns_1.subDays)(today, 1);
        const todayInTimezone = (0, date_fns_tz_1.toZonedTime)(today, timezone);
        const tomorrowInTimezone = (0, date_fns_tz_1.toZonedTime)(tomorrow, timezone);
        const yesterdayInTimezone = (0, date_fns_tz_1.toZonedTime)(yesterday, timezone);
        it('isToday should correctly identify today', () => {
            expect(DateUtils_1.default.isToday(todayInTimezone, timezone)).toBe(true);
            expect(DateUtils_1.default.isToday(tomorrowInTimezone, timezone)).toBe(false);
            expect(DateUtils_1.default.isToday(yesterdayInTimezone, timezone)).toBe(false);
        });
        it('isTomorrow should correctly identify tomorrow', () => {
            expect(DateUtils_1.default.isTomorrow(tomorrowInTimezone, timezone)).toBe(true);
            expect(DateUtils_1.default.isTomorrow(todayInTimezone, timezone)).toBe(false);
            expect(DateUtils_1.default.isTomorrow(yesterdayInTimezone, timezone)).toBe(false);
        });
        it('isYesterday should correctly identify yesterday', () => {
            expect(DateUtils_1.default.isYesterday(yesterdayInTimezone, timezone)).toBe(true);
            expect(DateUtils_1.default.isYesterday(todayInTimezone, timezone)).toBe(false);
            expect(DateUtils_1.default.isYesterday(tomorrowInTimezone, timezone)).toBe(false);
        });
    });
    describe('getDBTime', () => {
        it('should return the date in the format expected by the database', () => {
            const getDBTime = DateUtils_1.default.getDBTime();
            expect(getDBTime).toBe((0, date_fns_1.format)(new Date(getDBTime), CONST_1.default.DATE.FNS_DB_FORMAT_STRING));
        });
        it('should represent the correct date in utc when used with a standard datetime string', () => {
            const timestamp = 'Mon Nov 21 2022 19:04:14 GMT-0800 (Pacific Standard Time)';
            const getDBTime = DateUtils_1.default.getDBTime(timestamp);
            expect(getDBTime).toBe('2022-11-22 03:04:14.000');
        });
        it('should represent the correct date in time when used with an ISO string', () => {
            const timestamp = '2022-11-22T03:08:04.326Z';
            const getDBTime = DateUtils_1.default.getDBTime(timestamp);
            expect(getDBTime).toBe('2022-11-22 03:08:04.326');
        });
        it('should represent the correct date in time when used with a unix timestamp', () => {
            const timestamp = 1669086850792;
            const getDBTime = DateUtils_1.default.getDBTime(timestamp);
            expect(getDBTime).toBe('2022-11-22 03:14:10.792');
        });
    });
    describe('formatWithUTCTimeZone', () => {
        describe('when the date is invalid', () => {
            it('returns an empty string', () => {
                const invalidDateStr = '';
                const formattedDate = DateUtils_1.default.formatWithUTCTimeZone(invalidDateStr);
                expect(formattedDate).toEqual('');
            });
        });
        describe('when the date is valid', () => {
            const scenarios = [
                { dateFormat: CONST_1.default.DATE.FNS_FORMAT_STRING, expectedResult: '2022-11-07' },
                { dateFormat: CONST_1.default.DATE.FNS_TIMEZONE_FORMAT_STRING, expectedResult: '2022-11-07T00:00:00Z' },
                { dateFormat: CONST_1.default.DATE.FNS_DB_FORMAT_STRING, expectedResult: '2022-11-07 00:00:00.000' },
            ];
            test.each(scenarios)('returns the date as string with the format "$dateFormat"', ({ dateFormat, expectedResult }) => {
                const formattedDate = DateUtils_1.default.formatWithUTCTimeZone(datetime, dateFormat);
                expect(formattedDate).toEqual(expectedResult);
            });
        });
        it('returns the correct date when the date with time is used', () => {
            const datetimeStr = '2022-11-07 17:48:00';
            const expectedResult = '2022-11-07';
            expect(DateUtils_1.default.formatWithUTCTimeZone(datetimeStr)).toEqual(expectedResult);
        });
    });
    describe('getLastBusinessDayOfMonth', () => {
        const scenarios = [
            {
                // Last business day of May in 2025
                inputDate: new Date(2025, 4),
                expectedResult: 30,
            },
            {
                // Last business day  of February in 2024
                inputDate: new Date(2024, 2),
                expectedResult: 29,
            },
            {
                // Last business day of January in 2024
                inputDate: new Date(2024, 0),
                expectedResult: 31,
            },
            {
                // Last business day of September in 2023
                inputDate: new Date(2023, 8),
                expectedResult: 29,
            },
        ];
        test.each(scenarios)('returns a last business day based on the input date', ({ inputDate, expectedResult }) => {
            const lastBusinessDay = DateUtils_1.default.getLastBusinessDayOfMonth(inputDate);
            expect(lastBusinessDay).toEqual(expectedResult);
        });
    });
    describe('isCardExpired', () => {
        it('should return true when the card is expired', () => {
            const cardMonth = 1;
            const cardYear = new Date().getFullYear() - 1;
            expect(DateUtils_1.default.isCardExpired(cardMonth, cardYear)).toBe(true);
        });
        it('should return false when the card is not expired', () => {
            const cardMonth = 1;
            const cardYear = new Date().getFullYear() + 1;
            expect(DateUtils_1.default.isCardExpired(cardMonth, cardYear)).toBe(false);
        });
    });
    describe('isCurrentTimeWithinRange', () => {
        beforeAll(() => {
            jest.useFakeTimers();
        });
        afterAll(() => {
            jest.useRealTimers();
        });
        it('should return true when current time is within the range', () => {
            const currentTime = new Date(datetime);
            jest.setSystemTime(currentTime);
            const startTime = '2022-11-06T10:00:00Z';
            const endTime = '2022-11-07T14:00:00Z';
            expect(DateUtils_1.default.isCurrentTimeWithinRange(startTime, endTime)).toBe(true);
        });
        it('should return false when current time is before the range', () => {
            const currentTime = new Date(datetime);
            jest.setSystemTime(currentTime);
            const startTime = '2022-11-07T10:00:00Z';
            const endTime = '2022-11-07T14:00:00Z';
            expect(DateUtils_1.default.isCurrentTimeWithinRange(startTime, endTime)).toBe(false);
        });
        it('should return false when current time is after the range', () => {
            const currentTime = new Date(datetime);
            jest.setSystemTime(currentTime);
            const startTime = '2022-11-06T10:00:00Z';
            const endTime = '2022-11-06T14:00:00Z';
            expect(DateUtils_1.default.isCurrentTimeWithinRange(startTime, endTime)).toBe(false);
        });
    });
});
