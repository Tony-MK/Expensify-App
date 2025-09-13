"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useOnyx_1 = require("@hooks/useOnyx");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useSearchBackPress = ({ onClearSelection, onNavigationCallBack }) => {
    const [selectionMode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MOBILE_SELECTION_MODE, { canBeMissing: true });
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        const onBackPress = () => {
            if (selectionMode) {
                onClearSelection();
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
                return true;
            }
            onNavigationCallBack();
            return true;
        };
        const backHandler = react_native_1.BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => backHandler.remove();
    }, [selectionMode, onClearSelection, onNavigationCallBack]));
};
exports.default = useSearchBackPress;
