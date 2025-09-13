"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const usePreserveNavigatorState_1 = require("@navigation/AppNavigator/createSplitNavigator/usePreserveNavigatorState");
function SearchFullscreenRouter(options) {
    const stackRouter = (0, native_1.StackRouter)(options);
    return {
        ...stackRouter,
        getInitialState({ routeNames, routeParamList, routeGetIdList }) {
            const preservedState = (0, usePreserveNavigatorState_1.getPreservedNavigatorState)(options.parentRoute.key);
            return preservedState ?? stackRouter.getInitialState({ routeNames, routeParamList, routeGetIdList });
        },
    };
}
exports.default = SearchFullscreenRouter;
