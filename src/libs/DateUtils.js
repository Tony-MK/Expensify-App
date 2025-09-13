"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const throttle_1 = require("lodash/throttle");
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const TIMEZONES_1 = require("@src/TIMEZONES");
const CurrentDate_1 = require("./actions/CurrentDate");
const Network_1 = require("./actions/Network");
const Localize_1 = require("./Localize");
const Log_1 = require("./Log");
const memoize_1 = require("./memoize");
const TIMEZONE_UPDATE_THROTTLE_MINUTES = 5;
let networkTimeSkew = 0;
let isOffline;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NETWORK,
    callback: (val) => {
        networkTimeSkew = val?.timeSkew ?? 0;
        if (!val?.lastOfflineAt) {
            (0, Network_1.setNetworkLastOffline)(new Date().toISOString());
        }
        const newIsOffline = val?.isOffline ?? val?.shouldForceOffline;
        if (newIsOffline && isOffline === false) {
            (0, Network_1.setNetworkLastOffline)(new Date().toISOString());
        }
        isOffline = newIsOffline;
    },
});
function isDate(arg) {
    return Object.prototype.toString.call(arg) === '[object Date]';
}
/**
 * Get the day of the week that the week starts on
 */
function getWeekStartsOn() {
    return CONST_1.default.WEEK_STARTS_ON;
}
/**
 * Get the day of the week that the week ends on
 */
function getWeekEndsOn() {
    const weekStartsOn = getWeekStartsOn();
    return weekStartsOn === 0 ? 6 : (weekStartsOn - 1);
}
/**
 * Gets the user's stored time zone NVP and returns a localized
 * Date object for the given ISO-formatted datetime string
 */
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
function getLocalDateFromDatetime(locale, currentSelectedTimezone, datetime) {
    if (!datetime) {
        const res = (0, date_fns_tz_1.toZonedTime)(new Date(), currentSelectedTimezone);
        if (Number.isNaN(res.getTime())) {
            Log_1.default.warn('DateUtils.getLocalDateFromDatetime: toZonedTime returned an invalid date. Returning current date.', {
                locale,
                datetime,
                currentSelectedTimezone,
            });
            return new Date();
        }
        return res;
    }
    let parsedDatetime;
    try {
        // in some cases we cannot add 'Z' to the date string
        parsedDatetime = new Date(`${datetime}Z`);
        parsedDatetime.toISOString(); // we need to call toISOString because it throws RangeError in case of an invalid date
    }
    catch (e) {
        parsedDatetime = new Date(datetime);
    }
    return (0, date_fns_tz_1.toZonedTime)(parsedDatetime, currentSelectedTimezone);
}
/**
 * Checks if a given date is today in the specified time zone.
 *
 * @param date - The date to compare.
 * @param timeZone - The time zone to consider.
 * @returns True if the date is today; otherwise, false.
 */
function isToday(date, timeZone) {
    const currentDate = new Date();
    const currentDateInTimeZone = (0, date_fns_tz_1.toZonedTime)(currentDate, timeZone);
    return (0, date_fns_1.isSameDay)(date, currentDateInTimeZone);
}
/**
 * Checks if a given date is tomorrow in the specified time zone.
 *
 * @param date - The date to compare.
 * @param timeZone - The time zone to consider.
 * @returns True if the date is tomorrow; otherwise, false.
 */
function isTomorrow(date, timeZone) {
    const currentDate = new Date();
    const tomorrow = (0, date_fns_1.addDays)(currentDate, 1); // Get the date for tomorrow in the current time zone
    const tomorrowInTimeZone = (0, date_fns_tz_1.toZonedTime)(tomorrow, timeZone);
    return (0, date_fns_1.isSameDay)(date, tomorrowInTimeZone);
}
/**
 * Checks if a given date is yesterday in the specified time zone.
 *
 * @param date - The date to compare.
 * @param timeZone - The time zone to consider.
 * @returns True if the date is yesterday; otherwise, false.
 */
function isYesterday(date, timeZone) {
    const currentDate = new Date();
    const yesterday = (0, date_fns_1.subDays)(currentDate, 1); // Get the date for yesterday in the current time zone
    const yesterdayInTimeZone = (0, date_fns_tz_1.toZonedTime)(yesterday, timeZone);
    return (0, date_fns_1.isSameDay)(date, yesterdayInTimeZone);
}
/**
 * We have to fall back to older timezone names for native platforms that do not ship with newer timezone names to avoid a crash.
 * Memoize to prevent unnecessary calculation as timezone support will not change on runtime on a platform.
 */
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
const fallbackToSupportedTimezone = (0, memoize_1.default)((timezoneInput) => {
    try {
        const date = new Date();
        const testDate = (0, date_fns_tz_1.toZonedTime)(date, timezoneInput);
        (0, date_fns_1.format)(testDate, CONST_1.default.DATE.FNS_FORMAT_STRING);
        return timezoneInput;
    }
    catch (error) {
        return TIMEZONES_1.timezoneNewToBackwardMap[timezoneInput];
    }
});
/**
 * Formats an ISO-formatted datetime string to local date and time string
 *
 * e.g.
 *
 * Jan 20 at 5:30 PM          within the past year
 * Jan 20, 2019 at 5:30 PM    anything over 1 year ago
 */
