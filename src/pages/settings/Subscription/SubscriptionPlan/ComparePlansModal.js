"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Modal_1 = require("@components/Modal");
var RenderHTML_1 = require("@components/RenderHTML");
var SafeAreaConsumer_1 = require("@components/SafeAreaConsumer");
var ScrollView_1 = require("@components/ScrollView");
var useLocalize_1 = require("@hooks/useLocalize");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useWindowDimensions_1 = require("@hooks/useWindowDimensions");
var CONST_1 = require("@src/CONST");
var SubscriptionPlanCard_1 = require("./SubscriptionPlanCard");
function ComparePlansModal(_a) {
    var isModalVisible = _a.isModalVisible, setIsModalVisible = _a.setIsModalVisible;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var windowHeight = (0, useWindowDimensions_1.default)().windowHeight;
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to be consistent with BaseModal component
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
    var _b = (0, react_1.useState)('slideOutRight'), animationOut = _b[0], setAnimationOut = _b[1];
    (0, react_1.useEffect)(function () {
        setAnimationOut('slideOutRight');
    }, [isModalVisible]);
    var closeComparisonModalWithFadeOutAnimation = function () {
        setAnimationOut('fadeOut');
        setIsModalVisible(false);
    };
    var onClose = function () { return setIsModalVisible(false); };
    var renderPlans = function () { return (<react_native_1.View style={isSmallScreenWidth ? [styles.ph4, styles.pb8] : [styles.ph8, styles.pb8]}>
            <react_native_1.View style={[styles.renderHTML]}>
                <RenderHTML_1.default html={translate('subscription.compareModal.subtitle')}/>
            </react_native_1.View>
            <react_native_1.View style={isSmallScreenWidth ? styles.flexColumn : [styles.flexRow, styles.gap3]}>
                <SubscriptionPlanCard_1.default subscriptionPlan={CONST_1.default.POLICY.TYPE.TEAM} closeComparisonModal={closeComparisonModalWithFadeOutAnimation} isFromComparisonModal/>
                <SubscriptionPlanCard_1.default subscriptionPlan={CONST_1.default.POLICY.TYPE.CORPORATE} closeComparisonModal={closeComparisonModalWithFadeOutAnimation} isFromComparisonModal/>
            </react_native_1.View>
        </react_native_1.View>); };
    var maxHeight = isSmallScreenWidth ? undefined : windowHeight - 40;
    return (<SafeAreaConsumer_1.default>
            {function (_a) {
            var safeAreaPaddingBottomStyle = _a.safeAreaPaddingBottomStyle;
            return (<Modal_1.default isVisible={isModalVisible} type={isSmallScreenWidth ? CONST_1.default.MODAL.MODAL_TYPE.CENTERED : CONST_1.default.MODAL.MODAL_TYPE.CENTERED_SMALL} onClose={onClose} animationOut={isSmallScreenWidth ? animationOut : undefined} innerContainerStyle={isSmallScreenWidth ? __assign(__assign({}, safeAreaPaddingBottomStyle), { maxHeight: maxHeight }) : __assign(__assign(__assign({}, styles.workspaceSection), safeAreaPaddingBottomStyle), { maxHeight: maxHeight })}>
                    <HeaderWithBackButton_1.default title={translate('subscription.compareModal.comparePlans')} shouldShowCloseButton={!isSmallScreenWidth} onCloseButtonPress={onClose} shouldShowBackButton={isSmallScreenWidth} onBackButtonPress={onClose} style={isSmallScreenWidth ? styles.pl4 : [styles.pr3, styles.pl8]} shouldDisplayHelpButton={false}/>
                    <ScrollView_1.default>{renderPlans()}</ScrollView_1.default>
                </Modal_1.default>);
        }}
        </SafeAreaConsumer_1.default>);
}
exports.default = ComparePlansModal;
