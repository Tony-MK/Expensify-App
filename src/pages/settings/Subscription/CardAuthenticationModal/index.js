"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Modal_1 = require("@components/Modal");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var useOnyx_1 = require("@hooks/useOnyx");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var PaymentMethods_1 = require("@userActions/PaymentMethods");
var Policy_1 = require("@userActions/Policy/Policy");
var CONFIG_1 = require("@src/CONFIG");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var SECURE_ORIGIN = new URL(CONFIG_1.default.EXPENSIFY.SECURE_EXPENSIFY_URL).origin;
function CardAuthenticationModal(_a) {
    var headerTitle = _a.headerTitle, policyID = _a.policyID;
    var styles = (0, useThemeStyles_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to be consistent with BaseModal component
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
    var authenticationLink = (0, useOnyx_1.default)(ONYXKEYS_1.default.VERIFY_3DS_SUBSCRIPTION, { canBeMissing: true })[0];
    var session = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true })[0];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(false), isVisible = _c[0], setIsVisible = _c[1];
    var onModalClose = (0, react_1.useCallback)(function () {
        setIsVisible(false);
        (0, PaymentMethods_1.clearPaymentCard3dsVerification)();
    }, []);
    (0, react_1.useEffect)(function () {
        if (!authenticationLink) {
            return;
        }
        setIsVisible(!!authenticationLink);
    }, [authenticationLink]);
    var handleSCAAuthentication = (0, react_1.useCallback)(function (event) {
        var _a;
        if (event.origin !== SECURE_ORIGIN) {
            return;
        }
        var message = event.data;
        if (message === CONST_1.default.SCA_AUTHENTICATION_COMPLETE) {
            if (policyID) {
                (0, Policy_1.verifySetupIntentAndRequestPolicyOwnerChange)(policyID);
            }
            else {
                (0, PaymentMethods_1.verifySetupIntent)((_a = session === null || session === void 0 ? void 0 : session.accountID) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID, true);
            }
            onModalClose();
        }
    }, [onModalClose, policyID, session === null || session === void 0 ? void 0 : session.accountID]);
    (0, react_1.useEffect)(function () {
        window.addEventListener('message', handleSCAAuthentication);
        return function () {
            window.removeEventListener('message', handleSCAAuthentication);
        };
    }, [handleSCAAuthentication]);
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE} isVisible={isVisible} onClose={onModalClose}>
            <ScreenWrapper_1.default style={styles.pb0} includePaddingTop={false} includeSafeAreaPaddingBottom={false} testID={CardAuthenticationModal.displayName}>
                <HeaderWithBackButton_1.default title={headerTitle} shouldShowBorderBottom shouldShowCloseButton={!isSmallScreenWidth} onCloseButtonPress={onModalClose} shouldShowBackButton={isSmallScreenWidth} onBackButtonPress={onModalClose} shouldDisplayHelpButton={false}/>
                {isLoading && <FullscreenLoadingIndicator_1.default />}
                <react_native_1.View style={[styles.flex1]}>
                    <iframe src={authenticationLink} title="Statements" height="100%" width="100%" seamless style={{ border: 'none' }} onLoad={function () {
            setIsLoading(false);
        }}/>
                </react_native_1.View>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
CardAuthenticationModal.displayName = 'CardAuthenticationModal';
exports.default = CardAuthenticationModal;
