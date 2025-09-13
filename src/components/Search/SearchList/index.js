"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var Checkbox_1 = require("@components/Checkbox");
var Expensicons = require("@components/Icon/Expensicons");
var MenuItem_1 = require("@components/MenuItem");
var Modal_1 = require("@components/Modal");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var Pressable_1 = require("@components/Pressable");
var ScrollOffsetContextProvider_1 = require("@components/ScrollOffsetContextProvider");
var itemHeightCalculator_1 = require("@components/Search/itemHeightCalculator");
var itemHeights_1 = require("@components/Search/itemHeights");
var Text_1 = require("@components/Text");
var useInitialWindowDimensions_1 = require("@hooks/useInitialWindowDimensions");
var useKeyboardState_1 = require("@hooks/useKeyboardState");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var usePrevious_1 = require("@hooks/usePrevious");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
var navigationRef_1 = require("@libs/Navigation/navigationRef");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var BaseSearchList_1 = require("./BaseSearchList");
var easing = react_native_reanimated_1.Easing.bezier(0.76, 0.0, 0.24, 1.0);
var keyExtractor = function (item, index) { var _a; return (_a = item.keyForList) !== null && _a !== void 0 ? _a : "".concat(index); };
function isTransactionGroupListItemArray(data) {
    if (data.length <= 0) {
        return false;
    }
    var firstElement = data.at(0);
    return typeof firstElement === 'object' && 'transactions' in firstElement;
}
function SearchList(_a, ref) {
    var _b;
    var data = _a.data, ListItem = _a.ListItem, SearchTableHeader = _a.SearchTableHeader, onSelectRow = _a.onSelectRow, onCheckboxPress = _a.onCheckboxPress, canSelectMultiple = _a.canSelectMultiple, _c = _a.onScroll, onScroll = _c === void 0 ? function () { } : _c, onAllCheckboxPress = _a.onAllCheckboxPress, contentContainerStyle = _a.contentContainerStyle, onEndReachedThreshold = _a.onEndReachedThreshold, onEndReached = _a.onEndReached, containerStyle = _a.containerStyle, ListFooterComponent = _a.ListFooterComponent, shouldPreventDefaultFocusOnSelectRow = _a.shouldPreventDefaultFocusOnSelectRow, shouldPreventLongPressRow = _a.shouldPreventLongPressRow, queryJSON = _a.queryJSON, columns = _a.columns, isFocused = _a.isFocused, onViewableItemsChanged = _a.onViewableItemsChanged, onLayout = _a.onLayout, shouldAnimate = _a.shouldAnimate, _d = _a.estimatedItemSize, estimatedItemSize = _d === void 0 ? itemHeights_1.default.NARROW_WITHOUT_DRAWER.STANDARD : _d, isMobileSelectionModeEnabled = _a.isMobileSelectionModeEnabled, areAllOptionalColumnsHidden = _a.areAllOptionalColumnsHidden, violations = _a.violations;
    var styles = (0, useThemeStyles_1.default)();
    var _e = (0, useInitialWindowDimensions_1.default)(), initialHeight = _e.initialHeight, initialWidth = _e.initialWidth;
    var hash = queryJSON.hash, groupBy = queryJSON.groupBy, type = queryJSON.type;
    var flattenedItems = (0, react_1.useMemo)(function () {
        if (groupBy) {
            if (!isTransactionGroupListItemArray(data)) {
                return data;
            }
            return data.flatMap(function (item) { return item.transactions; });
        }
        return data;
    }, [data, groupBy]);
    var flattenedItemsWithoutPendingDelete = (0, react_1.useMemo)(function () { return flattenedItems.filter(function (t) { return (t === null || t === void 0 ? void 0 : t.pendingAction) !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE; }); }, [flattenedItems]);
    var selectedItemsLength = (0, react_1.useMemo)(function () {
        return flattenedItems.reduce(function (acc, item) {
            return (item === null || item === void 0 ? void 0 : item.isSelected) ? acc + 1 : acc;
        }, 0);
    }, [flattenedItems]);
    var translate = (0, useLocalize_1.default)().translate;
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var listRef = (0, react_1.useRef)(null);
    var isKeyboardShown = (0, useKeyboardState_1.default)().isKeyboardShown;
    var safeAreaPaddingBottomStyle = (0, useSafeAreaPaddings_1.default)().safeAreaPaddingBottomStyle;
    var prevDataLength = (0, usePrevious_1.default)(data.length);
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout here because there is a race condition that causes shouldUseNarrowLayout to change indefinitely in this component
    // See https://github.com/Expensify/App/issues/48675 for more details
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var _f = (0, useResponsiveLayout_1.default)(), isSmallScreenWidth = _f.isSmallScreenWidth, isLargeScreenWidth = _f.isLargeScreenWidth, shouldUseNarrowLayout = _f.shouldUseNarrowLayout;
    var _g = (0, react_1.useState)(false), isModalVisible = _g[0], setIsModalVisible = _g[1];
    var _h = (0, react_1.useState)(), longPressedItem = _h[0], setLongPressedItem = _h[1];
    var policies = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, {
        canBeMissing: true,
    })[0];
    var allReports = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false })[0];
    var accountID = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: function (s) { return s === null || s === void 0 ? void 0 : s.accountID; } })[0];
    var hasItemsBeingRemoved = prevDataLength && prevDataLength > data.length;
    var personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var userWalletTierName = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { selector: function (wallet) { return wallet === null || wallet === void 0 ? void 0 : wallet.tierName; }, canBeMissing: false })[0];
    var isUserValidated = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: function (account) { return account === null || account === void 0 ? void 0 : account.validated; }, canBeMissing: true })[0];
    var userBillingFundID = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BILLING_FUND_ID, { canBeMissing: true })[0];
    var route = (0, native_1.useRoute)();
    var getScrollOffset = (0, react_1.useContext)(ScrollOffsetContextProvider_1.ScrollOffsetContext).getScrollOffset;
    var handleLongPressRow = (0, react_1.useCallback)(function (item) {
        var _a;
        var currentRoute = (_a = navigationRef_1.default.current) === null || _a === void 0 ? void 0 : _a.getCurrentRoute();
        if (currentRoute && route.key !== currentRoute.key) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (shouldPreventLongPressRow || !isSmallScreenWidth || (item === null || item === void 0 ? void 0 : item.isDisabled) || (item === null || item === void 0 ? void 0 : item.isDisabledCheckbox)) {
            return;
        }
        // disable long press for empty expense reports
        if ('transactions' in item && item.transactions.length === 0) {
            return;
        }
        if (isMobileSelectionModeEnabled) {
            onCheckboxPress(item);
            return;
        }
        setLongPressedItem(item);
        setIsModalVisible(true);
    }, [route.key, shouldPreventLongPressRow, isSmallScreenWidth, isMobileSelectionModeEnabled, onCheckboxPress]);
    var turnOnSelectionMode = (0, react_1.useCallback)(function () {
        (0, MobileSelectionMode_1.turnOnMobileSelectionMode)();
        setIsModalVisible(false);
        if (onCheckboxPress && longPressedItem) {
            onCheckboxPress === null || onCheckboxPress === void 0 ? void 0 : onCheckboxPress(longPressedItem);
        }
    }, [longPressedItem, onCheckboxPress]);
    /**
     * Scrolls to the desired item index in the section list
     *
     * @param index - the index of the item to scroll to
     * @param animated - whether to animate the scroll
     */
    var scrollToIndex = (0, react_1.useCallback)(function (index, animated) {
        if (animated === void 0) { animated = true; }
        var item = data.at(index);
        if (!listRef.current || !item || index === -1) {
            return;
        }
        listRef.current.scrollToIndex({ index: index, animated: animated, viewOffset: variables_1.default.contentHeaderHeight });
    }, [data]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(function () {
        var offset = getScrollOffset(route);
        requestAnimationFrame(function () {
            if (!offset || !listRef.current) {
                return;
            }
            listRef.current.scrollToOffset({ offset: offset, animated: false });
        });
    }, [getScrollOffset, route]));
    (0, react_1.useImperativeHandle)(ref, function () { return ({ scrollToIndex: scrollToIndex }); }, [scrollToIndex]);
    var renderItem = (0, react_1.useCallback)(function (item, index, isItemFocused, onFocus) {
        var isDisabled = item.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
        var shouldApplyAnimation = shouldAnimate && index < data.length - 1;
        return (<react_native_reanimated_1.default.View exiting={shouldApplyAnimation && isFocused ? react_native_reanimated_1.FadeOutUp.duration(CONST_1.default.SEARCH.EXITING_ANIMATION_DURATION).easing(easing) : undefined} entering={undefined} style={styles.overflowHidden} layout={shouldApplyAnimation && hasItemsBeingRemoved && isFocused ? react_native_reanimated_1.LinearTransition.easing(easing).duration(CONST_1.default.SEARCH.EXITING_ANIMATION_DURATION) : undefined}>
                    <ListItem showTooltip isFocused={isItemFocused} onSelectRow={onSelectRow} onLongPressRow={handleLongPressRow} onCheckboxPress={onCheckboxPress} canSelectMultiple={canSelectMultiple} item={item} shouldPreventDefaultFocusOnSelectRow={shouldPreventDefaultFocusOnSelectRow} queryJSONHash={hash} columns={columns} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden} policies={policies} isDisabled={isDisabled} allReports={allReports} groupBy={groupBy} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} userBillingFundID={userBillingFundID} accountID={accountID} isOffline={isOffline} violations={violations} onFocus={onFocus}/>
                </react_native_reanimated_1.default.View>);
    }, [
        shouldAnimate,
        isFocused,
        data.length,
        styles.overflowHidden,
        hasItemsBeingRemoved,
        ListItem,
        onSelectRow,
        handleLongPressRow,
        columns,
        onCheckboxPress,
        canSelectMultiple,
        shouldPreventDefaultFocusOnSelectRow,
        hash,
        policies,
        allReports,
        groupBy,
        userWalletTierName,
        isUserValidated,
        personalDetails,
        userBillingFundID,
        accountID,
        isOffline,
        areAllOptionalColumnsHidden,
        violations,
    ]);
    var tableHeaderVisible = (canSelectMultiple || !!SearchTableHeader) && (!groupBy || groupBy === CONST_1.default.SEARCH.GROUP_BY.REPORTS);
    var selectAllButtonVisible = canSelectMultiple && !SearchTableHeader;
    var isSelectAllChecked = selectedItemsLength > 0 && selectedItemsLength === flattenedItemsWithoutPendingDelete.length;
    var getItemHeight = (0, react_1.useMemo)(function () {
        return (0, itemHeightCalculator_1.createItemHeightCalculator)({
            isLargeScreenWidth: isLargeScreenWidth,
            shouldUseNarrowLayout: shouldUseNarrowLayout,
            type: type,
        });
    }, [isLargeScreenWidth, shouldUseNarrowLayout, type]);
    var overrideItemLayout = (0, react_1.useCallback)(function (layout, item) {
        if (!layout) {
            return;
        }
        var height = getItemHeight(item);
        // eslint-disable-next-line no-param-reassign
        return (layout.size = height > 0 ? height : estimatedItemSize);
    }, [getItemHeight, estimatedItemSize]);
    var calculatedListHeight = (0, react_1.useMemo)(function () {
        return initialHeight - variables_1.default.contentHeaderHeight;
    }, [initialHeight]);
    var calculatedListWidth = (0, react_1.useMemo)(function () {
        if (shouldUseNarrowLayout) {
            return initialWidth;
        }
        if (isLargeScreenWidth) {
            return initialWidth - variables_1.default.navigationTabBarSize - variables_1.default.sideBarWithLHBWidth;
        }
        return initialWidth;
    }, [initialWidth, shouldUseNarrowLayout, isLargeScreenWidth]);
    var estimatedListSize = (0, react_1.useMemo)(function () {
        return {
            height: calculatedListHeight,
            width: calculatedListWidth,
        };
    }, [calculatedListHeight, calculatedListWidth]);
    return (<react_native_1.View style={[styles.flex1, !isKeyboardShown && safeAreaPaddingBottomStyle, containerStyle]}>
            {tableHeaderVisible && (<react_native_1.View style={[styles.searchListHeaderContainerStyle, styles.listTableHeader]}>
                    {canSelectMultiple && (<Checkbox_1.default accessibilityLabel={translate('workspace.people.selectAll')} isChecked={isSelectAllChecked} isIndeterminate={selectedItemsLength > 0 && selectedItemsLength !== flattenedItemsWithoutPendingDelete.length} onPress={function () {
                    onAllCheckboxPress();
                }} disabled={flattenedItems.length === 0}/>)}

                    {SearchTableHeader}

                    {selectAllButtonVisible && (<Pressable_1.PressableWithFeedback style={[styles.userSelectNone, styles.alignItemsCenter]} onPress={onAllCheckboxPress} accessibilityLabel={translate('workspace.people.selectAll')} role="button" accessibilityState={{ checked: isSelectAllChecked }} dataSet={_b = {}, _b[CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT] = true, _b}>
                            <Text_1.default style={[styles.textStrong, styles.ph3]}>{translate('workspace.people.selectAll')}</Text_1.default>
                        </Pressable_1.PressableWithFeedback>)}
                </react_native_1.View>)}
            <BaseSearchList_1.default data={data} renderItem={renderItem} onSelectRow={onSelectRow} keyExtractor={keyExtractor} onScroll={onScroll} showsVerticalScrollIndicator={false} ref={listRef} columns={columns} scrollToIndex={scrollToIndex} isFocused={isFocused} flattenedItemsLength={flattenedItems.length} onEndReached={onEndReached} onEndReachedThreshold={onEndReachedThreshold} ListFooterComponent={ListFooterComponent} onViewableItemsChanged={onViewableItemsChanged} onLayout={onLayout} removeClippedSubviews drawDistance={1000} estimatedItemSize={estimatedItemSize} overrideItemLayout={overrideItemLayout} estimatedListSize={estimatedListSize} contentContainerStyle={contentContainerStyle} calculatedListHeight={calculatedListHeight}/>
            <Modal_1.default isVisible={isModalVisible} type={CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED} onClose={function () { return setIsModalVisible(false); }} shouldPreventScrollOnFocus>
                <MenuItem_1.default title={translate('common.select')} icon={Expensicons.CheckSquare} onPress={turnOnSelectionMode}/>
            </Modal_1.default>
        </react_native_1.View>);
}
exports.default = (0, react_1.forwardRef)(SearchList);
