"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Header_1 = require("@components/Header");
const HeaderGap_1 = require("@components/HeaderGap");
const Lottie_1 = require("@components/Lottie");
const LottieAnimations_1 = require("@components/LottieAnimations");
const Text_1 = require("@components/Text");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const AppUpdate_1 = require("@userActions/AppUpdate");
const CONFIG_1 = require("@src/CONFIG");
function UpdateRequiredView() {
    const insets = (0, useSafeAreaInsets_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { isProduction } = (0, useEnvironment_1.default)();
    const isStandaloneNewAppProduction = isProduction && !CONFIG_1.default.IS_HYBRID_APP;
    return (<react_native_1.View style={[styles.appBG, styles.h100, StyleUtils.getPlatformSafeAreaPadding(insets)]}>
            <HeaderGap_1.default />
            <react_native_1.View style={[styles.pt5, styles.ph5, styles.updateRequiredViewHeader]}>
                <Header_1.default title={translate('updateRequiredView.updateRequired')}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.flex1, StyleUtils.getUpdateRequiredViewStyles(shouldUseNarrowLayout)]}>
                <Lottie_1.default source={LottieAnimations_1.default.Update} 
    // For small screens it looks better to have the arms from the animation come in from the edges of the screen.
    style={shouldUseNarrowLayout ? styles.w100 : styles.updateAnimation} webStyle={shouldUseNarrowLayout ? styles.w100 : styles.updateAnimation} autoPlay loop/>
                <react_native_1.View style={[styles.ph5, styles.alignItemsCenter, styles.mt5]}>
                    <react_native_1.View style={styles.updateRequiredViewTextContainer}>
                        <react_native_1.View style={[styles.mb3]}>
                            <Text_1.default style={[styles.newKansasLarge, styles.textAlignCenter]}>
                                {isStandaloneNewAppProduction ? translate('updateRequiredView.pleaseInstallExpensifyClassic') : translate('updateRequiredView.pleaseInstall')}
                            </Text_1.default>
                        </react_native_1.View>
                        <react_native_1.View style={styles.mb5}>
                            <Text_1.default style={[styles.textAlignCenter, styles.textSupporting]}>
                                {isStandaloneNewAppProduction ? translate('updateRequiredView.newAppNotAvailable') : translate('updateRequiredView.toGetLatestChanges')}
                            </Text_1.default>
                        </react_native_1.View>
                    </react_native_1.View>
                </react_native_1.View>
                <Button_1.default success large onPress={() => (0, AppUpdate_1.updateApp)(isProduction)} text={translate('common.update')} style={styles.updateRequiredViewTextContainer}/>
            </react_native_1.View>
        </react_native_1.View>);
}
UpdateRequiredView.displayName = 'UpdateRequiredView';
exports.default = UpdateRequiredView;
