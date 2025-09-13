"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_webview_1 = require("react-native-webview");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useImportPlaidAccounts_1 = require("@hooks/useImportPlaidAccounts");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePrevious_1 = require("@hooks/usePrevious");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useUpdateFeedBrokenConnection_1 = require("@hooks/useUpdateFeedBrokenConnection");
const Card_1 = require("@libs/actions/Card");
const CompanyCards_1 = require("@libs/actions/CompanyCards");
const CardUtils_1 = require("@libs/CardUtils");
const getUAForWebView_1 = require("@libs/getUAForWebView");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CompanyCards_2 = require("@userActions/CompanyCards");
const getCompanyCardBankConnection_1 = require("@userActions/getCompanyCardBankConnection");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function BankConnection({ policyID: policyIDFromProps, feed, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const webViewRef = (0, react_1.useRef)(null);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [assignCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ASSIGN_CARD, { canBeMissing: true });
    const authToken = session?.authToken ?? null;
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: true });
    const selectedBank = addNewCard?.data?.selectedBank;
    const { bankName: bankNameFromRoute, backTo, policyID: policyIDFromRoute } = route?.params ?? {};
    const policyID = policyIDFromProps ?? policyIDFromRoute;
    const bankName = feed ? (0, CardUtils_1.getBankName)(feed) : (bankNameFromRoute ?? addNewCard?.data?.plaidConnectedFeed ?? selectedBank);
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const plaidToken = addNewCard?.data?.publicToken ?? assignCard?.data?.plaidAccessToken;
    const isPlaid = isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS) && !!plaidToken;
    const url = (0, getCompanyCardBankConnection_1.getCompanyCardBankConnection)(policyID, bankName);
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const [isConnectionCompleted, setConnectionCompleted] = (0, react_1.useState)(false);
    const prevFeedsData = (0, usePrevious_1.default)(cardFeeds?.settings?.oAuthAccountDetails);
    const isFeedExpired = feed ? (0, CardUtils_1.isSelectedFeedExpired)(cardFeeds?.settings?.oAuthAccountDetails?.[feed]) : false;
    const { isNewFeedConnected, newFeed } = (0, react_1.useMemo)(() => (0, CardUtils_1.checkIfNewFeedConnected)(prevFeedsData ?? {}, cardFeeds?.settings?.oAuthAccountDetails ?? {}, addNewCard?.data?.plaidConnectedFeed), [addNewCard?.data?.plaidConnectedFeed, cardFeeds?.settings?.oAuthAccountDetails, prevFeedsData]);
    const headerTitleAddCards = !backTo ? translate('workspace.companyCards.addCards') : undefined;
    const headerTitle = feed ? translate('workspace.companyCards.assignCard') : headerTitleAddCards;
    const onImportPlaidAccounts = (0, useImportPlaidAccounts_1.default)(policyID);
    const { updateBrokenConnection, isFeedConnectionBroken } = (0, useUpdateFeedBrokenConnection_1.default)({ policyID, feed });
    const renderLoading = () => <FullscreenLoadingIndicator_1.default />;
    const handleBackButtonPress = () => {
        // Handle assign card flow
        if (feed) {
            Navigation_1.default.goBack();
            return;
        }
        // Handle add new card flow
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        if (bankName === CONST_1.default.COMPANY_CARDS.BANKS.BREX || isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS)) {
            (0, CompanyCards_2.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.SELECT_BANK });
            return;
        }
        if (bankName === CONST_1.default.COMPANY_CARDS.BANKS.AMEX) {
            (0, CompanyCards_2.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.AMEX_CUSTOM_FEED });
            return;
        }
        (0, CompanyCards_2.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.SELECT_FEED_TYPE });
    };
    (0, react_1.useEffect)(() => {
        if (!url && !isPlaid) {
            return;
        }
        // Handle assign card flow
        if (feed && !isFeedExpired) {
            if (isFeedConnectionBroken) {
                updateBrokenConnection();
                Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_COMPANY_CARDS.getRoute(policyID));
                return;
            }
            (0, CompanyCards_1.setAssignCardStepAndData)({
                currentStep: assignCard?.data?.dateOption ? CONST_1.default.COMPANY_CARD.STEP.CONFIRMATION : CONST_1.default.COMPANY_CARD.STEP.ASSIGNEE,
                isEditing: false,
            });
            return;
        }
        // Handle add new card flow
        if (isNewFeedConnected) {
            if (newFeed) {
                (0, Card_1.updateSelectedFeed)(newFeed, policyID);
            }
            // Direct feeds (except those added via Plaid) are created with default statement period end date.
            // Redirect the user to set a custom date.
            if (policyID && !isPlaid) {
                Navigation_1.default.closeRHPFlow();
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SETTINGS_STATEMENT_CLOSE_DATE.getRoute(policyID));
            }
            else {
                Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_COMPANY_CARDS.getRoute(policyID));
            }
        }
        if (isPlaid) {
            onImportPlaidAccounts();
        }
    }, [isNewFeedConnected, newFeed, policyID, url, feed, isFeedExpired, assignCard?.data?.dateOption, isPlaid, onImportPlaidAccounts, isFeedConnectionBroken, updateBrokenConnection]);
    const checkIfConnectionCompleted = (navState) => {
        if (!navState.url.includes(ROUTES_1.default.BANK_CONNECTION_COMPLETE)) {
            return;
        }
        setConnectionCompleted(true);
    };
    return (<ScreenWrapper_1.default testID={BankConnection.displayName} shouldShowOfflineIndicator={false} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={headerTitle} onBackButtonPress={handleBackButtonPress}/>
            <FullPageOfflineBlockingView_1.default addBottomSafeAreaPadding>
                {!!url && !isConnectionCompleted && !isPlaid && (<react_native_webview_1.WebView ref={webViewRef} source={{
                uri: url,
                headers: {
                    Cookie: `authToken=${authToken}`,
                },
            }} userAgent={(0, getUAForWebView_1.default)()} incognito onNavigationStateChange={checkIfConnectionCompleted} startInLoadingState renderLoading={renderLoading}/>)}
                {(isConnectionCompleted || isPlaid) && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={styles.flex1} color={theme.spinner}/>)}
            </FullPageOfflineBlockingView_1.default>
        </ScreenWrapper_1.default>);
}
BankConnection.displayName = 'BankConnection';
exports.default = BankConnection;
