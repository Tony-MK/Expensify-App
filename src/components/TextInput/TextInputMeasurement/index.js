"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
function TextInputMeasurement({ value, placeholder, contentWidth, autoGrowHeight, maxAutoGrowHeight, width, inputStyle, inputPaddingLeft, autoGrow, isAutoGrowHeightMarkdown, onSetTextInputWidth, onSetTextInputHeight, isPrefixCharacterPaddingCalculated, }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<>
            {!!contentWidth && isPrefixCharacterPaddingCalculated && (<react_native_1.View style={[inputStyle, styles.hiddenElementOutsideOfWindow, styles.visibilityHidden, styles.wAuto, inputPaddingLeft]} onLayout={(e) => {
                if (e.nativeEvent.layout.width === 0 && e.nativeEvent.layout.height === 0) {
                    return;
                }
                onSetTextInputWidth(e.nativeEvent.layout.width);
                onSetTextInputHeight(e.nativeEvent.layout.height);
            }}>
                    <Text_1.default style={[
                inputStyle,
                autoGrowHeight && styles.autoGrowHeightHiddenInput(width ?? 0, typeof maxAutoGrowHeight === 'number' ? maxAutoGrowHeight : undefined),
                { width: contentWidth },
            ]}>
                        {/* \u200B added to solve the issue of not expanding the text input enough when the value ends with '\n' (https://github.com/Expensify/App/issues/21271) */}
                        {value ? `${value}${value.endsWith('\n') ? '\u200B' : ''}` : placeholder}
                    </Text_1.default>
                </react_native_1.View>)}
            {/*
             Text input component doesn't support auto grow by default.
             We're using a hidden text input to achieve that.
             This text view is used to calculate width or height of the input value given textStyle in this component.
             This Text component is intentionally positioned out of the screen.
         */}
            {(!!autoGrow || !!autoGrowHeight) && !isAutoGrowHeightMarkdown && (
        // Add +2 to width on Safari browsers so that text is not cut off due to the cursor or when changing the value
        // Reference: https://github.com/Expensify/App/issues/8158, https://github.com/Expensify/App/issues/26628
        // For mobile Chrome, ensure proper display of the text selection handle (blue bubble down).
        // Reference: https://github.com/Expensify/App/issues/34921
        <Text_1.default style={[
                inputStyle,
                autoGrowHeight && styles.autoGrowHeightHiddenInput(width ?? 0, typeof maxAutoGrowHeight === 'number' ? maxAutoGrowHeight : undefined),
                styles.hiddenElementOutsideOfWindow,
                styles.visibilityHidden,
            ]} onLayout={(e) => {
                if (e.nativeEvent.layout.width === 0 && e.nativeEvent.layout.height === 0) {
                    return;
                }
                let additionalWidth = 0;
                if ((0, Browser_1.isMobileSafari)() || (0, Browser_1.isSafari)() || (0, Browser_1.isMobileChrome)()) {
                    additionalWidth = 2;
                }
                onSetTextInputWidth(e.nativeEvent.layout.width + additionalWidth);
                onSetTextInputHeight(e.nativeEvent.layout.height);
            }}>
                    {/* \u200B added to solve the issue of not expanding the text input enough when the value ends with '\n' (https://github.com/Expensify/App/issues/21271) */}
                    {value ? `${value}${value.endsWith('\n') ? '\u200B' : ''}` : placeholder}
                </Text_1.default>)}
        </>);
}
TextInputMeasurement.displayName = 'TextInputMeasurement';
exports.default = TextInputMeasurement;
