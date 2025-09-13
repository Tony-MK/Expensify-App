"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getButtonState_1 = require("@libs/getButtonState");
function AvailableBookingDay({ disabled, selected, pressed, hovered, children }) {
    const themeStyles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    return (<react_native_1.View style={[
            themeStyles.calendarDayContainer,
            !disabled ? [themeStyles.buttonDefaultBG, StyleUtils.getButtonBackgroundColorStyle((0, getButtonState_1.default)(hovered, pressed))] : {},
            selected ? themeStyles.buttonSuccess : {},
        ]}>
            <Text_1.default>{children}</Text_1.default>
        </react_native_1.View>);
}
AvailableBookingDay.displayName = 'AvailableBookingDay';
exports.default = AvailableBookingDay;
