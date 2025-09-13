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
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var BankAccounts_1 = require("@libs/actions/BankAccounts");
var KeyboardShortcut_1 = require("@libs/KeyboardShortcut");
var Log_1 = require("@libs/Log");
var App_1 = require("@userActions/App");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var FullPageOfflineBlockingView_1 = require("./BlockingViews/FullPageOfflineBlockingView");
var FormHelpMessage_1 = require("./FormHelpMessage");
var Icon_1 = require("./Icon");
var BankIcons_1 = require("./Icon/BankIcons");
var PlaidLink_1 = require("./PlaidLink");
var RadioButtons_1 = require("./RadioButtons");
var Text_1 = require("./Text");
function AddPlaidBankAccount(_a) {
    var _b, _c, _d;
    var plaidData = _a.plaidData, _e = _a.selectedPlaidAccountID, selectedPlaidAccountID = _e === void 0 ? '' : _e, _f = _a.onExitPlaid, onExitPlaid = _f === void 0 ? function () { } : _f, _g = _a.onSelect, onSelect = _g === void 0 ? function () { } : _g, _h = _a.text, text = _h === void 0 ? '' : _h, receivedRedirectURI = _a.receivedRedirectURI, _j = _a.plaidLinkOAuthToken, plaidLinkOAuthToken = _j === void 0 ? '' : _j, _k = _a.bankAccountID, bankAccountID = _k === void 0 ? 0 : _k, _l = _a.allowDebit, allowDebit = _l === void 0 ? false : _l, _m = _a.errorText, errorText = _m === void 0 ? '' : _m, _o = _a.onInputChange, onInputChange = _o === void 0 ? function () { } : _o, _p = _a.isDisplayedInWalletFlow, isDisplayedInWalletFlow = _p === void 0 ? false : _p;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var plaidBankAccounts = (_b = plaidData === null || plaidData === void 0 ? void 0 : plaidData.bankAccounts) !== null && _b !== void 0 ? _b : [];
    var defaultSelectedPlaidAccount = plaidBankAccounts.find(function (account) { return account.plaidAccountID === selectedPlaidAccountID; });
    var defaultSelectedPlaidAccountID = defaultSelectedPlaidAccount === null || defaultSelectedPlaidAccount === void 0 ? void 0 : defaultSelectedPlaidAccount.plaidAccountID;
    var defaultSelectedPlaidAccountMask = (_d = (_c = plaidBankAccounts.find(function (account) { return account.plaidAccountID === selectedPlaidAccountID; })) === null || _c === void 0 ? void 0 : _c.mask) !== null && _d !== void 0 ? _d : '';
    var subscribedKeyboardShortcuts = (0, react_1.useRef)([]);
    var previousNetworkState = (0, react_1.useRef)(undefined);
    var _q = (0, react_1.useState)(defaultSelectedPlaidAccountMask), selectedPlaidAccountMask = _q[0], setSelectedPlaidAccountMask = _q[1];
    var plaidLinkToken = (0, useOnyx_1.default)(ONYXKEYS_1.default.PLAID_LINK_TOKEN, { canBeMissing: true, initWithStoredValues: false })[0];
    var isPlaidDisabled = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_PLAID_DISABLED, { canBeMissing: true })[0];
    var translate = (0, useLocalize_1.default)().translate;
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var getPlaidLinkToken = function () {
        if (plaidLinkToken) {
            return plaidLinkToken;
        }
        if (receivedRedirectURI && plaidLinkOAuthToken) {
            return plaidLinkOAuthToken;
        }
    };
    /**
     * @returns {Boolean}
     * I'm using useCallback so the useEffect which uses this function doesn't run on every render.
     */
    var isAuthenticatedWithPlaid = (0, react_1.useCallback)(function () { var _a; return (!!receivedRedirectURI && !!plaidLinkOAuthToken) || !!((_a = plaidData === null || plaidData === void 0 ? void 0 : plaidData.bankAccounts) === null || _a === void 0 ? void 0 : _a.length) || !(0, EmptyObject_1.isEmptyObject)(plaidData === null || plaidData === void 0 ? void 0 : plaidData.errors); }, [plaidData, plaidLinkOAuthToken, receivedRedirectURI]);
    /**
     * Blocks the keyboard shortcuts that can navigate
     */
    var subscribeToNavigationShortcuts = function () {
        // find and block the shortcuts
        var shortcutsToBlock = Object.values(CONST_1.default.KEYBOARD_SHORTCUTS).filter(function (shortcut) { return 'type' in shortcut && shortcut.type === CONST_1.default.KEYBOARD_SHORTCUTS_TYPES.NAVIGATION_SHORTCUT; });
        subscribedKeyboardShortcuts.current = shortcutsToBlock.map(function (shortcut) {
            return KeyboardShortcut_1.default.subscribe(shortcut.shortcutKey, function () { }, // do nothing
            shortcut.descriptionKey, shortcut.modifiers, false, function () { var _a; return ((_a = plaidData === null || plaidData === void 0 ? void 0 : plaidData.bankAccounts) !== null && _a !== void 0 ? _a : []).length > 0; });
        });
    };
    /**
     * Unblocks the keyboard shortcuts that can navigate
     */
    var unsubscribeToNavigationShortcuts = function () {
        subscribedKeyboardShortcuts.current.forEach(function (unsubscribe) { return unsubscribe(); });
        subscribedKeyboardShortcuts.current = [];
    };
    (0, react_1.useEffect)(function () {
        subscribeToNavigationShortcuts();
        // If we're coming from Plaid OAuth flow then we need to reuse the existing plaidLinkToken
        if (isAuthenticatedWithPlaid()) {
            return unsubscribeToNavigationShortcuts;
        }
        (0, BankAccounts_1.openPlaidBankLogin)(allowDebit, bankAccountID);
        return unsubscribeToNavigationShortcuts;
        // disabling this rule, as we want this to run only on the first render
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(function () {
        // If we are coming back from offline and we haven't authenticated with Plaid yet, we need to re-run our call to kick off Plaid
        // previousNetworkState.current also makes sure that this doesn't run on the first render.
        if (previousNetworkState.current && !isOffline && !isAuthenticatedWithPlaid()) {
            (0, BankAccounts_1.openPlaidBankLogin)(allowDebit, bankAccountID);
        }
        previousNetworkState.current = isOffline;
    }, [allowDebit, bankAccountID, isAuthenticatedWithPlaid, isOffline]);
    var token = getPlaidLinkToken();
    var options = plaidBankAccounts.map(function (account) {
        var _a;
        return ({
            value: account.plaidAccountID,
            label: (_a = account.addressName) !== null && _a !== void 0 ? _a : '',
        });
    });
    var _r = (0, BankIcons_1.default)({ styles: styles }), icon = _r.icon, iconSize = _r.iconSize, iconStyles = _r.iconStyles;
    var plaidErrors = plaidData === null || plaidData === void 0 ? void 0 : plaidData.errors;
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    var plaidDataErrorMessage = !(0, EmptyObject_1.isEmptyObject)(plaidErrors) ? Object.values(plaidErrors).at(0) : '';
    var bankName = plaidData === null || plaidData === void 0 ? void 0 : plaidData.bankName;
    /**
     *
     * When user selects one of plaid accounts we need to set the mask in order to display it on UI
     */
    var handleSelectingPlaidAccount = function (plaidAccountID) {
        var _a, _b;
        var mask = (_b = (_a = plaidBankAccounts.find(function (account) { return account.plaidAccountID === plaidAccountID; })) === null || _a === void 0 ? void 0 : _a.mask) !== null && _b !== void 0 ? _b : '';
        setSelectedPlaidAccountMask(mask);
        onSelect(plaidAccountID);
        onInputChange(plaidAccountID);
    };
    var handlePlaidLinkError = (0, react_1.useCallback)(function (error) {
        Log_1.default.hmmm('[PlaidLink] Error: ', error === null || error === void 0 ? void 0 : error.message);
    }, []);
    if (isPlaidDisabled) {
        return (<react_native_1.View>
                <Text_1.default style={[styles.formError]}>{translate('bankAccount.error.tooManyAttempts')}</Text_1.default>
            </react_native_1.View>);
    }
    var renderPlaidLink = function () {
        if (!!token && !bankName) {
            return (<PlaidLink_1.default token={token} onSuccess={function (_a) {
                    var _b, _c;
                    var publicToken = _a.publicToken, metadata = _a.metadata;
                    Log_1.default.info('[PlaidLink] Success!');
                    (0, BankAccounts_1.openPlaidBankAccountSelector)(publicToken, (_c = (_b = metadata === null || metadata === void 0 ? void 0 : metadata.institution) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : '', allowDebit, bankAccountID);
                }} onError={handlePlaidLinkError} onEvent={function (event, metadata) {
                    var _a, _b;
                    (0, BankAccounts_1.setPlaidEvent)(event);
                    // Handle Plaid login errors (will potentially reset plaid token and item depending on the error)
                    if (event === 'ERROR') {
                        Log_1.default.hmmm('[PlaidLink] Error: ', __assign({}, metadata));
                        if (bankAccountID && metadata && 'error_code' in metadata) {
                            (0, BankAccounts_1.handlePlaidError)(bankAccountID, (_a = metadata.error_code) !== null && _a !== void 0 ? _a : '', (_b = metadata.error_message) !== null && _b !== void 0 ? _b : '', metadata.request_id);
                        }
                    }
                    // Limit the number of times a user can submit Plaid credentials
                    if (event === 'SUBMIT_CREDENTIALS') {
                        (0, App_1.handleRestrictedEvent)(event);
                    }
                }} 
            // User prematurely exited the Plaid flow
            // eslint-disable-next-line react/jsx-props-no-multi-spaces
            onExit={onExitPlaid} receivedRedirectURI={receivedRedirectURI}/>);
        }
        if (plaidDataErrorMessage) {
            return <Text_1.default style={[styles.formError, styles.mh5]}>{plaidDataErrorMessage}</Text_1.default>;
        }
        if (plaidData === null || plaidData === void 0 ? void 0 : plaidData.isLoading) {
            return (<react_native_1.View style={[styles.flex1, styles.alignItemsCenter, styles.justifyContentCenter]}>
                    <react_native_1.ActivityIndicator color={theme.spinner} size="large"/>
                </react_native_1.View>);
        }
        return <react_native_1.View />;
    };
    // Plaid Link view
    if (!plaidBankAccounts.length) {
        return <FullPageOfflineBlockingView_1.default>{renderPlaidLink()}</FullPageOfflineBlockingView_1.default>;
    }
    return (<FullPageOfflineBlockingView_1.default>
            <Text_1.default style={[styles.mb3, styles.textHeadlineLineHeightXXL]}>{translate(isDisplayedInWalletFlow ? 'walletPage.chooseYourBankAccount' : 'bankAccount.chooseAnAccount')}</Text_1.default>
            {!!text && <Text_1.default style={[styles.mb6, styles.textSupporting]}>{text}</Text_1.default>}
            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mb6]}>
                <Icon_1.default src={icon} height={iconSize} width={iconSize} additionalStyles={iconStyles}/>
                <react_native_1.View>
                    <Text_1.default style={[styles.ml3, styles.textStrong]}>{bankName}</Text_1.default>
                    {selectedPlaidAccountMask.length > 0 && (<Text_1.default style={[styles.ml3, styles.textLabelSupporting]}>{"".concat(translate('bankAccount.accountEnding'), " ").concat(selectedPlaidAccountMask)}</Text_1.default>)}
                </react_native_1.View>
            </react_native_1.View>
            <Text_1.default style={[styles.textLabelSupporting]}>{"".concat(translate('bankAccount.chooseAnAccountBelow'), ":")}</Text_1.default>
            <RadioButtons_1.default items={options} defaultCheckedValue={defaultSelectedPlaidAccountID} onPress={handleSelectingPlaidAccount} radioButtonStyle={[styles.mb6]}/>
            <FormHelpMessage_1.default message={errorText}/>
        </FullPageOfflineBlockingView_1.default>);
}
AddPlaidBankAccount.displayName = 'AddPlaidBankAccount';
exports.default = AddPlaidBankAccount;
