"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations_1 = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useImportPlaidAccounts_1 = require("@hooks/useImportPlaidAccounts");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePrevious_1 = require("@hooks/usePrevious");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useUpdateFeedBrokenConnection_1 = require("@hooks/useUpdateFeedBrokenConnection");
const CompanyCards_1 = require("@libs/actions/CompanyCards");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Card_1 = require("@userActions/Card");
const CompanyCards_2 = require("@userActions/CompanyCards");
const getCompanyCardBankConnection_1 = require("@userActions/getCompanyCardBankConnection");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const openBankConnection_1 = require("./openBankConnection");
let customWindow = null;
function BankConnection({ policyID: policyIDFromProps, feed, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: true });
    const [assignCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ASSIGN_CARD, { canBeMissing: true });
    const theme = (0, useTheme_1.default)();
    const { bankName: bankNameFromRoute, backTo, policyID: policyIDFromRoute } = route?.params ?? {};
    const policyID = policyIDFromProps ?? policyIDFromRoute;
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const prevFeedsData = (0, usePrevious_1.default)(cardFeeds?.settings?.oAuthAccountDetails);
    const [shouldBlockWindowOpen, setShouldBlockWindowOpen] = (0, react_1.useState)(false);
    const selectedBank = addNewCard?.data?.selectedBank;
    const bankName = feed ? (0, CardUtils_1.getBankName)(feed) : (bankNameFromRoute ?? addNewCard?.data?.plaidConnectedFeed ?? selectedBank);
    const { isNewFeedConnected, newFeed } = (0, react_1.useMemo)(() => (0, CardUtils_1.checkIfNewFeedConnected)(prevFeedsData ?? {}, cardFeeds?.settings?.oAuthAccountDetails ?? {}, addNewCard?.data?.plaidConnectedFeed), [addNewCard?.data?.plaidConnectedFeed, cardFeeds?.settings?.oAuthAccountDetails, prevFeedsData]);
    const { isOffline } = (0, useNetwork_1.default)();
    const plaidToken = addNewCard?.data?.publicToken ?? assignCard?.data?.plaidAccessToken;
    const { updateBrokenConnection, isFeedConnectionBroken } = (0, useUpdateFeedBrokenConnection_1.default)({ policyID, feed });
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const isPlaid = isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS) && !!plaidToken;
    const url = (0, getCompanyCardBankConnection_1.getCompanyCardBankConnection)(policyID, bankName);
    const isFeedExpired = feed ? (0, CardUtils_1.isSelectedFeedExpired)(cardFeeds?.settings?.oAuthAccountDetails?.[feed]) : false;
    const headerTitleAddCards = !backTo ? translate('workspace.companyCards.addCards') : undefined;
    const headerTitle = feed ? translate('workspace.companyCards.assignCard') : headerTitleAddCards;
    const onImportPlaidAccounts = (0, useImportPlaidAccounts_1.default)(policyID);
    const onOpenBankConnectionFlow = (0, react_1.useCallback)(() => {
        if (!url) {
            return;
        }
        customWindow = (0, openBankConnection_1.default)(url);
    }, [url]);
    const handleBackButtonPress = () => {
        customWindow?.close();
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
    const CustomSubtitle = (<Text_1.default style={[styles.textAlignCenter, styles.textSupporting]}>
            {bankName &&
            translate(`workspace.moreFeatures.companyCards.pendingBankDescription`, {
                bankName: addNewCard?.data?.plaidConnectedFeedName ?? bankName,
            })}
            <TextLink_1.default onPress={onOpenBankConnectionFlow}>{translate('workspace.moreFeatures.companyCards.pendingBankLink')}</TextLink_1.default>.
        </Text_1.default>);
    (0, react_1.useEffect)(() => {
        if ((!url && !isPlaid) || isOffline) {
            return;
        }
        // Handle assign card flow
        if (feed) {
            if (!isFeedExpired) {
                customWindow?.close();
                if (isFeedConnectionBroken) {
                    updateBrokenConnection();
                    Navigation_1.default.closeRHPFlow();
                    return;
                }
                (0, CompanyCards_1.setAssignCardStepAndData)({
                    currentStep: assignCard?.data?.dateOption ? CONST_1.default.COMPANY_CARD.STEP.CONFIRMATION : CONST_1.default.COMPANY_CARD.STEP.ASSIGNEE,
                    isEditing: false,
                });
                return;
            }
            if (isPlaid) {
                return;
            }
            if (url) {
                customWindow = (0, openBankConnection_1.default)(url);
                return;
            }
        }
        // Handle add new card flow
        if (isNewFeedConnected) {
            setShouldBlockWindowOpen(true);
            customWindow?.close();
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
                Navigation_1.default.closeRHPFlow();
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS.getRoute(policyID), { forceReplace: true });
            }
            return;
        }
        if (!shouldBlockWindowOpen) {
            if (isPlaid) {
                onImportPlaidAccounts();
                return;
            }
            if (url) {
                customWindow = (0, openBankConnection_1.default)(url);
            }
        }
    }, [
        isNewFeedConnected,
        shouldBlockWindowOpen,
        newFeed,
        policyID,
        url,
        feed,
        isFeedExpired,
        isOffline,
        assignCard?.data?.dateOption,
        isPlaid,
        onImportPlaidAccounts,
        isFeedConnectionBroken,
        updateBrokenConnection,
    ]);
    return (<ScreenWrapper_1.default testID={BankConnection.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={headerTitle} onBackButtonPress={handleBackButtonPress}/>
            <FullPageOfflineBlockingView_1.default addBottomSafeAreaPadding>
                {isPlaid ? (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={styles.flex1} color={theme.spinner}/>) : (<BlockingView_1.default icon={Illustrations_1.PendingBank} iconWidth={styles.pendingBankCardIllustration.width} iconHeight={styles.pendingBankCardIllustration.height} title={translate('workspace.moreFeatures.companyCards.pendingBankTitle')} CustomSubtitle={CustomSubtitle} onLinkPress={onOpenBankConnectionFlow} addBottomSafeAreaPadding/>)}
            </FullPageOfflineBlockingView_1.default>
        </ScreenWrapper_1.default>);
}
BankConnection.displayName = 'BankConnection';
exports.default = BankConnection;
