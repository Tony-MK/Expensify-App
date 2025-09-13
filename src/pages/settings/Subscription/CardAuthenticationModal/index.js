"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PaymentMethods_1 = require("@userActions/PaymentMethods");
const Policy_1 = require("@userActions/Policy/Policy");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SECURE_ORIGIN = new URL(CONFIG_1.default.EXPENSIFY.SECURE_EXPENSIFY_URL).origin;
function CardAuthenticationModal({ headerTitle, policyID }) {
    const styles = (0, useThemeStyles_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to be consistent with BaseModal component
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [authenticationLink] = (0, useOnyx_1.default)(ONYXKEYS_1.default.VERIFY_3DS_SUBSCRIPTION, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const onModalClose = (0, react_1.useCallback)(() => {
        setIsVisible(false);
        (0, PaymentMethods_1.clearPaymentCard3dsVerification)();
    }, []);
    (0, react_1.useEffect)(() => {
        if (!authenticationLink) {
            return;
        }
        setIsVisible(!!authenticationLink);
    }, [authenticationLink]);
    const handleSCAAuthentication = (0, react_1.useCallback)((event) => {
        if (event.origin !== SECURE_ORIGIN) {
            return;
        }
        const message = event.data;
        if (message === CONST_1.default.SCA_AUTHENTICATION_COMPLETE) {
            if (policyID) {
                (0, Policy_1.verifySetupIntentAndRequestPolicyOwnerChange)(policyID);
            }
            else {
                (0, PaymentMethods_1.verifySetupIntent)(session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, true);
            }
            onModalClose();
        }
    }, [onModalClose, policyID, session?.accountID]);
    (0, react_1.useEffect)(() => {
        window.addEventListener('message', handleSCAAuthentication);
        return () => {
            window.removeEventListener('message', handleSCAAuthentication);
        };
    }, [handleSCAAuthentication]);
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE} isVisible={isVisible} onClose={onModalClose}>
            <ScreenWrapper_1.default style={styles.pb0} includePaddingTop={false} includeSafeAreaPaddingBottom={false} testID={CardAuthenticationModal.displayName}>
                <HeaderWithBackButton_1.default title={headerTitle} shouldShowBorderBottom shouldShowCloseButton={!isSmallScreenWidth} onCloseButtonPress={onModalClose} shouldShowBackButton={isSmallScreenWidth} onBackButtonPress={onModalClose} shouldDisplayHelpButton={false}/>
                {isLoading && <FullscreenLoadingIndicator_1.default />}
                <react_native_1.View style={[styles.flex1]}>
                    <iframe src={authenticationLink} title="Statements" height="100%" width="100%" seamless style={{ border: 'none' }} onLoad={() => {
            setIsLoading(false);
        }}/>
                </react_native_1.View>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
CardAuthenticationModal.displayName = 'CardAuthenticationModal';
exports.default = CardAuthenticationModal;
