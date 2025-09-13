"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const getComponentDisplayName_1 = require("@libs/getComponentDisplayName");
function default_1(WrappedComponent) {
    function WithNavigationTransitionEnd(props, ref) {
        const [didScreenTransitionEnd, setDidScreenTransitionEnd] = (0, react_1.useState)(false);
        const navigation = (0, native_1.useNavigation)();
        (0, react_1.useEffect)(() => {
            const unsubscribeTransitionEnd = navigation.addListener('transitionEnd', () => {
                setDidScreenTransitionEnd(true);
            });
            return unsubscribeTransitionEnd;
            // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
        }, []);
        return (<WrappedComponent 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} didScreenTransitionEnd={didScreenTransitionEnd} ref={ref}/>);
    }
    WithNavigationTransitionEnd.displayName = `WithNavigationTransitionEnd(${(0, getComponentDisplayName_1.default)(WrappedComponent)})`;
    return react_1.default.forwardRef(WithNavigationTransitionEnd);
}
