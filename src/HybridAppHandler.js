"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CONFIG_1 = require("./CONFIG");
const CONST_1 = require("./CONST");
const useOnyx_1 = require("./hooks/useOnyx");
const HybridApp_1 = require("./libs/actions/HybridApp");
const Session_1 = require("./libs/actions/Session");
const Log_1 = require("./libs/Log");
const ONYXKEYS_1 = require("./ONYXKEYS");
const SplashScreenStateContext_1 = require("./SplashScreenStateContext");
const isLoadingOnyxValue_1 = require("./types/utils/isLoadingOnyxValue");
function HybridAppHandler() {
    const { splashScreenState, setSplashScreenState } = (0, react_1.useContext)(SplashScreenStateContext_1.default);
    const [tryNewDot, tryNewDotMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: true });
    const isLoadingTryNewDot = (0, isLoadingOnyxValue_1.default)(tryNewDotMetadata);
    const finalizeTransitionFromOldDot = (0, react_1.useCallback)((hybridAppSettings) => {
        const loggedOutFromOldDot = !!hybridAppSettings.hybridApp.loggedOutFromOldDot;
        (0, Session_1.setupNewDotAfterTransitionFromOldDot)(hybridAppSettings, tryNewDot).then(() => {
            if (splashScreenState !== CONST_1.default.BOOT_SPLASH_STATE.VISIBLE) {
                return;
            }
            setSplashScreenState(loggedOutFromOldDot ? CONST_1.default.BOOT_SPLASH_STATE.HIDDEN : CONST_1.default.BOOT_SPLASH_STATE.READY_TO_BE_HIDDEN);
        });
    }, [setSplashScreenState, splashScreenState, tryNewDot]);
    (0, react_1.useEffect)(() => {
        if (!CONFIG_1.default.IS_HYBRID_APP || isLoadingTryNewDot) {
            return;
        }
        (0, HybridApp_1.getHybridAppSettings)().then((hybridAppSettings) => {
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
