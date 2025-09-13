"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_plaid_link_sdk_1 = require("react-native-plaid-link-sdk");
const Log_1 = require("@libs/Log");
const CONST_1 = require("@src/CONST");
function BaseNativePlaidLink({ token, onSuccess = () => { }, onExit = () => { }, onEvent }) {
    (0, react_native_plaid_link_sdk_1.usePlaidEmitter)((event) => {
        Log_1.default.info('[PlaidLink] Handled Plaid Event: ', false, { ...event });
        onEvent(event.eventName, event.metadata);
    });
    (0, react_1.useEffect)(() => {
        onEvent(CONST_1.default.BANK_ACCOUNT.PLAID.EVENTS_NAME.OPEN);
        (0, react_native_plaid_link_sdk_1.create)({ token, noLoadingState: false });
        (0, react_native_plaid_link_sdk_1.open)({
            onSuccess: ({ publicToken, metadata }) => {
                onSuccess({ publicToken, metadata });
            },
            onExit: ({ error, metadata }) => {
                Log_1.default.info('[PlaidLink] Exit: ', false, { error, metadata });
                onExit();
            },
        });
        return () => {
            (0, react_native_plaid_link_sdk_1.dismissLink)();
        };
        // We generally do not need to include the token as a dependency here as it is only provided once via props and should not change
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return null;
}
BaseNativePlaidLink.displayName = 'BaseNativePlaidLink';
exports.default = BaseNativePlaidLink;
