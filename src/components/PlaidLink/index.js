"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_plaid_link_1 = require("react-plaid-link");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Log_1 = require("@libs/Log");
function PlaidLink({ token, onSuccess = () => { }, onError = () => { }, onExit = () => { }, onEvent, receivedRedirectURI }) {
    const [isPlaidLoaded, setIsPlaidLoaded] = (0, react_1.useState)(false);
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const successCallback = (0, react_1.useCallback)((publicToken, metadata) => {
        onSuccess({ publicToken, metadata });
    }, [onSuccess]);
    const { open, ready, error } = (0, react_plaid_link_1.usePlaidLink)({
        token,
        onSuccess: successCallback,
        onExit: (exitError, metadata) => {
            Log_1.default.info('[PlaidLink] Exit: ', false, { exitError, metadata });
            onExit();
        },
        onEvent: (event, metadata) => {
            Log_1.default.info('[PlaidLink] Event: ', false, { event, metadata });
            onEvent(event, metadata);
        },
        onLoad: () => setIsPlaidLoaded(true),
        // The redirect URI with an OAuth state ID. Needed to re-initialize the PlaidLink after directing the
        // user to their respective bank platform
        receivedRedirectUri: receivedRedirectURI,
    });
    (0, react_1.useEffect)(() => {
        if (error) {
            onError(error);
            return;
        }
        if (!ready) {
            return;
        }
        if (!isPlaidLoaded) {
            return;
        }
        open();
    }, [ready, error, isPlaidLoaded, open, onError]);
    return (<react_native_1.View style={[styles.flex1, styles.alignItemsCenter, styles.justifyContentCenter]}>
            <react_native_1.ActivityIndicator color={theme.spinner} size="large"/>
        </react_native_1.View>);
}
PlaidLink.displayName = 'PlaidLink';
exports.default = PlaidLink;
