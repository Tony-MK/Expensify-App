"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SearchFilterPageFooterButtons_1 = require("@components/Search/SearchFilterPageFooterButtons");
const SelectionList_1 = require("@components/SelectionList");
const CardListItem_1 = require("@components/SelectionList/Search/CardListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const CardFeedUtils_1 = require("@libs/CardFeedUtils");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function SearchFiltersCardPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const [userCardList, userCardListMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const [workspaceCardFeeds, workspaceCardFeedsMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: true });
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const [searchAdvancedFiltersForm, searchAdvancedFiltersFormMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [selectedCards, setSelectedCards] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const generatedCards = (0, CardFeedUtils_1.generateSelectedCards)(userCardList, workspaceCardFeeds, searchAdvancedFiltersForm?.feed, searchAdvancedFiltersForm?.cardID);
        setSelectedCards(generatedCards);
    }, [searchAdvancedFiltersForm?.feed, searchAdvancedFiltersForm?.cardID, workspaceCardFeeds, userCardList]);
    const individualCardsSectionData = (0, react_1.useMemo)(() => (0, CardFeedUtils_1.buildCardsData)(workspaceCardFeeds ?? {}, userCardList ?? {}, personalDetails ?? {}, selectedCards, illustrations, false), [workspaceCardFeeds, userCardList, personalDetails, selectedCards, illustrations]);
    const closedCardsSectionData = (0, react_1.useMemo)(() => (0, CardFeedUtils_1.buildCardsData)(workspaceCardFeeds ?? {}, userCardList ?? {}, personalDetails ?? {}, selectedCards, illustrations, true), [workspaceCardFeeds, userCardList, personalDetails, selectedCards, illustrations]);
    const domainFeedsData = (0, react_1.useMemo)(() => (0, CardFeedUtils_1.getDomainFeedData)(workspaceCardFeeds), [workspaceCardFeeds]);
    const cardFeedsSectionData = (0, react_1.useMemo)(() => (0, CardFeedUtils_1.buildCardFeedsData)(workspaceCardFeeds ?? CONST_1.default.EMPTY_OBJECT, domainFeedsData, selectedCards, translate, illustrations), [domainFeedsData, workspaceCardFeeds, selectedCards, translate, illustrations]);
    const shouldShowSearchInput = cardFeedsSectionData.selected.length + cardFeedsSectionData.unselected.length + individualCardsSectionData.selected.length + individualCardsSectionData.unselected.length >
        CONST_1.default.COMPANY_CARDS.CARD_LIST_THRESHOLD;
    const searchFunction = (0, react_1.useCallback)((item) => !!item.text?.toLocaleLowerCase().includes(debouncedSearchTerm.toLocaleLowerCase()) ||
        !!item.lastFourPAN?.toLocaleLowerCase().includes(debouncedSearchTerm.toLocaleLowerCase()) ||
        !!item.cardName?.toLocaleLowerCase().includes(debouncedSearchTerm.toLocaleLowerCase()) ||
        (item.isVirtual && translate('workspace.expensifyCard.virtual').toLocaleLowerCase().includes(debouncedSearchTerm.toLocaleLowerCase())), [debouncedSearchTerm, translate]);
    const sections = (0, react_1.useMemo)(() => {
        if (searchAdvancedFiltersForm === undefined) {
            return [];
        }
        const newSections = [];
        const selectedItems = [...cardFeedsSectionData.selected, ...individualCardsSectionData.selected, ...closedCardsSectionData.selected];
        newSections.push({
            title: undefined,
            data: selectedItems.filter(searchFunction),
            shouldShow: selectedItems.length > 0,
        });
        newSections.push({
            title: translate('search.filters.card.cardFeeds'),
            data: cardFeedsSectionData.unselected.filter(searchFunction),
            shouldShow: cardFeedsSectionData.unselected.length > 0,
        });
        newSections.push({
            title: translate('search.filters.card.individualCards'),
            data: individualCardsSectionData.unselected.filter(searchFunction),
            shouldShow: individualCardsSectionData.unselected.length > 0,
        });
        newSections.push({
            title: translate('search.filters.card.closedCards'),
            data: closedCardsSectionData.unselected.filter(searchFunction),
            shouldShow: closedCardsSectionData.unselected.length > 0,
        });
        return newSections;
    }, [
        searchAdvancedFiltersForm,
        cardFeedsSectionData.selected,
        cardFeedsSectionData.unselected,
        individualCardsSectionData.selected,
        individualCardsSectionData.unselected,
        closedCardsSectionData.selected,
        closedCardsSectionData.unselected,
        searchFunction,
        translate,
    ]);
    const handleConfirmSelection = (0, react_1.useCallback)(() => {
        const feeds = cardFeedsSectionData.selected.map((feed) => feed.cardFeedKey);
        const cardsFromSelectedFeed = (0, CardFeedUtils_1.getSelectedCardsFromFeeds)(userCardList, workspaceCardFeeds, feeds);
        const IDs = selectedCards.filter((card) => !cardsFromSelectedFeed.includes(card));
        (0, Search_1.updateAdvancedFilters)({
            cardID: IDs,
            feed: feeds,
        });
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [userCardList, selectedCards, cardFeedsSectionData.selected, workspaceCardFeeds]);
    const updateNewCards = (0, react_1.useCallback)((item) => {
        if (!item.keyForList) {
            return;
        }
        const isCardFeed = item?.isCardFeed && item?.correspondingCards;
        if (item.isSelected) {
            const newCardsObject = selectedCards.filter((card) => (isCardFeed ? !item.correspondingCards?.includes(card) : card !== item.keyForList));
            setSelectedCards(newCardsObject);
        }
        else {
            const newCardsObject = isCardFeed ? [...selectedCards, ...(item?.correspondingCards ?? [])] : [...selectedCards, item.keyForList];
            setSelectedCards(newCardsObject);
        }
    }, [selectedCards]);
    const headerMessage = debouncedSearchTerm.trim() && sections.every((section) => !section.data.length) ? translate('common.noResultsFound') : '';
    const resetChanges = (0, react_1.useCallback)(() => {
        setSelectedCards([]);
    }, [setSelectedCards]);
    const footerContent = (0, react_1.useMemo)(() => (<SearchFilterPageFooterButtons_1.default applyChanges={handleConfirmSelection} resetChanges={resetChanges}/>), [resetChanges, handleConfirmSelection]);
    return (<ScreenWrapper_1.default testID={SearchFiltersCardPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} shouldEnableMaxHeight>
            {({ didScreenTransitionEnd }) => (<>
                    <HeaderWithBackButton_1.default title={translate('common.card')} onBackButtonPress={() => {
                Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
            }}/>
                    <react_native_1.View style={[styles.flex1]}>
                        <SelectionList_1.default sections={sections} onSelectRow={updateNewCards} footerContent={footerContent} headerMessage={headerMessage} shouldStopPropagation shouldShowTooltips canSelectMultiple shouldPreventDefaultFocusOnSelectRow={false} shouldKeepFocusedItemAtTopOfViewableArea={false} ListItem={CardListItem_1.default} shouldShowTextInput={shouldShowSearchInput} textInputLabel={shouldShowSearchInput ? translate('common.search') : undefined} textInputValue={searchTerm} onChangeText={(value) => {
                setSearchTerm(value);
            }} showLoadingPlaceholder={(0, isLoadingOnyxValue_1.default)(userCardListMetadata, workspaceCardFeedsMetadata, searchAdvancedFiltersFormMetadata) || !didScreenTransitionEnd}/>
                    </react_native_1.View>
                </>)}
        </ScreenWrapper_1.default>);
}
SearchFiltersCardPage.displayName = 'SearchFiltersCardPage';
exports.default = SearchFiltersCardPage;
