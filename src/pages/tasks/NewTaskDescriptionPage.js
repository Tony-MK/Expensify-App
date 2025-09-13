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
const updateMultilineInputRange_1 = require("@libs/updateMultilineInputRange");
const variables_1 = require("@styles/variables");
const Task_1 = require("@userActions/Task");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const NewTaskForm_1 = require("@src/types/form/NewTaskForm");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function NewTaskDescriptionPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [task, taskMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.TASK);
    const { inputCallbackRef, inputRef } = (0, useAutoFocusInput_1.default)();
    const goBack = () => Navigation_1.default.goBack(ROUTES_1.default.NEW_TASK.getRoute(route.params?.backTo));
    const onSubmit = (values) => {
        (0, Task_1.setDescriptionValue)(values.taskDescription);
        goBack();
    };
    const validate = (values) => {
        const errors = {};
        const taskDescriptionLength = (0, ReportUtils_1.getCommentLength)(values.taskDescription);
        if (taskDescriptionLength > CONST_1.default.DESCRIPTION_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'taskDescription', translate('common.error.characterLimitExceedCounter', { length: taskDescriptionLength, limit: CONST_1.default.DESCRIPTION_LIMIT }));
        }
        return errors;
    };
    if ((0, isLoadingOnyxValue_1.default)(taskMetadata)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={NewTaskDescriptionPage.displayName}>
            <>
                <HeaderWithBackButton_1.default title={translate('task.description')} onBackButtonPress={goBack}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.NEW_TASK_FORM} submitButtonText={translate('common.next')} style={[styles.mh5, styles.flexGrow1]} validate={validate} onSubmit={onSubmit} enabledWhenOffline shouldHideFixErrorsAlert>
                    <react_native_1.View style={styles.mb5}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} defaultValue={Parser_1.default.htmlToMarkdown(Parser_1.default.replace(task?.description ?? ''))} inputID={NewTaskForm_1.default.TASK_DESCRIPTION} label={translate('newTaskPage.descriptionOptional')} accessibilityLabel={translate('newTaskPage.descriptionOptional')} role={CONST_1.default.ROLE.PRESENTATION} ref={(el) => {
            if (!inputRef.current) {
                (0, updateMultilineInputRange_1.default)(el);
            }
            inputCallbackRef(el);
        }} autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} shouldSubmitForm type="markdown"/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </>
        </ScreenWrapper_1.default>);
}
NewTaskDescriptionPage.displayName = 'NewTaskDescriptionPage';
exports.default = NewTaskDescriptionPage;
