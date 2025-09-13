"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useDelayAutoFocus_1 = require("@hooks/useDelayAutoFocus");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const HelpLinks_1 = require("@pages/ReimbursementAccount/USD/Requestor/PersonalInfo/HelpLinks");
const CONST_1 = require("@src/CONST");
function SingleFieldStep({ formID, formTitle, formDisclaimer, validate, onSubmit, inputId, inputLabel, inputMode, defaultValue, isEditing, shouldShowHelpLinks = true, maxLength, enabledWhenOffline, shouldUseDefaultValue = true, disabled = false, placeholder, shouldDelayAutoFocus = false, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const internalInputRef = (0, react_1.useRef)(null);
    (0, useDelayAutoFocus_1.default)(internalInputRef, shouldDelayAutoFocus);
    return (<FormProvider_1.default formID={formID} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} validate={validate} onSubmit={onSubmit} style={[styles.mh5, styles.flexGrow1]} submitButtonStyles={[styles.mb0]} enabledWhenOffline={enabledWhenOffline} shouldHideFixErrorsAlert>
            <react_native_1.View>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL]}>{formTitle}</Text_1.default>
                {!!formDisclaimer && <Text_1.default style={[styles.textSupporting, styles.mt3]}>{formDisclaimer}</Text_1.default>}
                <react_native_1.View style={[styles.flex1]}>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={inputId} label={inputLabel} aria-label={inputLabel} role={CONST_1.default.ROLE.PRESENTATION} containerStyles={[styles.mt6]} inputMode={inputMode} defaultValue={defaultValue} maxLength={maxLength} shouldSaveDraft={!isEditing} shouldUseDefaultValue={shouldUseDefaultValue} disabled={disabled} placeholder={placeholder} autoFocus={!shouldDelayAutoFocus} ref={internalInputRef}/>
                </react_native_1.View>
                {shouldShowHelpLinks && <HelpLinks_1.default containerStyles={[styles.mt5]}/>}
            </react_native_1.View>
        </FormProvider_1.default>);
}
SingleFieldStep.displayName = 'SingleFieldStep';
exports.default = (0, react_1.forwardRef)(SingleFieldStep);
