"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const Button_1 = require("@components/Button");
const CalendarPicker_1 = require("@components/DatePicker/CalendarPicker");
const DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ScheduleCall_1 = require("@libs/actions/ScheduleCall");
const DateUtils_1 = require("@libs/DateUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const AvailableBookingDay_1 = require("./AvailableBookingDay");
function ScheduleCallPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const route = (0, native_1.useRoute)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const userTimezone = currentUserPersonalDetails?.timezone?.selected ? currentUserPersonalDetails?.timezone.selected : CONST_1.default.DEFAULT_TIME_ZONE.selected;
    const [scheduleCallDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.SCHEDULE_CALL_DRAFT}`, { canBeMissing: true });
    const reportID = route.params?.reportID;
    const [adminReportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`, {
        selector: (data) => ({
            calendlySchedule: data?.calendlySchedule,
        }),
        canBeMissing: true,
    });
    const calendlySchedule = adminReportNameValuePairs?.calendlySchedule;
    (0, react_1.useEffect)(() => {
        if (!reportID) {
            return;
        }
        (0, ScheduleCall_1.getGuideCallAvailabilitySchedule)(reportID);
    }, [reportID]);
    // Clear selected time when user comes back to the selection screen
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        (0, ScheduleCall_1.saveBookingDraft)({ timeSlot: null });
    }, []));
    const loadTimeSlotsAndSaveDate = (0, react_1.useCallback)((date) => {
        (0, ScheduleCall_1.saveBookingDraft)({ date });
    }, []);
    const timeSlotDateMap = (0, react_1.useMemo)(() => {
        if (!calendlySchedule?.data) {
            return {};
        }
        const guides = Object.keys(calendlySchedule.data);
        const allTimeSlots = guides.reduce((allSlots, guideAccountID) => {
            const guideSchedule = calendlySchedule?.data?.[guideAccountID];
            guideSchedule?.timeSlots.forEach((timeSlot) => {
                allSlots.push({
                    guideAccountID: Number(guideAccountID),
                    guideEmail: guideSchedule.guideEmail,
                    startTime: timeSlot.startTime,
                    scheduleURL: timeSlot.schedulingURL,
                });
            });
            return allSlots;
        }, []);
        // Group time slots by date to render per day slots on calendar
        const timeSlotMap = {};
        allTimeSlots.forEach((timeSlot) => {
            const timeSlotDate = DateUtils_1.default.formatInTimeZoneWithFallback(new Date(timeSlot?.startTime), userTimezone, CONST_1.default.DATE.FNS_FORMAT_STRING);
            if (!timeSlotMap[timeSlotDate]) {
                timeSlotMap[timeSlotDate] = [];
            }
            timeSlotMap[timeSlotDate].push(timeSlot);
        });
        // Sort time slots within each date array to have in chronological order
        Object.values(timeSlotMap).forEach((slots) => {
            slots.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        });
        return timeSlotMap;
    }, [calendlySchedule?.data, userTimezone]);
    const selectableDates = Object.keys(timeSlotDateMap).sort(date_fns_1.compareAsc);
    const firstDate = selectableDates.at(0);
    const lastDate = selectableDates.at(selectableDates.length - 1);
    const minDate = firstDate ? (0, date_fns_1.parse)(firstDate, CONST_1.default.DATE.FNS_FORMAT_STRING, new Date()) : undefined;
    const maxDate = lastDate ? (0, date_fns_1.parse)(lastDate, CONST_1.default.DATE.FNS_FORMAT_STRING, new Date()) : undefined;
    const timeSlotsForSelectedData = scheduleCallDraft?.date ? (timeSlotDateMap?.[scheduleCallDraft?.date] ?? []) : [];
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (calendlySchedule?.isLoading || !firstDate || scheduleCallDraft?.date) {
            return;
        }
        (0, ScheduleCall_1.saveBookingDraft)({ date: firstDate });
    }, [firstDate, calendlySchedule?.isLoading, scheduleCallDraft?.date]);
    // When there is only one time slot on the row, it will take full width of the row, use a hidden filler item to keep 2 columns
    const timeFillerItem = (0, react_1.useMemo)(() => {
        if (timeSlotsForSelectedData.length % 2 === 0) {
            return null;
        }
        return (<react_native_1.View key="time-filler-col" aria-hidden accessibilityElementsHidden style={[styles.twoColumnLayoutCol, styles.visibilityHidden]}/>);
    }, [styles.twoColumnLayoutCol, styles.visibilityHidden, timeSlotsForSelectedData.length]);
    return (<ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} testID={ScheduleCallPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('scheduledCall.book.title')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <FullPageOfflineBlockingView_1.default>
                {adminReportNameValuePairs?.calendlySchedule?.isLoading ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<ScrollView_1.default style={styles.flexGrow1}>
                        <react_native_1.View style={styles.ph5}>
                            <Text_1.default style={[styles.mb5, styles.colorMuted]}>{translate('scheduledCall.book.description')}</Text_1.default>
                            <react_native_1.View style={[styles.datePickerPopover, styles.border]} collapsable={false}>
                                <CalendarPicker_1.default value={scheduleCallDraft?.date} minDate={minDate} maxDate={maxDate} selectableDates={Object.keys(timeSlotDateMap)} DayComponent={AvailableBookingDay_1.default} onSelected={loadTimeSlotsAndSaveDate}/>
                            </react_native_1.View>
                        </react_native_1.View>
                        <MenuItemWithTopDescription_1.default interactive={false} title={userTimezone} description={translate('timezonePage.timezone')} style={[styles.mt3, styles.mb3]}/>
                        {!(0, EmptyObject_1.isEmptyObject)(adminReportNameValuePairs?.calendlySchedule?.errors) && (<DotIndicatorMessage_1.default type="error" style={[styles.ph5, styles.mt6, styles.flex0]} messages={(0, ErrorUtils_1.getLatestError)(adminReportNameValuePairs?.calendlySchedule?.errors)}/>)}
                        {!!scheduleCallDraft?.date && (<react_native_1.View style={[styles.ph5, styles.mb5]}>
                                <Text_1.default style={[styles.mb5, styles.colorMuted]}>
                                    {translate('scheduledCall.book.slots')}
                                    <Text_1.default style={[styles.textStrong, styles.colorMuted]}>
                                        {DateUtils_1.default.formatInTimeZoneWithFallback(scheduleCallDraft.date, userTimezone, CONST_1.default.DATE.MONTH_DAY_YEAR_FORMAT)}
                                    </Text_1.default>
                                </Text_1.default>
                                <react_native_1.View style={[styles.flexRow, styles.flexWrap, styles.justifyContentStart, styles.gap2]}>
                                    {timeSlotsForSelectedData.map((timeSlot) => (<Button_1.default key={`time-slot-${timeSlot.startTime}`} large success={scheduleCallDraft?.timeSlot === timeSlot.startTime} onPress={() => {
                        (0, ScheduleCall_1.saveBookingDraft)({
                            timeSlot: timeSlot.startTime,
                            guide: {
                                scheduleURL: timeSlot.scheduleURL,
                                accountID: timeSlot.guideAccountID,
                                email: timeSlot.guideEmail,
                            },
                            reportID,
                        });
                        Navigation_1.default.navigate(ROUTES_1.default.SCHEDULE_CALL_CONFIRMATION.getRoute(reportID));
                    }} shouldEnableHapticFeedback style={styles.twoColumnLayoutCol} text={DateUtils_1.default.formatInTimeZoneWithFallback(timeSlot.startTime, userTimezone, CONST_1.default.DATE.LOCAL_TIME_FORMAT)}/>))}
                                    {timeFillerItem}
                                </react_native_1.View>
                            </react_native_1.View>)}
                    </ScrollView_1.default>)}
            </FullPageOfflineBlockingView_1.default>
        </ScreenWrapper_1.default>);
}
ScheduleCallPage.displayName = 'ScheduleCallPage';
exports.default = ScheduleCallPage;
