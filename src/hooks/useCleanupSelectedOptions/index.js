"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const useCleanupSelectedOptions = (cleanupFunction) => {
    const navigationContainerRef = (0, react_1.useContext)(native_1.NavigationContainerRefContext);
    const state = navigationContainerRef?.getState();
    const lastRoute = state?.routes.at(-1);
    const isRightModalOpening = lastRoute?.name === NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR;
    const isFocused = (0, native_1.useIsFocused)();
    (0, react_1.useEffect)(() => {
        if (isFocused || isRightModalOpening) {
            return;
        }
        cleanupFunction?.();
    }, [isFocused, cleanupFunction, isRightModalOpening]);
};
exports.default = useCleanupSelectedOptions;
