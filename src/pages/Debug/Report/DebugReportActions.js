"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const ScrollView_1 = require("@components/ScrollView");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Parser_1 = require("@libs/Parser");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SidebarUtils_1 = require("@libs/SidebarUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const mapOnyxCollectionItems_1 = require("@src/utils/mapOnyxCollectionItems");
const personalDetailsSelector = (personalDetail) => personalDetail && {
    accountID: personalDetail.accountID,
    login: personalDetail.login,
    avatar: personalDetail.avatar,
    pronouns: personalDetail.pronouns,
};
function DebugReportActions({ reportID }) {
    const { translate, datetimeToCalendarTime, localeCompare } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: true });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`, { canBeMissing: true });
    const isReportArchived = (0, useReportIsArchived_1.default)(reportID);
    const ifUserCanPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived);
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { selector: (c) => (0, mapOnyxCollectionItems_1.default)(c, personalDetailsSelector), canBeMissing: false });
    const [sortedAllReportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {
        canEvict: false,
        selector: (allReportActions) => (0, ReportActionsUtils_1.getSortedReportActionsForDisplay)(allReportActions, ifUserCanPerformWriteAction, true),
        canBeMissing: true,
    });
    const participantAccountIDs = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, undefined, undefined, true);
    const participantPersonalDetailList = Object.values((0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(participantAccountIDs, personalDetails));
    const getReportActionDebugText = (0, react_1.useCallback)((reportAction) => {
        const reportActionMessage = (0, ReportActionsUtils_1.getReportActionMessage)(reportAction);
        const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction);
        if (!reportActionMessage) {
            return '';
        }
        if (!!reportActionMessage.deleted || (originalMessage && 'deleted' in originalMessage && originalMessage.deleted)) {
            return `[${translate('parentReportAction.deletedMessage')}]`;
        }
        if ((0, ReportActionsUtils_1.isCreatedAction)(reportAction)) {
            return (0, ReportUtils_1.formatReportLastMessageText)(SidebarUtils_1.default.getWelcomeMessage(report, policy, participantPersonalDetailList, localeCompare, isReportArchived).messageText ?? translate('report.noActivityYet'));
        }
        if (reportActionMessage.html) {
            return Parser_1.default.htmlToText(reportActionMessage.html.replace(/<mention-user accountID=(\d+)>\s*<\/mention-user>/gi, '<mention-user accountID="$1"/>'));
        }
        return (0, ReportActionsUtils_1.getReportActionMessageText)(reportAction);
    }, [translate, report, policy, participantPersonalDetailList, localeCompare, isReportArchived]);
    const searchedReportActions = (0, react_1.useMemo)(() => {
        return (sortedAllReportActions ?? [])
            .filter((reportAction) => reportAction.reportActionID.includes(debouncedSearchValue) || (0, ReportActionsUtils_1.getReportActionMessageText)(reportAction).toLowerCase().includes(debouncedSearchValue.toLowerCase()))
            .map((reportAction) => ({
            reportActionID: reportAction.reportActionID,
            text: getReportActionDebugText(reportAction),
            alternateText: `${reportAction.reportActionID} | ${datetimeToCalendarTime(reportAction.created, false, false)}`,
        }));
    }, [sortedAllReportActions, debouncedSearchValue, getReportActionDebugText, datetimeToCalendarTime]);
    return (<ScrollView_1.default style={styles.mv3}>
            <Button_1.default success large text={translate('common.create')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.DEBUG_REPORT_ACTION_CREATE.getRoute(reportID))} style={[styles.pb3, styles.ph3]}/>
            <SelectionList_1.default sections={[{ data: searchedReportActions }]} listItemTitleStyles={styles.fontWeightNormal} textInputValue={searchValue} textInputLabel={translate('common.search')} headerMessage={(0, OptionsListUtils_1.getHeaderMessageForNonUserList)(searchedReportActions.length > 0, debouncedSearchValue)} onChangeText={setSearchValue} onSelectRow={(item) => Navigation_1.default.navigate(ROUTES_1.default.DEBUG_REPORT_ACTION.getRoute(reportID, item.reportActionID))} ListItem={RadioListItem_1.default}/>
        </ScrollView_1.default>);
}
DebugReportActions.displayName = 'DebugReportActions';
exports.default = DebugReportActions;