function datetimeToCalendarTime(locale, datetime, currentSelectedTimezone, includeTimeZone = false, isLowercase = false) {
    const date = getLocalDateFromDatetime(locale, fallbackToSupportedTimezone(currentSelectedTimezone), datetime);
    const tz = includeTimeZone ? ' [UTC]Z' : '';
    let todayAt = (0, Localize_1.translate)(locale, 'common.todayAt');
    let tomorrowAt = (0, Localize_1.translate)(locale, 'common.tomorrowAt');
    let yesterdayAt = (0, Localize_1.translate)(locale, 'common.yesterdayAt');
    const at = (0, Localize_1.translate)(locale, 'common.conjunctionAt');
    const weekStartsOn = getWeekStartsOn();
    const startOfCurrentWeek = (0, date_fns_1.startOfWeek)(new Date(), { weekStartsOn });
    const endOfCurrentWeek = (0, date_fns_1.endOfWeek)(new Date(), { weekStartsOn });
    if (isLowercase) {
        todayAt = todayAt.toLowerCase();
        tomorrowAt = tomorrowAt.toLowerCase();
        yesterdayAt = yesterdayAt.toLowerCase();
    }
    if (isToday(date, currentSelectedTimezone)) {
        return `${todayAt} ${(0, date_fns_1.format)(date, CONST_1.default.DATE.LOCAL_TIME_FORMAT)}${tz}`;
    }
    if (isTomorrow(date, currentSelectedTimezone)) {
        return `${tomorrowAt} ${(0, date_fns_1.format)(date, CONST_1.default.DATE.LOCAL_TIME_FORMAT)}${tz}`;
    }
    if (isYesterday(date, currentSelectedTimezone)) {
        return `${yesterdayAt} ${(0, date_fns_1.format)(date, CONST_1.default.DATE.LOCAL_TIME_FORMAT)}${tz}`;
    }
    if (date >= startOfCurrentWeek && date <= endOfCurrentWeek) {
        return `${(0, date_fns_1.format)(date, CONST_1.default.DATE.MONTH_DAY_ABBR_FORMAT)} ${at} ${(0, date_fns_1.format)(date, CONST_1.default.DATE.LOCAL_TIME_FORMAT)}${tz}`;
    }
    return `${(0, date_fns_1.format)(date, CONST_1.default.DATE.MONTH_DAY_YEAR_ABBR_FORMAT)} ${at} ${(0, date_fns_1.format)(date, CONST_1.default.DATE.LOCAL_TIME_FORMAT)}${tz}`;
}
/**
 * Converts an ISO-formatted datetime string into a localized string representation
 * that's relative to current moment in time.
 *
 * e.g.
 *
 * < 1 minute ago       within the past minute
 * 12 minutes ago       within the past hour
 * 1 hour ago           within the past day
 * 3 days ago           within the past month
 * Jan 20               within the past year
 * Jan 20, 2019         anything over 1 year
 */
function datetimeToRelative(locale, datetime, currentSelectedTimezone) {
    const date = getLocalDateFromDatetime(locale, currentSelectedTimezone, datetime);
    const now = getLocalDateFromDatetime(locale, currentSelectedTimezone);
    return (0, date_fns_1.formatDistance)(date, now, { addSuffix: true });
}
/**
 * Gets the zone abbreviation from the date
 *
 * e.g.
 *
 * PST
 * EST
 * GMT +07  -  For GMT timezone
 *
 * @param datetime
 * @param selectedTimezone
 * @returns
 */
function getZoneAbbreviation(datetime, selectedTimezone) {
    return (0, date_fns_tz_1.formatInTimeZone)(datetime, selectedTimezone, 'zzz');
}
/**
 * Format date to a long date format with weekday
 *
 * @returns Sunday, July 9, 2023
 */
function formatToLongDateWithWeekday(datetime) {
    return (0, date_fns_1.format)(new Date(datetime), CONST_1.default.DATE.LONG_DATE_FORMAT_WITH_WEEKDAY);
}
/**
 * Format date to a weekday format
 *
 * @returns Sunday
 */
function formatToDayOfWeek(datetime) {
    return (0, date_fns_1.format)(datetime, CONST_1.default.DATE.WEEKDAY_TIME_FORMAT);
}
/**
 * Format date to a local time
 *
 * @returns 2:30 PM
 */
