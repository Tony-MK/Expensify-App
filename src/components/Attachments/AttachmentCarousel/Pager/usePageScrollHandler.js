"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_reanimated_1 = require("react-native-reanimated");
/**
 * This hook is used to create a wrapped handler for the onPageScroll event from react-native-pager-view.
 * The produced handler can react to the onPageScroll event and allows to use it with animated shared values (from REA)
 * This hook is a wrapper around the useHandler and useEvent hooks from react-native-reanimated.
 * @param onPageScroll The handler for the onPageScroll event from react-native-pager-view
 * @param dependencies The dependencies for the useHandler hook
 * @returns A wrapped/animated handler for the onPageScroll event from react-native-pager-view
 */
const usePageScrollHandler = (onPageScroll, dependencies) => {
    const { context, doDependenciesDiffer } = (0, react_native_reanimated_1.useHandler)({ onPageScroll }, dependencies);
    const subscribeForEvents = ['onPageScroll'];
    return (0, react_native_reanimated_1.useEvent)((event) => {
        'worklet';
        if (onPageScroll && event.eventName.endsWith('onPageScroll')) {
            onPageScroll(event, context);
        }
    }, subscribeForEvents, doDependenciesDiffer);
};
exports.default = usePageScrollHandler;
