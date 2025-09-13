"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_webview_1 = require("react-native-webview");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const walletNavigationUtils_1 = require("./walletNavigationUtils");
const renderLoading = () => <FullscreenLoadingIndicator_1.default />;
function WalletStatementModal({ statementPageURL }) {
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const webViewRef = (0, react_1.useRef)(null);
    const authToken = session?.authToken ?? null;
    const onMessage = (0, react_1.useCallback)((event) => {
        try {
            const parsedData = JSON.parse(event.nativeEvent.data);
            const { type, url } = parsedData || {};
            if (!webViewRef.current) {
                return;
            }
            (0, walletNavigationUtils_1.default)(type, url);
        }
        catch (error) {
            console.error('Error parsing message from WebView:', error);
        }
    }, []);
    return (<react_native_webview_1.WebView ref={webViewRef} originWhitelist={['https://*']} source={{
            uri: statementPageURL,
            headers: {
                Cookie: `authToken=${authToken}`,
            },
        }} incognito // 'incognito' prop required for Android, issue here https://github.com/react-native-webview/react-native-webview/issues/1352
     startInLoadingState renderLoading={renderLoading} onMessage={onMessage}/>);
}
WalletStatementModal.displayName = 'WalletStatementModal';
exports.default = WalletStatementModal;
