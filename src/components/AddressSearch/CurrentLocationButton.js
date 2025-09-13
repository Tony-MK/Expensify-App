"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getButtonState_1 = require("@libs/getButtonState");
const colors_1 = require("@styles/theme/colors");
function CurrentLocationButton({ onPress, isDisabled = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<PressableWithFeedback_1.default style={[styles.flexRow, styles.pv4, styles.ph3, isDisabled && styles.buttonOpacityDisabled]} hoverStyle={StyleUtils.getButtonBackgroundColorStyle((0, getButtonState_1.default)(true), true)} onPress={() => onPress?.()} accessibilityLabel={translate('location.useCurrent')} disabled={isDisabled} onMouseDown={(e) => e.preventDefault()} onTouchStart={(e) => e.preventDefault()}>
            <Icon_1.default src={Expensicons.Location} fill={colors_1.default.green}/>
            <Text_1.default style={[styles.textLabel, styles.mh2, isDisabled && styles.userSelectNone]}>{translate('location.useCurrent')}</Text_1.default>
        </PressableWithFeedback_1.default>);
}
CurrentLocationButton.displayName = 'CurrentLocationButton';
exports.default = CurrentLocationButton;
