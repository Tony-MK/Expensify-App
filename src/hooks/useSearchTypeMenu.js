"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useSearchTypeMenu;
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
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
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const useDeleteSavedSearch_1 = require("./useDeleteSavedSearch");
const useLocalize_1 = require("./useLocalize");
const useOnyx_1 = require("./useOnyx");
const useSearchTypeMenuSections_1 = require("./useSearchTypeMenuSections");
const useSingleExecution_1 = require("./useSingleExecution");
const useTheme_1 = require("./useTheme");
const useThemeStyles_1 = require("./useThemeStyles");
const useWindowDimensions_1 = require("./useWindowDimensions");
function useSearchTypeMenu(queryJSON) {
    const { hash, similarSearchHash } = queryJSON;
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { singleExecution } = (0, useSingleExecution_1.default)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { typeMenuSections } = (0, useSearchTypeMenuSections_1.default)();
    const { showDeleteModal, DeleteConfirmModal } = (0, useDeleteSavedSearch_1.default)();
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [reports = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const taxRates = (0, PolicyUtils_1.getAllTaxRates)();
    const [userCardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const [workspaceCardFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: true });
    const [savedSearches] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SAVED_SEARCHES, { canBeMissing: true });
    const [isPopoverVisible, setIsPopoverVisible] = (0, react_1.useState)(false);
    const allCards = (0, react_1.useMemo)(() => (0, CardUtils_1.mergeCardListWithWorkspaceFeeds)(workspaceCardFeeds ?? CONST_1.default.EMPTY_OBJECT, userCardList), [userCardList, workspaceCardFeeds]);
    const [allFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER, { canBeMissing: true });
    // this is a performance fix, rendering popover menu takes a lot of time and we don't need this component initially, that's why we postpone rendering it until everything else is rendered
    const [delayPopoverMenuFirstRender, setDelayPopoverMenuFirstRender] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        setTimeout(() => {
            setDelayPopoverMenuFirstRender(false);
        }, 100);
    }, []);
    const closeMenu = (0, react_1.useCallback)(() => {
        setIsPopoverVisible(false);
    }, []);
    const getOverflowMenu = (0, react_1.useCallback)((itemName, itemHash, itemQuery) => (0, SearchUIUtils_1.getOverflowMenu)(itemName, itemHash, itemQuery, showDeleteModal, true, closeMenu), [showDeleteModal, closeMenu]);
    const { savedSearchesMenuItems, isSavedSearchActive } = (0, react_1.useMemo)(() => {
        let savedSearchFocused = false;
        if (!savedSearches) {
            return {
                isSavedSearchActive: false,
                savedSearchesMenuItems: [],
            };
        }
        const menuItems = Object.entries(savedSearches).map(([key, item], index) => {
            let savedSearchTitle = item.name;
            if (savedSearchTitle === item.query) {
                const jsonQuery = (0, SearchQueryUtils_1.buildSearchQueryJSON)(item.query) ?? {};
                savedSearchTitle = (0, SearchQueryUtils_1.buildUserReadableQueryString)(jsonQuery, personalDetails, reports, taxRates, allCards, allFeeds, allPolicies);
            }
            const isItemFocused = Number(key) === hash;
            const baseMenuItem = (0, SearchUIUtils_1.createBaseSavedSearchMenuItem)(item, key, index, savedSearchTitle, isItemFocused);
            savedSearchFocused || (savedSearchFocused = isItemFocused);
            return {
                ...baseMenuItem,
                onSelected: () => {
                    (0, Search_1.clearAllFilters)();
                    Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: item?.query ?? '', name: item?.name }));
                },
                rightComponent: (<ThreeDotsMenu_1.default menuItems={getOverflowMenu(baseMenuItem.title ?? '', Number(baseMenuItem.hash ?? ''), item.query ?? '')} anchorPosition={{ horizontal: 0, vertical: 380 }} anchorAlignment={{
                        horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                        vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
                    }} disabled={item.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE}/>),
                isSelected: false,
                shouldCallAfterModalHide: true,
                icon: Expensicons.Bookmark,
                iconWidth: variables_1.default.iconSizeNormal,
                iconHeight: variables_1.default.iconSizeNormal,
                shouldIconUseAutoWidthStyle: false,
                text: baseMenuItem.title ?? '',
            };
        });
        return {
            savedSearchesMenuItems: menuItems,
            isSavedSearchActive: savedSearchFocused,
        };
    }, [savedSearches, hash, getOverflowMenu, personalDetails, reports, taxRates, allCards, allFeeds, allPolicies]);
    const activeItemIndex = (0, react_1.useMemo)(() => {
        // If we have a suggested search, then none of the menu items are active
        if (isSavedSearchActive) {
            return -1;
        }
        const flattenedMenuItems = typeMenuSections.map((section) => section.menuItems).flat();
        return flattenedMenuItems.findIndex((item) => item.similarSearchHash === similarSearchHash);
    }, [similarSearchHash, isSavedSearchActive, typeMenuSections]);
    const popoverMenuItems = (0, react_1.useMemo)(() => {
        return typeMenuSections
            .map((section, sectionIndex) => {
            const sectionItems = [
                {
                    shouldShowBasicTitle: true,
                    text: translate(section.translationPath),
                    style: [styles.textSupporting],
                    disabled: true,
                    interactive: false,
                    shouldUseDefaultCursorWhenDisabled: true,
                },
            ];
            if (section.translationPath === 'search.savedSearchesMenuItemTitle') {
                sectionItems.push(...savedSearchesMenuItems);
            }
            else {
                section.menuItems.forEach((item, itemIndex) => {
                    const previousItemCount = typeMenuSections.slice(0, sectionIndex).reduce((acc, sec) => acc + sec.menuItems.length, 0);
                    const flattenedIndex = previousItemCount + itemIndex;
                    const isSelected = flattenedIndex === activeItemIndex;
                    sectionItems.push({
                        text: translate(item.translationPath),
                        isSelected,
                        icon: item.icon,
                        ...(isSelected ? { iconFill: theme.iconSuccessFill } : {}),
                        iconRight: Expensicons.Checkmark,
                        shouldShowRightIcon: isSelected,
                        success: isSelected,
                        containerStyle: isSelected ? [{ backgroundColor: theme.border }] : undefined,
                        shouldCallAfterModalHide: true,
                        onSelected: singleExecution(() => {
                            (0, Search_1.clearAllFilters)();
                            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: item.searchQuery }));
                        }),
                    });
                });
            }
            return sectionItems;
        })
            .flat();
    }, [typeMenuSections, savedSearchesMenuItems, translate, styles.textSupporting, activeItemIndex, theme.iconSuccessFill, theme.border, singleExecution]);
    const openMenu = (0, react_1.useCallback)(() => {
        setIsPopoverVisible(true);
    }, []);
    return {
        isPopoverVisible,
        delayPopoverMenuFirstRender,
        openMenu,
        closeMenu,
        allMenuItems: popoverMenuItems,
        DeleteConfirmModal,
        theme,
        styles,
        windowHeight,
    };
}
