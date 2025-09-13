"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useOnyx_1 = require("@hooks/useOnyx");
const useViewportOffsetTop_1 = require("@hooks/useViewportOffsetTop");
const TwoFactorAuthActions_1 = require("@libs/actions/TwoFactorAuthActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function TwoFactorAuthWrapper({ stepName, title, stepCounter, onBackButtonPress, shouldEnableKeyboardAvoidingView = true, shouldEnableViewportOffsetTop = false, children, }) {
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const { isDelegateAccessRestricted } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFound = (0, react_1.useMemo)(() => {
        if (!account) {
            return true;
        }
        const is2FAEnabled = !!account.requiresTwoFactorAuth;
        switch (stepName) {
            case CONST_1.default.TWO_FACTOR_AUTH_STEPS.COPY_CODES:
            case CONST_1.default.TWO_FACTOR_AUTH_STEPS.ENABLED:
            case CONST_1.default.TWO_FACTOR_AUTH_STEPS.DISABLE:
                return false;
            case CONST_1.default.TWO_FACTOR_AUTH_STEPS.VERIFY:
                return !account.codesAreCopied;
            case CONST_1.default.TWO_FACTOR_AUTH_STEPS.SUCCESS:
                return !is2FAEnabled;
            case CONST_1.default.TWO_FACTOR_AUTH_STEPS.DISABLED:
                return is2FAEnabled;
            default:
                return false;
        }
    }, [account, stepName]);
    const viewportOffsetTop = (0, useViewportOffsetTop_1.default)();
    if (isDelegateAccessRestricted) {
        return (<ScreenWrapper_1.default testID={TwoFactorAuthWrapper.displayName} includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false}>
                <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}/>
            </ScreenWrapper_1.default>);
    }
    const defaultGoBack = () => (0, TwoFactorAuthActions_1.quitAndNavigateBack)(ROUTES_1.default.SETTINGS_SECURITY);
    return (<ScreenWrapper_1.default shouldShowOfflineIndicator={false} shouldEnableKeyboardAvoidingView={shouldEnableKeyboardAvoidingView} shouldEnableMaxHeight testID={stepName} style={shouldEnableViewportOffsetTop ? { marginTop: viewportOffsetTop } : undefined}>
            <FullPageNotFoundView_1.default shouldShow={shouldShowNotFound} linkTranslationKey="securityPage.goToSecurity" onLinkPress={defaultGoBack}>
                <HeaderWithBackButton_1.default title={title} stepCounter={stepCounter} onBackButtonPress={onBackButtonPress ?? defaultGoBack}/>
                <FullPageOfflineBlockingView_1.default>{children}</FullPageOfflineBlockingView_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
TwoFactorAuthWrapper.displayName = 'TwoFactorAuthWrapper';
exports.default = TwoFactorAuthWrapper;
