"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Session_1 = require("@libs/actions/Session");
var BackgroundMobile = (0, react_1.lazy)(function () {
    return Promise.resolve().then(function () { return require('@assets/images/home-background--mobile.svg'); }).catch(function () { return ({
        default: function () { return null; },
    }); });
});
var BackgroundDesktop = (0, react_1.lazy)(function () {
    return Promise.resolve().then(function () { return require('@assets/images/home-background--desktop.svg'); }).catch(function () { return ({
        default: function () { return null; },
    }); });
});
function BackgroundImage(_a) {
    var width = _a.width, transitionDuration = _a.transitionDuration, _b = _a.isSmallScreen, isSmallScreen = _b === void 0 ? false : _b;
    var styles = (0, useThemeStyles_1.default)();
    var _c = (0, react_1.useState)(false), isInteractionComplete = _c[0], setIsInteractionComplete = _c[1];
    var isAnonymous = (0, Session_1.isAnonymousUser)();
    var BackgroundComponent = (0, react_1.useMemo)(function () {
        if (isSmallScreen) {
            return BackgroundMobile;
        }
        return BackgroundDesktop;
    }, [isSmallScreen]);
    (0, react_1.useEffect)(function () {
        if (!isAnonymous) {
            return;
        }
        var interactionTask = react_native_1.InteractionManager.runAfterInteractions(function () {
            setIsInteractionComplete(true);
        });
        return function () {
            interactionTask.cancel();
        };
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    if (!isInteractionComplete && isAnonymous) {
        return;
    }
    return (<react_1.Suspense fallback={null}>
            <react_native_reanimated_1.default.View style={styles.signInBackground} entering={react_native_reanimated_1.FadeIn.duration(transitionDuration)}>
                <BackgroundComponent width={width}/>
            </react_native_reanimated_1.default.View>
        </react_1.Suspense>);
}
BackgroundImage.displayName = 'BackgroundImage';
exports.default = BackgroundImage;
