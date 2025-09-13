"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useHandleBackButton;
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
function useHandleBackButton(callback) {
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        const backHandler = react_native_1.BackHandler.addEventListener('hardwareBackPress', callback);
        return () => backHandler.remove();
    }, [callback]));
}
