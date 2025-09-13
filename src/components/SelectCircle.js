"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
function SelectCircle({ isChecked = false, selectCircleStyles }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.selectCircle, styles.alignSelfCenter, selectCircleStyles]}>
            {isChecked && (<Icon_1.default src={Expensicons.Checkmark} fill={theme.iconSuccessFill}/>)}
        </react_native_1.View>);
}
SelectCircle.displayName = 'SelectCircle';
exports.default = SelectCircle;
