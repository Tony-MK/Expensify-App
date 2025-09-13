"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const expensify_logo__adhoc_svg_1 = require("@assets/images/expensify-logo--adhoc.svg");
const expensify_logo__dev_svg_1 = require("@assets/images/expensify-logo--dev.svg");
const expensify_logo__prod_svg_1 = require("@assets/images/expensify-logo--prod.svg");
const expensify_logo__staging_svg_1 = require("@assets/images/expensify-logo--staging.svg");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ImageSVG_1 = require("./ImageSVG");
const logoComponents = {
    [CONST_1.default.ENVIRONMENT.DEV]: expensify_logo__dev_svg_1.default,
    [CONST_1.default.ENVIRONMENT.STAGING]: expensify_logo__staging_svg_1.default,
    [CONST_1.default.ENVIRONMENT.PRODUCTION]: expensify_logo__prod_svg_1.default,
    [CONST_1.default.ENVIRONMENT.ADHOC]: expensify_logo__adhoc_svg_1.default,
};
function ExpensifyWordmark({ style }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { environment } = (0, useEnvironment_1.default)();
    // PascalCase is required for React components, so capitalize the const here
    const LogoComponent = logoComponents[environment];
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return (<react_native_1.View style={[
            StyleUtils.getSignInWordmarkWidthStyle(shouldUseNarrowLayout, environment),
            StyleUtils.getHeight(shouldUseNarrowLayout ? variables_1.default.signInLogoHeightSmallScreen : variables_1.default.signInLogoHeight),
            shouldUseNarrowLayout && (environment === CONST_1.default.ENVIRONMENT.DEV || environment === CONST_1.default.ENVIRONMENT.STAGING) ? styles.ml3 : {},
            style,
        ]}>
            <ImageSVG_1.default contentFit="contain" src={LogoComponent}/>
        </react_native_1.View>);
}
ExpensifyWordmark.displayName = 'ExpensifyWordmark';
exports.default = ExpensifyWordmark;
