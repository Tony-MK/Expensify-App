"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
// beforeRemove have some limitations. When the react-navigation is upgraded to 7.x, update this to use usePreventRemove hook.
const useBeforeRemove = (onBeforeRemove) => {
    const navigation = (0, native_1.useNavigation)();
    (0, react_1.useEffect)(() => {
        const unsubscribe = navigation.addListener('beforeRemove', onBeforeRemove);
        return unsubscribe;
    }, [navigation, onBeforeRemove]);
};
exports.default = useBeforeRemove;
