"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const expensify_card_svg_1 = require("@assets/images/expensify-card.svg");
const Button_1 = require("@components/Button");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const FeedSelector_1 = require("@components/FeedSelector");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Illustrations_1 = require("@components/Icon/Illustrations");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Pressable_1 = require("@components/Pressable");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const SearchBar_1 = require("@components/SearchBar");
const Text_1 = require("@components/Text");
const useCurrencyForExpensifyCard_1 = require("@hooks/useCurrencyForExpensifyCard");
const useEmptyViewHeaderHeight_1 = require("@hooks/useEmptyViewHeaderHeight");
const useExpensifyCardFeeds_1 = require("@hooks/useExpensifyCardFeeds");
const useExpensifyCardUkEuSupported_1 = require("@hooks/useExpensifyCardUkEuSupported");
const useHandleBackButton_1 = require("@hooks/useHandleBackButton");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSearchResults_1 = require("@hooks/useSearchResults");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Card_1 = require("@libs/actions/Card");
const PaymentMethods_1 = require("@libs/actions/PaymentMethods");
const CardUtils_1 = require("@libs/CardUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const EmptyCardView_1 = require("./EmptyCardView");
const WorkspaceCardListHeader_1 = require("./WorkspaceCardListHeader");
const WorkspaceCardListLabels_1 = require("./WorkspaceCardListLabels");
const WorkspaceCardListRow_1 = require("./WorkspaceCardListRow");
function WorkspaceExpensifyCardListPage({ route, cardsList, fundID }) {
    const { shouldUseNarrowLayout, isMediumScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [cardOnWaitlist] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.NVP_EXPENSIFY_ON_CARD_WAITLIST}${policyID}`, { canBeMissing: true });
    const [cardSettings] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${fundID}`, { canBeMissing: false });
    const allExpensifyCardFeeds = (0, useExpensifyCardFeeds_1.default)(policyID);
    const shouldShowSelector = Object.keys(allExpensifyCardFeeds ?? {}).length > 1;
    const { isActingAsDelegate, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const { isAccountLocked, showLockedAccountModal } = (0, react_1.useContext)(LockedAccountModalProvider_1.LockedAccountContext);
    const isUkEuCurrencySupported = (0, useExpensifyCardUkEuSupported_1.default)(policyID);
    const shouldChangeLayout = isMediumScreenWidth || shouldUseNarrowLayout;
    const isBankAccountVerified = !cardOnWaitlist;
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const headerHeight = (0, useEmptyViewHeaderHeight_1.default)(shouldUseNarrowLayout, isBankAccountVerified);
    const [footerHeight, setFooterHeight] = (0, react_1.useState)(0);
    const settlementCurrency = (0, useCurrencyForExpensifyCard_1.default)({ policyID });
    const allCards = (0, react_1.useMemo)(() => {
        const policyMembersAccountIDs = Object.values((0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList));
        return (0, CardUtils_1.getCardsByCardholderName)(cardsList, policyMembersAccountIDs);
    }, [cardsList, policy?.employeeList]);
    const filterCard = (0, react_1.useCallback)((card, searchInput) => (0, CardUtils_1.filterCardsByPersonalDetails)(card, searchInput, personalDetails), [personalDetails]);
    const sortCards = (0, react_1.useCallback)((cards) => (0, CardUtils_1.sortCardsByCardholderName)(cards, personalDetails, localeCompare), [personalDetails, localeCompare]);
    const [inputValue, setInputValue, filteredSortedCards] = (0, useSearchResults_1.default)(allCards, filterCard, sortCards);
    const handleIssueCardPress = () => {
        (0, Card_1.clearIssueNewCardFormData)();
        if (isAccountLocked) {
            showLockedAccountModal();
            return;
        }
        if (isActingAsDelegate) {
            showDelegateNoAccessModal();
            return;
        }
        const activeRoute = Navigation_1.default.getActiveRoute();
        (0, Card_1.setIssueNewCardStepAndData)({ policyID, isChangeAssigneeDisabled: false });
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_ISSUE_NEW.getRoute(policyID, activeRoute));
    };
    const secondaryActions = (0, react_1.useMemo)(() => [
        {
            icon: Expensicons_1.Gear,
            text: translate('common.settings'),
            onSelected: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_SETTINGS.getRoute(policyID)),
            value: CONST_1.default.POLICY.SECONDARY_ACTIONS.SETTINGS,
        },
    ], [policyID, translate]);
    const getHeaderButtons = () => (<react_native_1.View style={[styles.flexRow, styles.gap2, !shouldShowSelector && shouldUseNarrowLayout && styles.mb3, shouldShowSelector && shouldChangeLayout && styles.mt3]}>
            <Button_1.default success onPress={handleIssueCardPress} icon={Expensicons_1.Plus} text={translate('workspace.expensifyCard.issueCard')} style={shouldChangeLayout && styles.flex1}/>
            <ButtonWithDropdownMenu_1.default success={false} onPress={() => { }} shouldAlwaysShowDropdownMenu customText={translate('common.more')} options={secondaryActions} isSplitButton={false} wrapperStyle={styles.flexGrow0}/>
        </react_native_1.View>);
    const renderItem = (0, react_1.useCallback)(({ item, index }) => (<OfflineWithFeedback_1.default key={`${item.nameValuePairs?.cardTitle}_${index}`} pendingAction={item.pendingAction} errorRowStyles={styles.ph5} errors={item.errors} onClose={() => (0, PaymentMethods_1.clearDeletePaymentMethodError)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`, item.cardID)}>
                <Pressable_1.PressableWithFeedback role={CONST_1.default.ROLE.BUTTON} style={[styles.mh5, styles.br3, styles.mb3, styles.highlightBG]} accessibilityLabel="row" hoverStyle={[styles.hoveredComponentBG]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_DETAILS.getRoute(policyID, item.cardID.toString()))}>
                    <WorkspaceCardListRow_1.default lastFourPAN={item.lastFourPAN ?? ''} cardholder={personalDetails?.[item.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID]} limit={item.nameValuePairs?.unapprovedExpenseLimit ?? 0} name={item.nameValuePairs?.cardTitle ?? ''} currency={settlementCurrency} isVirtual={!!item.nameValuePairs?.isVirtual}/>
                </Pressable_1.PressableWithFeedback>
            </OfflineWithFeedback_1.default>), [personalDetails, settlementCurrency, policyID, workspaceAccountID, styles]);
    const isSearchEmpty = filteredSortedCards.length === 0 && inputValue.length > 0;
    const renderListHeader = (<>
            <react_native_1.View style={[styles.appBG, styles.flexShrink0, styles.flexGrow1]}>
                <WorkspaceCardListLabels_1.default policyID={policyID} cardSettings={cardSettings}/>
                {allCards.length > CONST_1.default.SEARCH_ITEM_LIMIT && (<SearchBar_1.default label={translate('workspace.expensifyCard.findCard')} inputValue={inputValue} onChangeText={setInputValue} shouldShowEmptyState={isSearchEmpty} style={[styles.mb0, styles.mt5]}/>)}
            </react_native_1.View>
            {!isSearchEmpty && <WorkspaceCardListHeader_1.default cardSettings={cardSettings}/>}
        </>);
    const handleBackButtonPress = () => {
        Navigation_1.default.popToSidebar();
        return true;
    };
    (0, useHandleBackButton_1.default)(handleBackButtonPress);
    return (<ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldShowOfflineIndicatorInWideScreen shouldEnableMaxHeight testID={WorkspaceExpensifyCardListPage.displayName}>
            <HeaderWithBackButton_1.default icon={Illustrations_1.HandCard} shouldUseHeadlineHeader title={translate('workspace.common.expensifyCard')} shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={handleBackButtonPress}>
                {!shouldShowSelector && !shouldUseNarrowLayout && isBankAccountVerified && getHeaderButtons()}
            </HeaderWithBackButton_1.default>
            {!shouldShowSelector && shouldUseNarrowLayout && isBankAccountVerified && <react_native_1.View style={styles.ph5}>{getHeaderButtons()}</react_native_1.View>}
            {shouldShowSelector && (<react_native_1.View style={[styles.w100, styles.ph5, styles.pb3, !shouldChangeLayout && [styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween]]}>
                    <FeedSelector_1.default onFeedSelect={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_SELECT_FEED.getRoute(policyID))} cardIcon={expensify_card_svg_1.default} feedName={translate('workspace.common.expensifyCard')} supportingText={(0, PolicyUtils_1.getDescriptionForPolicyDomainCard)(cardSettings?.domainName ?? '')}/>
                    {isBankAccountVerified && getHeaderButtons()}
                </react_native_1.View>)}
            {(0, EmptyObject_1.isEmptyObject)(cardsList) ? (<EmptyCardView_1.default isBankAccountVerified={isBankAccountVerified} policyID={policyID}/>) : (<ScrollView_1.default addBottomSafeAreaPadding showsVerticalScrollIndicator={false}>
                    <react_native_1.FlatList data={filteredSortedCards} renderItem={renderItem} ListHeaderComponent={renderListHeader} contentContainerStyle={[styles.flexGrow1, { minHeight: windowHeight - headerHeight + footerHeight }]} ListFooterComponent={<Text_1.default style={[styles.textMicroSupporting, styles.p5]} onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}>
                                {translate(isUkEuCurrencySupported ? 'workspace.expensifyCard.euUkDisclaimer' : 'workspace.expensifyCard.disclaimer')}
                            </Text_1.default>} ListFooterComponentStyle={[styles.flexGrow1, styles.justifyContentEnd]} keyboardShouldPersistTaps="handled"/>
                </ScrollView_1.default>)}
        </ScreenWrapper_1.default>);
}
WorkspaceExpensifyCardListPage.displayName = 'WorkspaceExpensifyCardListPage';
exports.default = WorkspaceExpensifyCardListPage;
