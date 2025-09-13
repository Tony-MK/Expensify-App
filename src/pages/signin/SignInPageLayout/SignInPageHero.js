"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const variables_1 = require("@styles/variables");
const SignInHeroCopy_1 = require("./SignInHeroCopy");
const SignInHeroImage_1 = require("./SignInHeroImage");
function SignInPageHero({ customHeadline, customHeroBody }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { windowWidth, windowHeight } = (0, useWindowDimensions_1.default)();
    return (<react_native_1.View style={[
            StyleUtils.getHeight(windowHeight < variables_1.default.signInContentMinHeight ? variables_1.default.signInContentMinHeight : windowHeight),
            StyleUtils.getMinimumHeight(variables_1.default.signInContentMinHeight),
            windowWidth <= variables_1.default.tabletResponsiveWidthBreakpoint ? styles.flexColumn : styles.flexColumn,
            styles.pt20,
            StyleUtils.getMaximumWidth(variables_1.default.signInHeroContextMaxWidth),
            styles.alignSelfCenter,
        ]}>
            <react_native_1.View style={[styles.flex1, styles.alignSelfCenter, styles.gap7]}>
                <SignInHeroImage_1.default />
                <SignInHeroCopy_1.default customHeadline={customHeadline} customHeroBody={customHeroBody}/>
            </react_native_1.View>
        </react_native_1.View>);
}
SignInPageHero.displayName = 'SignInPageHero';
exports.default = SignInPageHero;