function formatToLocalTime(datetime) {
    return (0, date_fns_1.format)(new Date(datetime), CONST_1.default.DATE.LOCAL_TIME_FORMAT);
}
const THREE_HOURS = 1000 * 60 * 60 * 3;
/**
 * A throttled version of a function that updates the current date in Onyx store
 */
const updateCurrentDate = (0, throttle_1.default)(() => {
    const currentDate = (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING);
    (0, CurrentDate_1.setCurrentDate)(currentDate);
}, THREE_HOURS);
/**
 * Initialises the event listeners that trigger the current date update
 */
function startCurrentDateUpdater() {
    const trackedEvents = ['mousemove', 'touchstart', 'keydown', 'scroll'];
    trackedEvents.forEach((eventName) => {
        document.addEventListener(eventName, updateCurrentDate);
    });
}
function getCurrentTimezone(timezone) {
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.automatic && timezone.selected !== currentTimezone) {
        return { ...timezone, selected: currentTimezone, automatic: timezone.automatic ?? false };
    }
    return { selected: timezone.selected ?? CONST_1.default.DEFAULT_TIME_ZONE.selected, automatic: timezone.automatic ?? false };
}
/**
 * @returns [January, February, March, April, May, June, July, August, ...]
 */
function getMonthNames() {
    const fullYear = new Date().getFullYear();
    const monthsArray = (0, date_fns_1.eachMonthOfInterval)({
        start: new Date(fullYear, 0, 1), // January 1st of the current year
        end: new Date(fullYear, 11, 31), // December 31st of the current year
    });
    return monthsArray.map((monthDate) => (0, date_fns_1.format)(monthDate, CONST_1.default.DATE.MONTH_FORMAT));
}
/**
 * @returns [Monday, Tuesday, Wednesday, ...]
 */
function getDaysOfWeek() {
    const weekStartsOn = getWeekStartsOn();
    const startOfCurrentWeek = (0, date_fns_1.startOfWeek)(new Date(), { weekStartsOn });
    const endOfCurrentWeek = (0, date_fns_1.endOfWeek)(new Date(), { weekStartsOn });
    const daysOfWeek = (0, date_fns_1.eachDayOfInterval)({ start: startOfCurrentWeek, end: endOfCurrentWeek });
    return daysOfWeek.map((date) => (0, date_fns_1.format)(date, 'eeee'));
}
// Used to throttle updates to the timezone when necessary. Initialize outside the throttle window so it's updated the first time.
let lastUpdatedTimezoneTime = (0, date_fns_1.subMinutes)(new Date(), TIMEZONE_UPDATE_THROTTLE_MINUTES + 1);
function canUpdateTimezone() {
    const currentTime = new Date();
    const fiveMinutesAgo = (0, date_fns_1.subMinutes)(currentTime, TIMEZONE_UPDATE_THROTTLE_MINUTES);
    // Compare the last updated time with five minutes ago
    return (0, date_fns_1.isBefore)(lastUpdatedTimezoneTime, fiveMinutesAgo);
}
function setTimezoneUpdated() {
    lastUpdatedTimezoneTime = new Date();
}
/**
 * Get the UNIX timestamp in microseconds, with millisecond precision.
 */
function getMicroseconds() {
    return Date.now() * CONST_1.default.MICROSECONDS_PER_MS;
}
function getDBTimeFromDate(date) {
    return date.toISOString().replace('T', ' ').replace('Z', '');
}
/**
 * Convert the given timestamp to the "yyyy-MM-dd HH:mm:ss" format, as expected by the database
 *
 * @param [timestamp] the given timestamp (if omitted, defaults to the current time)
 */
function getDBTime(timestamp = '') {
    const datetime = timestamp ? new Date(timestamp) : new Date();
    return getDBTimeFromDate(datetime);
}
/**
 * Returns the current time plus skew in milliseconds in the format expected by the database
 */
function getDBTimeWithSkew(timestamp = '') {
    if (networkTimeSkew > 0) {
        const datetime = timestamp ? new Date(timestamp) : new Date();
        return getDBTime(datetime.valueOf() + networkTimeSkew);
    }
    return getDBTime(timestamp);
}
function subtractMillisecondsFromDateTime(dateTime, milliseconds) {
    const date = (0, date_fns_tz_1.fromZonedTime)(dateTime, 'UTC');
    const newTimestamp = (0, date_fns_1.subMilliseconds)(date, milliseconds).valueOf();
    return getDBTime(newTimestamp);
}
function addMillisecondsFromDateTime(dateTime, milliseconds) {
    const date = (0, date_fns_tz_1.fromZonedTime)(dateTime, 'UTC');
    const newTimestamp = (0, date_fns_1.addMilliseconds)(date, milliseconds).valueOf();
    return getDBTime(newTimestamp);
}
/**
 * returns {string} example: 2023-05-16 05:34:14
 */
