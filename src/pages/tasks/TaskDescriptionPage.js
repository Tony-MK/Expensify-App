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
function TaskDescriptionPage({ report, currentUserPersonalDetails }) {
    const route = (0, native_1.useRoute)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const taskDescriptionLength = (0, ReportUtils_1.getCommentLength)(values.description);
        if (values?.description && taskDescriptionLength > CONST_1.default.DESCRIPTION_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'description', translate('common.error.characterLimitExceedCounter', { length: taskDescriptionLength, limit: CONST_1.default.DESCRIPTION_LIMIT }));
        }
        return errors;
    }, [translate]);
    const submit = (0, react_1.useCallback)((values) => {
        if (values.description !== Parser_1.default.htmlToMarkdown(report?.description ?? '') && !(0, EmptyObject_1.isEmptyObject)(report)) {
            // Set the description of the report in the store and then call EditTask API
            // to update the description of the report on the server
            (0, Task_1.editTask)(report, { description: values.description });
        }
        Navigation_1.default.dismissModalWithReport({ reportID: report?.reportID });
    }, [report]);
    if (!(0, ReportUtils_1.isTaskReport)(report)) {
        Navigation_1.default.isNavigationReady().then(() => {
            Navigation_1.default.dismissModalWithReport({ reportID: report?.reportID });
        });
    }
    const inputRef = (0, react_1.useRef)(null);
    const focusTimeoutRef = (0, react_1.useRef)(null);
    const isOpen = (0, ReportUtils_1.isOpenTaskReport)(report);
    const isParentReportArchived = (0, useReportIsArchived_1.default)(report?.parentReportID);
    const canActuallyModifyTask = (0, Task_1.canModifyTask)(report, currentUserPersonalDetails.accountID, isParentReportArchived);
    const isTaskNonEditable = (0, ReportUtils_1.isTaskReport)(report) && (!canActuallyModifyTask || !isOpen);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
            return () => {
                if (!focusTimeoutRef.current) {
                    return;
                }
                clearTimeout(focusTimeoutRef.current);
            };
        }, CONST_1.default.ANIMATED_TRANSITION);
    }, []));
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={TaskDescriptionPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={isTaskNonEditable}>
                <HeaderWithBackButton_1.default title={translate('task.task')} onBackButtonPress={() => Navigation_1.default.goBack(route.params.backTo)}/>
                <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.EDIT_TASK_FORM} validate={validate} onSubmit={submit} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert>
                    <react_native_1.View style={[styles.mb4]}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} inputID={EditTaskForm_1.default.DESCRIPTION} name={EditTaskForm_1.default.DESCRIPTION} label={translate('newTaskPage.descriptionOptional')} accessibilityLabel={translate('newTaskPage.descriptionOptional')} defaultValue={Parser_1.default.htmlToMarkdown(report?.description ?? '')} ref={(element) => {
            if (!element) {
                return;
            }
            if (!inputRef.current) {
                (0, updateMultilineInputRange_1.default)(inputRef.current);
            }
            inputRef.current = element;
        }} autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} shouldSubmitForm type="markdown"/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
TaskDescriptionPage.displayName = 'TaskDescriptionPage';
const ComponentWithCurrentUserPersonalDetails = (0, withCurrentUserPersonalDetails_1.default)(TaskDescriptionPage);
exports.default = (0, withReportOrNotFound_1.default)()(ComponentWithCurrentUserPersonalDetails);
