"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
const ScheduleCall_1 = require("@libs/actions/ScheduleCall");
const DateUtils_1 = require("@libs/DateUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const ButtonWithDropdownMenu_1 = require("./ButtonWithDropdownMenu");
const Expensicons_1 = require("./Icon/Expensicons");
const Illustrations = require("./Icon/Illustrations");
function OnboardingHelpDropdownButton({ reportID, shouldUseNarrowLayout, shouldShowRegisterForWebinar, shouldShowGuideBooking, hasActiveScheduledCall }) {
    const { translate } = (0, useLocalize_1.default)();
    const [accountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.accountID, canBeMissing: false });
    const [latestScheduledCall] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`, {
        selector: (reportNameValuePairs) => reportNameValuePairs?.calendlyCalls?.at(-1),
        canBeMissing: true,
    });
    const styles = (0, useThemeStyles_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const userTimezone = currentUserPersonalDetails?.timezone?.selected ? currentUserPersonalDetails?.timezone.selected : CONST_1.default.DEFAULT_TIME_ZONE.selected;
    if (!reportID || !accountID) {
        return null;
    }
    const options = [];
    if (!hasActiveScheduledCall && shouldShowGuideBooking) {
        options.push({
            text: translate('getAssistancePage.scheduleACall'),
            icon: Expensicons_1.CalendarSolid,
            value: CONST_1.default.ONBOARDING_HELP.SCHEDULE_CALL,
            onSelected: () => {
                (0, ScheduleCall_1.clearBookingDraft)();
                Navigation_1.default.navigate(ROUTES_1.default.SCHEDULE_CALL_BOOK.getRoute(reportID));
            },
        });
    }
    if (hasActiveScheduledCall && latestScheduledCall) {
        options.push({
            text: `${DateUtils_1.default.formatInTimeZoneWithFallback(latestScheduledCall.eventTime, userTimezone, CONST_1.default.DATE.WEEKDAY_TIME_FORMAT)}, ${DateUtils_1.default.formatInTimeZoneWithFallback(latestScheduledCall.eventTime, userTimezone, CONST_1.default.DATE.MONTH_DAY_YEAR_FORMAT)}`,
            value: CONST_1.default.ONBOARDING_HELP.EVENT_TIME,
            description: `${DateUtils_1.default.formatInTimeZoneWithFallback(latestScheduledCall.eventTime, userTimezone, CONST_1.default.DATE.LOCAL_TIME_FORMAT)} - ${DateUtils_1.default.formatInTimeZoneWithFallback((0, date_fns_1.addMinutes)(latestScheduledCall.eventTime, 30), userTimezone, CONST_1.default.DATE.LOCAL_TIME_FORMAT)} ${DateUtils_1.default.getZoneAbbreviation(new Date(latestScheduledCall.eventTime), userTimezone)}`,
            descriptionTextStyle: [styles.themeTextColor, styles.ml2],
            displayInDefaultIconColor: true,
            icon: Illustrations.HeadSet,
            iconWidth: variables_1.default.avatarSizeLargeNormal,
            iconHeight: variables_1.default.avatarSizeLargeNormal,
            wrapperStyle: [styles.mb3, styles.pl4, styles.pr5, styles.pt3, styles.pb6, styles.borderBottom],
            interactive: false,
            titleStyle: styles.ml2,
            avatarSize: CONST_1.default.AVATAR_SIZE.LARGE_NORMAL,
        });
        options.push({
            text: translate('common.reschedule'),
            value: CONST_1.default.ONBOARDING_HELP.RESCHEDULE,
            onSelected: () => (0, ScheduleCall_1.rescheduleBooking)(latestScheduledCall),
            icon: Expensicons_1.CalendarSolid,
        });
        options.push({
            text: translate('common.cancel'),
            value: CONST_1.default.ONBOARDING_HELP.CANCEL,
            onSelected: () => (0, ScheduleCall_1.cancelBooking)(latestScheduledCall),
            icon: Expensicons_1.Close,
        });
    }
    if (shouldShowRegisterForWebinar) {
        options.push({
            text: translate('getAssistancePage.registerForWebinar'),
            icon: Expensicons_1.Monitor,
            shouldShowButtonRightIcon: true,
            value: CONST_1.default.ONBOARDING_HELP.REGISTER_FOR_WEBINAR,
            onSelected: () => {
                (0, Link_1.openExternalLink)(CONST_1.default.REGISTER_FOR_WEBINAR_URL);
            },
        });
    }
    if (options.length === 0) {
        return null;
    }
    return (<ButtonWithDropdownMenu_1.default onPress={(_event, value) => {
            const option = options.find((opt) => opt.value === value);
            option?.onSelected?.();
        }} pressOnEnter success={!!hasActiveScheduledCall} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} options={options} shouldUseOptionIcon isSplitButton={false} customText={hasActiveScheduledCall ? translate('scheduledCall.callScheduled') : translate('getAssistancePage.onboardingHelp')} wrapperStyle={shouldUseNarrowLayout && styles.earlyDiscountButton}/>);
}
exports.default = OnboardingHelpDropdownButton;