function getThirtyMinutesFromNow() {
    const date = (0, date_fns_1.addMinutes)(new Date(), 30);
    return (0, date_fns_1.format)(date, 'yyyy-MM-dd HH:mm:ss');
}
/**
 * returns {string} example: 2023-05-16 05:34:14
 */
function getOneHourFromNow() {
    const date = (0, date_fns_1.addHours)(new Date(), 1);
    return (0, date_fns_1.format)(date, 'yyyy-MM-dd HH:mm:ss');
}
/**
 * returns {string} example: 2023-05-16 05:34:14
 */
function getEndOfToday() {
    const date = (0, date_fns_1.endOfDay)(new Date());
    return (0, date_fns_1.format)(date, 'yyyy-MM-dd HH:mm:ss');
}
/**
 * returns {string} example: 2023-05-16 05:34:14
 */
function getStartOfToday() {
    const date = (0, date_fns_1.startOfDay)(new Date());
    return (0, date_fns_1.format)(date, 'yyyy-MM-dd HH:mm:ss');
}
/**
 * returns {string} example: 2023-05-16 05:34:14
 */
function getOneWeekFromNow() {
    const date = (0, date_fns_1.addDays)(new Date(), 7);
    return (0, date_fns_1.format)(date, 'yyyy-MM-dd HH:mm:ss');
}
/**
 * param {string} dateTimeString
 * returns {string} example: 2023-05-16
 */
function extractDate(dateTimeString) {
    if (!dateTimeString) {
        return '';
    }
    if (dateTimeString === 'never') {
        return '';
    }
    const date = new Date(dateTimeString);
    return (0, date_fns_1.format)(date, 'yyyy-MM-dd');
}
/**
 * param {string} dateTimeString
 * returns {string} example: 11:10 PM
 */
function extractTime12Hour(dateTimeString, isFullFormat = false) {
    if (!dateTimeString || dateTimeString === 'never') {
        return '';
    }
    const date = new Date(dateTimeString);
    return (0, date_fns_1.format)(date, isFullFormat ? 'hh:mm:ss.SSS a' : 'hh:mm a');
}
/**
 * param {string} dateTimeString
 * returns {string} example: 2023-05-16 11:10 PM
 */
function formatDateTimeTo12Hour(dateTimeString) {
    if (!dateTimeString) {
        return '';
    }
    const date = new Date(dateTimeString);
    return (0, date_fns_1.format)(date, 'yyyy-MM-dd hh:mm a');
}
/**
 * param {string} type - one of the values from CONST.CUSTOM_STATUS_TYPES
 * returns {string} example: 2023-05-16 11:10:00 or ''
 */
function getDateFromStatusType(type) {
    switch (type) {
        case CONST_1.default.CUSTOM_STATUS_TYPES.THIRTY_MINUTES:
            return getThirtyMinutesFromNow();
        case CONST_1.default.CUSTOM_STATUS_TYPES.ONE_HOUR:
            return getOneHourFromNow();
        case CONST_1.default.CUSTOM_STATUS_TYPES.AFTER_TODAY:
            return getEndOfToday();
        case CONST_1.default.CUSTOM_STATUS_TYPES.AFTER_WEEK:
            return getOneWeekFromNow();
        case CONST_1.default.CUSTOM_STATUS_TYPES.NEVER:
            return CONST_1.default.CUSTOM_STATUS_TYPES.NEVER;
        default:
            return '';
    }
}
/**
 * param {string} data - either a value from CONST.CUSTOM_STATUS_TYPES or a dateTime string in the format YYYY-MM-DD HH:mm
 * returns {string} example: 2023-05-16 11:10 PM or 'Today'
 */
function getLocalizedTimePeriodDescription(data) {
    switch (data) {
        case getEndOfToday():
            return (0, Localize_1.translateLocal)('statusPage.timePeriods.afterToday');
        case CONST_1.default.CUSTOM_STATUS_TYPES.NEVER:
        case '':
            return (0, Localize_1.translateLocal)('statusPage.timePeriods.never');
        default:
            return formatDateTimeTo12Hour(data);
    }
}
/**
 * receive date like 2020-05-16 05:34:14 and format it to show in string like "Until 05:34 PM"
 */
