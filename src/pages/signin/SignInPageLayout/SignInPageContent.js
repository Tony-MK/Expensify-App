"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ExpensifyWordmark_1 = require("@components/ExpensifyWordmark");
const FormElement_1 = require("@components/FormElement");
const OfflineIndicator_1 = require("@components/OfflineIndicator");
const Text_1 = require("@components/Text");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const SignInHeroImage_1 = require("./SignInHeroImage");
function SignInPageContent({ shouldShowWelcomeHeader, welcomeHeader, welcomeText, shouldShowWelcomeText, children }) {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    return (<react_native_1.View style={[styles.flex1, styles.signInPageLeftContainer]}>
            <react_native_1.View style={[styles.flex1, styles.alignSelfCenter, styles.signInPageWelcomeFormContainer]}>
                {/* This empty view creates margin on the top of the sign in form which will shrink and grow depending on if the keyboard is open or not */}
                <react_native_1.View style={[styles.flexGrow1, shouldUseNarrowLayout ? styles.signInPageContentTopSpacerSmallScreens : styles.signInPageContentTopSpacer]}/>
                <react_native_1.View style={[styles.flexGrow2, styles.mb8]}>
                    <FormElement_1.default style={[styles.alignSelfStretch]}>
                        <react_native_1.View style={[shouldUseNarrowLayout ? styles.mb8 : styles.mb15, shouldUseNarrowLayout ? styles.alignItemsCenter : styles.alignSelfStart]}>
                            <ExpensifyWordmark_1.default />
                        </react_native_1.View>
                        <react_native_1.View style={[styles.signInPageWelcomeTextContainer]}>
                            {shouldShowWelcomeHeader && welcomeHeader ? (<Text_1.default style={[
                styles.loginHeroHeader,
                StyleUtils.getLineHeightStyle(variables_1.default.lineHeightSignInHeroXSmall),
                StyleUtils.getFontSizeStyle(variables_1.default.fontSizeSignInHeroXSmall),
                !welcomeText ? styles.mb5 : {},
                !shouldUseNarrowLayout ? styles.textAlignLeft : {},
                styles.mb5,
            ]}>
                                    {welcomeHeader}
                                </Text_1.default>) : null}
                            {shouldShowWelcomeText && welcomeText ? (<Text_1.default style={[styles.loginHeroBody, styles.mb5, styles.textNormal, !shouldUseNarrowLayout ? styles.textAlignLeft : {}]}>{welcomeText}</Text_1.default>) : null}
                        </react_native_1.View>
                        {children}
                    </FormElement_1.default>
                    <react_native_1.View style={[styles.mb8, styles.signInPageWelcomeTextContainer, styles.alignSelfCenter]}>
                        <OfflineIndicator_1.default style={[styles.m0, styles.pl0, styles.alignItemsStart]}/>
                    </react_native_1.View>
                    {shouldUseNarrowLayout ? (<react_native_1.View style={[styles.mt8]}>
                            <SignInHeroImage_1.default />
                        </react_native_1.View>) : null}
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
SignInPageContent.displayName = 'SignInPageContent';
exports.default = SignInPageContent;
