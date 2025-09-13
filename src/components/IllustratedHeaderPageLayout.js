"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const HeaderPageLayout_1 = require("./HeaderPageLayout");
const Lottie_1 = require("./Lottie");
function IllustratedHeaderPageLayout({ backgroundColor, children, illustration, testID, overlayContent, ...rest }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const shouldLimitHeight = !rest.shouldShowBackButton;
    return (<HeaderPageLayout_1.default backgroundColor={backgroundColor ?? theme.appBG} headerContent={<>
                    <Lottie_1.default source={illustration} style={styles.w100} webStyle={shouldLimitHeight ? styles.h100 : styles.w100} autoPlay loop/>
                    {overlayContent?.()}
                </>} testID={testID} headerContainerStyles={[styles.justifyContentCenter, styles.w100, shouldLimitHeight && styles.centralPaneAnimation]} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}>
            {children}
        </HeaderPageLayout_1.default>);
}
IllustratedHeaderPageLayout.displayName = 'IllustratedHeaderPageLayout';
exports.default = IllustratedHeaderPageLayout;
