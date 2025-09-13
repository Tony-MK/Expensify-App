"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const NewChatNameForm_1 = require("@src/types/form/NewChatNameForm");
function GroupChatNameEditPage({ report }) {
    // If we have a report this means we are using this page to update an existing Group Chat name
    // In this case its better to use empty string as the reportID if there is no reportID
    const reportID = report?.reportID;
    const isUpdatingExistingReport = !!reportID;
    const [groupChatDraft = (0, ReportUtils_1.getGroupChatDraft)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NEW_GROUP_CHAT_DRAFT, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const existingReportName = (0, react_1.useMemo)(() => (report ? (0, ReportUtils_1.getGroupChatName)(undefined, false, report) : (0, ReportUtils_1.getGroupChatName)(groupChatDraft?.participants)), [groupChatDraft?.participants, report]);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const currentChatName = reportID ? existingReportName : groupChatDraft?.reportName || existingReportName;
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const name = values[NewChatNameForm_1.default.NEW_CHAT_NAME] ?? '';
        // Uses the spread syntax to count the number of Unicode code points instead of the number of UTF-16 code units.
        const nameLength = [...name.trim()].length;
        if (nameLength > CONST_1.default.REPORT_NAME_LIMIT) {
            errors.newChatName = translate('common.error.characterLimitExceedCounter', { length: nameLength, limit: CONST_1.default.REPORT_NAME_LIMIT });
        }
        return errors;
    }, [translate]);
    const editName = (0, react_1.useCallback)((values) => {
        if (isUpdatingExistingReport) {
            if (values[NewChatNameForm_1.default.NEW_CHAT_NAME] !== currentChatName) {
                (0, Report_1.updateChatName)(reportID, values[NewChatNameForm_1.default.NEW_CHAT_NAME] ?? '', CONST_1.default.REPORT.CHAT_TYPE.GROUP);
            }
            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(reportID)));
            return;
        }
        if (values[NewChatNameForm_1.default.NEW_CHAT_NAME] !== currentChatName) {
            (0, Report_1.setGroupDraft)({ reportName: values[NewChatNameForm_1.default.NEW_CHAT_NAME] });
        }
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.goBack(ROUTES_1.default.NEW_CHAT_CONFIRM));
    }, [isUpdatingExistingReport, reportID, currentChatName]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom style={[styles.defaultModalContainer]} testID={GroupChatNameEditPage.displayName} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('newRoomPage.groupName')} onBackButtonPress={() => Navigation_1.default.goBack(isUpdatingExistingReport ? ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(reportID) : ROUTES_1.default.NEW_CHAT_CONFIRM)}/>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.NEW_CHAT_NAME_FORM} onSubmit={editName} submitButtonText={translate('common.save')} validate={validate} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert>
                <InputWrapper_1.default InputComponent={TextInput_1.default} defaultValue={currentChatName} label={translate('common.name')} accessibilityLabel={translate('common.name')} inputID={NewChatNameForm_1.default.NEW_CHAT_NAME} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef}/>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
GroupChatNameEditPage.displayName = 'GroupChatNameEditPage';
exports.default = GroupChatNameEditPage;
