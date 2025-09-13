"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const Checkbox_1 = require("@components/Checkbox");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const RNTextInput_1 = require("@components/RNTextInput");
const Text_1 = require("@components/Text");
const implementations_1 = require("@components/TextInput/BaseTextInput/implementations");
const styleConst = require("@components/TextInput/styleConst");
const TextInputClearButton_1 = require("@components/TextInput/TextInputClearButton");
const TextInputLabel_1 = require("@components/TextInput/TextInputLabel");
const TextInputMeasurement_1 = require("@components/TextInput/TextInputMeasurement");
const useHtmlPaste_1 = require("@hooks/useHtmlPaste");
const useLocalize_1 = require("@hooks/useLocalize");
const useMarkdownStyle_1 = require("@hooks/useMarkdownStyle");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const isInputAutoFilled_1 = require("@libs/isInputAutoFilled");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function BaseTextInput({ label = '', 
/**
 * To be able to function as either controlled or uncontrolled component we should not
 * assign a default prop value for `value` or `defaultValue` props
 */
value = undefined, defaultValue = undefined, placeholder = '', errorText = '', iconLeft = null, icon = null, textInputContainerStyles, shouldApplyPaddingToContainer = true, touchableInputWrapperStyle, containerStyles, inputStyle, shouldUseFullInputHeight = false, forceActiveLabel = false, disableKeyboard = false, autoGrow = false, autoGrowExtraSpace = 0, autoGrowMarginSide, autoGrowHeight = false, maxAutoGrowHeight, hideFocusedState = false, maxLength = undefined, hint = '', onInputChange = () => { }, multiline = false, autoCorrect = true, prefixCharacter = '', suffixCharacter = '', inputID, type = 'default', excludedMarkdownStyles = [], shouldShowClearButton = false, shouldHideClearButton = true, prefixContainerStyle = [], prefixStyle = [], suffixContainerStyle = [], suffixStyle = [], contentWidth, loadingSpinnerStyle, uncontrolled, placeholderTextColor, onClearInput, iconContainerStyle, shouldUseDefaultLineHeightForPrefix = true, ref, ...props }) {
    const InputComponent = implementations_1.default.get(type) ?? RNTextInput_1.default;
    const isMarkdownEnabled = type === 'markdown';
    const isAutoGrowHeightMarkdown = isMarkdownEnabled && autoGrowHeight;
    const inputProps = { shouldSaveDraft: false, shouldUseDefaultValue: false, ...props };
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const markdownStyle = (0, useMarkdownStyle_1.default)(false, excludedMarkdownStyles);
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { hasError = false } = inputProps;
    // Disabling this line for safeness as nullish coalescing works only if the value is undefined or null
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const initialValue = value || defaultValue || '';
    const initialActiveLabel = !!forceActiveLabel || initialValue.length > 0 || !!prefixCharacter || !!suffixCharacter;
    const isMultiline = multiline || autoGrowHeight;
    const [isFocused, setIsFocused] = (0, react_1.useState)(false);
    const [passwordHidden, setPasswordHidden] = (0, react_1.useState)(inputProps.secureTextEntry);
    const [textInputWidth, setTextInputWidth] = (0, react_1.useState)(0);
    const [textInputHeight, setTextInputHeight] = (0, react_1.useState)(0);
    const [height, setHeight] = (0, react_1.useState)(variables_1.default.componentSizeLarge);
    const [width, setWidth] = (0, react_1.useState)(null);
    const [prefixCharacterPadding, setPrefixCharacterPadding] = (0, react_1.useState)(8);
    const [isPrefixCharacterPaddingCalculated, setIsPrefixCharacterPaddingCalculated] = (0, react_1.useState)(() => !prefixCharacter);
    const labelScale = (0, react_native_reanimated_1.useSharedValue)(initialActiveLabel ? styleConst.ACTIVE_LABEL_SCALE : styleConst.INACTIVE_LABEL_SCALE);
    const labelTranslateY = (0, react_native_reanimated_1.useSharedValue)(initialActiveLabel ? styleConst.ACTIVE_LABEL_TRANSLATE_Y : styleConst.INACTIVE_LABEL_TRANSLATE_Y);
    const input = (0, react_1.useRef)(null);
    const isLabelActive = (0, react_1.useRef)(initialActiveLabel);
    const hasLabel = !!label?.length;
    (0, useHtmlPaste_1.default)(input, undefined, isMarkdownEnabled);
    const animateLabel = (0, react_1.useCallback)((translateY, scale) => {
        labelScale.set((0, react_native_reanimated_1.withTiming)(scale, {
            duration: 200,
            easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease),
        }));
        labelTranslateY.set((0, react_native_reanimated_1.withTiming)(translateY, {
            duration: 200,
            easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease),
        }));
    }, [labelScale, labelTranslateY]);
    const activateLabel = (0, react_1.useCallback)(() => {
        const inputValue = value ?? '';
        if (inputValue.length < 0 || isLabelActive.current) {
            return;
        }
        animateLabel(styleConst.ACTIVE_LABEL_TRANSLATE_Y, styleConst.ACTIVE_LABEL_SCALE);
        isLabelActive.current = true;
    }, [animateLabel, value]);
    const deactivateLabel = (0, react_1.useCallback)(() => {
        const inputValue = value ?? '';
        if (!!forceActiveLabel || inputValue.length !== 0 || prefixCharacter || suffixCharacter) {
            return;
        }
        animateLabel(styleConst.INACTIVE_LABEL_TRANSLATE_Y, styleConst.INACTIVE_LABEL_SCALE);
        isLabelActive.current = false;
    }, [animateLabel, forceActiveLabel, prefixCharacter, suffixCharacter, value]);
    const onFocus = (event) => {
        inputProps.onFocus?.(event);
        setIsFocused(true);
    };
    const onBlur = (event) => {
        inputProps.onBlur?.(event);
        setIsFocused(false);
    };
    const onPress = (event) => {
        if (!!inputProps.disabled || !event) {
            return;
        }
        inputProps.onPress?.(event);
        if ('isDefaultPrevented' in event && !event?.isDefaultPrevented()) {
            input.current?.focus();
        }
    };
    const onLayout = (0, react_1.useCallback)((event) => {
        if (!autoGrowHeight && multiline) {
            return;
        }
        const layout = event.nativeEvent.layout;
        // We need to increase the height for single line inputs to escape cursor jumping on ios
        const heightToFitEmojis = 1;
        setWidth((prevWidth) => (autoGrowHeight ? layout.width : prevWidth));
        const borderWidth = styles.textInputContainer.borderWidth * 2;
        const labelPadding = hasLabel ? styles.textInputContainer.padding : 0;
        setHeight((prevHeight) => (!multiline ? layout.height + heightToFitEmojis - (labelPadding + borderWidth) : prevHeight));
    }, [autoGrowHeight, multiline, styles.textInputContainer, hasLabel]);
    // The ref is needed when the component is uncontrolled and we don't have a value prop
    const hasValueRef = (0, react_1.useRef)(initialValue.length > 0);
    const inputValue = value ?? '';
    const hasValue = inputValue.length > 0 || hasValueRef.current;
    // Activate or deactivate the label when either focus changes, or for controlled
    // components when the value prop changes:
    (0, react_1.useEffect)(() => {
        if (hasValue ||
            isFocused ||
            // If the text has been supplied by Chrome autofill, the value state is not synced with the value
            // as Chrome doesn't trigger a change event. When there is autofill text, keep the label activated.
            (0, isInputAutoFilled_1.default)(input.current)) {
            activateLabel();
        }
        else {
            deactivateLabel();
        }
    }, [activateLabel, deactivateLabel, hasValue, isFocused]);
    // When the value prop gets cleared externally, we need to keep the ref in sync:
    (0, react_1.useEffect)(() => {
        // Return early when component uncontrolled, or we still have a value
        if (value === undefined || value) {
            return;
        }
        hasValueRef.current = false;
    }, [value]);
    /**
     * Set Value & activateLabel
     */
    const setValue = (newValue) => {
        const formattedValue = isMultiline ? newValue : newValue.replace(/\n/g, ' ');
        onInputChange?.(formattedValue);
        if (inputProps.onChangeText) {
            expensify_common_1.Str.result(inputProps.onChangeText, formattedValue);
        }
        if (formattedValue && formattedValue.length > 0) {
            hasValueRef.current = true;
            // When the component is uncontrolled, we need to manually activate the label:
            if (value === undefined) {
                activateLabel();
            }
        }
        else {
            hasValueRef.current = false;
        }
    };
    const togglePasswordVisibility = (0, react_1.useCallback)(() => {
        setPasswordHidden((prevPasswordHidden) => !prevPasswordHidden);
    }, []);
    const shouldAddPaddingBottom = isMultiline || (autoGrowHeight && !isAutoGrowHeightMarkdown && textInputHeight > variables_1.default.componentSizeLarge);
    const isReadOnly = inputProps.readOnly ?? inputProps.disabled;
    // Disabling this line for safeness as nullish coalescing works only if the value is undefined or null, and errorText can be an empty string
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const inputHelpText = errorText || hint;
    const placeholderValue = !!prefixCharacter || !!suffixCharacter || isFocused || !hasLabel || (hasLabel && forceActiveLabel) ? placeholder : undefined;
    const newTextInputContainerStyles = react_native_1.StyleSheet.flatten([
        styles.textInputContainer,
        !hasLabel && styles.pt0,
        textInputContainerStyles,
        !shouldApplyPaddingToContainer && styles.p0,
        !!contentWidth && StyleUtils.getWidthStyle(textInputWidth + (shouldApplyPaddingToContainer ? styles.textInputContainer.padding * 2 : 0)),
        autoGrow && StyleUtils.getAutoGrowWidthInputContainerStyles(textInputWidth, autoGrowExtraSpace, autoGrowMarginSide),
        !hideFocusedState && isFocused && styles.borderColorFocus,
        (!!hasError || !!errorText) && styles.borderColorDanger,
        autoGrowHeight && { scrollPaddingTop: typeof maxAutoGrowHeight === 'number' ? 2 * maxAutoGrowHeight : undefined },
        isAutoGrowHeightMarkdown && styles.pb2,
        inputProps.disabled && styles.textInputDisabledContainer,
        shouldAddPaddingBottom && styles.pb1,
    ]);
    const verticalPaddingDiff = StyleUtils.getVerticalPaddingDiffFromStyle(newTextInputContainerStyles);
    const inputPaddingLeft = !!prefixCharacter && StyleUtils.getPaddingLeft(prefixCharacterPadding + styles.pl1.paddingLeft);
    const inputPaddingRight = !!suffixCharacter && StyleUtils.getPaddingRight(StyleUtils.getCharacterPadding(suffixCharacter) + styles.pr1.paddingRight);
    // Height fix is needed only for Text single line inputs
    const shouldApplyHeight = !shouldUseFullInputHeight && !isMultiline && !isMarkdownEnabled;
    return (<>
            <react_native_1.View style={[containerStyles]}>
                <PressableWithoutFeedback_1.default role={CONST_1.default.ROLE.PRESENTATION} onPress={onPress} tabIndex={-1} 
    // When autoGrowHeight is true we calculate the width for the text input, so it will break lines properly
    // or if multiline is not supplied we calculate the text input height, using onLayout.
    onLayout={onLayout} accessibilityLabel={label} style={[
            autoGrowHeight &&
                !isAutoGrowHeightMarkdown &&
                styles.autoGrowHeightInputContainer(textInputHeight + (shouldAddPaddingBottom ? styles.textInputContainer.padding : 0), variables_1.default.componentSizeLarge, typeof maxAutoGrowHeight === 'number' ? maxAutoGrowHeight : 0),
            isAutoGrowHeightMarkdown && { minHeight: variables_1.default.inputHeight },
            !isMultiline && styles.componentHeightLarge,
            touchableInputWrapperStyle,
        ]}>
                    <react_native_1.View style={[
            newTextInputContainerStyles,
            // When autoGrow is on and minWidth is not supplied, add a minWidth to allow the input to be focusable.
            autoGrow && !newTextInputContainerStyles?.minWidth && styles.mnw2,
        ]}>
                        {hasLabel ? (<>
                                {/* Adding this background to the label only for multiline text input,
to prevent text overlapping with label when scrolling */}
                                {isMultiline && <react_native_1.View style={[styles.textInputLabelBackground, styles.pointerEventsNone, inputProps.disabled && styles.textInputDisabledContainer]}/>}
                                <TextInputLabel_1.default label={label} labelTranslateY={labelTranslateY} labelScale={labelScale} for={inputProps.nativeID} isMultiline={isMultiline}/>
                            </>) : null}
                        <react_native_1.View style={[
            styles.textInputAndIconContainer(isMarkdownEnabled),
            { flex: 1 },
            isMultiline && hasLabel && styles.textInputMultilineContainer,
            styles.pointerEventsBoxNone,
        ]}>
                            {!!iconLeft && (<react_native_1.View style={styles.textInputLeftIconContainer}>
                                    <Icon_1.default src={iconLeft} fill={theme.icon} height={20} width={20}/>
                                </react_native_1.View>)}
                            {!!prefixCharacter && (<react_native_1.View style={[styles.textInputPrefixWrapper, prefixContainerStyle, shouldApplyHeight && { height }]}>
                                    <Text_1.default onLayout={(event) => {
                if (event.nativeEvent.layout.width === 0 && event.nativeEvent.layout.height === 0) {
                    return;
                }
                setPrefixCharacterPadding(event?.nativeEvent?.layout.width);
                setIsPrefixCharacterPaddingCalculated(true);
            }} tabIndex={-1} style={[styles.textInputPrefix, !hasLabel && styles.pv0, styles.pointerEventsNone, prefixStyle]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }} shouldUseDefaultLineHeight={!!shouldUseDefaultLineHeightForPrefix && !shouldApplyHeight}>
                                        {prefixCharacter}
                                    </Text_1.default>
                                </react_native_1.View>)}
                            <InputComponent ref={(element) => {
            const baseTextInputRef = element;
            if (typeof ref === 'function') {
                ref(baseTextInputRef);
            }
            else if (ref && 'current' in ref) {
                // eslint-disable-next-line no-param-reassign
                ref.current = baseTextInputRef;
            }
            const elementRef = element;
            input.current = elementRef;
        }} 
    // eslint-disable-next-line
    {...inputProps} autoCorrect={inputProps.secureTextEntry ? false : autoCorrect} placeholder={placeholderValue} placeholderTextColor={placeholderTextColor ?? theme.placeholderText} underlineColorAndroid="transparent" style={[
            styles.flex1,
            styles.w100,
            inputStyle,
            (!hasLabel || isMultiline) && styles.pv0,
            inputPaddingLeft,
            inputPaddingRight,
            inputProps.secureTextEntry && styles.secureInput,
            // Explicitly remove `lineHeight` from single line inputs so that long text doesn't disappear
            // once it exceeds the input space on iOS (See https://github.com/Expensify/App/issues/13802)
            shouldApplyHeight && { height, lineHeight: undefined },
            // Stop scrollbar flashing when breaking lines with autoGrowHeight enabled.
            ...(autoGrowHeight && !isAutoGrowHeightMarkdown
                ? [StyleUtils.getAutoGrowHeightInputStyle(textInputHeight, typeof maxAutoGrowHeight === 'number' ? maxAutoGrowHeight : 0), styles.verticalAlignTop]
                : []),
            isAutoGrowHeightMarkdown ? [StyleUtils.getMarkdownMaxHeight(maxAutoGrowHeight), styles.verticalAlignTop] : undefined,
            // Add disabled color theme when field is not editable.
            inputProps.disabled && styles.textInputDisabled,
            styles.pointerEventsAuto,
        ]} multiline={isMultiline} maxLength={maxLength} onFocus={onFocus} onBlur={onBlur} onChangeText={setValue} secureTextEntry={passwordHidden} onPressOut={inputProps.onPress} showSoftInputOnFocus={!disableKeyboard} keyboardType={inputProps.keyboardType} inputMode={!disableKeyboard ? inputProps.inputMode : CONST_1.default.INPUT_MODE.NONE} value={uncontrolled ? undefined : value} readOnly={isReadOnly} defaultValue={defaultValue} markdownStyle={markdownStyle}/>
                            {!!suffixCharacter && (<react_native_1.View style={[styles.textInputSuffixWrapper, suffixContainerStyle]}>
                                    <Text_1.default tabIndex={-1} style={[styles.textInputSuffix, !hasLabel && styles.pv0, styles.pointerEventsNone, suffixStyle]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                                        {suffixCharacter}
                                    </Text_1.default>
                                </react_native_1.View>)}
                            {((isFocused && !isReadOnly && shouldShowClearButton) || !shouldHideClearButton) && !!value && !inputProps.isLoading && (<TextInputClearButton_1.default onPressButton={() => {
                setValue('');
                onClearInput?.();
            }} style={[StyleUtils.getTextInputIconContainerStyles(hasLabel, false, verticalPaddingDiff)]}/>)}
                            {inputProps.isLoading !== undefined && !shouldShowClearButton && (<react_native_1.ActivityIndicator size="small" color={theme.iconSuccessFill} style={[
                StyleUtils.getTextInputIconContainerStyles(hasLabel, false, verticalPaddingDiff),
                styles.ml1,
                loadingSpinnerStyle,
                StyleUtils.getOpacityStyle(inputProps.isLoading ? 1 : 0),
            ]}/>)}
                            {!!inputProps.secureTextEntry && (<Checkbox_1.default style={StyleUtils.getTextInputIconContainerStyles(hasLabel, true, verticalPaddingDiff)} onPress={togglePasswordVisibility} onMouseDown={(event) => {
                event.preventDefault();
            }} accessibilityLabel={translate('common.visible')}>
                                    <Icon_1.default src={passwordHidden ? Expensicons.Eye : Expensicons.EyeDisabled} fill={theme.icon}/>
                                </Checkbox_1.default>)}
                            {!inputProps.secureTextEntry && !!icon && (<react_native_1.View style={[
                StyleUtils.getTextInputIconContainerStyles(hasLabel, true, verticalPaddingDiff),
                !isReadOnly ? styles.cursorPointer : styles.pointerEventsNone,
                iconContainerStyle,
            ]}>
                                    <Icon_1.default src={icon} fill={theme.icon}/>
                                </react_native_1.View>)}
                        </react_native_1.View>
                    </react_native_1.View>
                </PressableWithoutFeedback_1.default>
                {!!inputHelpText && (<FormHelpMessage_1.default isError={!!errorText} message={inputHelpText}/>)}
            </react_native_1.View>
            <TextInputMeasurement_1.default value={value} placeholder={placeholder} contentWidth={contentWidth} autoGrowHeight={autoGrowHeight} maxAutoGrowHeight={maxAutoGrowHeight} width={width} inputStyle={inputStyle} inputPaddingLeft={inputPaddingLeft} autoGrow={autoGrow} isAutoGrowHeightMarkdown={isAutoGrowHeightMarkdown} onSetTextInputWidth={setTextInputWidth} onSetTextInputHeight={setTextInputHeight} isPrefixCharacterPaddingCalculated={isPrefixCharacterPaddingCalculated}/>
        </>);
}
BaseTextInput.displayName = 'BaseTextInput';
exports.default = BaseTextInput;
