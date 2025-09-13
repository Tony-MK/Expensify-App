"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defer_1 = require("lodash/defer");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_picker_select_1 = require("react-native-picker-select");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useScrollContext_1 = require("@hooks/useScrollContext");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getOperatingSystem_1 = require("@libs/getOperatingSystem");
const CONST_1 = require("@src/CONST");
function BasePicker({ items, backgroundColor, inputID, value, onInputChange, icon, label = '', isDisabled = false, errorText = '', hintText = '', containerStyles, placeholder = {}, size = 'normal', shouldAllowDisabledStyle = true, shouldFocusPicker = false, shouldShowOnlyTextWhenDisabled = true, onBlur = () => { }, additionalPickerEvents = () => { }, ref, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isHighlighted, setIsHighlighted] = (0, react_1.useState)(false);
    // reference to the root View
    const root = (0, react_1.useRef)(null);
    // reference to @react-native-picker/picker
    const picker = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!!value || !items || items.length !== 1 || !onInputChange) {
            return;
        }
        // When there is only 1 element in the selector, we do the user a favor and automatically select it for them
        // so they don't have to spend extra time selecting the only possible value.
        const item = items.at(0);
        if (item) {
            onInputChange(item.value, 0);
        }
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [items]);
    const context = (0, useScrollContext_1.default)();
    /**
     * Forms use inputID to set values. But BasePicker passes an index as the second parameter to onValueChange
     * We are overriding this behavior to make BasePicker work with Form
     */
    const onValueChange = (inputValue, index) => {
        if (inputID) {
            onInputChange?.(inputValue);
            return;
        }
        onInputChange?.(inputValue, index);
    };
    const enableHighlight = () => {
        setIsHighlighted(true);
    };
    const disableHighlight = () => {
        setIsHighlighted(false);
    };
    const iconToRender = (0, react_1.useMemo)(() => {
        if (icon) {
            return () => icon(size);
        }
        // eslint-disable-next-line react/display-name
        return () => (<Icon_1.default fill={theme.icon} src={Expensicons.DownArrow} 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...(size === 'small' ? { width: styles.pickerSmall().icon.width, height: styles.pickerSmall().icon.height } : {})}/>);
    }, [icon, size, styles, theme.icon]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        /**
         * Focuses the picker (if configured to do so)
         *
         * This method is used by Form
         */
        focus() {
            if (!shouldFocusPicker) {
                return;
            }
            // Defer the focusing to work around a bug on Mobile Safari, where focusing the `select` element in the
            // same task when we scrolled to it left that element in a glitched state, where the dropdown list can't
            // be opened until the element gets re-focused
            (0, defer_1.default)(() => {
                picker.current?.focus();
            });
        },
        /**
         * Like measure(), but measures the view relative to an ancestor
         *
         * This method is used by Form when scrolling to the input
         *
         * @param relativeToNativeComponentRef - reference to an ancestor
         * @param onSuccess - callback called on success
         * @param onFail - callback called on failure
         */
        measureLayout(relativeToNativeComponentRef, onSuccess, onFail) {
            if (!root.current) {
                return;
            }
            root.current.measureLayout(relativeToNativeComponentRef, onSuccess, onFail);
        },
    }));
    /**
     * We pass light text on Android, since Android Native alerts have a dark background in all themes for now.
     */
    const itemColor = (0, react_1.useMemo)(() => {
        if ((0, getOperatingSystem_1.default)() === CONST_1.default.OS.ANDROID) {
            return theme.textLight;
        }
        return theme.text;
    }, [theme]);
    // Windows will reuse the text color of the select for each one of the options
    // so we might need to color accordingly so it doesn't blend with the background.
    const pickerPlaceholder = Object.keys(placeholder).length > 0 ? { ...placeholder, color: itemColor } : {};
    const hasError = !!errorText;
    if (isDisabled && shouldShowOnlyTextWhenDisabled) {
        return (<react_native_1.View>
                {!!label && (<Text_1.default style={[styles.textLabelSupporting, styles.mb1]} numberOfLines={1}>
                        {label}
                    </Text_1.default>)}
                <Text_1.default numberOfLines={1}>{value}</Text_1.default>
                {!!hintText && <Text_1.default style={[styles.textLabel, styles.colorMuted, styles.mt2]}>{hintText}</Text_1.default>}
            </react_native_1.View>);
    }
    return (<>
            <react_native_1.View ref={root} style={[
            styles.pickerContainer,
            isDisabled && shouldAllowDisabledStyle && styles.inputDisabled,
            containerStyles,
            isHighlighted && styles.borderColorFocus,
            hasError && styles.borderColorDanger,
        ]}>
                {!!label && <Text_1.default style={[styles.pickerLabel, styles.textLabelSupporting, styles.pointerEventsNone]}>{label}</Text_1.default>}
                <react_native_picker_select_1.default onValueChange={onValueChange} 
    // We add a text color to prevent white text on white background dropdown items on Windows
    items={items.map((item) => ({ ...item, color: itemColor }))} style={size === 'normal' ? styles.picker(isDisabled, backgroundColor) : styles.pickerSmall(isDisabled, backgroundColor)} useNativeAndroidPickerStyle={false} placeholder={pickerPlaceholder} value={value} Icon={iconToRender} disabled={isDisabled} fixAndroidTouchableBug onOpen={enableHighlight} onClose={disableHighlight} textInputProps={{
            allowFontScaling: false,
        }} pickerProps={{
            ref: picker,
            tabIndex: -1,
            onFocus: enableHighlight,
            onBlur: () => {
                disableHighlight();
                onBlur();
            },
            ...additionalPickerEvents(enableHighlight, (inputValue, index) => {
                onValueChange(inputValue, index);
                disableHighlight();
            }),
        }} scrollViewRef={context?.scrollViewRef} scrollViewContentOffsetY={context?.contentOffsetY}/>
            </react_native_1.View>
            <FormHelpMessage_1.default message={errorText}/>
            {!!hintText && <Text_1.default style={[styles.textLabel, styles.colorMuted, styles.mt2]}>{hintText}</Text_1.default>}
        </>);
}
BasePicker.displayName = 'BasePicker';
exports.default = BasePicker;
