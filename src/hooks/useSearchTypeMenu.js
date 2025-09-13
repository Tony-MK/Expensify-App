"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useSearchTypeMenu;
var react_1 = require("react");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
var Search_1 = require("@libs/actions/Search");
var CardUtils_1 = require("@libs/CardUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
var SearchUIUtils_1 = require("@libs/SearchUIUtils");
var variables_1 = require("@styles/variables");
var Expensicons = require("@src/components/Icon/Expensicons");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var useDeleteSavedSearch_1 = require("./useDeleteSavedSearch");
var useLocalize_1 = require("./useLocalize");
var useOnyx_1 = require("./useOnyx");
var useSearchTypeMenuSections_1 = require("./useSearchTypeMenuSections");
var useSingleExecution_1 = require("./useSingleExecution");
var useTheme_1 = require("./useTheme");
var useThemeStyles_1 = require("./useThemeStyles");
var useWindowDimensions_1 = require("./useWindowDimensions");
function useSearchTypeMenu(queryJSON) {
    var hash = queryJSON.hash, similarSearchHash = queryJSON.similarSearchHash;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var singleExecution = (0, useSingleExecution_1.default)().singleExecution;
    var windowHeight = (0, useWindowDimensions_1.default)().windowHeight;
    var translate = (0, useLocalize_1.default)().translate;
    var typeMenuSections = (0, useSearchTypeMenuSections_1.default)().typeMenuSections;
    var _a = (0, useDeleteSavedSearch_1.default)(), showDeleteModal = _a.showDeleteModal, DeleteConfirmModal = _a.DeleteConfirmModal;
    var allPolicies = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true })[0];
    var personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var _b = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true })[0], reports = _b === void 0 ? (0, EmptyObject_1.getEmptyObject)() : _b;
    var taxRates = (0, PolicyUtils_1.getAllTaxRates)();
    var userCardList = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true })[0];
    var workspaceCardFeeds = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: true })[0];
    var savedSearches = (0, useOnyx_1.default)(ONYXKEYS_1.default.SAVED_SEARCHES, { canBeMissing: true })[0];
    var _c = (0, react_1.useState)(false), isPopoverVisible = _c[0], setIsPopoverVisible = _c[1];
    var allCards = (0, react_1.useMemo)(function () { return (0, CardUtils_1.mergeCardListWithWorkspaceFeeds)(workspaceCardFeeds !== null && workspaceCardFeeds !== void 0 ? workspaceCardFeeds : CONST_1.default.EMPTY_OBJECT, userCardList); }, [userCardList, workspaceCardFeeds]);
    var allFeeds = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER, { canBeMissing: true })[0];
    // this is a performance fix, rendering popover menu takes a lot of time and we don't need this component initially, that's why we postpone rendering it until everything else is rendered
    var _d = (0, react_1.useState)(true), delayPopoverMenuFirstRender = _d[0], setDelayPopoverMenuFirstRender = _d[1];
    (0, react_1.useEffect)(function () {
        setTimeout(function () {
            setDelayPopoverMenuFirstRender(false);
        }, 100);
    }, []);
    var closeMenu = (0, react_1.useCallback)(function () {
        setIsPopoverVisible(false);
    }, []);
    var getOverflowMenu = (0, react_1.useCallback)(function (itemName, itemHash, itemQuery) { return (0, SearchUIUtils_1.getOverflowMenu)(itemName, itemHash, itemQuery, showDeleteModal, true, closeMenu); }, [showDeleteModal, closeMenu]);
    var _e = (0, react_1.useMemo)(function () {
        var savedSearchFocused = false;
        if (!savedSearches) {
            return {
                isSavedSearchActive: false,
                savedSearchesMenuItems: [],
            };
        }
        var menuItems = Object.entries(savedSearches).map(function (_a, index) {
            var _b, _c, _d, _e, _f;
            var key = _a[0], item = _a[1];
            var savedSearchTitle = item.name;
            if (savedSearchTitle === item.query) {
                var jsonQuery = (_b = (0, SearchQueryUtils_1.buildSearchQueryJSON)(item.query)) !== null && _b !== void 0 ? _b : {};
                savedSearchTitle = (0, SearchQueryUtils_1.buildUserReadableQueryString)(jsonQuery, personalDetails, reports, taxRates, allCards, allFeeds, allPolicies);
            }
            var isItemFocused = Number(key) === hash;
            var baseMenuItem = (0, SearchUIUtils_1.createBaseSavedSearchMenuItem)(item, key, index, savedSearchTitle, isItemFocused);
            savedSearchFocused || (savedSearchFocused = isItemFocused);
            return __assign(__assign({}, baseMenuItem), { onSelected: function () {
                    var _a;
                    (0, Search_1.clearAllFilters)();
                    Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: (_a = item === null || item === void 0 ? void 0 : item.query) !== null && _a !== void 0 ? _a : '', name: item === null || item === void 0 ? void 0 : item.name }));
                }, rightComponent: (<ThreeDotsMenu_1.default menuItems={getOverflowMenu((_c = baseMenuItem.title) !== null && _c !== void 0 ? _c : '', Number((_d = baseMenuItem.hash) !== null && _d !== void 0 ? _d : ''), (_e = item.query) !== null && _e !== void 0 ? _e : '')} anchorPosition={{ horizontal: 0, vertical: 380 }} anchorAlignment={{
                        horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                        vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
                    }} disabled={item.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE}/>), isSelected: false, shouldCallAfterModalHide: true, icon: Expensicons.Bookmark, iconWidth: variables_1.default.iconSizeNormal, iconHeight: variables_1.default.iconSizeNormal, shouldIconUseAutoWidthStyle: false, text: (_f = baseMenuItem.title) !== null && _f !== void 0 ? _f : '' });
        });
        return {
            savedSearchesMenuItems: menuItems,
            isSavedSearchActive: savedSearchFocused,
        };
    }, [savedSearches, hash, getOverflowMenu, personalDetails, reports, taxRates, allCards, allFeeds, allPolicies]), savedSearchesMenuItems = _e.savedSearchesMenuItems, isSavedSearchActive = _e.isSavedSearchActive;
    var activeItemIndex = (0, react_1.useMemo)(function () {
        // If we have a suggested search, then none of the menu items are active
        if (isSavedSearchActive) {
            return -1;
        }
        var flattenedMenuItems = typeMenuSections.map(function (section) { return section.menuItems; }).flat();
        return flattenedMenuItems.findIndex(function (item) { return item.similarSearchHash === similarSearchHash; });
    }, [similarSearchHash, isSavedSearchActive, typeMenuSections]);
    var popoverMenuItems = (0, react_1.useMemo)(function () {
        return typeMenuSections
            .map(function (section, sectionIndex) {
            var sectionItems = [
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
                sectionItems.push.apply(sectionItems, savedSearchesMenuItems);
            }
            else {
                section.menuItems.forEach(function (item, itemIndex) {
                    var previousItemCount = typeMenuSections.slice(0, sectionIndex).reduce(function (acc, sec) { return acc + sec.menuItems.length; }, 0);
                    var flattenedIndex = previousItemCount + itemIndex;
                    var isSelected = flattenedIndex === activeItemIndex;
                    sectionItems.push(__assign(__assign({ text: translate(item.translationPath), isSelected: isSelected, icon: item.icon }, (isSelected ? { iconFill: theme.iconSuccessFill } : {})), { iconRight: Expensicons.Checkmark, shouldShowRightIcon: isSelected, success: isSelected, containerStyle: isSelected ? [{ backgroundColor: theme.border }] : undefined, shouldCallAfterModalHide: true, onSelected: singleExecution(function () {
                            (0, Search_1.clearAllFilters)();
                            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: item.searchQuery }));
                        }) }));
                });
            }
            return sectionItems;
        })
            .flat();
    }, [typeMenuSections, savedSearchesMenuItems, translate, styles.textSupporting, activeItemIndex, theme.iconSuccessFill, theme.border, singleExecution]);
    var openMenu = (0, react_1.useCallback)(function () {
        setIsPopoverVisible(true);
    }, []);
    return {
        isPopoverVisible: isPopoverVisible,
        delayPopoverMenuFirstRender: delayPopoverMenuFirstRender,
        openMenu: openMenu,
        closeMenu: closeMenu,
        allMenuItems: popoverMenuItems,
        DeleteConfirmModal: DeleteConfirmModal,
        theme: theme,
        styles: styles,
        windowHeight: windowHeight,
    };
}
