"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ScrollView_1 = require("./ScrollView");
function FormScrollView({ children, ...rest }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    return (<ScrollView_1.default style={[styles.w100, styles.flex1]} ref={ref} contentContainerStyle={styles.flexGrow1} keyboardShouldPersistTaps="handled" 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}>
            {children}
        </ScrollView_1.default>);
}
FormScrollView.displayName = 'FormScrollView';
exports.default = react_1.default.forwardRef(FormScrollView);
