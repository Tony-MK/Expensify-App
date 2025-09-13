"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const ReportUtils_1 = require("@libs/ReportUtils");
const updateMultilineInputRange_1 = require("@libs/updateMultilineInputRange");
const withReportOrNotFound_1 = require("@pages/home/report/withReportOrNotFound");
const variables_1 = require("@styles/variables");
const Task_1 = require("@userActions/Task");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EditTaskForm_1 = require("@src/types/form/EditTaskForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function TaskTitlePage({ report, currentUserPersonalDetails }) {
    const route = (0, native_1.useRoute)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const validate = (0, react_1.useCallback)(({ title }) => {
        const errors = {};
        const parsedTitle = (0, ReportUtils_1.getParsedComment)(title, undefined, undefined, [...CONST_1.default.TASK_TITLE_DISABLED_RULES]);
        const parsedTitleLength = (0, ReportUtils_1.getCommentLength)(parsedTitle);
        if (!parsedTitle) {
            (0, ErrorUtils_1.addErrorMessage)(errors, EditTaskForm_1.default.TITLE, translate('newTaskPage.pleaseEnterTaskName'));
        }
        else if (parsedTitleLength > CONST_1.default.TASK_TITLE_CHARACTER_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, EditTaskForm_1.default.TITLE, translate('common.error.characterLimitExceedCounter', { length: parsedTitleLength, limit: CONST_1.default.TASK_TITLE_CHARACTER_LIMIT }));
        }
        return errors;
    }, [translate]);
    const submit = (0, react_1.useCallback)((values) => {
        if (values.title !== Parser_1.default.htmlToMarkdown(report?.reportName ?? '') && !(0, EmptyObject_1.isEmptyObject)(report)) {
            // Set the title of the report in the store and then call EditTask API
            // to update the title of the report on the server
            (0, Task_1.editTask)(report, { title: values.title });
        }
        Navigation_1.default.dismissModalWithReport({ reportID: report?.reportID });
    }, [report]);
    if (!(0, ReportUtils_1.isTaskReport)(report)) {
        Navigation_1.default.isNavigationReady().then(() => {
            Navigation_1.default.dismissModalWithReport({ reportID: report?.reportID });
        });
    }
    const inputRef = (0, react_1.useRef)(null);
    const isOpen = (0, ReportUtils_1.isOpenTaskReport)(report);
    const isParentReportArchived = (0, useReportIsArchived_1.default)(report?.parentReportID);
    const isTaskModifiable = (0, Task_1.canModifyTask)(report, currentUserPersonalDetails.accountID, isParentReportArchived);
    const isTaskNonEditable = (0, ReportUtils_1.isTaskReport)(report) && (!isTaskModifiable || !isOpen);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom onEntryTransitionEnd={() => {
            inputRef?.current?.focus();
        }} shouldEnableMaxHeight testID={TaskTitlePage.displayName}>
            {({ didScreenTransitionEnd }) => (<FullPageNotFoundView_1.default shouldShow={isTaskNonEditable}>
                    <HeaderWithBackButton_1.default title={translate('task.task')} onBackButtonPress={() => Navigation_1.default.goBack(route.params.backTo)}/>
                    <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.EDIT_TASK_FORM} validate={validate} onSubmit={submit} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert>
                        <react_native_1.View style={[styles.mb4]}>
                            <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} inputID={EditTaskForm_1.default.TITLE} name={EditTaskForm_1.default.TITLE} label={translate('task.title')} accessibilityLabel={translate('task.title')} defaultValue={Parser_1.default.htmlToMarkdown(report?.reportName ?? '', {})} ref={(element) => {
                if (!element) {
                    return;
                }
                if (!inputRef.current && didScreenTransitionEnd) {
                    (0, updateMultilineInputRange_1.default)(inputRef.current);
                }
                inputRef.current = element;
            }} autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} shouldSubmitForm={false} type="markdown"/>
                        </react_native_1.View>
                    </FormProvider_1.default>
                </FullPageNotFoundView_1.default>)}
        </ScreenWrapper_1.default>);
}
TaskTitlePage.displayName = 'TaskTitlePage';
const ComponentWithCurrentUserPersonalDetails = (0, withCurrentUserPersonalDetails_1.default)(TaskTitlePage);
exports.default = (0, withReportOrNotFound_1.default)()(ComponentWithCurrentUserPersonalDetails);