function getStatusUntilDate(inputDate) {
    if (!inputDate) {
        return '';
    }
    const input = new Date(inputDate);
    const now = new Date();
    const endOfToday = (0, date_fns_1.endOfDay)(now);
    // If the date is adjusted to the following day
    if ((0, date_fns_1.isSameSecond)(input, endOfToday)) {
        return (0, Localize_1.translateLocal)('statusPage.untilTomorrow');
    }
    // If it's a time on the same date
    if ((0, date_fns_1.isSameDay)(input, now)) {
        return (0, Localize_1.translateLocal)('statusPage.untilTime', { time: (0, date_fns_1.format)(input, CONST_1.default.DATE.LOCAL_TIME_FORMAT) });
    }
    // If it's further in the future than tomorrow but within the same year
    if ((0, date_fns_1.isAfter)(input, now) && (0, date_fns_1.isSameYear)(input, now)) {
        return (0, Localize_1.translateLocal)('statusPage.untilTime', { time: (0, date_fns_1.format)(input, `${CONST_1.default.DATE.SHORT_DATE_FORMAT} ${CONST_1.default.DATE.LOCAL_TIME_FORMAT}`) });
    }
    // If it's in another year
    return (0, Localize_1.translateLocal)('statusPage.untilTime', { time: (0, date_fns_1.format)(input, `${CONST_1.default.DATE.FNS_FORMAT_STRING} ${CONST_1.default.DATE.LOCAL_TIME_FORMAT}`) });
}
/**
 * Update the time for a given date.
 *
 * param {string} updatedTime - Time in "hh:mm A" or "HH:mm:ss" or "yyyy-MM-dd HH:mm:ss" format.
 * param {string} inputDateTime - Date in "YYYY-MM-DD HH:mm:ss" or "YYYY-MM-DD" format.
 * returns {string} - Date with updated time in "YYYY-MM-DD HH:mm:ss" format.
 */
const combineDateAndTime = (updatedTime, inputDateTime) => {
    if (!updatedTime || !inputDateTime) {
        return '';
    }
    let parsedTime = null;
    if (updatedTime.includes('-')) {
        // it's in "yyyy-MM-dd HH:mm:ss" format
        const tempTime = (0, date_fns_1.parse)(updatedTime, 'yyyy-MM-dd HH:mm:ss', new Date());
        if ((0, date_fns_1.isValid)(tempTime)) {
            parsedTime = tempTime;
        }
    }
    else if (updatedTime.includes(':')) {
        // it's in "hh:mm a" format
        const tempTime = (0, date_fns_1.parse)(updatedTime, 'hh:mm a', new Date());
        if ((0, date_fns_1.isValid)(tempTime)) {
            parsedTime = tempTime;
        }
    }
    if (!parsedTime) {
        return '';
    }
    let parsedDateTime = null;
    if (inputDateTime.includes(':')) {
        // Check if it includes time
        const tempDateTime = (0, date_fns_1.parse)(inputDateTime, 'yyyy-MM-dd HH:mm:ss', new Date());
        if ((0, date_fns_1.isValid)(tempDateTime)) {
            parsedDateTime = tempDateTime;
        }
    }
    else {
        const tempDateTime = (0, date_fns_1.parse)(inputDateTime, 'yyyy-MM-dd', new Date());
        if ((0, date_fns_1.isValid)(tempDateTime)) {
            parsedDateTime = tempDateTime;
        }
    }
    if (!parsedDateTime) {
        return '';
    }
    const updatedDateTime = (0, date_fns_1.set)(parsedDateTime, {
        hours: parsedTime.getHours(),
        minutes: parsedTime.getMinutes(),
        seconds: parsedTime.getSeconds(),
    });
    return (0, date_fns_1.format)(updatedDateTime, 'yyyy-MM-dd HH:mm:ss');
};
/**
 * param {String} dateTime in 'HH:mm:ss.SSS a' format
 * returns {Object}
 * example {hour: '11', minute: '10', seconds: '10', milliseconds: '123', period: 'AM'}
 */
function get12HourTimeObjectFromDate(dateTime, isFullFormat = false) {
    if (!dateTime) {
        return {
            hour: '12',
            minute: '00',
            seconds: '00',
            milliseconds: '000',
            period: 'PM',
        };
    }
    const parsedTime = (0, date_fns_1.parse)(dateTime, isFullFormat ? 'hh:mm:ss.SSS a' : 'hh:mm a', new Date());
    return {
        hour: (0, date_fns_1.format)(parsedTime, 'hh'),
        minute: (0, date_fns_1.format)(parsedTime, 'mm'),
        seconds: isFullFormat ? (0, date_fns_1.format)(parsedTime, 'ss') : '00',
        milliseconds: isFullFormat ? (0, date_fns_1.format)(parsedTime, 'SSS') : '000',
        period: (0, date_fns_1.format)(parsedTime, 'a').toUpperCase(),
    };
}
/**
 * Checks if the time input is at least one minute in the future.
 * param {String} timeString: '04:24 AM'
 * param {String} dateTimeString: '2023-11-14 14:24:00'
 * returns {Boolean}
 */
const isTimeAtLeastOneMinuteInFuture = ({ timeString, dateTimeString }) => {
    let dateToCheck = dateTimeString;
    if (timeString) {
        dateToCheck = combineDateAndTime(timeString, dateTimeString);
    }
    // Get current date and time
    const now = new Date();
    // Check if the combinedDate is at least one minute later than the current date and time
    return (0, date_fns_1.isAfter)(new Date(dateToCheck), (0, date_fns_1.addMinutes)(now, 1));
};
/**
 * Checks if the time range input is valid.
 * param {String} startTime: '2023-11-14 12:24:00'
 * param {String} endTime: '2023-11-14 14:24:00'
 * returns {Boolean}
 */
