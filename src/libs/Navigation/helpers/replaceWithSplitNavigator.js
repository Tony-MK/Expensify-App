"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const CONST_1 = require("@src/CONST");
function replaceWithSplitNavigator(splitNavigatorState) {
    navigationRef_1.default.current?.dispatch({
        target: navigationRef_1.default.current.getRootState().key,
        payload: splitNavigatorState,
        type: CONST_1.default.NAVIGATION.ACTION_TYPE.REPLACE,
    });
}
exports.default = replaceWithSplitNavigator;
