"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const Button_1 = require("./Button");
const Lottie_1 = require("./Lottie");
const LottieAnimations_1 = require("./LottieAnimations");
const Modal_1 = require("./Modal");
const Text_1 = require("./Text");
function RequireTwoFactorAuthenticationModal({ onCancel = () => { }, description, isVisible, onSubmit, shouldEnableNewFocusManagement }) {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    return (<Modal_1.default onClose={onCancel} isVisible={isVisible} type={shouldUseNarrowLayout ? CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED : CONST_1.default.MODAL.MODAL_TYPE.CONFIRM} innerContainerStyle={{ ...styles.pb5, ...styles.pt0, ...styles.boxShadowNone }} shouldEnableNewFocusManagement={shouldEnableNewFocusManagement}>
            <react_native_1.View>
                <react_native_1.View style={[styles.cardSectionIllustration, styles.alignItemsCenter, StyleUtils.getBackgroundColorStyle(LottieAnimations_1.default.Safe.backgroundColor)]}>
                    <Lottie_1.default source={LottieAnimations_1.default.Safe} style={styles.h100} webStyle={styles.h100} autoPlay loop/>
                </react_native_1.View>
                <react_native_1.View style={[styles.mt5, styles.mh5]}>
                    <react_native_1.View style={[styles.gap2, styles.mb10]}>
                        <Text_1.default style={[styles.textHeadlineH1]}>{translate('twoFactorAuth.pleaseEnableTwoFactorAuth')}</Text_1.default>
                        <Text_1.default style={styles.textSupporting}>{description}</Text_1.default>
                    </react_native_1.View>
                    <Button_1.default large success pressOnEnter onPress={onSubmit} text={translate('twoFactorAuth.enableTwoFactorAuth')}/>
                </react_native_1.View>
            </react_native_1.View>
        </Modal_1.default>);
}
RequireTwoFactorAuthenticationModal.displayName = 'RequireTwoFactorAuthenticationModal';
exports.default = RequireTwoFactorAuthenticationModal;
