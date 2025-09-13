"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const RadioButtons_1 = require("@components/RadioButtons");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function YesNoStep({ title, description, defaultValue, onSelectedValue, submitButtonStyles, isLoading = false }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [value, setValue] = (0, react_1.useState)(defaultValue);
    const handleSubmit = () => {
        onSelectedValue(value);
    };
    const handleSelectValue = (newValue) => setValue(newValue === 'true');
    const options = (0, react_1.useMemo)(() => [
        {
            label: translate('common.yes'),
            value: 'true',
        },
        {
            label: translate('common.no'),
            value: 'false',
        },
    ], [translate]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate('common.confirm')} onSubmit={handleSubmit} style={[styles.mh5, styles.flexGrow1]} submitButtonStyles={submitButtonStyles} isLoading={isLoading} shouldHideFixErrorsAlert>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL]}>{title}</Text_1.default>
            <Text_1.default style={[styles.pv3, styles.textSupporting]}>{description}</Text_1.default>
            <RadioButtons_1.default items={options} onPress={handleSelectValue} defaultCheckedValue={defaultValue.toString()} radioButtonStyle={[styles.mb6]}/>
        </FormProvider_1.default>);
}
YesNoStep.displayName = 'YesNoStep';
exports.default = YesNoStep;
