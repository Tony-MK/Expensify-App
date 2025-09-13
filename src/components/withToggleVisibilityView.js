"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = withToggleVisibilityView;
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getComponentDisplayName_1 = require("@libs/getComponentDisplayName");
function withToggleVisibilityView(WrappedComponent) {
    function WithToggleVisibilityView({ isVisible = false, ...rest }, ref) {
        const styles = (0, useThemeStyles_1.default)();
        return (<react_native_1.View style={!isVisible && styles.visuallyHidden} collapsable={false}>
                <WrappedComponent 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest} ref={ref} isVisible={isVisible}/>
            </react_native_1.View>);
    }
    WithToggleVisibilityView.displayName = `WithToggleVisibilityViewWithRef(${(0, getComponentDisplayName_1.default)(WrappedComponent)})`;
    return react_1.default.forwardRef(WithToggleVisibilityView);
}
