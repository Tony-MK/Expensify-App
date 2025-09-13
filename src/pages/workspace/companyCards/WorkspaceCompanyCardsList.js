"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Pressable_1 = require("@components/Pressable");
const SearchBar_1 = require("@components/SearchBar");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useSearchResults_1 = require("@hooks/useSearchResults");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspaceCompanyCardsFeedAddedEmptyPage_1 = require("./WorkspaceCompanyCardsFeedAddedEmptyPage");
const WorkspaceCompanyCardsListRow_1 = require("./WorkspaceCompanyCardsListRow");
function WorkspaceCompanyCardsList({ cardsList, policyID, handleAssignCard, isDisabledAssignCardButton, shouldShowGBDisclaimer }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [customCardNames] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_EXPENSIFY_COMPANY_CARDS_CUSTOM_NAMES, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(policyID);
    const allCards = (0, react_1.useMemo)(() => {
        const policyMembersAccountIDs = Object.values((0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList));
        return (0, CardUtils_1.getCardsByCardholderName)(cardsList, policyMembersAccountIDs);
    }, [cardsList, policy?.employeeList]);
    const filterCard = (0, react_1.useCallback)((card, searchInput) => (0, CardUtils_1.filterCardsByPersonalDetails)(card, searchInput, personalDetails), [personalDetails]);
    const sortCards = (0, react_1.useCallback)((cards) => (0, CardUtils_1.sortCardsByCardholderName)(cards, personalDetails, localeCompare), [personalDetails, localeCompare]);
    const [inputValue, setInputValue, filteredSortedCards] = (0, useSearchResults_1.default)(allCards, filterCard, sortCards, true);
    const renderItem = (0, react_1.useCallback)(({ item, index }) => {
        const cardID = Object.keys(cardsList ?? {}).find((id) => cardsList?.[id].cardID === item.cardID);
        const isCardDeleted = item.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
        return (<OfflineWithFeedback_1.default key={`${item.nameValuePairs?.cardTitle}_${index}`} errorRowStyles={styles.ph5} errors={item.errors} pendingAction={item.pendingAction}>
                    <Pressable_1.PressableWithFeedback role={CONST_1.default.ROLE.BUTTON} style={[styles.mh5, styles.br3, styles.mb3, styles.highlightBG]} accessibilityLabel="row" hoverStyle={styles.hoveredComponentBG} disabled={isCardDeleted} onPress={() => {
                if (!cardID || !item?.accountID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARD_DETAILS.getRoute(policyID, cardID, item.bank));
            }}>
                        <WorkspaceCompanyCardsListRow_1.default cardholder={personalDetails?.[item.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID]} cardNumber={item.lastFourPAN ?? ''} name={customCardNames?.[item.cardID] ?? (0, CardUtils_1.getDefaultCardName)(personalDetails?.[item.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID]?.firstName)}/>
                    </Pressable_1.PressableWithFeedback>
                </OfflineWithFeedback_1.default>);
    }, [cardsList, customCardNames, personalDetails, policyID, styles]);
    const isSearchEmpty = filteredSortedCards.length === 0 && inputValue.length > 0;
    const renderListHeader = (<>
            {allCards.length > CONST_1.default.SEARCH_ITEM_LIMIT && (<SearchBar_1.default label={translate('workspace.companyCards.findCard')} inputValue={inputValue} onChangeText={setInputValue} shouldShowEmptyState={isSearchEmpty} style={[styles.mt5]}/>)}
            {!isSearchEmpty && (<react_native_1.View style={[styles.flexRow, styles.appBG, styles.justifyContentBetween, styles.mh5, styles.gap5, styles.p4]}>
                    <Text_1.default numberOfLines={1} style={[styles.textMicroSupporting, styles.lh16]}>
                        {translate('common.name')}
                    </Text_1.default>
                    <Text_1.default numberOfLines={1} style={[styles.textMicroSupporting, styles.lh16]}>
                        {translate('workspace.expensifyCard.lastFour')}
                    </Text_1.default>
                </react_native_1.View>)}
        </>);
    if (allCards.length === 0) {
        return (<WorkspaceCompanyCardsFeedAddedEmptyPage_1.default shouldShowGBDisclaimer={shouldShowGBDisclaimer} handleAssignCard={handleAssignCard} isDisabledAssignCardButton={isDisabledAssignCardButton}/>);
    }
    return (<react_native_1.FlatList contentContainerStyle={styles.flexGrow1} data={filteredSortedCards} renderItem={renderItem} ListHeaderComponent={renderListHeader} keyboardShouldPersistTaps="handled"/>);
}
exports.default = WorkspaceCompanyCardsList;
