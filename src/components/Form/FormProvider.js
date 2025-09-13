"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const InputBlurContext_1 = require("@components/InputBlurContext");
const useDebounceNonReactive_1 = require("@hooks/useDebounceNonReactive");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const Browser_1 = require("@libs/Browser");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Visibility_1 = require("@libs/Visibility");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const keyboard_1 = require("@src/utils/keyboard");
const FormContext_1 = require("./FormContext");
const FormWrapper_1 = require("./FormWrapper");
// In order to prevent Checkbox focus loss when the user are focusing a TextInput and proceeds to toggle a CheckBox in web and mobile web.
// 200ms delay was chosen as a result of empirical testing.
// More details: https://github.com/Expensify/App/pull/16444#issuecomment-1482983426
const VALIDATE_DELAY = 200;
function getInitialValueByType(valueType) {
    switch (valueType) {
        case 'string':
            return '';
        case 'boolean':
            return false;
        case 'date':
            return new Date();
        default:
            return '';
    }
}
function FormProvider({ formID, validate, shouldValidateOnBlur = true, shouldValidateOnChange = true, children, enabledWhenOffline = false, onSubmit, shouldTrimValues = true, allowHTML = false, isLoading = false, shouldRenderFooterAboveSubmit = false, shouldUseStrictHtmlTagValidation = false, shouldPreventDefaultFocusOnPressSubmit = false, ref, ...rest }) {
    const [network] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NETWORK, { canBeMissing: true });
    const [formState] = (0, useOnyx_1.default)(`${formID}`, { canBeMissing: true });
    const [draftValues, draftValuesMetadata] = (0, useOnyx_1.default)(`${formID}Draft`, { canBeMissing: true });
    const { preferredLocale, translate } = (0, useLocalize_1.default)();
    const inputRefs = (0, react_1.useRef)({});
    const touchedInputs = (0, react_1.useRef)({});
    const [inputValues, setInputValues] = (0, react_1.useState)(() => ({ ...draftValues }));
    const isLoadingDraftValues = (0, isLoadingOnyxValue_1.default)(draftValuesMetadata);
    const prevIsLoadingDraftValues = (0, usePrevious_1.default)(isLoadingDraftValues);
    (0, react_1.useEffect)(() => {
        if (isLoadingDraftValues || !prevIsLoadingDraftValues) {
            return;
        }
        setInputValues({ ...draftValues });
    }, [isLoadingDraftValues, draftValues, prevIsLoadingDraftValues]);
    const [errors, setErrors] = (0, react_1.useState)({});
    const hasServerError = (0, react_1.useMemo)(() => !!formState && !(0, EmptyObject_1.isEmptyObject)(formState?.errors), [formState]);
    const { setIsBlurred } = (0, InputBlurContext_1.useInputBlurContext)();
    const onValidate = (0, react_1.useCallback)((values, shouldClearServerError = true) => {
        const trimmedStringValues = shouldTrimValues ? (0, ValidationUtils_1.prepareValues)(values) : values;
        if (shouldClearServerError) {
            (0, FormActions_1.clearErrors)(formID);
        }
        (0, FormActions_1.clearErrorFields)(formID);
        const validateErrors = validate?.(trimmedStringValues) ?? {};
        if (!allowHTML) {
            // Validate the input for html tags. It should supersede any other error
            Object.entries(trimmedStringValues).forEach(([inputID, inputValue]) => {
                // If the input value is empty OR is non-string, we don't need to validate it for HTML tags
                if (!inputValue || typeof inputValue !== 'string') {
                    return;
                }
                const validateForHtmlTagRegex = shouldUseStrictHtmlTagValidation ? CONST_1.default.STRICT_VALIDATE_FOR_HTML_TAG_REGEX : CONST_1.default.VALIDATE_FOR_HTML_TAG_REGEX;
                const foundHtmlTagIndex = inputValue.search(validateForHtmlTagRegex);
                const leadingSpaceIndex = inputValue.search(CONST_1.default.VALIDATE_FOR_LEADING_SPACES_HTML_TAG_REGEX);
                // Return early if there are no HTML characters
                if (leadingSpaceIndex === -1 && foundHtmlTagIndex === -1) {
                    return;
                }
                const matchedHtmlTags = inputValue.match(validateForHtmlTagRegex);
                let isMatch = CONST_1.default.WHITELISTED_TAGS.some((regex) => regex.test(inputValue));
                // Check for any matches that the original regex (foundHtmlTagIndex) matched
                if (matchedHtmlTags) {
                    // Check if any matched inputs does not match in WHITELISTED_TAGS list and return early if needed.
                    for (const htmlTag of matchedHtmlTags) {
                        isMatch = CONST_1.default.WHITELISTED_TAGS.some((regex) => regex.test(htmlTag));
                        if (!isMatch) {
                            break;
                        }
                    }
                }
                if (isMatch && leadingSpaceIndex === -1) {
                    return;
                }
                // Add a validation error here because it is a string value that contains HTML characters
                validateErrors[inputID] = translate('common.error.invalidCharacter');
            });
        }
        if (typeof validateErrors !== 'object') {
            throw new Error('Validate callback must return an empty object or an object with shape {inputID: error}');
        }
        const touchedInputErrors = Object.fromEntries(Object.entries(validateErrors).filter(([inputID]) => touchedInputs.current[inputID]));
        if (!(0, fast_equals_1.deepEqual)(errors, touchedInputErrors)) {
            setErrors(touchedInputErrors);
        }
        return touchedInputErrors;
    }, [shouldTrimValues, formID, validate, errors, translate, allowHTML, shouldUseStrictHtmlTagValidation]);
    // When locales change from another session of the same account,
    // validate the form in order to update the error translations
    (0, react_1.useEffect)(() => {
        // Return since we only have issues with error translations
        if (Object.keys(errors).length === 0) {
            return;
        }
        // Prepare validation values
        const trimmedStringValues = shouldTrimValues ? (0, ValidationUtils_1.prepareValues)(inputValues) : inputValues;
        // Validate in order to make sure the correct error translations are displayed,
        // making sure to not clear server errors if they exist
        onValidate(trimmedStringValues, !hasServerError);
        // Only run when locales change
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [preferredLocale]);
    /** @param inputID - The inputID of the input being touched */
    const setTouchedInput = (0, react_1.useCallback)((inputID) => {
        touchedInputs.current[inputID] = true;
    }, [touchedInputs]);
    const submit = (0, useDebounceNonReactive_1.default)((0, react_1.useCallback)(() => {
        // Return early if the form is already submitting to avoid duplicate submission
        if (!!formState?.isLoading || isLoading) {
            return;
        }
        // Prepare values before submitting
        const trimmedStringValues = shouldTrimValues ? (0, ValidationUtils_1.prepareValues)(inputValues) : inputValues;
        // Touches all form inputs, so we can validate the entire form
        Object.keys(inputRefs.current).forEach((inputID) => (touchedInputs.current[inputID] = true));
        // Validate form and return early if any errors are found
        if (!(0, EmptyObject_1.isEmptyObject)(onValidate(trimmedStringValues))) {
            return;
        }
        // Do not submit form if network is offline and the form is not enabled when offline
        if (network?.isOffline && !enabledWhenOffline) {
            return;
        }
        keyboard_1.default.dismiss().then(() => onSubmit(trimmedStringValues));
    }, [enabledWhenOffline, formState?.isLoading, inputValues, isLoading, network?.isOffline, onSubmit, onValidate, shouldTrimValues]), 1000, { leading: true, trailing: false });
    // Keep track of the focus state of the current screen.
    // This is used to prevent validating the form on blur before it has been interacted with.
    const isFocusedRef = (0, react_1.useRef)(true);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        isFocusedRef.current = true;
        return () => {
            isFocusedRef.current = false;
        };
    }, []));
    const resetForm = (0, react_1.useCallback)((optionalValue) => {
        Object.keys(inputValues).forEach((inputID) => {
            setInputValues((prevState) => {
                const copyPrevState = { ...prevState };
                touchedInputs.current[inputID] = false;
                copyPrevState[inputID] = optionalValue[inputID] || '';
                return copyPrevState;
            });
        });
        setErrors({});
    }, [inputValues]);
    const resetErrors = (0, react_1.useCallback)(() => {
        (0, FormActions_1.clearErrors)(formID);
        (0, FormActions_1.clearErrorFields)(formID);
        setErrors({});
    }, [formID]);
    const resetFormFieldError = (0, react_1.useCallback)((inputID) => {
        const newErrors = { ...errors };
        delete newErrors[inputID];
        (0, FormActions_1.setErrors)(formID, newErrors);
        setErrors(newErrors);
    }, [errors, formID]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        resetForm,
        resetErrors,
        resetFormFieldError,
        submit,
    }));
    const registerInput = (0, react_1.useCallback)((inputID, shouldSubmitForm, inputProps) => {
        const newRef = inputRefs.current[inputID] ?? inputProps.ref ?? (0, react_1.createRef)();
        if (inputRefs.current[inputID] !== newRef) {
            inputRefs.current[inputID] = newRef;
        }
        if (inputProps.value !== undefined) {
            // eslint-disable-next-line react-compiler/react-compiler
            inputValues[inputID] = inputProps.value;
        }
        else if (inputProps.shouldSaveDraft && draftValues?.[inputID] !== undefined && inputValues[inputID] === undefined) {
            inputValues[inputID] = draftValues[inputID];
        }
        else if (inputProps.shouldUseDefaultValue && inputProps.defaultValue !== undefined && inputValues[inputID] === undefined) {
            // We force the form to set the input value from the defaultValue props if there is a saved valid value
            inputValues[inputID] = inputProps.defaultValue;
        }
        else if (inputValues[inputID] === undefined) {
            // We want to initialize the input value if it's undefined
            inputValues[inputID] = inputProps.defaultValue ?? getInitialValueByType(inputProps.valueType);
        }
        const errorFields = formState?.errorFields?.[inputID] ?? {};
        const fieldErrorMessage = Object.keys(errorFields)
            .sort()
            .map((key) => errorFields[key])
            .at(-1) ?? '';
        const inputRef = inputProps.ref;
        return {
            ...inputProps,
            ...(shouldSubmitForm && {
                onSubmitEditing: (event) => {
                    submit();
                    inputProps.onSubmitEditing?.(event);
                },
                returnKeyType: 'go',
            }),
            ref: typeof inputRef === 'function'
                ? (node) => {
                    inputRef(node);
                    newRef.current = node;
                }
                : newRef,
            inputID,
            key: inputProps.key ?? inputID,
            errorText: errors[inputID] ?? fieldErrorMessage,
            value: inputValues[inputID],
            // As the text input is controlled, we never set the defaultValue prop
            // as this is already happening by the value prop.
            // If it's uncontrolled, then we set the `defaultValue` prop to actual value
            defaultValue: inputProps.uncontrolled ? inputProps.defaultValue : undefined,
            onTouched: (event) => {
                if (!inputProps.shouldSetTouchedOnBlurOnly) {
                    setTouchedInput(inputID);
                }
                inputProps.onTouched?.(event);
            },
            onPress: (event) => {
                if (!inputProps.shouldSetTouchedOnBlurOnly) {
                    setTimeout(() => {
                        setTouchedInput(inputID);
                    }, VALIDATE_DELAY);
                }
                inputProps.onPress?.(event);
            },
            onPressOut: (event) => {
                // To prevent validating just pressed inputs, we need to set the touched input right after
                // onValidate and to do so, we need to delay setTouchedInput of the same amount of time
                // as the onValidate is delayed
                if (!inputProps.shouldSetTouchedOnBlurOnly) {
                    setTimeout(() => {
                        setTouchedInput(inputID);
                    }, VALIDATE_DELAY);
                }
                inputProps.onPressOut?.(event);
            },
            onBlur: (event) => {
                // Only run validation when user proactively blurs the input.
                if (Visibility_1.default.isVisible() && Visibility_1.default.hasFocus()) {
                    const relatedTarget = event && 'relatedTarget' in event.nativeEvent && event?.nativeEvent?.relatedTarget;
                    const relatedTargetId = relatedTarget && 'id' in relatedTarget && typeof relatedTarget.id === 'string' && relatedTarget.id;
                    // We delay the validation in order to prevent Checkbox loss of focus when
                    // the user is focusing a TextInput and proceeds to toggle a CheckBox in
                    // web and mobile web platforms.
                    setTimeout(() => {
                        if (relatedTargetId === CONST_1.default.OVERLAY.BOTTOM_BUTTON_NATIVE_ID ||
                            relatedTargetId === CONST_1.default.OVERLAY.TOP_BUTTON_NATIVE_ID ||
                            relatedTargetId === CONST_1.default.BACK_BUTTON_NATIVE_ID) {
                            return;
                        }
                        setTouchedInput(inputID);
                        // We don't validate the form on blur in case the current screen is not focused
                        if (shouldValidateOnBlur && isFocusedRef.current) {
                            onValidate(inputValues, !hasServerError);
                        }
                    }, VALIDATE_DELAY);
                }
                inputProps.onBlur?.(event);
                if ((0, Browser_1.isSafari)()) {
                    react_native_1.InteractionManager.runAfterInteractions(() => {
                        setIsBlurred(true);
                    });
                }
            },
            onInputChange: (value, key) => {
                const inputKey = key ?? inputID;
                setInputValues((prevState) => {
                    const newState = {
                        ...prevState,
                        [inputKey]: value,
                    };
                    if (shouldValidateOnChange) {
                        onValidate(newState);
                    }
                    return newState;
                });
                if (inputProps.shouldSaveDraft && !formID.includes('Draft')) {
                    (0, FormActions_1.setDraftValues)(formID, { [inputKey]: value });
                }
                inputProps.onValueChange?.(value, inputKey);
            },
        };
    }, [draftValues, inputValues, formState?.errorFields, errors, submit, setTouchedInput, shouldValidateOnBlur, onValidate, hasServerError, setIsBlurred, formID, shouldValidateOnChange]);
    const value = (0, react_1.useMemo)(() => ({ registerInput }), [registerInput]);
    return (<FormContext_1.default.Provider value={value}>
            {/* eslint-disable react/jsx-props-no-spreading */}
            <FormWrapper_1.default {...rest} formID={formID} onSubmit={submit} inputRefs={inputRefs} errors={errors} isLoading={isLoading} enabledWhenOffline={enabledWhenOffline} shouldRenderFooterAboveSubmit={shouldRenderFooterAboveSubmit} shouldPreventDefaultFocusOnPressSubmit={shouldPreventDefaultFocusOnPressSubmit}>
                {typeof children === 'function' ? children({ inputValues }) : children}
            </FormWrapper_1.default>
        </FormContext_1.default.Provider>);
}
FormProvider.displayName = 'Form';
exports.default = FormProvider;