const isValidStartEndTimeRange = ({ startTime, endTime }) => {
    // Check if the combinedDate is at least one minute later than the current date and time
    return (0, date_fns_1.isAfter)(new Date(endTime), new Date(startTime));
};
/**
 * Checks if the input date is in the future compared to the reference date.
 * param {Date} inputDate - The date to validate.
 * param {Date} referenceDate - The date to compare against.
 * returns {string} - Returns an error key if validation fails, otherwise an empty string.
 */
const getDayValidationErrorKey = (inputDate) => {
    if (!inputDate) {
        return '';
    }
    if ((0, date_fns_1.isAfter)((0, date_fns_1.startOfDay)(new Date()), (0, date_fns_1.startOfDay)(inputDate))) {
        return (0, Localize_1.translateLocal)('common.error.invalidDateShouldBeFuture');
    }
    return '';
};
/**
 * Checks if the input time is after the reference date
 * param {Date} inputDate - The date to validate.
 * returns {boolean} - Returns true if the input date is after the reference date, otherwise false.
 */
const isFutureDay = (inputDate) => {
    return (0, date_fns_1.isAfter)((0, date_fns_1.startOfDay)(inputDate), (0, date_fns_1.startOfDay)(new Date()));
};
/**
 * Checks if the input time is at least one minute in the future compared to the reference time.
 * param {Date} inputTime - The time to validate.
 * param {Date} referenceTime - The time to compare against.
 * returns {string} - Returns an error key if validation fails, otherwise an empty string.
 */
const getTimeValidationErrorKey = (inputTime) => {
    const timeNowPlusOneMinute = (0, date_fns_1.addMinutes)(new Date(), 1);
    if ((0, date_fns_1.isBefore)(inputTime, timeNowPlusOneMinute)) {
        return (0, Localize_1.translateLocal)('common.error.invalidTimeShouldBeFuture');
    }
    return '';
};
/**
 *
 * Get a date and format this date using the UTC timezone.
 * param datetime
 * param dateFormat
 * returns If the date is valid, returns the formatted date with the UTC timezone, otherwise returns an empty string.
 */
function formatWithUTCTimeZone(datetime, dateFormat = CONST_1.default.DATE.FNS_FORMAT_STRING) {
    const date = (0, date_fns_tz_1.toDate)(datetime, { timeZone: 'UTC' });
    if ((0, date_fns_1.isValid)(date)) {
        return (0, date_fns_tz_1.format)((0, date_fns_tz_1.toZonedTime)(date, 'UTC'), dateFormat);
    }
    return '';
}
/**
 *
 * @param timezone
 * Convert unsupported old timezone to app supported timezone
 * @returns Timezone
 */
function formatToSupportedTimezone(timezoneInput) {
    if (!timezoneInput?.selected) {
        return timezoneInput;
    }
    return {
        selected: TIMEZONES_1.timezoneBackwardToNewMap[timezoneInput.selected] ?? timezoneInput.selected,
        automatic: timezoneInput.automatic,
    };
}
/**
 * Returns the last business day of given date month
 *
 * param {Date} inputDate
 * returns {number}
 */
function getLastBusinessDayOfMonth(inputDate) {
    let currentDate = (0, date_fns_1.endOfMonth)(inputDate);
    const dayOfWeek = (0, date_fns_1.getDay)(currentDate);
    if (dayOfWeek === 0) {
        currentDate = (0, date_fns_1.subDays)(currentDate, 2);
    }
    else if (dayOfWeek === 6) {
        currentDate = (0, date_fns_1.subDays)(currentDate, 1);
    }
    return (0, date_fns_1.getDate)(currentDate);
}
/**
 * Returns a formatted date range from date 1 to date 2.
 * Dates are formatted as follows:
 * 1. When both dates refer to the same day: Mar 17
 * 2. When both dates refer to the same month: Mar 17-20
 * 3. When both dates refer to the same year: Feb 28 to Mar 1
 * 4. When the dates are from different years: Dec 28, 2023 to Jan 5, 2024
 */
