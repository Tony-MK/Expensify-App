"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const walletNavigationUtils_1 = require("./walletNavigationUtils");
function WalletStatementModal({ statementPageURL }) {
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const authToken = session?.authToken ?? null;
    /**
     * Handles in-app navigation for iframe links
     */
    const navigate = (event) => {
        const { data } = event;
        const { type, url } = data || {};
        (0, walletNavigationUtils_1.default)(type, url);
    };
    return (<>
            {isLoading && <FullscreenLoadingIndicator_1.default />}
            <react_native_1.View style={[styles.flex1]}>
                <iframe src={`${statementPageURL}&authToken=${authToken}`} title="Statements" height="100%" width="100%" seamless frameBorder="0" onLoad={() => {
            setIsLoading(false);
            // We listen to a message sent from the iframe to the parent component when a link is clicked.
            // This lets us handle navigation in the app, outside of the iframe.
            window.onmessage = navigate;
        }}/>
            </react_native_1.View>
        </>);
}
WalletStatementModal.displayName = 'WalletStatementModal';
exports.default = WalletStatementModal;
