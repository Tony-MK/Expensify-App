"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_webview_1 = require("react-native-webview");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const RequireTwoFactorAuthenticationModal_1 = require("@components/RequireTwoFactorAuthenticationModal");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const Xero_1 = require("@libs/actions/connections/Xero");
const Modal_2 = require("@libs/actions/Modal");
const getUAForWebView_1 = require("@libs/getUAForWebView");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ConnectToXeroFlow({ policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const webViewRef = (0, react_1.useRef)(null);
    const [isWebViewOpen, setIsWebViewOpen] = (0, react_1.useState)(false);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const authToken = session?.authToken ?? null;
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const is2FAEnabled = account?.requiresTwoFactorAuth ?? false;
    const renderLoading = () => <FullscreenLoadingIndicator_1.default />;
    const [isRequire2FAModalOpen, setIsRequire2FAModalOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!is2FAEnabled) {
            setIsRequire2FAModalOpen(true);
            return;
        }
        setIsWebViewOpen(true);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return (<>
            {!is2FAEnabled && (<RequireTwoFactorAuthenticationModal_1.default onSubmit={() => {
                setIsRequire2FAModalOpen(false);
                (0, Modal_2.close)(() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_2FA_ROOT.getRoute(ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID), (0, Xero_1.getXeroSetupLink)(policyID))));
            }} onCancel={() => setIsRequire2FAModalOpen(false)} isVisible={isRequire2FAModalOpen} description={translate('twoFactorAuth.twoFactorAuthIsRequiredDescription')}/>)}
            <Modal_1.default onClose={() => setIsWebViewOpen(false)} fullscreen isVisible={isWebViewOpen} type={CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE}>
                <HeaderWithBackButton_1.default title={translate('workspace.accounting.title')} onBackButtonPress={() => setIsWebViewOpen(false)} shouldDisplayHelpButton={false}/>
                <FullPageOfflineBlockingView_1.default>
                    <react_native_webview_1.WebView ref={webViewRef} source={{
            uri: (0, Xero_1.getXeroSetupLink)(policyID),
            headers: {
                Cookie: `authToken=${authToken}`,
            },
        }} userAgent={(0, getUAForWebView_1.default)()} incognito startInLoadingState renderLoading={renderLoading}/>
                </FullPageOfflineBlockingView_1.default>
            </Modal_1.default>
        </>);
}
ConnectToXeroFlow.displayName = 'ConnectToXeroFlow';
exports.default = ConnectToXeroFlow;
