"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react-native-a11y/has-valid-accessibility-descriptors */
const react_1 = require("react");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useThrottledButtonState_1 = require("@hooks/useThrottledButtonState");
const getButtonState_1 = require("@libs/getButtonState");
const variables_1 = require("@styles/variables");
const PressableWithoutFeedback_1 = require("./PressableWithoutFeedback");
function PressableWithDelayToggle({ iconChecked = Expensicons.Checkmark, inline = true, onPress, text, textChecked, tooltipText, tooltipTextChecked, styles: pressableStyle, textStyles, iconStyles, icon, ref, accessibilityRole, shouldHaveActiveBackground, iconWidth = variables_1.default.iconSizeSmall, iconHeight = variables_1.default.iconSizeSmall, shouldUseButtonBackground = false, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [isActive, temporarilyDisableInteractions] = (0, useThrottledButtonState_1.default)();
    const updatePressState = () => {
        if (!isActive) {
            return;
        }
        temporarilyDisableInteractions();
        onPress?.();
    };
    // Due to limitations in RN regarding the vertical text alignment of non-Text elements,
    // for elements that are supposed to be inline, we need to use a Text element instead
    // of a Pressable
    const PressableView = inline ? Text_1.default : PressableWithoutFeedback_1.default;
    const tooltipTexts = !isActive ? tooltipTextChecked : tooltipText;
    const labelText = 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Disabling this line for safeness as nullish coalescing works only if the value is undefined or null
    text || textChecked ? (<Text_1.default suppressHighlighting style={textStyles}>
                {!isActive && textChecked ? textChecked : text}
                &nbsp;
            </Text_1.default>) : null;
    return (<PressableView 
    // Using `ref as any` due to variable component (Text or View) based on 'inline' prop; TypeScript workaround.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    ref={ref} onPress={updatePressState} accessibilityLabel={tooltipTexts} suppressHighlighting={inline ? true : undefined} accessibilityRole={accessibilityRole}>
            <>
                {inline && labelText}
                <Tooltip_1.default text={tooltipTexts} shouldRender>
                    <PressableWithoutFeedback_1.default tabIndex={-1} accessible={false} onPress={updatePressState} style={({ hovered, pressed }) => [
            styles.flexRow,
            pressableStyle,
            !isActive && styles.cursorDefault,
            shouldUseButtonBackground &&
                StyleUtils.getButtonBackgroundColorStyle((0, getButtonState_1.default)(!!shouldHaveActiveBackground || hovered, shouldHaveActiveBackground ? hovered : pressed, !shouldHaveActiveBackground && !isActive), true),
        ]}>
                        {({ hovered, pressed }) => (<>
                                {!inline && labelText}
                                {!!icon && (<Icon_1.default src={!isActive ? iconChecked : icon} fill={StyleUtils.getIconFillColor((0, getButtonState_1.default)(hovered, pressed, !isActive))} additionalStyles={iconStyles} width={iconWidth} height={iconHeight} inline={inline}/>)}
                            </>)}
                    </PressableWithoutFeedback_1.default>
                </Tooltip_1.default>
            </>
        </PressableView>);
}
PressableWithDelayToggle.displayName = 'PressableWithDelayToggle';
exports.default = PressableWithDelayToggle;
