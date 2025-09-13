"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BankAccounts_1 = require("@libs/actions/BankAccounts");
const KeyboardShortcut_1 = require("@libs/KeyboardShortcut");
const Log_1 = require("@libs/Log");
const App_1 = require("@userActions/App");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const FullPageOfflineBlockingView_1 = require("./BlockingViews/FullPageOfflineBlockingView");
const FormHelpMessage_1 = require("./FormHelpMessage");
const Icon_1 = require("./Icon");
const BankIcons_1 = require("./Icon/BankIcons");
const PlaidLink_1 = require("./PlaidLink");
const RadioButtons_1 = require("./RadioButtons");
const Text_1 = require("./Text");
function AddPlaidBankAccount({ plaidData, selectedPlaidAccountID = '', onExitPlaid = () => { }, onSelect = () => { }, text = '', receivedRedirectURI, plaidLinkOAuthToken = '', bankAccountID = 0, allowDebit = false, errorText = '', onInputChange = () => { }, isDisplayedInWalletFlow = false, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const plaidBankAccounts = plaidData?.bankAccounts ?? [];
    const defaultSelectedPlaidAccount = plaidBankAccounts.find((account) => account.plaidAccountID === selectedPlaidAccountID);
    const defaultSelectedPlaidAccountID = defaultSelectedPlaidAccount?.plaidAccountID;
    const defaultSelectedPlaidAccountMask = plaidBankAccounts.find((account) => account.plaidAccountID === selectedPlaidAccountID)?.mask ?? '';
    const subscribedKeyboardShortcuts = (0, react_1.useRef)([]);
    const previousNetworkState = (0, react_1.useRef)(undefined);
    const [selectedPlaidAccountMask, setSelectedPlaidAccountMask] = (0, react_1.useState)(defaultSelectedPlaidAccountMask);
    const [plaidLinkToken] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PLAID_LINK_TOKEN, { canBeMissing: true, initWithStoredValues: false });
    const [isPlaidDisabled] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_PLAID_DISABLED, { canBeMissing: true });
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const getPlaidLinkToken = () => {
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
    const isAuthenticatedWithPlaid = (0, react_1.useCallback)(() => (!!receivedRedirectURI && !!plaidLinkOAuthToken) || !!plaidData?.bankAccounts?.length || !(0, EmptyObject_1.isEmptyObject)(plaidData?.errors), [plaidData, plaidLinkOAuthToken, receivedRedirectURI]);
    /**
     * Blocks the keyboard shortcuts that can navigate
     */
    const subscribeToNavigationShortcuts = () => {
        // find and block the shortcuts
        const shortcutsToBlock = Object.values(CONST_1.default.KEYBOARD_SHORTCUTS).filter((shortcut) => 'type' in shortcut && shortcut.type === CONST_1.default.KEYBOARD_SHORTCUTS_TYPES.NAVIGATION_SHORTCUT);
        subscribedKeyboardShortcuts.current = shortcutsToBlock.map((shortcut) => KeyboardShortcut_1.default.subscribe(shortcut.shortcutKey, () => { }, // do nothing
        shortcut.descriptionKey, shortcut.modifiers, false, () => (plaidData?.bankAccounts ?? []).length > 0));
    };
    /**
     * Unblocks the keyboard shortcuts that can navigate
     */
    const unsubscribeToNavigationShortcuts = () => {
        subscribedKeyboardShortcuts.current.forEach((unsubscribe) => unsubscribe());
        subscribedKeyboardShortcuts.current = [];
    };
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        // If we are coming back from offline and we haven't authenticated with Plaid yet, we need to re-run our call to kick off Plaid
        // previousNetworkState.current also makes sure that this doesn't run on the first render.
        if (previousNetworkState.current && !isOffline && !isAuthenticatedWithPlaid()) {
            (0, BankAccounts_1.openPlaidBankLogin)(allowDebit, bankAccountID);
        }
        previousNetworkState.current = isOffline;
    }, [allowDebit, bankAccountID, isAuthenticatedWithPlaid, isOffline]);
    const token = getPlaidLinkToken();
    const options = plaidBankAccounts.map((account) => ({
        value: account.plaidAccountID,
        label: account.addressName ?? '',
    }));
    const { icon, iconSize, iconStyles } = (0, BankIcons_1.default)({ styles });
    const plaidErrors = plaidData?.errors;
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    const plaidDataErrorMessage = !(0, EmptyObject_1.isEmptyObject)(plaidErrors) ? Object.values(plaidErrors).at(0) : '';
    const bankName = plaidData?.bankName;
    /**
     *
     * When user selects one of plaid accounts we need to set the mask in order to display it on UI
     */
    const handleSelectingPlaidAccount = (plaidAccountID) => {
        const mask = plaidBankAccounts.find((account) => account.plaidAccountID === plaidAccountID)?.mask ?? '';
        setSelectedPlaidAccountMask(mask);
        onSelect(plaidAccountID);
        onInputChange(plaidAccountID);
    };
    const handlePlaidLinkError = (0, react_1.useCallback)((error) => {
        Log_1.default.hmmm('[PlaidLink] Error: ', error?.message);
    }, []);
    if (isPlaidDisabled) {
        return (<react_native_1.View>
                <Text_1.default style={[styles.formError]}>{translate('bankAccount.error.tooManyAttempts')}</Text_1.default>
            </react_native_1.View>);
    }
    const renderPlaidLink = () => {
        if (!!token && !bankName) {
            return (<PlaidLink_1.default token={token} onSuccess={({ publicToken, metadata }) => {
                    Log_1.default.info('[PlaidLink] Success!');
                    (0, BankAccounts_1.openPlaidBankAccountSelector)(publicToken, metadata?.institution?.name ?? '', allowDebit, bankAccountID);
                }} onError={handlePlaidLinkError} onEvent={(event, metadata) => {
                    (0, BankAccounts_1.setPlaidEvent)(event);
                    // Handle Plaid login errors (will potentially reset plaid token and item depending on the error)
                    if (event === 'ERROR') {
                        Log_1.default.hmmm('[PlaidLink] Error: ', { ...metadata });
                        if (bankAccountID && metadata && 'error_code' in metadata) {
                            (0, BankAccounts_1.handlePlaidError)(bankAccountID, metadata.error_code ?? '', metadata.error_message ?? '', metadata.request_id);
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
        if (plaidData?.isLoading) {
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
                    {selectedPlaidAccountMask.length > 0 && (<Text_1.default style={[styles.ml3, styles.textLabelSupporting]}>{`${translate('bankAccount.accountEnding')} ${selectedPlaidAccountMask}`}</Text_1.default>)}
                </react_native_1.View>
            </react_native_1.View>
            <Text_1.default style={[styles.textLabelSupporting]}>{`${translate('bankAccount.chooseAnAccountBelow')}:`}</Text_1.default>
            <RadioButtons_1.default items={options} defaultCheckedValue={defaultSelectedPlaidAccountID} onPress={handleSelectingPlaidAccount} radioButtonStyle={[styles.mb6]}/>
            <FormHelpMessage_1.default message={errorText}/>
        </FullPageOfflineBlockingView_1.default>);
}
AddPlaidBankAccount.displayName = 'AddPlaidBankAccount';
exports.default = AddPlaidBankAccount;
