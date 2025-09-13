"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const withReportOrNotFound_1 = require("@pages/home/report/withReportOrNotFound");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function ReportSettingsPage({ report, policy, route }) {
    const backTo = route.params.backTo;
    const reportID = report?.reportID;
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isReportArchived = (0, useReportIsArchived_1.default)(reportID);
    const isArchivedNonExpenseReport = (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived);
    // The workspace the report is on, null if the user isn't a member of the workspace
    const linkedWorkspace = (0, react_1.useMemo)(() => (report?.policyID && policy?.id === report?.policyID ? policy : undefined), [policy, report?.policyID]);
    const isMoneyRequestReport = (0, ReportUtils_1.isMoneyRequestReport)(report);
    const shouldDisableSettings = isArchivedNonExpenseReport || (0, EmptyObject_1.isEmptyObject)(report) || (0, ReportUtils_1.isSelfDM)(report);
    const notificationPreferenceValue = (0, ReportUtils_1.getReportNotificationPreference)(report);
    const notificationPreference = notificationPreferenceValue && !(0, ReportUtils_1.isHiddenForCurrentUser)(notificationPreferenceValue)
        ? translate(`notificationPreferencesPage.notificationPreferences.${notificationPreferenceValue}`)
        : '';
    const writeCapability = (0, ReportUtils_1.isAdminRoom)(report) ? CONST_1.default.REPORT.WRITE_CAPABILITIES.ADMINS : (report?.writeCapability ?? CONST_1.default.REPORT.WRITE_CAPABILITIES.ALL);
    const writeCapabilityText = translate(`writeCapabilityPage.writeCapability.${writeCapability}`);
    const shouldAllowWriteCapabilityEditing = (0, react_1.useMemo)(() => (0, ReportUtils_1.canEditWriteCapability)(report, linkedWorkspace, isReportArchived), [report, linkedWorkspace, isReportArchived]);
    const shouldAllowChangeVisibility = (0, react_1.useMemo)(() => (0, ReportUtils_1.canEditRoomVisibility)(linkedWorkspace, isArchivedNonExpenseReport), [linkedWorkspace, isArchivedNonExpenseReport]);
    const shouldShowNotificationPref = !isMoneyRequestReport && !(0, ReportUtils_1.isHiddenForCurrentUser)(notificationPreferenceValue);
    const shouldShowWriteCapability = !isMoneyRequestReport;
    return (<ScreenWrapper_1.default testID={ReportSettingsPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={shouldDisableSettings}>
                <HeaderWithBackButton_1.default title={translate('common.settings')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(reportID, backTo))}/>
                <ScrollView_1.default style={[styles.flex1]}>
                    {shouldShowNotificationPref && (<MenuItemWithTopDescription_1.default shouldShowRightIcon title={notificationPreference} description={translate('notificationPreferencesPage.label')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_SETTINGS_NOTIFICATION_PREFERENCES.getRoute(reportID, backTo))}/>)}
                    {shouldShowWriteCapability &&
            (shouldAllowWriteCapabilityEditing ? (<MenuItemWithTopDescription_1.default shouldShowRightIcon title={writeCapabilityText} description={translate('writeCapabilityPage.label')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_SETTINGS_WRITE_CAPABILITY.getRoute(reportID, backTo))}/>) : (<react_native_1.View style={[styles.ph5, styles.pv3]}>
                                <Text_1.default style={[styles.textLabelSupporting, styles.lh16, styles.mb1]} numberOfLines={1}>
                                    {translate('writeCapabilityPage.label')}
                                </Text_1.default>
                                <Text_1.default numberOfLines={1} style={[styles.optionAlternateText, styles.pre]}>
                                    {writeCapabilityText}
                                </Text_1.default>
                            </react_native_1.View>))}
                    {!!report?.visibility &&
            report.chatType !== CONST_1.default.REPORT.CHAT_TYPE.INVOICE &&
            (shouldAllowChangeVisibility ? (<MenuItemWithTopDescription_1.default shouldShowRightIcon title={translate(`newRoomPage.visibilityOptions.${report.visibility}`)} description={translate('newRoomPage.visibility')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_SETTINGS_VISIBILITY.getRoute(report.reportID, backTo))}/>) : (<react_native_1.View style={[styles.pv3, styles.ph5]}>
                                <Text_1.default style={[styles.textLabelSupporting, styles.lh16, styles.mb1]} numberOfLines={1}>
                                    {translate('newRoomPage.visibility')}
                                </Text_1.default>
                                <Text_1.default numberOfLines={1} style={[styles.reportSettingsVisibilityText]}>
                                    {translate(`newRoomPage.visibilityOptions.${report.visibility}`)}
                                </Text_1.default>
                                <Text_1.default style={[styles.textLabelSupporting, styles.mt1]}>{translate(`newRoomPage.${report.visibility}Description`)}</Text_1.default>
                            </react_native_1.View>))}
                </ScrollView_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
ReportSettingsPage.displayName = 'ReportSettingsPage';
exports.default = (0, withReportOrNotFound_1.default)()(ReportSettingsPage);
