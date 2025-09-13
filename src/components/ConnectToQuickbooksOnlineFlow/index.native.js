"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_webview_1 = require("react-native-webview");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const renderLoading = () => <FullscreenLoadingIndicator_1.default />;
function ConnectToQuickbooksOnlineFlow({ policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const webViewRef = (0, react_1.useRef)(null);
    const [isWebViewOpen, setIsWebViewOpen] = (0, react_1.useState)(false);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const authToken = session?.authToken ?? null;
    (0, react_1.useEffect)(() => {
        // Since QBO doesn't support Taxes, we should disable them from the LHN when connecting to QBO
        (0, Policy_1.enablePolicyTaxes)(policyID, false);
        setIsWebViewOpen(true);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return (<Modal_1.default onClose={() => setIsWebViewOpen(false)} fullscreen isVisible={isWebViewOpen} type={CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE}>
            <HeaderWithBackButton_1.default title={translate('workspace.accounting.title')} onBackButtonPress={() => setIsWebViewOpen(false)} shouldDisplayHelpButton={false}/>
            <FullPageOfflineBlockingView_1.default>
                <react_native_webview_1.WebView ref={webViewRef} source={{
            uri: (0, QuickbooksOnline_1.getQuickbooksOnlineSetupLink)(policyID),
            headers: {
                Cookie: `authToken=${authToken}`,
            },
        }} incognito // 'incognito' prop required for Android, issue here https://github.com/react-native-webview/react-native-webview/issues/1352
     startInLoadingState renderLoading={renderLoading}/>
            </FullPageOfflineBlockingView_1.default>
        </Modal_1.default>);
}
ConnectToQuickbooksOnlineFlow.displayName = 'ConnectToQuickbooksOnlineFlow';
exports.default = ConnectToQuickbooksOnlineFlow;
