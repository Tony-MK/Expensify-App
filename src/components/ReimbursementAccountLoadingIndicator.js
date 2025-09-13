"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FullPageOfflineBlockingView_1 = require("./BlockingViews/FullPageOfflineBlockingView");
const HeaderWithBackButton_1 = require("./HeaderWithBackButton");
const Lottie_1 = require("./Lottie");
const LottieAnimations_1 = require("./LottieAnimations");
const ScreenWrapper_1 = require("./ScreenWrapper");
const Text_1 = require("./Text");
function ReimbursementAccountLoadingIndicator({ onBackButtonPress }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<ScreenWrapper_1.default shouldShowOfflineIndicator={false} style={[react_native_1.StyleSheet.absoluteFillObject, styles.reimbursementAccountFullScreenLoading]} testID={ReimbursementAccountLoadingIndicator.displayName}>
            <HeaderWithBackButton_1.default title={translate('reimbursementAccountLoadingAnimation.oneMoment')} onBackButtonPress={onBackButtonPress}/>
            <FullPageOfflineBlockingView_1.default>
                <react_native_1.View style={styles.pageWrapper}>
                    <Lottie_1.default source={LottieAnimations_1.default.ReviewingBankInfo} autoPlay loop style={styles.loadingVBAAnimation} webStyle={styles.loadingVBAAnimationWeb}/>
                    <react_native_1.View style={styles.ph6}>
                        <Text_1.default style={styles.textAlignCenter}>{translate('reimbursementAccountLoadingAnimation.explanationLine')}</Text_1.default>
                    </react_native_1.View>
                </react_native_1.View>
            </FullPageOfflineBlockingView_1.default>
        </ScreenWrapper_1.default>);
}
ReimbursementAccountLoadingIndicator.displayName = 'ReimbursementAccountLoadingIndicator';
exports.default = ReimbursementAccountLoadingIndicator;
