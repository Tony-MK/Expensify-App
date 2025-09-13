"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceCategoryForm_1 = require("@src/types/form/WorkspaceCategoryForm");
function CategoryForm({ onSubmit, policyCategories, categoryName, validateEdit }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const newCategoryName = values.categoryName.trim();
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(newCategoryName)) {
            errors.categoryName = translate('workspace.categories.categoryRequiredError');
        }
        else if (policyCategories?.[newCategoryName]) {
            errors.categoryName = translate('workspace.categories.existingCategoryError');
        }
        else if (newCategoryName === CONST_1.default.INVALID_CATEGORY_NAME) {
            errors.categoryName = translate('workspace.categories.invalidCategoryName');
        }
        else if ([...newCategoryName].length > CONST_1.default.API_TRANSACTION_CATEGORY_MAX_LENGTH) {
            // Uses the spread syntax to count the number of Unicode code points instead of the number of UTF-16 code units.
            (0, ErrorUtils_1.addErrorMessage)(errors, 'categoryName', translate('common.error.characterLimitExceedCounter', { length: [...newCategoryName].length, limit: CONST_1.default.API_TRANSACTION_CATEGORY_MAX_LENGTH }));
        }
        return errors;
    }, [policyCategories, translate]);
    const submit = (0, react_1.useCallback)((values) => {
        react_native_1.Keyboard.dismiss();
        onSubmit(values);
    }, [onSubmit]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_CATEGORY_FORM} onSubmit={submit} submitButtonText={translate('common.save')} 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    validate={validateEdit || validate} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
            <InputWrapper_1.default ref={inputCallbackRef} InputComponent={TextInput_1.default} defaultValue={categoryName} label={translate('common.name')} accessibilityLabel={translate('common.name')} inputID={WorkspaceCategoryForm_1.default.CATEGORY_NAME} role={CONST_1.default.ROLE.PRESENTATION}/>
        </FormProvider_1.default>);
}
CategoryForm.displayName = 'CategoryForm';
exports.default = CategoryForm;
