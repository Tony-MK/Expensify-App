"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const expensify_card_svg_1 = require("@assets/images/expensify-card.svg");
const Badge_1 = require("@components/Badge");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DecisionModal_1 = require("@components/DecisionModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Expensicons = require("@components/Icon/Expensicons");
const ImageSVG_1 = require("@components/ImageSVG");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useCurrencyForExpensifyCard_1 = require("@hooks/useCurrencyForExpensifyCard");
const useDefaultFundID_1 = require("@hooks/useDefaultFundID");
const useExpensifyCardFeeds_1 = require("@hooks/useExpensifyCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspaceAccountID_1 = require("@hooks/useWorkspaceAccountID");
const CardUtils_1 = require("@libs/CardUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const Navigation_1 = require("@navigation/Navigation");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const variables_1 = require("@styles/variables");
const Card_1 = require("@userActions/Card");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function WorkspaceExpensifyCardDetailsPage({ route }) {
    const { policyID, cardID, backTo } = route.params;
    const defaultFundID = (0, useDefaultFundID_1.default)(policyID);
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const [isDeactivateModalVisible, setIsDeactivateModalVisible] = (0, react_1.useState)(false);
    const [isOfflineModalVisible, setIsOfflineModalVisible] = (0, react_1.useState)(false);
    const { translate } = (0, useLocalize_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use the correct modal type for the decision modal
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isDeleted, setIsDeleted] = (0, react_1.useState)(false);
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const expensifyCardSettings = (0, useExpensifyCardFeeds_1.default)(policyID);
    const [allFeedsCards, allFeedsCardsResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: true });
    const workspaceCards = (0, CardUtils_1.getAllCardsForWorkspace)(workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID, allFeedsCards, cardFeeds, expensifyCardSettings);
    const isWorkspaceCardRhp = route.name === SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_DETAILS;
    const card = workspaceCards?.[cardID];
    const currency = (0, useCurrencyForExpensifyCard_1.default)({ policyID });
    const cardholder = personalDetails?.[card?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID];
    const isVirtual = !!card?.nameValuePairs?.isVirtual;
    const formattedAvailableSpendAmount = (0, CurrencyUtils_1.convertToDisplayString)(card?.availableSpend, currency);
    const formattedLimit = (0, CurrencyUtils_1.convertToDisplayString)(card?.nameValuePairs?.unapprovedExpenseLimit, currency);
    const displayName = (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(cardholder);
    const translationForLimitType = (0, CardUtils_1.getTranslationKeyForLimitType)(card?.nameValuePairs?.limitType);
    const fetchCardDetails = (0, react_1.useCallback)(() => {
        (0, Card_1.openCardDetailsPage)(Number(cardID));
    }, [cardID]);
    (0, react_1.useEffect)(() => {
        if (!isDeleted) {
            return;
        }
        return () => {
            (0, Card_1.deactivateCard)(defaultFundID, card);
        };
    }, [isDeleted, defaultFundID, card]);
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: fetchCardDetails });
    (0, react_1.useEffect)(() => fetchCardDetails(), [fetchCardDetails]);
    const deactivateCard = () => {
        setIsDeleted(true);
        setIsDeactivateModalVisible(false);
        requestAnimationFrame(() => {
            Navigation_1.default.goBack();
        });
    };
    if (!card && !(0, isLoadingOnyxValue_1.default)(allFeedsCardsResult)) {
        return <NotFoundPage_1.default />;
    }
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding testID={WorkspaceExpensifyCardDetailsPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.expensifyCard.cardDetails')} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
                <ScrollView_1.default addBottomSafeAreaPadding>
                    <react_native_1.View style={[styles.walletCard, styles.mb3]}>
                        <ImageSVG_1.default contentFit="contain" src={expensify_card_svg_1.default} pointerEvents="none" height={variables_1.default.cardPreviewHeight} width={variables_1.default.cardPreviewWidth}/>
                        <Badge_1.default badgeStyles={styles.cardBadge} textStyles={styles.cardBadgeText} text={translate(isVirtual ? 'workspace.expensifyCard.virtual' : 'workspace.expensifyCard.physical')}/>
                    </react_native_1.View>

                    <MenuItem_1.default label={translate('workspace.card.issueNewCard.cardholder')} title={displayName} icon={cardholder?.avatar ?? Expensicons_1.FallbackAvatar} iconType={CONST_1.default.ICON_TYPE_AVATAR} description={cardholder?.login} interactive={false}/>
                    <MenuItemWithTopDescription_1.default description={translate(isVirtual ? 'cardPage.virtualCardNumber' : 'cardPage.physicalCardNumber')} title={(0, CardUtils_1.maskCard)(card?.lastFourPAN)} interactive={false} titleStyle={styles.walletCardNumber}/>
                    <OfflineWithFeedback_1.default pendingAction={card?.pendingFields?.availableSpend}>
                        <MenuItemWithTopDescription_1.default description={translate('cardPage.availableSpend')} title={formattedAvailableSpendAmount} interactive={false} titleStyle={styles.newKansasLarge}/>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default pendingAction={card?.nameValuePairs?.pendingFields?.unapprovedExpenseLimit}>
                        <MenuItemWithTopDescription_1.default description={translate('workspace.expensifyCard.cardLimit')} title={formattedLimit} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(isWorkspaceCardRhp
            ? ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_LIMIT.getRoute(policyID, cardID, Navigation_1.default.getActiveRoute())
            : ROUTES_1.default.EXPENSIFY_CARD_LIMIT.getRoute(policyID, cardID, Navigation_1.default.getActiveRoute()))}/>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default pendingAction={card?.nameValuePairs?.pendingFields?.limitType}>
                        <MenuItemWithTopDescription_1.default description={translate('workspace.card.issueNewCard.limitType')} title={translationForLimitType ? translate(translationForLimitType) : ''} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(isWorkspaceCardRhp
            ? ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_LIMIT_TYPE.getRoute(policyID, cardID, Navigation_1.default.getActiveRoute())
            : ROUTES_1.default.EXPENSIFY_CARD_LIMIT_TYPE.getRoute(policyID, cardID, Navigation_1.default.getActiveRoute()))}/>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default pendingAction={card?.nameValuePairs?.pendingFields?.cardTitle}>
                        <MenuItemWithTopDescription_1.default description={translate('workspace.card.issueNewCard.cardName')} title={card?.nameValuePairs?.cardTitle} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(isWorkspaceCardRhp
            ? ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_NAME.getRoute(policyID, cardID, Navigation_1.default.getActiveRoute())
            : ROUTES_1.default.EXPENSIFY_CARD_NAME.getRoute(policyID, cardID, Navigation_1.default.getActiveRoute()))}/>
                    </OfflineWithFeedback_1.default>
                    <MenuItem_1.default icon={Expensicons.MoneySearch} title={translate('workspace.common.viewTransactions')} style={styles.mt3} onPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({
                query: (0, SearchQueryUtils_1.buildCannedSearchQuery)({
                    type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                    status: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL,
                    cardID,
                }),
            }));
        }}/>
                    <MenuItem_1.default icon={Expensicons.Trashcan} title={translate('workspace.expensifyCard.deactivate')} style={styles.mb1} onPress={() => (isOffline ? setIsOfflineModalVisible(true) : setIsDeactivateModalVisible(true))}/>
                    <ConfirmModal_1.default title={translate('workspace.card.deactivateCardModal.deactivateCard')} isVisible={isDeactivateModalVisible} onConfirm={deactivateCard} onCancel={() => setIsDeactivateModalVisible(false)} shouldSetModalVisibility={false} prompt={translate('workspace.card.deactivateCardModal.deactivateConfirmation')} confirmText={translate('workspace.card.deactivateCardModal.deactivate')} cancelText={translate('common.cancel')} danger/>
                    <DecisionModal_1.default title={translate('common.youAppearToBeOffline')} prompt={translate('common.offlinePrompt')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setIsOfflineModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={isOfflineModalVisible} onClose={() => setIsOfflineModalVisible(false)}/>
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceExpensifyCardDetailsPage.displayName = 'WorkspaceExpensifyCardDetailsPage';
exports.default = WorkspaceExpensifyCardDetailsPage;
