"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CONFIG_1 = require("./CONFIG");
var CONST_1 = require("./CONST");
var useOnyx_1 = require("./hooks/useOnyx");
var HybridApp_1 = require("./libs/actions/HybridApp");
var Session_1 = require("./libs/actions/Session");
var Log_1 = require("./libs/Log");
var ONYXKEYS_1 = require("./ONYXKEYS");
var SplashScreenStateContext_1 = require("./SplashScreenStateContext");
var isLoadingOnyxValue_1 = require("./types/utils/isLoadingOnyxValue");
function HybridAppHandler() {
    var _a = (0, react_1.useContext)(SplashScreenStateContext_1.default), splashScreenState = _a.splashScreenState, setSplashScreenState = _a.setSplashScreenState;
    var _b = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: true }), tryNewDot = _b[0], tryNewDotMetadata = _b[1];
    var isLoadingTryNewDot = (0, isLoadingOnyxValue_1.default)(tryNewDotMetadata);
    var finalizeTransitionFromOldDot = (0, react_1.useCallback)(function (hybridAppSettings) {
        var loggedOutFromOldDot = !!hybridAppSettings.hybridApp.loggedOutFromOldDot;
        (0, Session_1.setupNewDotAfterTransitionFromOldDot)(hybridAppSettings, tryNewDot).then(function () {
            if (splashScreenState !== CONST_1.default.BOOT_SPLASH_STATE.VISIBLE) {
                return;
            }
            setSplashScreenState(loggedOutFromOldDot ? CONST_1.default.BOOT_SPLASH_STATE.HIDDEN : CONST_1.default.BOOT_SPLASH_STATE.READY_TO_BE_HIDDEN);
        });
    }, [setSplashScreenState, splashScreenState, tryNewDot]);
    (0, react_1.useEffect)(function () {
        if (!CONFIG_1.default.IS_HYBRID_APP || isLoadingTryNewDot) {
            return;
        }
        (0, HybridApp_1.getHybridAppSettings)().then(function (hybridAppSettings) {
            if (!hybridAppSettings) {
                // Native method can send non-null value only once per NewDot lifecycle. It prevents issues with multiple initializations during reloads on debug builds.
                Log_1.default.info('[HybridApp] `getHybridAppSettings` called more than once during single NewDot lifecycle. Skipping initialization.');
                return;
            }
            finalizeTransitionFromOldDot(hybridAppSettings);
        });
    }, [finalizeTransitionFromOldDot, isLoadingTryNewDot]);
    return null;
}
HybridAppHandler.displayName = 'HybridAppHandler';
exports.default = HybridAppHandler;
