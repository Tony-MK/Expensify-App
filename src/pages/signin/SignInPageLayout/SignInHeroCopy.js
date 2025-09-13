"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
function SignInHeroCopy({ customHeadline, customHeroBody }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { isMediumScreenWidth, isLargeScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={[styles.flex1, styles.alignSelfCenter, styles.gap7]}>
            <Text_1.default style={[
            styles.loginHeroHeader,
            isMediumScreenWidth && StyleUtils.getFontSizeStyle(variables_1.default.fontSizeSignInHeroMedium),
            isLargeScreenWidth && StyleUtils.getFontSizeStyle(variables_1.default.fontSizeSignInHeroLarge),
        ]}>
                {customHeadline ?? translate('login.hero.header')}
            </Text_1.default>
            <Text_1.default style={[styles.loginHeroBody]}>{customHeroBody ?? translate('login.hero.body')}</Text_1.default>
        </react_native_1.View>);
}
SignInHeroCopy.displayName = 'SignInHeroCopy';
exports.default = SignInHeroCopy;
