"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuideCallAvailabilitySchedule = getGuideCallAvailabilitySchedule;
exports.saveBookingDraft = saveBookingDraft;
exports.clearBookingDraft = clearBookingDraft;
exports.confirmBooking = confirmBooking;
exports.rescheduleBooking = rescheduleBooking;
exports.cancelBooking = cancelBooking;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Link_1 = require("./Link");
function getGuideCallAvailabilitySchedule(reportID) {
    if (!reportID) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`,
            value: {
                calendlySchedule: {
                    isLoading: true,
                    errors: null,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`,
            value: {
                calendlySchedule: {
                    isLoading: false,
                    errors: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`,
            value: {
                calendlySchedule: {
                    isLoading: false,
                },
            },
        },
    ];
    const params = {
        reportID,
    };
    API.read(types_1.READ_COMMANDS.GET_GUIDE_CALL_AVAILABILITY_SCHEDULE, params, { optimisticData, successData, failureData });
}
function saveBookingDraft(data) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.SCHEDULE_CALL_DRAFT}`, data);
}
function clearBookingDraft() {
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.SCHEDULE_CALL_DRAFT}`, null);
}
function confirmBooking(data, currentUser, timezone) {
    const scheduleURL = `${data.guide.scheduleURL}?name=${encodeURIComponent(currentUser.displayName ?? '')}&email=${encodeURIComponent(currentUser?.login ?? '')}&utm_source=newDot&utm_medium=report&utm_content=${data.reportID}&timezone=${timezone}`;
    (0, Link_1.openExternalLink)(scheduleURL);
    clearBookingDraft();
    Navigation_1.default.dismissModal();
}
function getEventIDFromURI(eventURI) {
    const parts = eventURI.split('/');
    // Last path in the URI is ID
    return parts.slice(-1).at(0);
}
function rescheduleBooking(call) {
    const rescheduleURL = `https://calendly.com/reschedulings/${getEventIDFromURI(call.eventURI)}`;
    (0, Link_1.openExternalLink)(rescheduleURL);
}
function cancelBooking(call) {
    const cancelURL = `https://calendly.com/cancellations/${getEventIDFromURI(call.eventURI)}`;
    (0, Link_1.openExternalLink)(cancelURL);
}
