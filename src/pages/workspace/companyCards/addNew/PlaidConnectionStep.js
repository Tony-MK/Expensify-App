"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const PlaidLink_1 = require("@components/PlaidLink");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CompanyCards_1 = require("@libs/actions/CompanyCards");
const KeyboardShortcut_1 = require("@libs/KeyboardShortcut");
const Log_1 = require("@libs/Log");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const App_1 = require("@userActions/App");
const BankAccounts_1 = require("@userActions/BankAccounts");
const Plaid_1 = require("@userActions/Plaid");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function PlaidConnectionStep({ feed, policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: true });
    const isUSCountry = addNewCard?.data?.selectedCountry === CONST_1.default.COUNTRY.US;
    const [isPlaidDisabled] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_PLAID_DISABLED, { canBeMissing: true });
    const [plaidLinkToken] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PLAID_LINK_TOKEN, { canBeMissing: true });
    const [plaidData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PLAID_DATA, { canBeMissing: true });
    const plaidErrors = plaidData?.errors;
    const subscribedKeyboardShortcuts = (0, react_1.useRef)([]);
    const previousNetworkState = (0, react_1.useRef)(undefined);
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    const plaidDataErrorMessage = !(0, EmptyObject_1.isEmptyObject)(plaidErrors) ? Object.values(plaidErrors).at(0) : '';
    const { isOffline } = (0, useNetwork_1.default)();
    const domain = (0, PolicyUtils_1.getDomainNameForPolicy)(policyID);
    const isAuthenticatedWithPlaid = (0, react_1.useCallback)(() => !!plaidData?.bankAccounts?.length || !(0, EmptyObject_1.isEmptyObject)(plaidData?.errors), [plaidData]);
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
        if (addNewCard?.data?.selectedCountry) {
            (0, Plaid_1.openPlaidCompanyCardLogin)(addNewCard.data.selectedCountry, domain, feed);
            return unsubscribeToNavigationShortcuts;
        }
        // disabling this rule, as we want this to run only on the first render
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        // If we are coming back from offline and we haven't authenticated with Plaid yet, we need to re-run our call to kick off Plaid
        // previousNetworkState.current also makes sure that this doesn't run on the first render.
        if (previousNetworkState.current && !isOffline && !isAuthenticatedWithPlaid() && addNewCard?.data?.selectedCountry) {
            (0, Plaid_1.openPlaidCompanyCardLogin)(addNewCard.data.selectedCountry, domain, feed);
        }
        previousNetworkState.current = isOffline;
    }, [addNewCard?.data?.selectedCountry, domain, feed, isAuthenticatedWithPlaid, isOffline]);
    const handleBackButtonPress = () => {
        if (feed) {
            Navigation_1.default.goBack();
            return;
        }
        (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: isUSCountry ? CONST_1.default.COMPANY_CARDS.STEP.SELECT_BANK : CONST_1.default.COMPANY_CARDS.STEP.SELECT_FEED_TYPE });
    };
    const handlePlaidLinkError = (0, react_1.useCallback)((error) => {
        Log_1.default.hmmm('[PlaidLink] Error: ', error?.message);
    }, []);
    const renderPlaidLink = () => {
        if (plaidLinkToken) {
            return (<PlaidLink_1.default token={plaidLinkToken} onSuccess={({ publicToken, metadata }) => {
                    // on success we need to move to bank connection screen with token, bank name = plaid
                    Log_1.default.info('[PlaidLink] Success!');
                    const plaidConnectedFeed = metadata?.institution?.institution_id ?? metadata?.institution?.id;
                    const plaidConnectedFeedName = metadata?.institution?.name ?? metadata?.institution?.name;
                    if (feed) {
                        if (plaidConnectedFeed && addNewCard?.data?.selectedCountry && plaidConnectedFeedName) {
                            (0, Plaid_1.importPlaidAccounts)(publicToken, plaidConnectedFeed, plaidConnectedFeedName, addNewCard.data.selectedCountry, (0, PolicyUtils_1.getDomainNameForPolicy)(policyID), JSON.stringify(metadata?.accounts), addNewCard.data.statementPeriodEnd, addNewCard.data.statementPeriodEndDay);
                            react_native_1.InteractionManager.runAfterInteractions(() => {
                                (0, CompanyCards_1.setAssignCardStepAndData)({
                                    data: {
                                        plaidAccessToken: publicToken,
                                        institutionId: plaidConnectedFeed,
                                        plaidConnectedFeedName,
                                        plaidAccounts: metadata?.accounts,
                                    },
                                    currentStep: CONST_1.default.COMPANY_CARD.STEP.BANK_CONNECTION,
                                });
                            });
                            return;
                        }
                        (0, CompanyCards_1.setAssignCardStepAndData)({
                            data: {
                                plaidAccessToken: publicToken,
                                institutionId: plaidConnectedFeed,
                                plaidConnectedFeedName,
                                plaidAccounts: metadata?.accounts,
                            },
                            currentStep: CONST_1.default.COMPANY_CARD.STEP.BANK_CONNECTION,
                        });
                        return;
                    }
                    (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
                        step: CONST_1.default.COMPANY_CARDS.STEP.SELECT_STATEMENT_CLOSE_DATE,
                        data: {
                            publicToken,
                            plaidConnectedFeed,
                            plaidConnectedFeedName,
                            plaidAccounts: metadata?.accounts,
                        },
                    });
                }} onError={handlePlaidLinkError} onEvent={(event) => {
                    (0, BankAccounts_1.setPlaidEvent)(event);
                    // Limit the number of times a user can submit Plaid credentials
                    if (event === 'SUBMIT_CREDENTIALS') {
                        (0, App_1.handleRestrictedEvent)(event);
                    }
                }} 
            // User prematurely exited the Plaid flow
            // eslint-disable-next-line react/jsx-props-no-multi-spaces
            onExit={handleBackButtonPress}/>);
        }
        if (plaidDataErrorMessage) {
            return <Text_1.default style={[styles.formError, styles.mh5]}>{plaidDataErrorMessage}</Text_1.default>;
        }
        if (plaidData?.isLoading) {
            return (<react_native_1.View style={[styles.flex1, styles.alignItemsCenter, styles.justifyContentCenter]}>
                    <react_native_1.ActivityIndicator color={theme.spinner} size="large"/>
                </react_native_1.View>);
        }
    };
    return (<ScreenWrapper_1.default testID={PlaidConnectionStep.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('workspace.companyCards.addCards')} onBackButtonPress={handleBackButtonPress}/>
            {isPlaidDisabled ? (<Text_1.default style={[styles.formError, styles.ph5, styles.mv3]}>{translate('bankAccount.error.tooManyAttempts')}</Text_1.default>) : (<FullPageOfflineBlockingView_1.default>{renderPlaidLink()}</FullPageOfflineBlockingView_1.default>)}
        </ScreenWrapper_1.default>);
}
PlaidConnectionStep.displayName = 'PlaidConnectionStep';
exports.default = PlaidConnectionStep;
