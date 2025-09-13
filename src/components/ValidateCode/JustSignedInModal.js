"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Lottie_1 = require("@components/Lottie");
const LottieAnimations_1 = require("@components/LottieAnimations");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
function JustSignedInModal({ is2FARequired }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={styles.deeplinkWrapperContainer}>
            <react_native_1.View style={styles.deeplinkWrapperMessage}>
                <react_native_1.View style={styles.mb2}>
                    <Lottie_1.default source={is2FARequired ? LottieAnimations_1.default.Safe : LottieAnimations_1.default.Abracadabra} style={styles.justSignedInModalAnimation(is2FARequired)} webStyle={styles.justSignedInModalAnimation(is2FARequired)} autoPlay loop/>
                </react_native_1.View>
                <Text_1.default style={[styles.textHeadline, styles.textXXLarge, styles.textAlignCenter]}>
                    {translate(is2FARequired ? 'validateCodeModal.tfaRequiredTitle' : 'validateCodeModal.successfulSignInTitle')}
                </Text_1.default>
                <react_native_1.View style={[styles.mt2, styles.mb2]}>
                    <Text_1.default style={styles.textAlignCenter}>{translate(is2FARequired ? 'validateCodeModal.tfaRequiredDescription' : 'validateCodeModal.successfulSignInDescription')}</Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={styles.deeplinkWrapperFooter}>
                <Icon_1.default width={variables_1.default.modalWordmarkWidth} height={variables_1.default.modalWordmarkHeight} fill={theme.success} src={Expensicons.ExpensifyWordmark}/>
            </react_native_1.View>
        </react_native_1.View>);
}
JustSignedInModal.displayName = 'JustSignedInModal';
exports.default = JustSignedInModal;
