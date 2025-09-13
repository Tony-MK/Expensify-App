"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const RenderHTML_1 = require("@components/RenderHTML");
const SafeAreaConsumer_1 = require("@components/SafeAreaConsumer");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const CONST_1 = require("@src/CONST");
const SubscriptionPlanCard_1 = require("./SubscriptionPlanCard");
function ComparePlansModal({ isModalVisible, setIsModalVisible }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to be consistent with BaseModal component
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [animationOut, setAnimationOut] = (0, react_1.useState)('slideOutRight');
    (0, react_1.useEffect)(() => {
        setAnimationOut('slideOutRight');
    }, [isModalVisible]);
    const closeComparisonModalWithFadeOutAnimation = () => {
        setAnimationOut('fadeOut');
        setIsModalVisible(false);
    };
    const onClose = () => setIsModalVisible(false);
    const renderPlans = () => (<react_native_1.View style={isSmallScreenWidth ? [styles.ph4, styles.pb8] : [styles.ph8, styles.pb8]}>
            <react_native_1.View style={[styles.renderHTML]}>
                <RenderHTML_1.default html={translate('subscription.compareModal.subtitle')}/>
            </react_native_1.View>
            <react_native_1.View style={isSmallScreenWidth ? styles.flexColumn : [styles.flexRow, styles.gap3]}>
                <SubscriptionPlanCard_1.default subscriptionPlan={CONST_1.default.POLICY.TYPE.TEAM} closeComparisonModal={closeComparisonModalWithFadeOutAnimation} isFromComparisonModal/>
                <SubscriptionPlanCard_1.default subscriptionPlan={CONST_1.default.POLICY.TYPE.CORPORATE} closeComparisonModal={closeComparisonModalWithFadeOutAnimation} isFromComparisonModal/>
            </react_native_1.View>
        </react_native_1.View>);
    const maxHeight = isSmallScreenWidth ? undefined : windowHeight - 40;
    return (<SafeAreaConsumer_1.default>
            {({ safeAreaPaddingBottomStyle }) => (<Modal_1.default isVisible={isModalVisible} type={isSmallScreenWidth ? CONST_1.default.MODAL.MODAL_TYPE.CENTERED : CONST_1.default.MODAL.MODAL_TYPE.CENTERED_SMALL} onClose={onClose} animationOut={isSmallScreenWidth ? animationOut : undefined} innerContainerStyle={isSmallScreenWidth ? { ...safeAreaPaddingBottomStyle, maxHeight } : { ...styles.workspaceSection, ...safeAreaPaddingBottomStyle, maxHeight }}>
                    <HeaderWithBackButton_1.default title={translate('subscription.compareModal.comparePlans')} shouldShowCloseButton={!isSmallScreenWidth} onCloseButtonPress={onClose} shouldShowBackButton={isSmallScreenWidth} onBackButtonPress={onClose} style={isSmallScreenWidth ? styles.pl4 : [styles.pr3, styles.pl8]} shouldDisplayHelpButton={false}/>
                    <ScrollView_1.default>{renderPlans()}</ScrollView_1.default>
                </Modal_1.default>)}
        </SafeAreaConsumer_1.default>);
}
exports.default = ComparePlansModal;
