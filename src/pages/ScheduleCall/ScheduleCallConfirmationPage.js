"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ScheduleCall_1 = require("@libs/actions/ScheduleCall");
const DateUtils_1 = require("@libs/DateUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const UserUtils_1 = require("@libs/UserUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ScheduleCallConfirmationPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [scheduleCallDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.SCHEDULE_CALL_DRAFT}`, { canBeMissing: false });
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const userTimezone = currentUserPersonalDetails?.timezone?.selected ? currentUserPersonalDetails?.timezone.selected : CONST_1.default.DEFAULT_TIME_ZONE.selected;
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const route = (0, native_1.useRoute)();
    const confirm = (0, react_1.useCallback)(() => {
        if (!scheduleCallDraft?.timeSlot || !scheduleCallDraft?.date || !scheduleCallDraft.guide || !scheduleCallDraft.reportID) {
            return;
        }
        (0, ScheduleCall_1.confirmBooking)({
            date: scheduleCallDraft.date,
            timeSlot: scheduleCallDraft.timeSlot,
            guide: scheduleCallDraft.guide,
            reportID: scheduleCallDraft.reportID,
        }, currentUserPersonalDetails, userTimezone);
    }, [currentUserPersonalDetails, scheduleCallDraft, userTimezone]);
    const guideDetails = (0, react_1.useMemo)(() => scheduleCallDraft?.guide?.accountID
        ? (personalDetails?.[scheduleCallDraft.guide.accountID] ?? {
            accountID: scheduleCallDraft.guide.accountID,
            login: scheduleCallDraft.guide.email,
            displayName: scheduleCallDraft.guide.email,
            avatar: (0, UserUtils_1.getDefaultAvatarURL)(scheduleCallDraft.guide.accountID),
        })
        : null, [personalDetails, scheduleCallDraft?.guide?.accountID, scheduleCallDraft?.guide?.email]);
    const dateTimeString = (0, react_1.useMemo)(() => {
        if (!scheduleCallDraft?.timeSlot || !scheduleCallDraft.date) {
            return '';
        }
        const dateString = DateUtils_1.default.formatInTimeZoneWithFallback(scheduleCallDraft.date, userTimezone, CONST_1.default.DATE.MONTH_DAY_YEAR_FORMAT);
        const timeString = `${DateUtils_1.default.formatInTimeZoneWithFallback(scheduleCallDraft?.timeSlot, userTimezone, CONST_1.default.DATE.LOCAL_TIME_FORMAT)} - ${DateUtils_1.default.formatInTimeZoneWithFallback((0, date_fns_1.addMinutes)(scheduleCallDraft?.timeSlot, 30), userTimezone, CONST_1.default.DATE.LOCAL_TIME_FORMAT)}`;
        const timezoneString = DateUtils_1.default.getZoneAbbreviation(new Date(scheduleCallDraft?.timeSlot), userTimezone);
        return `${dateString} from ${timeString} ${timezoneString}`;
    }, [scheduleCallDraft?.date, scheduleCallDraft?.timeSlot, userTimezone]);
    return (<ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} testID={ScheduleCallConfirmationPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('scheduledCall.confirmation.title')} onBackButtonPress={() => {
            if (!route?.params?.reportID) {
                return;
            }
            Navigation_1.default.goBack(ROUTES_1.default.SCHEDULE_CALL_BOOK.getRoute(route?.params?.reportID));
        }}/>
            <FullPageOfflineBlockingView_1.default>
                <ScrollView_1.default contentContainerStyle={[styles.flexGrow1]}>
                    <Text_1.default style={[styles.mb5, styles.ph5, styles.colorMuted]}>{translate('scheduledCall.confirmation.description')}</Text_1.default>
                    <MenuItem_1.default style={styles.mb3} title={guideDetails?.displayName} description={guideDetails?.login} label={translate('scheduledCall.confirmation.setupSpecialist')} interactive={false} iconAccountID={guideDetails?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID}/>
                    <MenuItemWithTopDescription_1.default title={dateTimeString} description={translate('scheduledCall.confirmation.dateTime')} shouldTruncateTitle={false} numberOfLinesTitle={2} shouldShowRightIcon style={styles.mb3} onPress={() => {
            if (!route?.params?.reportID) {
                return;
            }
            Navigation_1.default.goBack(ROUTES_1.default.SCHEDULE_CALL_BOOK.getRoute(route?.params?.reportID));
        }}/>
                    <MenuItemWithTopDescription_1.default title={translate('scheduledCall.confirmation.minutes')} description={translate('scheduledCall.confirmation.meetingLength')} interactive={false} style={styles.mb3}/>
                </ScrollView_1.default>
                <FixedFooter_1.default>
                    <Button_1.default success large text={translate('scheduledCall.confirmation.title')} onPress={confirm}/>
                </FixedFooter_1.default>
            </FullPageOfflineBlockingView_1.default>
        </ScreenWrapper_1.default>);
}
ScheduleCallConfirmationPage.displayName = 'ScheduleCallConfirmationPage';
exports.default = ScheduleCallConfirmationPage;