function getFormattedDateRange(date1, date2) {
    if ((0, date_fns_1.isSameDay)(date1, date2)) {
        // Dates are from the same day
        return (0, date_fns_1.format)(date1, 'MMM d');
    }
    if ((0, date_fns_1.isSameMonth)(date1, date2)) {
        // Dates in the same month and year, differ by days
        return `${(0, date_fns_1.format)(date1, 'MMM d')}-${(0, date_fns_1.format)(date2, 'd')}`;
    }
    if ((0, date_fns_1.isSameYear)(date1, date2)) {
        // Dates are in the same year, differ by months
        return `${(0, date_fns_1.format)(date1, 'MMM d')} ${(0, Localize_1.translateLocal)('common.to').toLowerCase()} ${(0, date_fns_1.format)(date2, 'MMM d')}`;
    }
    // Dates differ by years, months, days
    return `${(0, date_fns_1.format)(date1, 'MMM d, yyyy')} ${(0, Localize_1.translateLocal)('common.to').toLowerCase()} ${(0, date_fns_1.format)(date2, 'MMM d, yyyy')}`;
}
/**
 * Returns a formatted date range from date 1 to date 2 of a reservation.
 * Dates are formatted as follows:
 * 1. When both dates refer to the same day and the current year: Sunday, Mar 17
 * 2. When both dates refer to the same day but not the current year: Wednesday, Mar 17, 2023
 * 3. When both dates refer to the current year: Sunday, Mar 17 to Wednesday, Mar 20
 * 4. When the dates are from different years or from a year which is not current: Wednesday, Mar 17, 2023 to Saturday, Jan 20, 2024
 */
function getFormattedReservationRangeDate(date1, date2) {
    if ((0, date_fns_1.isSameDay)(date1, date2) && (0, date_fns_1.isThisYear)(date1)) {
        // Dates are from the same day
        return (0, date_fns_1.format)(date1, 'EEEE, MMM d');
    }
    if ((0, date_fns_1.isSameDay)(date1, date2)) {
        // Dates are from the same day but not this year
        return (0, date_fns_1.format)(date1, 'EEEE, MMM d, yyyy');
    }
    if ((0, date_fns_1.isSameYear)(date1, date2) && (0, date_fns_1.isThisYear)(date1)) {
        // Dates are in the current year, differ by months
        return `${(0, date_fns_1.format)(date1, 'EEEE, MMM d')} ${(0, Localize_1.translateLocal)('common.conjunctionTo')} ${(0, date_fns_1.format)(date2, 'EEEE, MMM d')}`;
    }
    // Dates differ by years, months, days or only by months but the year is not current
    return `${(0, date_fns_1.format)(date1, 'EEEE, MMM d, yyyy')} ${(0, Localize_1.translateLocal)('common.conjunctionTo')} ${(0, date_fns_1.format)(date2, 'EEEE, MMM d, yyyy')}`;
}
/**
 * Returns a formatted date of departure.
 * Dates are formatted as follows:
 * 1. When the date refers to the current year: Departs on Sunday, Mar 17 at 8:00.
 * 2. When the date refers not to the current year: Departs on Wednesday, Mar 17, 2023 at 8:00.
 */
function getFormattedTransportDate(date) {
    if ((0, date_fns_1.isThisYear)(date)) {
        return `${(0, Localize_1.translateLocal)('travel.departs')} ${(0, date_fns_1.format)(date, 'EEEE, MMM d')} ${(0, Localize_1.translateLocal)('common.conjunctionAt')} ${(0, date_fns_1.format)(date, 'hh:mm a')}`;
    }
    return `${(0, Localize_1.translateLocal)('travel.departs')} ${(0, date_fns_1.format)(date, 'EEEE, MMM d, yyyy')} ${(0, Localize_1.translateLocal)('common.conjunctionAt')} ${(0, date_fns_1.format)(date, 'hh:mm a')}`;
}
/**
 * Returns a formatted flight date and hour.
 * Dates are formatted as follows:
 * 1. When the date refers to the current year: Wednesday, Mar 17 8:00 AM
 * 2. When the date refers not to the current year: Wednesday, Mar 17, 2023 8:00 AM
 */
function getFormattedTransportDateAndHour(date) {
    if ((0, date_fns_1.isThisYear)(date)) {
        return {
            date: (0, date_fns_1.format)(date, 'EEEE, MMM d'),
            hour: (0, date_fns_1.format)(date, 'h:mm a'),
        };
    }
    return {
        date: (0, date_fns_1.format)(date, 'EEEE, MMM d, yyyy'),
        hour: (0, date_fns_1.format)(date, 'h:mm a'),
    };
}
/**
 * Returns a formatted cancellation date.
 * Dates are formatted as follows:
 * 1. When the date refers to the current year: Wednesday, Mar 17 8:00 AM
 * 2. When the date refers not to the current year: Wednesday, Mar 17, 2023 8:00 AM
 */
function getFormattedCancellationDate(date) {
    if ((0, date_fns_1.isThisYear)(date)) {
        return (0, date_fns_1.format)(date, 'EEEE, MMM d h:mm a');
    }
    return (0, date_fns_1.format)(date, 'EEEE, MMM d, yyyy h:mm a');
}
/**
 * Returns a formatted layover duration in format "2h 30m".
 */
