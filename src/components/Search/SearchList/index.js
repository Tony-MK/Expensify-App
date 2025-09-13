"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const Checkbox_1 = require("@components/Checkbox");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const Modal_1 = require("@components/Modal");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const Pressable_1 = require("@components/Pressable");
const ScrollOffsetContextProvider_1 = require("@components/ScrollOffsetContextProvider");
const itemHeightCalculator_1 = require("@components/Search/itemHeightCalculator");
const itemHeights_1 = require("@components/Search/itemHeights");
const Text_1 = require("@components/Text");
const useInitialWindowDimensions_1 = require("@hooks/useInitialWindowDimensions");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const BaseSearchList_1 = require("./BaseSearchList");
const easing = react_native_reanimated_1.Easing.bezier(0.76, 0.0, 0.24, 1.0);
const keyExtractor = (item, index) => item.keyForList ?? `${index}`;
function isTransactionGroupListItemArray(data) {
    if (data.length <= 0) {
        return false;
    }
    const firstElement = data.at(0);
    return typeof firstElement === 'object' && 'transactions' in firstElement;
}
function SearchList({ data, ListItem, SearchTableHeader, onSelectRow, onCheckboxPress, canSelectMultiple, onScroll = () => { }, onAllCheckboxPress, contentContainerStyle, onEndReachedThreshold, onEndReached, containerStyle, ListFooterComponent, shouldPreventDefaultFocusOnSelectRow, shouldPreventLongPressRow, queryJSON, columns, isFocused, onViewableItemsChanged, onLayout, shouldAnimate, estimatedItemSize = itemHeights_1.default.NARROW_WITHOUT_DRAWER.STANDARD, isMobileSelectionModeEnabled, areAllOptionalColumnsHidden, violations, }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const { initialHeight, initialWidth } = (0, useInitialWindowDimensions_1.default)();
    const { hash, groupBy, type } = queryJSON;
    const flattenedItems = (0, react_1.useMemo)(() => {
        if (groupBy) {
            if (!isTransactionGroupListItemArray(data)) {
                return data;
            }
            return data.flatMap((item) => item.transactions);
        }
        return data;
    }, [data, groupBy]);
    const flattenedItemsWithoutPendingDelete = (0, react_1.useMemo)(() => flattenedItems.filter((t) => t?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE), [flattenedItems]);
    const selectedItemsLength = (0, react_1.useMemo)(() => flattenedItems.reduce((acc, item) => {
        return item?.isSelected ? acc + 1 : acc;
    }, 0), [flattenedItems]);
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const listRef = (0, react_1.useRef)(null);
    const { isKeyboardShown } = (0, useKeyboardState_1.default)();
    const { safeAreaPaddingBottomStyle } = (0, useSafeAreaPaddings_1.default)();
    const prevDataLength = (0, usePrevious_1.default)(data.length);
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout here because there is a race condition that causes shouldUseNarrowLayout to change indefinitely in this component
    // See https://github.com/Expensify/App/issues/48675 for more details
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth, isLargeScreenWidth, shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [isModalVisible, setIsModalVisible] = (0, react_1.useState)(false);
    const [longPressedItem, setLongPressedItem] = (0, react_1.useState)();
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, {
        canBeMissing: true,
    });
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [accountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: (s) => s?.accountID });
    const hasItemsBeingRemoved = prevDataLength && prevDataLength > data.length;
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [userWalletTierName] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { selector: (wallet) => wallet?.tierName, canBeMissing: false });
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: true });
    const [userBillingFundID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BILLING_FUND_ID, { canBeMissing: true });
    const route = (0, native_1.useRoute)();
    const { getScrollOffset } = (0, react_1.useContext)(ScrollOffsetContextProvider_1.ScrollOffsetContext);
    const handleLongPressRow = (0, react_1.useCallback)((item) => {
        const currentRoute = navigationRef_1.default.current?.getCurrentRoute();
        if (currentRoute && route.key !== currentRoute.key) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (shouldPreventLongPressRow || !isSmallScreenWidth || item?.isDisabled || item?.isDisabledCheckbox) {
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
    const turnOnSelectionMode = (0, react_1.useCallback)(() => {
        (0, MobileSelectionMode_1.turnOnMobileSelectionMode)();
        setIsModalVisible(false);
        if (onCheckboxPress && longPressedItem) {
            onCheckboxPress?.(longPressedItem);
        }
    }, [longPressedItem, onCheckboxPress]);
    /**
     * Scrolls to the desired item index in the section list
     *
     * @param index - the index of the item to scroll to
     * @param animated - whether to animate the scroll
     */
    const scrollToIndex = (0, react_1.useCallback)((index, animated = true) => {
        const item = data.at(index);
        if (!listRef.current || !item || index === -1) {
            return;
        }
        listRef.current.scrollToIndex({ index, animated, viewOffset: variables_1.default.contentHeaderHeight });
    }, [data]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        const offset = getScrollOffset(route);
        requestAnimationFrame(() => {
            if (!offset || !listRef.current) {
                return;
            }
            listRef.current.scrollToOffset({ offset, animated: false });
        });
    }, [getScrollOffset, route]));
    (0, react_1.useImperativeHandle)(ref, () => ({ scrollToIndex }), [scrollToIndex]);
    const renderItem = (0, react_1.useCallback)((item, index, isItemFocused, onFocus) => {
        const isDisabled = item.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
        const shouldApplyAnimation = shouldAnimate && index < data.length - 1;
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
    const tableHeaderVisible = (canSelectMultiple || !!SearchTableHeader) && (!groupBy || groupBy === CONST_1.default.SEARCH.GROUP_BY.REPORTS);
    const selectAllButtonVisible = canSelectMultiple && !SearchTableHeader;
    const isSelectAllChecked = selectedItemsLength > 0 && selectedItemsLength === flattenedItemsWithoutPendingDelete.length;
    const getItemHeight = (0, react_1.useMemo)(() => (0, itemHeightCalculator_1.createItemHeightCalculator)({
        isLargeScreenWidth,
        shouldUseNarrowLayout,
        type,
    }), [isLargeScreenWidth, shouldUseNarrowLayout, type]);
    const overrideItemLayout = (0, react_1.useCallback)((layout, item) => {
        if (!layout) {
            return;
        }
        const height = getItemHeight(item);
        // eslint-disable-next-line no-param-reassign
        return (layout.size = height > 0 ? height : estimatedItemSize);
    }, [getItemHeight, estimatedItemSize]);
    const calculatedListHeight = (0, react_1.useMemo)(() => {
        return initialHeight - variables_1.default.contentHeaderHeight;
    }, [initialHeight]);
    const calculatedListWidth = (0, react_1.useMemo)(() => {
        if (shouldUseNarrowLayout) {
            return initialWidth;
        }
        if (isLargeScreenWidth) {
            return initialWidth - variables_1.default.navigationTabBarSize - variables_1.default.sideBarWithLHBWidth;
        }
        return initialWidth;
    }, [initialWidth, shouldUseNarrowLayout, isLargeScreenWidth]);
    const estimatedListSize = (0, react_1.useMemo)(() => {
        return {
            height: calculatedListHeight,
            width: calculatedListWidth,
        };
    }, [calculatedListHeight, calculatedListWidth]);
    return (<react_native_1.View style={[styles.flex1, !isKeyboardShown && safeAreaPaddingBottomStyle, containerStyle]}>
            {tableHeaderVisible && (<react_native_1.View style={[styles.searchListHeaderContainerStyle, styles.listTableHeader]}>
                    {canSelectMultiple && (<Checkbox_1.default accessibilityLabel={translate('workspace.people.selectAll')} isChecked={isSelectAllChecked} isIndeterminate={selectedItemsLength > 0 && selectedItemsLength !== flattenedItemsWithoutPendingDelete.length} onPress={() => {
                    onAllCheckboxPress();
                }} disabled={flattenedItems.length === 0}/>)}

                    {SearchTableHeader}

                    {selectAllButtonVisible && (<Pressable_1.PressableWithFeedback style={[styles.userSelectNone, styles.alignItemsCenter]} onPress={onAllCheckboxPress} accessibilityLabel={translate('workspace.people.selectAll')} role="button" accessibilityState={{ checked: isSelectAllChecked }} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                            <Text_1.default style={[styles.textStrong, styles.ph3]}>{translate('workspace.people.selectAll')}</Text_1.default>
                        </Pressable_1.PressableWithFeedback>)}
                </react_native_1.View>)}
            <BaseSearchList_1.default data={data} renderItem={renderItem} onSelectRow={onSelectRow} keyExtractor={keyExtractor} onScroll={onScroll} showsVerticalScrollIndicator={false} ref={listRef} columns={columns} scrollToIndex={scrollToIndex} isFocused={isFocused} flattenedItemsLength={flattenedItems.length} onEndReached={onEndReached} onEndReachedThreshold={onEndReachedThreshold} ListFooterComponent={ListFooterComponent} onViewableItemsChanged={onViewableItemsChanged} onLayout={onLayout} removeClippedSubviews drawDistance={1000} estimatedItemSize={estimatedItemSize} overrideItemLayout={overrideItemLayout} estimatedListSize={estimatedListSize} contentContainerStyle={contentContainerStyle} calculatedListHeight={calculatedListHeight}/>
            <Modal_1.default isVisible={isModalVisible} type={CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED} onClose={() => setIsModalVisible(false)} shouldPreventScrollOnFocus>
                <MenuItem_1.default title={translate('common.select')} icon={Expensicons.CheckSquare} onPress={turnOnSelectionMode}/>
            </Modal_1.default>
        </react_native_1.View>);
}
exports.default = (0, react_1.forwardRef)(SearchList);
