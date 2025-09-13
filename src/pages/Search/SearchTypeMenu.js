"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemList_1 = require("@components/MenuItemList");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ProductTrainingContext_1 = require("@components/ProductTrainingContext");
const ScrollOffsetContextProvider_1 = require("@components/ScrollOffsetContextProvider");
const ScrollView_1 = require("@components/ScrollView");
const SearchContext_1 = require("@components/Search/SearchContext");
const Text_1 = require("@components/Text");
const useDeleteSavedSearch_1 = require("@hooks/useDeleteSavedSearch");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSearchTypeMenuSections_1 = require("@hooks/useSearchTypeMenuSections");
const useSingleExecution_1 = require("@hooks/useSingleExecution");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const variables_1 = require("@styles/variables");
const Expensicons = require("@src/components/Icon/Expensicons");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SavedSearchItemThreeDotMenu_1 = require("./SavedSearchItemThreeDotMenu");
function SearchTypeMenu({ queryJSON }) {
    const { hash, similarSearchHash } = queryJSON ?? {};
    const styles = (0, useThemeStyles_1.default)();
    const { singleExecution } = (0, useSingleExecution_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [savedSearches] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SAVED_SEARCHES, { canBeMissing: true });
    const { typeMenuSections } = (0, useSearchTypeMenuSections_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    const { shouldShowProductTrainingTooltip: shouldShowSavedSearchTooltip, renderProductTrainingTooltip: renderSavedSearchTooltip, hideProductTrainingTooltip: hideSavedSearchTooltip, } = (0, ProductTrainingContext_1.useProductTrainingContext)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.RENAME_SAVED_SEARCH, !!typeMenuSections.find((section) => section.translationPath === 'search.savedSearchesMenuItemTitle') && isFocused);
    const { shouldShowProductTrainingTooltip: shouldShowExpenseReportsTypeTooltip, renderProductTrainingTooltip: renderExpenseReportsTypeTooltip, hideProductTrainingTooltip: hideExpenseReportsTypeTooltip, } = (0, ProductTrainingContext_1.useProductTrainingContext)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.EXPENSE_REPORTS_FILTER, true);
    const { showDeleteModal, DeleteConfirmModal } = (0, useDeleteSavedSearch_1.default)();
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const [userCardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const [workspaceCardFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: true });
    const allCards = (0, react_1.useMemo)(() => (0, CardUtils_1.mergeCardListWithWorkspaceFeeds)(workspaceCardFeeds ?? CONST_1.default.EMPTY_OBJECT, userCardList), [userCardList, workspaceCardFeeds]);
    const [allFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER, { canBeMissing: true });
    const taxRates = (0, PolicyUtils_1.getAllTaxRates)();
    const { clearSelectedTransactions } = (0, SearchContext_1.useSearchContext)();
    const initialSearchKeys = (0, react_1.useRef)([]);
    // The first time we render all of the sections the user can see, we need to mark these as 'rendered', such that we
    // dont animate them in. We only animate in items that a user gains access to later on
    (0, react_1.useEffect)(() => {
        if (initialSearchKeys.current.length) {
            return;
        }
        initialSearchKeys.current = typeMenuSections.flatMap((section) => {
            return section.menuItems.map((item) => item.key);
        });
    }, [typeMenuSections]);
    const getOverflowMenu = (0, react_1.useCallback)((itemName, itemHash, itemQuery) => (0, SearchUIUtils_1.getOverflowMenu)(itemName, itemHash, itemQuery, showDeleteModal), [showDeleteModal]);
    const createSavedSearchMenuItem = (0, react_1.useCallback)((item, key, index) => {
        let title = item.name;
        if (title === item.query) {
            const jsonQuery = (0, SearchQueryUtils_1.buildSearchQueryJSON)(item.query) ?? {};
            title = (0, SearchQueryUtils_1.buildUserReadableQueryString)(jsonQuery, personalDetails, reports, taxRates, allCards, allFeeds, allPolicies);
        }
        const isItemFocused = Number(key) === hash;
        const baseMenuItem = (0, SearchUIUtils_1.createBaseSavedSearchMenuItem)(item, key, index, title, isItemFocused);
        return {
            ...baseMenuItem,
            onPress: () => {
                (0, Search_1.clearAllFilters)();
                Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: item?.query ?? '', name: item?.name }));
            },
            rightComponent: (<SavedSearchItemThreeDotMenu_1.default menuItems={getOverflowMenu(title, Number(key), item.query)} isDisabledItem={item.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE} hideProductTrainingTooltip={index === 0 && shouldShowSavedSearchTooltip ? hideSavedSearchTooltip : undefined} shouldRenderTooltip={index === 0 && shouldShowSavedSearchTooltip} renderTooltipContent={renderSavedSearchTooltip}/>),
            style: [styles.alignItemsCenter],
            tooltipAnchorAlignment: {
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            },
            tooltipShiftHorizontal: variables_1.default.savedSearchShiftHorizontal,
            tooltipShiftVertical: variables_1.default.savedSearchShiftVertical,
            tooltipWrapperStyle: [styles.mh4, styles.pv2, styles.productTrainingTooltipWrapper],
            renderTooltipContent: renderSavedSearchTooltip,
        };
    }, [
        hash,
        getOverflowMenu,
        shouldShowSavedSearchTooltip,
        hideSavedSearchTooltip,
        renderSavedSearchTooltip,
        styles.alignItemsCenter,
        styles.mh4,
        styles.pv2,
        styles.productTrainingTooltipWrapper,
        personalDetails,
        reports,
        taxRates,
        allCards,
        allFeeds,
        allPolicies,
    ]);
    const route = (0, native_1.useRoute)();
    const scrollViewRef = (0, react_1.useRef)(null);
    const { saveScrollOffset, getScrollOffset } = (0, react_1.useContext)(ScrollOffsetContextProvider_1.ScrollOffsetContext);
    const onScroll = (0, react_1.useCallback)((e) => {
        // If the layout measurement is 0, it means the flash list is not displayed but the onScroll may be triggered with offset value 0.
        // We should ignore this case.
        if (e.nativeEvent.layoutMeasurement.height === 0) {
            return;
        }
        saveScrollOffset(route, e.nativeEvent.contentOffset.y);
    }, [route, saveScrollOffset]);
    (0, react_1.useLayoutEffect)(() => {
        const scrollOffset = getScrollOffset(route);
        if (!scrollOffset || !scrollViewRef.current) {
            return;
        }
        scrollViewRef.current.scrollTo({ y: scrollOffset, animated: false });
    }, [getScrollOffset, route]);
    const { savedSearchesMenuItems, isSavedSearchActive } = (0, react_1.useMemo)(() => {
        let savedSearchFocused = false;
        if (!savedSearches) {
            return {
                isSavedSearchActive: false,
                savedSearchesMenuItems: [],
            };
        }
        const menuItems = Object.entries(savedSearches).map(([key, item], index) => {
            const baseMenuItem = createSavedSearchMenuItem(item, key, index);
            savedSearchFocused || (savedSearchFocused = !!baseMenuItem.focused);
            return baseMenuItem;
        });
        return {
            savedSearchesMenuItems: menuItems,
            isSavedSearchActive: savedSearchFocused,
        };
    }, [createSavedSearchMenuItem, savedSearches]);
    const renderSavedSearchesSection = (0, react_1.useCallback)((menuItems) => (<MenuItemList_1.default menuItems={menuItems} wrapperStyle={styles.sectionMenuItem} icon={Expensicons.Bookmark} iconWidth={variables_1.default.iconSizeNormal} iconHeight={variables_1.default.iconSizeNormal} shouldUseSingleExecution/>), [styles]);
    const activeItemIndex = (0, react_1.useMemo)(() => {
        // If we have a suggested search, then none of the menu items are active
        if (isSavedSearchActive) {
            return -1;
        }
        const flattenedMenuItems = typeMenuSections.map((section) => section.menuItems).flat();
        return flattenedMenuItems.findIndex((item) => item.similarSearchHash === similarSearchHash);
    }, [similarSearchHash, isSavedSearchActive, typeMenuSections]);
    return (<ScrollView_1.default onScroll={onScroll} ref={scrollViewRef} showsVerticalScrollIndicator={false}>
            <react_native_1.View style={[styles.pb4, styles.mh3, styles.gap4]}>
                {typeMenuSections.map((section, sectionIndex) => (<react_native_1.View key={section.translationPath}>
                        <Text_1.default style={styles.sectionTitle}>{translate(section.translationPath)}</Text_1.default>

                        {section.translationPath === 'search.savedSearchesMenuItemTitle' ? (<>
                                {renderSavedSearchesSection(savedSearchesMenuItems)}
                                {/* DeleteConfirmModal is a stable JSX element returned by the hook.
                Returning the element directly keeps the component identity across re-renders so React
                can play its exit animation instead of removing it instantly. */}
                                {DeleteConfirmModal}
                            </>) : (<>
                                {section.menuItems.map((item, itemIndex) => {
                    const previousItemCount = typeMenuSections.slice(0, sectionIndex).reduce((acc, sec) => acc + sec.menuItems.length, 0);
                    const flattenedIndex = previousItemCount + itemIndex;
                    const focused = activeItemIndex === flattenedIndex;
                    const shouldShowTooltip = item.translationPath === 'common.reports' && !focused && shouldShowExpenseReportsTypeTooltip;
                    const onPress = singleExecution(() => {
                        if (shouldShowTooltip) {
                            hideExpenseReportsTypeTooltip();
                        }
                        (0, Search_1.clearAllFilters)();
                        clearSelectedTransactions();
                        Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: item.searchQuery }));
                    });
                    const isInitialItem = !initialSearchKeys.current.length || initialSearchKeys.current.includes(item.key);
                    return (<react_native_reanimated_1.default.View key={item.translationPath} entering={!isInitialItem ? react_native_reanimated_1.FadeIn : undefined}>
                                            <MenuItem_1.default key={item.key} disabled={false} interactive title={translate(item.translationPath)} icon={item.icon} iconWidth={variables_1.default.iconSizeNormal} iconHeight={variables_1.default.iconSizeNormal} wrapperStyle={styles.sectionMenuItem} focused={focused} onPress={onPress} shouldIconUseAutoWidthStyle shouldRenderTooltip={shouldShowTooltip} renderTooltipContent={renderExpenseReportsTypeTooltip} tooltipAnchorAlignment={{
                            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
                        }} tooltipShiftHorizontal={variables_1.default.expenseReportsTypeTooltipShiftHorizontal} tooltipWrapperStyle={styles.productTrainingTooltipWrapper} onEducationTooltipPress={onPress}/>
                                        </react_native_reanimated_1.default.View>);
                })}
                            </>)}
                    </react_native_1.View>))}
            </react_native_1.View>
        </ScrollView_1.default>);
}
SearchTypeMenu.displayName = 'SearchTypeMenu';
exports.default = SearchTypeMenu;
