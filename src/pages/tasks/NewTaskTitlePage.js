"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
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
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function NewTaskTitlePage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const [task, taskMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.TASK);
    const { translate } = (0, useLocalize_1.default)();
    const goBack = () => Navigation_1.default.goBack(ROUTES_1.default.NEW_TASK.getRoute(route.params?.backTo));
    const validate = (values) => {
        const errors = {};
        const parsedTitleLength = (0, ReportUtils_1.getCommentLength)(values.taskTitle);
        if (!values.taskTitle) {
            // We error if the user doesn't enter a task name
            (0, ErrorUtils_1.addErrorMessage)(errors, 'taskTitle', translate('newTaskPage.pleaseEnterTaskName'));
        }
        else if (parsedTitleLength > CONST_1.default.TASK_TITLE_CHARACTER_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'taskTitle', translate('common.error.characterLimitExceedCounter', { length: parsedTitleLength, limit: CONST_1.default.TASK_TITLE_CHARACTER_LIMIT }));
        }
        return errors;
    };
    // On submit, we want to call the assignTask function and wait to validate
    // the response
    const onSubmit = (values) => {
        (0, Task_1.setTitleValue)(values.taskTitle);
        goBack();
    };
    if ((0, isLoadingOnyxValue_1.default)(taskMetadata)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={NewTaskTitlePage.displayName}>
            <HeaderWithBackButton_1.default title={translate('task.title')} shouldShowBackButton onBackButtonPress={goBack}/>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.NEW_TASK_FORM} submitButtonText={translate('common.next')} style={[styles.mh5, styles.flexGrow1]} validate={validate} onSubmit={onSubmit} enabledWhenOffline shouldHideFixErrorsAlert>
                <react_native_1.View style={styles.mb5}>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={Parser_1.default.htmlToMarkdown(task?.title ?? '')} ref={inputCallbackRef} inputID={NewTaskForm_1.default.TASK_TITLE} label={translate('task.title')} accessibilityLabel={translate('task.title')} autoGrowHeight type="markdown" maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight}/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
NewTaskTitlePage.displayName = 'NewTaskTitlePage';
exports.default = NewTaskTitlePage;
