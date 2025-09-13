"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
function CaretWrapper({ children, style }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.flexRow, styles.gap1, styles.alignItemsCenter, style]}>
            {children}
            <Icon_1.default src={Expensicons.DownArrow} fill={theme.icon} width={variables_1.default.iconSizeExtraSmall} height={variables_1.default.iconSizeExtraSmall}/>
        </react_native_1.View>);
}
exports.default = CaretWrapper;
