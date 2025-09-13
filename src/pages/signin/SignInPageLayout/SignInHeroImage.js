"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Lottie_1 = require("@components/Lottie");
const LottieAnimations_1 = require("@components/LottieAnimations");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Session_1 = require("@libs/actions/Session");
const variables_1 = require("@styles/variables");
function SignInHeroImage() {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout, isMediumScreenWidth } = (0, useResponsiveLayout_1.default)();
    const imageSize = (0, react_1.useMemo)(() => {
        if (shouldUseNarrowLayout) {
            return {
                height: variables_1.default.signInHeroImageMobileHeight,
                width: variables_1.default.signInHeroImageMobileWidth,
            };
        }
        return {
            height: isMediumScreenWidth ? variables_1.default.signInHeroImageTabletHeight : variables_1.default.signInHeroImageDesktopHeight,
            width: isMediumScreenWidth ? variables_1.default.signInHeroImageTabletWidth : variables_1.default.signInHeroImageDesktopWidth,
        };
    }, [shouldUseNarrowLayout, isMediumScreenWidth]);
    return (<Lottie_1.default source={LottieAnimations_1.default.Hands} loop autoPlay shouldLoadAfterInteractions={(0, Session_1.isAnonymousUser)()} style={[styles.alignSelfCenter, imageSize]} webStyle={{ ...styles.alignSelfCenter, ...imageSize }}/>);
}
SignInHeroImage.displayName = 'SignInHeroImage';
exports.default = SignInHeroImage;
