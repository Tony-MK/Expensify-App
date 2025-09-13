"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getButtonState_1 = require("@libs/getButtonState");
function Day({ disabled, selected, pressed, hovered, children }) {
    const themeStyles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    return (<react_native_1.View style={[
            themeStyles.calendarDayContainer,
            selected ? themeStyles.buttonDefaultBG : {},
            !disabled ? StyleUtils.getButtonBackgroundColorStyle((0, getButtonState_1.default)(hovered, pressed)) : {},
        ]}>
            <Text_1.default style={disabled ? themeStyles.buttonOpacityDisabled : {}}>{children}</Text_1.default>
        </react_native_1.View>);
}
Day.displayName = 'Day';
exports.default = Day;