function getFormattedDurationBetweenDates(translateParam, start, end) {
    const { days, hours, minutes } = (0, date_fns_1.intervalToDuration)({ start, end });
    if (days && days > 0) {
        return;
    }
    return `${hours ? `${hours}${translateParam('common.hourAbbreviation')} ` : ''}${minutes}${translateParam('common.minuteAbbreviation')}`;
}
function getFormattedDuration(translateParam, durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    return `${hours ? `${hours}${translateParam('common.hourAbbreviation')} ` : ''}${minutes}${translateParam('common.minuteAbbreviation')}`;
}
function doesDateBelongToAPastYear(date) {
    const transactionYear = new Date(date).getFullYear();
    return transactionYear !== new Date().getFullYear();
}
/**
 * Returns a boolean value indicating whether the card has expired.
 * @param expiryMonth month when card expires (starts from 1 so can be any number between 1 and 12)
 * @param expiryYear year when card expires
 */
function isCardExpired(expiryMonth, expiryYear) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    return expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth);
}
/**
 * Returns the difference in the number of days from the provided date to/from now.
 * @param - The date to compare.
 * @returns The difference in days as an integer.
 */
function getDifferenceInDaysFromNow(date) {
    return (0, date_fns_1.differenceInDays)(new Date(), date);
}
/**
 * Returns a boolean value indicating whether the provided date string can be parsed as a valid date.
 * @param dateString string
 * @returns True if the date string is valid, otherwise false.
 */
function isValidDateString(dateString) {
    const date = new Date(dateString);
    return !Number.isNaN(date.getTime());
}
function getFormattedDateRangeForPerDiem(date1, date2) {
    return `${(0, date_fns_1.format)(date1, 'MMM d, yyyy')} - ${(0, date_fns_1.format)(date2, 'MMM d, yyyy')}`;
}
/**
 * Checks if the current time falls within the specified time range.
 */
const isCurrentTimeWithinRange = (startTime, endTime) => {
    const now = Date.now();
    return (0, date_fns_1.isAfter)(now, new Date(startTime)) && (0, date_fns_1.isBefore)(now, new Date(endTime));
};
/**
 * Converts a date to a string in the format MMMM d, yyyy
 */
const formatToReadableString = (date) => {
    const parsedDate = (0, date_fns_1.parse)(date, 'yyyy-MM-dd', new Date());
    return (0, date_fns_1.format)(parsedDate, 'MMMM d, yyyy');
};
const formatInTimeZoneWithFallback = (date, timeZone, formatStr, options) => {
    try {
        return (0, date_fns_tz_1.formatInTimeZone)(date, timeZone, formatStr, options);
        // On macOs and iOS devices some platform use deprecated old timezone values which results in invalid time string error.
        // Try with backward timezone values on error.
    }
    catch {
        return (0, date_fns_tz_1.formatInTimeZone)(date, TIMEZONES_1.timezoneNewToBackwardMap[timeZone], formatStr, options);
    }
};
const DateUtils = {
    isDate,
    formatToDayOfWeek,
    formatToLongDateWithWeekday,
    formatToLocalTime,
    formatToReadableString,
    getZoneAbbreviation,
    datetimeToRelative,
    datetimeToCalendarTime,
    startCurrentDateUpdater,
    getLocalDateFromDatetime,
    getCurrentTimezone,
    canUpdateTimezone,
    setTimezoneUpdated,
    getMicroseconds,
    getDBTime,
    getDBTimeWithSkew,
    subtractMillisecondsFromDateTime,
    addMillisecondsFromDateTime,
    getEndOfToday,
    getStartOfToday,
    getDateFromStatusType,
    getOneHourFromNow,
    extractDate,
    getStatusUntilDate,
    extractTime12Hour,
    formatDateTimeTo12Hour,
    get12HourTimeObjectFromDate,
    getLocalizedTimePeriodDescription,
    combineDateAndTime,
    getDayValidationErrorKey,
    getTimeValidationErrorKey,
    isToday,
    isTomorrow,
    isYesterday,
    getMonthNames,
    getDaysOfWeek,
    formatWithUTCTimeZone,
    getWeekEndsOn,
    isTimeAtLeastOneMinuteInFuture,
    isValidStartEndTimeRange,
    formatToSupportedTimezone,
    getLastBusinessDayOfMonth,
    getFormattedDateRange,
    getFormattedReservationRangeDate,
    getFormattedTransportDate,
    getFormattedTransportDateAndHour,
    getFormattedCancellationDate,
    doesDateBelongToAPastYear,
    isCardExpired,
    getDifferenceInDaysFromNow,
    isValidDateString,
    getFormattedDurationBetweenDates,
    getFormattedDuration,
    isFutureDay,
    getFormattedDateRangeForPerDiem,
    isCurrentTimeWithinRange,
    formatInTimeZoneWithFallback,
};
exports.default = DateUtils;
