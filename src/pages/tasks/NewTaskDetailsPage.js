"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const ReportUtils_1 = require("@libs/ReportUtils");
const variables_1 = require("@styles/variables");
const Task_1 = require("@userActions/Task");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const NewTaskForm_1 = require("@src/types/form/NewTaskForm");
function NewTaskDetailsPage({ route }) {
    const [task] = (0, useOnyx_1.default)(ONYXKEYS_1.default.TASK, { canBeMissing: true });
    const [quickAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [taskTitle, setTaskTitle] = (0, react_1.useState)(task?.title ?? '');
    const [taskDescription, setTaskDescription] = (0, react_1.useState)(task?.description ?? '');
    const titleDefaultValue = (0, react_1.useMemo)(() => Parser_1.default.htmlToMarkdown(Parser_1.default.replace(taskTitle)), [taskTitle]);
    const descriptionDefaultValue = (0, react_1.useMemo)(() => Parser_1.default.htmlToMarkdown(Parser_1.default.replace(taskDescription)), [taskDescription]);
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const backTo = route.params?.backTo;
    const skipConfirmation = task?.skipConfirmation && task?.assigneeAccountID && task?.parentReportID;
    const buttonText = skipConfirmation ? translate('newTaskPage.assignTask') : translate('common.next');
    (0, react_1.useEffect)(() => {
        setTaskTitle(Parser_1.default.htmlToMarkdown(Parser_1.default.replace(task?.title ?? '')));
        setTaskDescription(Parser_1.default.htmlToMarkdown(Parser_1.default.replace(task?.description ?? '')));
    }, [task]);
    const validate = (values) => {
        const errors = {};
        if (!values.taskTitle) {
            // We error if the user doesn't enter a task name
            (0, ErrorUtils_1.addErrorMessage)(errors, 'taskTitle', translate('newTaskPage.pleaseEnterTaskName'));
        }
        else if (values.taskTitle.length > CONST_1.default.TASK_TITLE_CHARACTER_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'taskTitle', translate('common.error.characterLimitExceedCounter', { length: values.taskTitle.length, limit: CONST_1.default.TASK_TITLE_CHARACTER_LIMIT }));
        }
        const taskDescriptionLength = (0, ReportUtils_1.getCommentLength)(values.taskDescription);
        if (taskDescriptionLength > CONST_1.default.DESCRIPTION_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'taskDescription', translate('common.error.characterLimitExceedCounter', { length: taskDescriptionLength, limit: CONST_1.default.DESCRIPTION_LIMIT }));
        }
        return errors;
    };
    // On submit, we want to call the assignTask function and wait to validate
    // the response
    const onSubmit = (values) => {
        (0, Task_1.setDetailsValue)(values.taskTitle, values.taskDescription);
        if (skipConfirmation) {
            (0, Task_1.setShareDestinationValue)(task?.parentReportID);
            (0, Task_1.createTaskAndNavigate)(task?.parentReportID, values.taskTitle, values.taskDescription ?? '', task?.assignee ?? '', task.assigneeAccountID, task.assigneeChatReport, CONST_1.default.POLICY.OWNER_EMAIL_FAKE, false, quickAction);
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.NEW_TASK.getRoute(backTo));
        }
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={NewTaskDetailsPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('newTaskPage.assignTask')} shouldShowBackButton onBackButtonPress={() => (0, Task_1.dismissModalAndClearOutTaskInfo)(backTo)}/>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.NEW_TASK_FORM} submitButtonText={buttonText} style={[styles.mh5, styles.flexGrow1]} validate={validate} onSubmit={onSubmit} enabledWhenOffline>
                <react_native_1.View style={styles.mb5}>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} ref={inputCallbackRef} valueType="string" role={CONST_1.default.ROLE.PRESENTATION} inputID={NewTaskForm_1.default.TASK_TITLE} label={translate('task.title')} accessibilityLabel={translate('task.title')} defaultValue={titleDefaultValue} value={taskTitle} onValueChange={setTaskTitle} autoCorrect={false} type="markdown" autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight}/>
                </react_native_1.View>
                <react_native_1.View style={styles.mb5}>
                    <InputWrapper_1.default valueType="string" InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} inputID={NewTaskForm_1.default.TASK_DESCRIPTION} label={translate('newTaskPage.descriptionOptional')} accessibilityLabel={translate('newTaskPage.descriptionOptional')} autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} shouldSubmitForm defaultValue={descriptionDefaultValue} value={taskDescription} onValueChange={setTaskDescription} type="markdown"/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
NewTaskDetailsPage.displayName = 'NewTaskDetailsPage';
exports.default = NewTaskDetailsPage;
