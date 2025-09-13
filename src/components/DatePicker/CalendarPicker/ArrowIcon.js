"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function ArrowIcon({ disabled = false, direction = CONST_1.default.DIRECTION.RIGHT }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    return (<react_native_1.View style={[styles.p1, StyleUtils.getDirectionStyle(direction), disabled ? styles.buttonOpacityDisabled : {}]}>
            <Icon_1.default fill={theme.icon} src={Expensicons.ArrowRight}/>
        </react_native_1.View>);
}
ArrowIcon.displayName = 'ArrowIcon';
exports.default = ArrowIcon;
