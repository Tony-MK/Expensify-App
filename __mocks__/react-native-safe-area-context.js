"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSafeAreaInsets = exports.useSafeAreaFrame = exports.SafeAreaView = exports.SafeAreaInsetsContext = exports.SafeAreaConsumer = exports.SafeAreaProvider = void 0;
exports.withSafeAreaInsets = withSafeAreaInsets;
const react_1 = require("react");
const react_native_1 = require("react-native");
const insets = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};
function withSafeAreaInsets(WrappedComponent) {
    function WithSafeAreaInsets(props) {
        return (<WrappedComponent 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} 
        // eslint-disable-next-line react/prop-types
        ref={props.forwardedRef} insets={insets}/>);
    }
    const WithSafeAreaInsetsWithRef = (0, react_1.forwardRef)((props, ref) => (<WithSafeAreaInsets 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} forwardedRef={ref}/>));
    return WithSafeAreaInsetsWithRef;
}
const SafeAreaView = react_native_1.View;
exports.SafeAreaView = SafeAreaView;
const SafeAreaProvider = (props) => props.children;
exports.SafeAreaProvider = SafeAreaProvider;
const SafeAreaConsumer = (props) => props.children?.(insets);
exports.SafeAreaConsumer = SafeAreaConsumer;
const SafeAreaInsetsContext = {
    Consumer: SafeAreaConsumer,
};
exports.SafeAreaInsetsContext = SafeAreaInsetsContext;
const useSafeAreaFrame = jest.fn(() => ({
    x: 0,
    y: 0,
    width: 390,
    height: 844,
}));
exports.useSafeAreaFrame = useSafeAreaFrame;
const useSafeAreaInsets = jest.fn(() => insets);
exports.useSafeAreaInsets = useSafeAreaInsets;
