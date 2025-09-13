"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
/**
 * This hook resets the navigation root state when changing the layout size, resetting the state calls the getRehydratedState method in CustomFullScreenRouter.tsx.
 * It is also called when the navigator is created to set the initial state correctly.
 * When the screen size is changed, it is necessary to check whether the application displays the content correctly.
 * When the app is opened on a small layout and the user resizes it to wide, a second screen has to be present in the navigation state to fill the space.
 */
function useNavigationResetOnLayoutChange({ navigation }) {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    (0, react_1.useEffect)(() => {
        if (!navigationRef_1.default.isReady()) {
            return;
        }
        navigation.reset(navigation.getState());
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [shouldUseNarrowLayout]);
}
exports.default = useNavigationResetOnLayoutChange;
