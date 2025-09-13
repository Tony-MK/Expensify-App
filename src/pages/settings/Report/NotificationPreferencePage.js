"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const ReportUtils_1 = require("@libs/ReportUtils");
const withReportOrNotFound_1 = require("@pages/home/report/withReportOrNotFound");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
function NotificationPreferencePage({ report }) {
    const route = (0, native_1.useRoute)();
    const { translate } = (0, useLocalize_1.default)();
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const isMoneyRequest = (0, ReportUtils_1.isMoneyRequestReport)(report);
    const currentNotificationPreference = (0, ReportUtils_1.getReportNotificationPreference)(report);
    const shouldDisableNotificationPreferences = (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived) || (0, ReportUtils_1.isSelfDM)(report) || (!isMoneyRequest && (0, ReportUtils_1.isHiddenForCurrentUser)(currentNotificationPreference));
    const notificationPreferenceOptions = Object.values(CONST_1.default.REPORT.NOTIFICATION_PREFERENCE)
        .filter((pref) => !(0, ReportUtils_1.isHiddenForCurrentUser)(pref))
        .map((preference) => ({
        value: preference,
        text: translate(`notificationPreferencesPage.notificationPreferences.${preference}`),
        keyForList: preference,
        isSelected: preference === currentNotificationPreference,
    }));
    const goBack = (0, react_1.useCallback)(() => {
        (0, ReportUtils_1.goBackToDetailsPage)(report, route.params.backTo);
    }, [report, route.params.backTo]);
    const updateNotificationPreferenceForReportAction = (0, react_1.useCallback)((value) => {
        (0, Report_1.updateNotificationPreference)(report.reportID, currentNotificationPreference, value, undefined, undefined);
        goBack();
    }, [report.reportID, currentNotificationPreference, goBack]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={NotificationPreferencePage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={shouldDisableNotificationPreferences}>
                <HeaderWithBackButton_1.default title={translate('notificationPreferencesPage.header')} onBackButtonPress={goBack}/>
                <SelectionList_1.default sections={[{ data: notificationPreferenceOptions }]} ListItem={RadioListItem_1.default} onSelectRow={(option) => updateNotificationPreferenceForReportAction(option.value)} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={notificationPreferenceOptions.find((locale) => locale.isSelected)?.keyForList}/>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
NotificationPreferencePage.displayName = 'NotificationPreferencePage';
exports.default = (0, withReportOrNotFound_1.default)()(NotificationPreferencePage);
