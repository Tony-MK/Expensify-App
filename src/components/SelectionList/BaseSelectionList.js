"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const debounce_1 = require("lodash/debounce");
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Checkbox_1 = require("@components/Checkbox");
const FixedFooter_1 = require("@components/FixedFooter");
const OptionsListSkeletonView_1 = require("@components/OptionsListSkeletonView");
const Pressable_1 = require("@components/Pressable");
const SectionList_1 = require("@components/SectionList");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useActiveElementRole_1 = require("@hooks/useActiveElementRole");
const useArrowKeyFocusManager_1 = require("@hooks/useArrowKeyFocusManager");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const useLocalize_1 = require("@hooks/useLocalize");
const usePrevious_1 = require("@hooks/usePrevious");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useScrollEnabled_1 = require("@hooks/useScrollEnabled");
const useSingleExecution_1 = require("@hooks/useSingleExecution");
const useSyncFocusImplementation_1 = require("@hooks/useSyncFocus/useSyncFocusImplementation");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getSectionsWithIndexOffset_1 = require("@libs/getSectionsWithIndexOffset");
const KeyDownPressListener_1 = require("@libs/KeyboardShortcut/KeyDownPressListener");
const Log_1 = require("@libs/Log");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const arraysEqual_1 = require("@src/utils/arraysEqual");
const BaseSelectionListItemRenderer_1 = require("./BaseSelectionListItemRenderer");
const FocusAwareCellRendererComponent_1 = require("./FocusAwareCellRendererComponent");
const getDefaultItemHeight = () => variables_1.default.optionRowHeight;
function BaseSelectionList({ sections, ListItem, shouldUseUserSkeletonView, canSelectMultiple = false, onSelectRow, shouldSingleExecuteRowSelect = false, onCheckboxPress, onSelectAll, onDismissError, getItemHeight = getDefaultItemHeight, textInputLabel = '', textInputPlaceholder = '', textInputValue = '', textInputStyle, textInputHint, textInputMaxLength, inputMode = CONST_1.default.INPUT_MODE.TEXT, onChangeText, initiallyFocusedOptionKey = '', onScroll, onScrollBeginDrag, headerMessage = '', confirmButtonText = '', onConfirm, headerContent, footerContent, listFooterContent, footerContentAbovePagination, listEmptyContent, showScrollIndicator = true, showLoadingPlaceholder = false, LoadingPlaceholderComponent = OptionsListSkeletonView_1.default, showConfirmButton = false, isConfirmButtonDisabled = false, shouldUseDefaultTheme = false, shouldPreventDefaultFocusOnSelectRow = false, containerStyle, sectionListStyle, disableKeyboardShortcuts = false, children, autoCorrect, shouldStopPropagation = false, shouldPreventDefault = true, shouldShowTooltips = true, shouldUseDynamicMaxToRenderPerBatch = false, rightHandSideComponent, isLoadingNewOptions = false, onLayout, customListHeader, customListHeaderHeight = 0, listHeaderWrapperStyle, isRowMultilineSupported = false, isAlternateTextMultilineSupported = false, alternateTextNumberOfLines = 2, textInputRef, headerMessageStyle, confirmButtonStyles, shouldHideListOnInitialRender = true, textInputIconLeft, sectionTitleStyles, textInputAutoFocus = true, shouldShowTextInputAfterHeader = false, shouldShowHeaderMessageAfterHeader = false, includeSafeAreaPaddingBottom = true, shouldTextInputInterceptSwipe = false, listHeaderContent, onEndReached, onEndReachedThreshold, windowSize = 5, updateCellsBatchingPeriod = 50, removeClippedSubviews = true, shouldDelayFocus = true, onArrowFocus = () => { }, shouldUpdateFocusedIndex = false, onLongPressRow, shouldShowTextInput = !!textInputLabel || !!textInputIconLeft, shouldShowListEmptyContent = true, listItemWrapperStyle, shouldIgnoreFocus = false, scrollEventThrottle, contentContainerStyle, shouldKeepFocusedItemAtTopOfViewableArea = false, shouldDebounceScrolling = false, shouldPreventActiveCellVirtualization = false, shouldScrollToFocusedIndex = true, isSmallScreenWidth, onContentSizeChange, listItemTitleStyles, initialNumToRender = 12, listItemTitleContainerStyles, isScreenFocused = false, shouldSubscribeToArrowKeyEvents = true, shouldClearInputOnSelect = true, addBottomSafeAreaPadding, addOfflineIndicatorBottomSafeAreaPadding, fixedNumItemsForLoader, loaderSpeed, errorText, shouldUseDefaultRightHandSideCheckmark, selectedItems = [], isSelected, canShowProductTrainingTooltip, renderScrollComponent, ref, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const listRef = (0, react_1.useRef)(null);
    const innerTextInputRef = (0, react_1.useRef)(null);
    const hasKeyBeenPressed = (0, react_1.useRef)(false);
    const focusTimeoutRef = (0, react_1.useRef)(null);
    const shouldShowSelectAll = !!onSelectAll;
    const activeElementRole = (0, useActiveElementRole_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    const scrollEnabled = (0, useScrollEnabled_1.default)();
    const [maxToRenderPerBatch, setMaxToRenderPerBatch] = (0, react_1.useState)(shouldUseDynamicMaxToRenderPerBatch ? 0 : CONST_1.default.MAX_TO_RENDER_PER_BATCH.DEFAULT);
    const [isInitialSectionListRender, setIsInitialSectionListRender] = (0, react_1.useState)(true);
    const { isKeyboardShown } = (0, useKeyboardState_1.default)();
    const [itemsToHighlight, setItemsToHighlight] = (0, react_1.useState)(null);
    const itemFocusTimeoutRef = (0, react_1.useRef)(null);
    const isItemSelected = (0, react_1.useCallback)((item) => item.isSelected ?? ((isSelected?.(item) ?? selectedItems.includes(item.keyForList ?? '')) && canSelectMultiple), [isSelected, selectedItems, canSelectMultiple]);
    /** Calculates on which page is selected item so we can scroll to it on first render  */
    const calculateInitialCurrentPage = (0, react_1.useCallback)(() => {
        if (canSelectMultiple || sections.length === 0) {
            return 1;
        }
        let currentIndex = 0;
        for (const section of sections) {
            if (section.data) {
                for (const item of section.data) {
                    if (isItemSelected(item)) {
                        return Math.floor(currentIndex / CONST_1.default.MAX_SELECTION_LIST_PAGE_LENGTH) + 1;
                    }
                    currentIndex++;
                }
            }
        }
        return 1;
    }, [canSelectMultiple, isItemSelected, sections]);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(() => calculateInitialCurrentPage());
    const isTextInputFocusedRef = (0, react_1.useRef)(false);
    const { singleExecution } = (0, useSingleExecution_1.default)();
    const [itemHeights, setItemHeights] = (0, react_1.useState)({});
    const pendingScrollIndexRef = (0, react_1.useRef)(null);
    const onItemLayout = (event, itemKey) => {
        if (!itemKey) {
            return;
        }
        const { height } = event.nativeEvent.layout;
        setItemHeights((prevHeights) => ({
            ...prevHeights,
            [itemKey]: height,
        }));
    };
    const canShowProductTrainingTooltipMemo = (0, react_1.useMemo)(() => {
        return canShowProductTrainingTooltip && isFocused;
    }, [canShowProductTrainingTooltip, isFocused]);
    /**
     * Iterates through the sections and items inside each section, and builds 4 arrays along the way:
     * - `allOptions`: Contains all the items in the list, flattened, regardless of section
     * - `disabledOptionsIndexes`: Contains the indexes of all the unselectable and disabled items in the list
     * - `disabledArrowKeyOptionsIndexes`: Contains the indexes of item that is not navigable by the arrow key. The list is separated from disabledOptionsIndexes because unselectable item is still navigable by the arrow key.
     * - `itemLayouts`: Contains the layout information for each item, header and footer in the list,
     * so we can calculate the position of any given item when scrolling programmatically
     */
    const flattenedSections = (0, react_1.useMemo)(() => {
        const allOptions = [];
        const disabledOptionsIndexes = [];
        const disabledArrowKeyOptionsIndexes = [];
        let disabledIndex = 0;
        // need to account that the list might have some extra content above it
        let offset = customListHeader ? customListHeaderHeight : 0;
        const itemLayouts = [{ length: 0, offset }];
        const selectedOptions = [];
        sections.forEach((section, sectionIndex) => {
            const sectionHeaderHeight = !!section.title || !!section.CustomSectionHeader ? variables_1.default.optionsListSectionHeaderHeight : 0;
            itemLayouts.push({ length: sectionHeaderHeight, offset });
            offset += sectionHeaderHeight;
            section.data?.forEach((item, optionIndex) => {
                // Add item to the general flattened array
                allOptions.push({
                    ...item,
                    sectionIndex,
                    index: optionIndex,
                });
                // If disabled, add to the disabled indexes array
                const isItemDisabled = !!section.isDisabled || (item.isDisabled && !isItemSelected(item));
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                if (isItemDisabled || item.isDisabledCheckbox) {
                    disabledOptionsIndexes.push(disabledIndex);
                    if (isItemDisabled) {
                        disabledArrowKeyOptionsIndexes.push(disabledIndex);
                    }
                }
                disabledIndex += 1;
                // Account for the height of the item in getItemLayout
                const fullItemHeight = item?.keyForList && itemHeights[item.keyForList] ? itemHeights[item.keyForList] : getItemHeight(item);
                itemLayouts.push({ length: fullItemHeight, offset });
                offset += fullItemHeight;
                if (isItemSelected(item) && !selectedOptions.find((option) => option.keyForList === item.keyForList)) {
                    selectedOptions.push(item);
                }
            });
            // We're not rendering any section footer, but we need to push to the array
            // because React Native accounts for it in getItemLayout
            itemLayouts.push({ length: 0, offset });
        });
        // We're not rendering the list footer, but we need to push to the array
        // because React Native accounts for it in getItemLayout
        itemLayouts.push({ length: 0, offset });
        if (selectedOptions.length > 1 && !canSelectMultiple) {
            Log_1.default.alert('Dev error: SelectionList - multiple items are selected but prop `canSelectMultiple` is false. Please enable `canSelectMultiple` or make your list have only 1 item with `isSelected: true`.');
        }
        const totalSelectable = allOptions.length - disabledOptionsIndexes.length;
        return {
            allOptions,
            selectedOptions,
            disabledOptionsIndexes,
            disabledArrowKeyOptionsIndexes,
            itemLayouts,
            allSelected: selectedOptions.length > 0 && selectedOptions.length === totalSelectable,
            someSelected: selectedOptions.length > 0 && selectedOptions.length < totalSelectable,
        };
    }, [customListHeader, customListHeaderHeight, sections, canSelectMultiple, isItemSelected, itemHeights, getItemHeight]);
    const incrementPage = (0, react_1.useCallback)(() => {
        if (flattenedSections.allOptions.length <= CONST_1.default.MAX_SELECTION_LIST_PAGE_LENGTH * currentPage) {
            return;
        }
        setCurrentPage((prev) => prev + 1);
    }, [flattenedSections.allOptions.length, currentPage]);
    const slicedSections = (0, react_1.useMemo)(() => {
        let remainingOptionsLimit = CONST_1.default.MAX_SELECTION_LIST_PAGE_LENGTH * currentPage;
        return (0, getSectionsWithIndexOffset_1.default)(sections.map((section) => {
            const data = !(0, isEmpty_1.default)(section.data) && remainingOptionsLimit > 0 ? section.data.slice(0, remainingOptionsLimit) : [];
            remainingOptionsLimit -= data.length;
            return {
                ...section,
                data,
            };
        }));
    }, [sections, currentPage]);
    // Disable `Enter` shortcut if the active element is a button or checkbox
    const disableEnterShortcut = activeElementRole && [CONST_1.default.ROLE.BUTTON, CONST_1.default.ROLE.CHECKBOX].includes(activeElementRole);
    /**
     * Scrolls to the desired item index in the section list
     *
     * @param index - the index of the item to scroll to
     * @param animated - whether to animate the scroll
     */
    const scrollToIndex = (0, react_1.useCallback)((index, animated = true) => {
        const item = flattenedSections.allOptions.at(index);
        if (!listRef.current || !item || index === -1) {
            return;
        }
        // Calculate which page is needed to show this index
        const requiredPage = Math.ceil((index + 1) / CONST_1.default.MAX_SELECTION_LIST_PAGE_LENGTH);
        // If the required page is beyond the current page, load all pages up to it,
        // then return early and let the scroll happen after the page update
        if (requiredPage > currentPage) {
            pendingScrollIndexRef.current = index;
            setCurrentPage(requiredPage);
            return;
        }
        const itemIndex = item.index ?? -1;
        const sectionIndex = item.sectionIndex ?? -1;
        let viewOffsetToKeepFocusedItemAtTopOfViewableArea = 0;
        // Since there are always two items above the focused item in viewable area, and items can grow beyond the screen size
        // in searchType chat, the focused item may move out of view. To prevent this, we will ensure that the focused item remains at
        // the top of the viewable area at all times by adjusting the viewOffset.
        if (shouldKeepFocusedItemAtTopOfViewableArea) {
            const firstPreviousItem = index > 0 ? flattenedSections.allOptions.at(index - 1) : undefined;
            const firstPreviousItemHeight = firstPreviousItem && firstPreviousItem.keyForList ? itemHeights[firstPreviousItem.keyForList] : 0;
            const secondPreviousItem = index > 1 ? flattenedSections.allOptions.at(index - 2) : undefined;
            const secondPreviousItemHeight = secondPreviousItem && secondPreviousItem?.keyForList ? itemHeights[secondPreviousItem.keyForList] : 0;
            viewOffsetToKeepFocusedItemAtTopOfViewableArea = firstPreviousItemHeight + secondPreviousItemHeight;
        }
        listRef.current.scrollToLocation({ sectionIndex, itemIndex, animated, viewOffset: variables_1.default.contentHeaderHeight - viewOffsetToKeepFocusedItemAtTopOfViewableArea });
        pendingScrollIndexRef.current = null;
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [flattenedSections.allOptions, currentPage]);
    // this function is used specifically for scrolling to the focused input to prevent it from appearing below opened keyboard
    // and ensures the entire list item element is visible, not just the input field inside it
    const scrollToFocusedInput = (0, react_1.useCallback)((index) => {
        if (!listRef.current) {
            return;
        }
        if (index < 0) {
            return;
        }
        // Perform scroll to specific position in SectionList to show entire item
        listRef.current.scrollToLocation({
            sectionIndex: 0, // Scroll to first section (index 0) as this function is designed for specific SplitExpenseItem.tsx list
            itemIndex: index + 2, // Scroll to item at index + 2 (because first two items is reserved for optional header and content above the selectionList)
            animated: true,
            viewOffset: 4, // scrollToLocation scrolls 4 pixels more than the specified list item, so we need to subtract this using viewOffset
            viewPosition: 1.0, // Item position: 1.0 = bottom of screen
        });
    }, []);
    const [disabledArrowKeyIndexes, setDisabledArrowKeyIndexes] = (0, react_1.useState)(flattenedSections.disabledArrowKeyOptionsIndexes);
    (0, react_1.useEffect)(() => {
        if ((0, arraysEqual_1.default)(disabledArrowKeyIndexes, flattenedSections.disabledArrowKeyOptionsIndexes)) {
            return;
        }
        setDisabledArrowKeyIndexes(flattenedSections.disabledArrowKeyOptionsIndexes);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [flattenedSections.disabledArrowKeyOptionsIndexes]);
    /** Check whether there is a need to scroll to an item and if all items are loaded */
    (0, react_1.useEffect)(() => {
        if (pendingScrollIndexRef.current === null) {
            return;
        }
        const indexToScroll = pendingScrollIndexRef.current;
        const targetItem = flattenedSections.allOptions.at(indexToScroll);
        if (targetItem && indexToScroll < CONST_1.default.MAX_SELECTION_LIST_PAGE_LENGTH * currentPage) {
            pendingScrollIndexRef.current = null;
            scrollToIndex(indexToScroll, true);
        }
    }, [currentPage, scrollToIndex, flattenedSections.allOptions]);
    const debouncedScrollToIndex = (0, react_1.useMemo)(() => (0, debounce_1.default)(scrollToIndex, CONST_1.default.TIMING.LIST_SCROLLING_DEBOUNCE_TIME, { leading: true, trailing: true }), [scrollToIndex]);
    const setHasKeyBeenPressed = (0, react_1.useCallback)(() => {
        if (hasKeyBeenPressed.current) {
            return;
        }
        // We need to track whether a key has been pressed to enable focus syncing only if a key has been pressed.
        // This is to avoid the default behavior of web showing blue border on click of items after a page refresh.
        hasKeyBeenPressed.current = true;
    }, []);
    // If `initiallyFocusedOptionKey` is not passed, we fall back to `-1`, to avoid showing the highlight on the first member
    const [focusedIndex, setFocusedIndex] = (0, useArrowKeyFocusManager_1.default)({
        initialFocusedIndex: flattenedSections.allOptions.findIndex((option) => option.keyForList === initiallyFocusedOptionKey),
        maxIndex: Math.min(flattenedSections.allOptions.length - 1, CONST_1.default.MAX_SELECTION_LIST_PAGE_LENGTH * currentPage - 1),
        disabledIndexes: disabledArrowKeyIndexes,
        isActive: shouldSubscribeToArrowKeyEvents && isFocused,
        onFocusedIndexChange: (index) => {
            const focusedItem = flattenedSections.allOptions.at(index);
            if (focusedItem) {
                onArrowFocus(focusedItem);
            }
            if (shouldScrollToFocusedIndex) {
                (shouldDebounceScrolling ? debouncedScrollToIndex : scrollToIndex)(index, true);
            }
        },
        ...(!hasKeyBeenPressed.current && { setHasKeyBeenPressed }),
        isFocused,
    });
    (0, react_1.useEffect)(() => {
        (0, KeyDownPressListener_1.addKeyDownPressListener)(setHasKeyBeenPressed);
        return () => (0, KeyDownPressListener_1.removeKeyDownPressListener)(setHasKeyBeenPressed);
    }, [setHasKeyBeenPressed]);
    const selectedItemIndex = (0, react_1.useMemo)(() => (initiallyFocusedOptionKey ? flattenedSections.allOptions.findIndex(isItemSelected) : -1), [flattenedSections.allOptions, initiallyFocusedOptionKey, isItemSelected]);
    (0, react_1.useEffect)(() => {
        if (selectedItemIndex === -1 || selectedItemIndex === focusedIndex || textInputValue) {
            return;
        }
        setFocusedIndex(selectedItemIndex);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [selectedItemIndex]);
    const clearInputAfterSelect = (0, react_1.useCallback)(() => {
        if (!shouldClearInputOnSelect) {
            return;
        }
        onChangeText?.('');
    }, [onChangeText, shouldClearInputOnSelect]);
    /**
     * Logic to run when a row is selected, either with click/press or keyboard hotkeys.
     *
     * @param item - the list item
     * @param indexToFocus - the list item index to focus
     */
    const selectRow = (0, react_1.useCallback)((item, indexToFocus) => {
        if (!isFocused && !isScreenFocused) {
            return;
        }
        // In single-selection lists we don't care about updating the focused index, because the list is closed after selecting an item
        if (canSelectMultiple) {
            if (sections.length > 1 && !isItemSelected(item)) {
                // If we're selecting an item, scroll to its position at the top, so we can see it
                scrollToIndex(0, true);
            }
            if (shouldShowTextInput) {
                clearInputAfterSelect();
            }
            else if (isSmallScreenWidth) {
                if (!item.isDisabledCheckbox) {
                    onCheckboxPress?.(item);
                }
                return;
            }
        }
        if (shouldUpdateFocusedIndex && typeof indexToFocus === 'number') {
            setFocusedIndex(indexToFocus);
        }
        onSelectRow(item);
        if (shouldShowTextInput && shouldPreventDefaultFocusOnSelectRow && innerTextInputRef.current) {
            innerTextInputRef.current.focus();
        }
    }, [
        isFocused,
        isScreenFocused,
        canSelectMultiple,
        shouldUpdateFocusedIndex,
        onSelectRow,
        shouldShowTextInput,
        shouldPreventDefaultFocusOnSelectRow,
        sections.length,
        isItemSelected,
        isSmallScreenWidth,
        scrollToIndex,
        clearInputAfterSelect,
        onCheckboxPress,
        setFocusedIndex,
    ]);
    const selectAllRow = () => {
        onSelectAll?.();
        if (shouldShowTextInput && shouldPreventDefaultFocusOnSelectRow && innerTextInputRef.current) {
            innerTextInputRef.current.focus();
        }
    };
    const getFocusedOption = (0, react_1.useCallback)(() => {
        const focusedOption = focusedIndex !== -1 ? flattenedSections.allOptions.at(focusedIndex) : undefined;
        if (!focusedOption || (focusedOption.isDisabled && !isItemSelected(focusedOption))) {
            return;
        }
        return focusedOption;
    }, [flattenedSections.allOptions, focusedIndex, isItemSelected]);
    const selectFocusedOption = () => {
        const focusedOption = getFocusedOption();
        if (!focusedOption) {
            return;
        }
        selectRow(focusedOption);
    };
    /**
     * This function is used to compute the layout of any given item in our list.
     * We need to implement it so that we can programmatically scroll to items outside the virtual render window of the SectionList.
     *
     * @param data - This is the same as the data we pass into the component
     * @param flatDataArrayIndex - This index is provided by React Native, and refers to a flat array with data from all the sections. This flat array has some quirks:
     *
     *     1. It ALWAYS includes a list header and a list footer, even if we don't provide/render those.
     *     2. Each section includes a header, even if we don't provide/render one.
     *
     *     For example, given a list with two sections, two items in each section, no header, no footer, and no section headers, the flat array might look something like this:
     *
     *     [{header}, {sectionHeader}, {item}, {item}, {sectionHeader}, {item}, {item}, {footer}]
     */
    const getItemLayout = (data, flatDataArrayIndex) => {
        const targetItem = flattenedSections.itemLayouts.at(flatDataArrayIndex);
        if (!targetItem || flatDataArrayIndex === -1) {
            return {
                length: 0,
                offset: 0,
                index: flatDataArrayIndex,
            };
        }
        return {
            length: targetItem.length,
            offset: targetItem.offset,
            index: flatDataArrayIndex,
        };
    };
    const renderSectionHeader = ({ section }) => {
        if (section.CustomSectionHeader) {
            return <section.CustomSectionHeader section={section}/>;
        }
        if (!section.title || (0, EmptyObject_1.isEmptyObject)(section.data) || listHeaderContent) {
            return null;
        }
        return (
        // Note: The `optionsListSectionHeader` style provides an explicit height to section headers.
        // We do this so that we can reference the height in `getItemLayout` –
        // we need to know the heights of all list items up-front in order to synchronously compute the layout of any given list item.
        // So be aware that if you adjust the content of the section header (for example, change the font size), you may need to adjust this explicit height as well.
        <react_native_1.View style={[styles.optionsListSectionHeader, styles.justifyContentCenter, sectionTitleStyles]}>
                <Text_1.default style={[styles.ph5, styles.textLabelSupporting]}>{section.title}</Text_1.default>
            </react_native_1.View>);
    };
    const header = () => (<>
            {!headerMessage && canSelectMultiple && shouldShowSelectAll && (<react_native_1.View style={[styles.userSelectNone, styles.peopleRow, styles.ph5, styles.pb3, listHeaderWrapperStyle, styles.selectionListStickyHeader]}>
                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                        <Checkbox_1.default accessibilityLabel={translate('workspace.people.selectAll')} isChecked={flattenedSections.allSelected} isIndeterminate={flattenedSections.someSelected} onPress={selectAllRow} disabled={flattenedSections.allOptions.length === flattenedSections.disabledOptionsIndexes.length}/>
                        {!customListHeader && (<Pressable_1.PressableWithFeedback style={[styles.userSelectNone, styles.flexRow, styles.alignItemsCenter]} onPress={selectAllRow} accessibilityLabel={translate('workspace.people.selectAll')} role="button" accessibilityState={{ checked: flattenedSections.allSelected }} disabled={flattenedSections.allOptions.length === flattenedSections.disabledOptionsIndexes.length} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }} onMouseDown={shouldPreventDefaultFocusOnSelectRow ? (e) => e.preventDefault() : undefined}>
                                <Text_1.default style={[styles.textStrong, styles.ph3]}>{translate('workspace.people.selectAll')}</Text_1.default>
                            </Pressable_1.PressableWithFeedback>)}
                    </react_native_1.View>
                    {customListHeader}
                </react_native_1.View>)}
            {!headerMessage && !canSelectMultiple && customListHeader}
        </>);
    const renderItem = ({ item, index, section }) => {
        const normalizedIndex = index + (section?.indexOffset ?? 0);
        const isDisabled = !!section.isDisabled || item.isDisabled;
        const selected = isItemSelected(item);
        const isItemFocused = (!isDisabled || selected) && focusedIndex === normalizedIndex;
        const isItemHighlighted = !!itemsToHighlight?.has(item.keyForList ?? '');
        return (<react_native_1.View onLayout={(event) => onItemLayout(event, item?.keyForList)}>
                <BaseSelectionListItemRenderer_1.default ListItem={ListItem} item={{
                shouldAnimateInHighlight: isItemHighlighted,
                isSelected: selected,
                ...item,
            }} shouldUseDefaultRightHandSideCheckmark={shouldUseDefaultRightHandSideCheckmark} index={index} isFocused={isItemFocused} isDisabled={isDisabled} showTooltip={shouldShowTooltips} canSelectMultiple={canSelectMultiple} onLongPressRow={onLongPressRow} shouldSingleExecuteRowSelect={shouldSingleExecuteRowSelect} selectRow={selectRow} onCheckboxPress={onCheckboxPress} onDismissError={onDismissError} shouldPreventDefaultFocusOnSelectRow={shouldPreventDefaultFocusOnSelectRow} rightHandSideComponent={rightHandSideComponent} isMultilineSupported={isRowMultilineSupported} isAlternateTextMultilineSupported={isAlternateTextMultilineSupported} alternateTextNumberOfLines={alternateTextNumberOfLines} shouldIgnoreFocus={shouldIgnoreFocus} setFocusedIndex={setFocusedIndex} normalizedIndex={normalizedIndex} shouldSyncFocus={!isTextInputFocusedRef.current && hasKeyBeenPressed.current} wrapperStyle={listItemWrapperStyle} titleStyles={listItemTitleStyles} singleExecution={singleExecution} titleContainerStyles={listItemTitleContainerStyles} canShowProductTrainingTooltip={canShowProductTrainingTooltipMemo}/>
            </react_native_1.View>);
    };
    const renderListEmptyContent = () => {
        if (showLoadingPlaceholder) {
            return (<LoadingPlaceholderComponent fixedNumItems={fixedNumItemsForLoader} shouldStyleAsTable={shouldUseUserSkeletonView} speed={loaderSpeed}/>);
        }
        if (shouldShowListEmptyContent) {
            return listEmptyContent;
        }
        return null;
    };
    const textInputKeyPress = (0, react_1.useCallback)((event) => {
        const key = event.nativeEvent.key;
        if (key === CONST_1.default.KEYBOARD_SHORTCUTS.TAB.shortcutKey) {
            useSyncFocusImplementation_1.focusedItemRef?.focus();
        }
    }, []);
    const renderInput = () => {
        return (<react_native_1.View style={[styles.ph5, styles.pb3, textInputStyle]}>
                <TextInput_1.default onKeyPress={textInputKeyPress} ref={(element) => {
                innerTextInputRef.current = element;
                if (!textInputRef) {
                    return;
                }
                if (typeof textInputRef === 'function') {
                    textInputRef(element);
                }
                else {
                    // eslint-disable-next-line no-param-reassign
                    textInputRef.current = element;
                }
            }} onFocus={() => (isTextInputFocusedRef.current = true)} onBlur={() => (isTextInputFocusedRef.current = false)} label={textInputLabel} accessibilityLabel={textInputLabel} hint={textInputHint} role={CONST_1.default.ROLE.PRESENTATION} value={textInputValue} placeholder={textInputPlaceholder} autoCorrect={autoCorrect} maxLength={textInputMaxLength} onChangeText={onChangeText} inputMode={inputMode} selectTextOnFocus spellCheck={false} iconLeft={textInputIconLeft} onSubmitEditing={selectFocusedOption} blurOnSubmit={!!flattenedSections.allOptions.length} isLoading={isLoadingNewOptions} testID="selection-list-text-input" shouldInterceptSwipe={shouldTextInputInterceptSwipe} errorText={errorText}/>
            </react_native_1.View>);
    };
    const scrollToFocusedIndexOnFirstRender = (0, react_1.useCallback)((nativeEvent) => {
        if (shouldUseDynamicMaxToRenderPerBatch) {
            const listHeight = nativeEvent.nativeEvent.layout.height;
            const itemHeight = nativeEvent.nativeEvent.layout.y;
            setMaxToRenderPerBatch((Math.ceil(listHeight / itemHeight) || 0) + CONST_1.default.MAX_TO_RENDER_PER_BATCH.DEFAULT);
        }
        if (!isInitialSectionListRender) {
            return;
        }
        if (shouldScrollToFocusedIndex) {
            scrollToIndex(focusedIndex, false);
        }
        setIsInitialSectionListRender(false);
    }, [focusedIndex, isInitialSectionListRender, scrollToIndex, shouldUseDynamicMaxToRenderPerBatch, shouldScrollToFocusedIndex]);
    const onSectionListLayout = (0, react_1.useCallback)((nativeEvent) => {
        onLayout?.(nativeEvent);
        scrollToFocusedIndexOnFirstRender(nativeEvent);
    }, [onLayout, scrollToFocusedIndexOnFirstRender]);
    const updateAndScrollToFocusedIndex = (0, react_1.useCallback)((newFocusedIndex) => {
        setFocusedIndex(newFocusedIndex);
        scrollToIndex(newFocusedIndex, true);
    }, [scrollToIndex, setFocusedIndex]);
    /** Function to focus text input */
    const focusTextInput = (0, react_1.useCallback)(() => {
        if (!innerTextInputRef.current) {
            return;
        }
        innerTextInputRef.current.focus();
    }, []);
    /** Focuses the text input when the component comes into focus and after any navigation animations finish. */
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (textInputAutoFocus && shouldShowTextInput) {
            if (shouldDelayFocus) {
                focusTimeoutRef.current = setTimeout(focusTextInput, CONST_1.default.ANIMATED_TRANSITION);
            }
            else {
                requestAnimationFrame(focusTextInput);
            }
        }
        return () => focusTimeoutRef.current && clearTimeout(focusTimeoutRef.current);
    }, [shouldShowTextInput, textInputAutoFocus, shouldDelayFocus, focusTextInput]));
    const prevTextInputValue = (0, usePrevious_1.default)(textInputValue);
    const prevSelectedOptionsLength = (0, usePrevious_1.default)(flattenedSections.selectedOptions.length);
    const prevAllOptionsLength = (0, usePrevious_1.default)(flattenedSections.allOptions.length);
    (0, react_1.useEffect)(() => {
        if (prevTextInputValue === textInputValue) {
            return;
        }
        // Reset the current page to 1 when the user types something
        setCurrentPage(1);
    }, [textInputValue, prevTextInputValue]);
    (0, react_1.useEffect)(() => {
        // Avoid changing focus if the textInputValue remains unchanged.
        if ((prevTextInputValue === textInputValue && flattenedSections.selectedOptions.length === prevSelectedOptionsLength) ||
            flattenedSections.allOptions.length === 0 ||
            (flattenedSections.selectedOptions.length !== prevSelectedOptionsLength && shouldUpdateFocusedIndex)) {
            return;
        }
        // Handle clearing search
        if (prevTextInputValue !== '' && textInputValue === '') {
            const foundSelectedItemIndex = flattenedSections.allOptions.findIndex(isItemSelected);
            const singleSectionList = slicedSections.length < 2;
            if (foundSelectedItemIndex !== -1 && singleSectionList && !canSelectMultiple) {
                const requiredPage = Math.ceil((foundSelectedItemIndex + 1) / CONST_1.default.MAX_SELECTION_LIST_PAGE_LENGTH);
                setCurrentPage(requiredPage);
                updateAndScrollToFocusedIndex(foundSelectedItemIndex);
                return;
            }
        }
        // Remove the focus if the search input is empty and prev search input not empty or selected options length is changed (and allOptions length remains the same)
        // else focus on the first non disabled item
        const newSelectedIndex = ((0, isEmpty_1.default)(prevTextInputValue) && textInputValue === '') ||
            (flattenedSections.selectedOptions.length !== prevSelectedOptionsLength && prevAllOptionsLength === flattenedSections.allOptions.length)
            ? -1
            : 0;
        updateAndScrollToFocusedIndex(newSelectedIndex);
    }, [
        canSelectMultiple,
        flattenedSections.allOptions.length,
        flattenedSections.selectedOptions.length,
        prevTextInputValue,
        textInputValue,
        updateAndScrollToFocusedIndex,
        prevSelectedOptionsLength,
        prevAllOptionsLength,
        shouldUpdateFocusedIndex,
        flattenedSections.allOptions,
        isItemSelected,
        slicedSections.length,
    ]);
    (0, react_1.useEffect)(() => () => {
        if (!itemFocusTimeoutRef.current) {
            return;
        }
        clearTimeout(itemFocusTimeoutRef.current);
    }, []);
    /**
     * Highlights the items and scrolls to the first item present in the items list.
     *
     * @param items - The list of items to highlight.
     * @param timeout - The timeout in milliseconds before removing the highlight.
     */
    const scrollAndHighlightItem = (0, react_1.useCallback)((items) => {
        const newItemsToHighlight = new Set();
        items.forEach((item) => {
            newItemsToHighlight.add(item);
        });
        const index = flattenedSections.allOptions.findIndex((option) => newItemsToHighlight.has(option.keyForList ?? ''));
        scrollToIndex(index);
        setItemsToHighlight(newItemsToHighlight);
        if (itemFocusTimeoutRef.current) {
            clearTimeout(itemFocusTimeoutRef.current);
        }
        const duration = CONST_1.default.ANIMATED_HIGHLIGHT_ENTRY_DELAY +
            CONST_1.default.ANIMATED_HIGHLIGHT_ENTRY_DURATION +
            CONST_1.default.ANIMATED_HIGHLIGHT_START_DELAY +
            CONST_1.default.ANIMATED_HIGHLIGHT_START_DURATION +
            CONST_1.default.ANIMATED_HIGHLIGHT_END_DELAY +
            CONST_1.default.ANIMATED_HIGHLIGHT_END_DURATION;
        itemFocusTimeoutRef.current = setTimeout(() => {
            setItemsToHighlight(null);
        }, duration);
    }, [flattenedSections.allOptions, scrollToIndex]);
    /**
     * Handles isTextInputFocusedRef value when using external TextInput, so external TextInput does not lose focus when typing in it.
     *
     * @param isTextInputFocused - Is external TextInput focused.
     */
    const updateExternalTextInputFocus = (0, react_1.useCallback)((isTextInputFocused) => {
        isTextInputFocusedRef.current = isTextInputFocused;
    }, []);
    (0, react_1.useImperativeHandle)(ref, () => ({
        scrollAndHighlightItem,
        clearInputAfterSelect,
        updateAndScrollToFocusedIndex,
        updateExternalTextInputFocus,
        scrollToIndex,
        getFocusedOption,
        focusTextInput,
        scrollToFocusedInput,
    }), [scrollAndHighlightItem, clearInputAfterSelect, updateAndScrollToFocusedIndex, updateExternalTextInputFocus, scrollToIndex, getFocusedOption, focusTextInput, scrollToFocusedInput]);
    /** Selects row when pressing Enter */
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ENTER, selectFocusedOption, {
        captureOnInputs: true,
        shouldBubble: !flattenedSections.allOptions.at(focusedIndex) || focusedIndex === -1,
        shouldStopPropagation,
        shouldPreventDefault,
        isActive: !disableKeyboardShortcuts && !disableEnterShortcut && isFocused && focusedIndex >= 0,
    });
    /** Calls confirm action when pressing CTRL (CMD) + Enter */
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.CTRL_ENTER, (e) => {
        const focusedOption = focusedIndex !== -1 ? flattenedSections.allOptions.at(focusedIndex) : undefined;
        if (onConfirm) {
            onConfirm(e, focusedOption);
            return;
        }
        selectFocusedOption();
    }, {
        captureOnInputs: true,
        shouldBubble: !flattenedSections.allOptions.at(focusedIndex) || focusedIndex === -1,
        isActive: !disableKeyboardShortcuts && isFocused && !isConfirmButtonDisabled,
    });
    const headerMessageContent = () => (!isLoadingNewOptions || headerMessage !== translate('common.noResultsFound') || (flattenedSections.allOptions.length === 0 && !showLoadingPlaceholder)) &&
        !!headerMessage && (<react_native_1.View style={headerMessageStyle ?? [styles.ph5, styles.pb5]}>
                <Text_1.default style={[styles.textLabel, styles.colorMuted, styles.minHeight5]}>{headerMessage}</Text_1.default>
            </react_native_1.View>);
    const { safeAreaPaddingBottomStyle } = (0, useSafeAreaPaddings_1.default)();
    const paddingBottomStyle = (0, react_1.useMemo)(() => (!isKeyboardShown || !!footerContent) && includeSafeAreaPaddingBottom && safeAreaPaddingBottomStyle, [footerContent, includeSafeAreaPaddingBottom, isKeyboardShown, safeAreaPaddingBottomStyle]);
    const shouldHideContentBottomSafeAreaPadding = showConfirmButton || !!footerContent;
    // TODO: test _every_ component that uses SelectionList
    return (<react_native_1.View style={[styles.flex1, !addBottomSafeAreaPadding && paddingBottomStyle, containerStyle]}>
            {shouldShowTextInput && !shouldShowTextInputAfterHeader && renderInput()}
            {/* If we are loading new options we will avoid showing any header message. This is mostly because one of the header messages says there are no options. */}
            {/* This is misleading because we might be in the process of loading fresh options from the server. */}
            {!shouldShowHeaderMessageAfterHeader && headerMessageContent()}
            {!!headerContent && headerContent}
            {flattenedSections.allOptions.length === 0 && (showLoadingPlaceholder || shouldShowListEmptyContent) ? (renderListEmptyContent()) : (<>
                    {!listHeaderContent && header()}
                    <SectionList_1.default renderScrollComponent={renderScrollComponent} removeClippedSubviews={removeClippedSubviews} ref={listRef} sections={slicedSections} stickySectionHeadersEnabled={false} renderSectionHeader={(arg) => (<>
                                {renderSectionHeader(arg)}
                                {listHeaderContent && header()}
                            </>)} renderItem={renderItem} getItemLayout={getItemLayout} onScroll={onScroll} onScrollBeginDrag={onScrollBeginDrag} onContentSizeChange={onContentSizeChange} keyExtractor={(item, index) => item.keyForList ?? `${index}`} extraData={focusedIndex} 
        // the only valid values on the new arch are "white", "black", and "default", other values will cause a crash
        indicatorStyle="white" keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={showScrollIndicator} initialNumToRender={initialNumToRender} maxToRenderPerBatch={maxToRenderPerBatch} windowSize={windowSize} updateCellsBatchingPeriod={updateCellsBatchingPeriod} viewabilityConfig={{ viewAreaCoveragePercentThreshold: 95 }} testID="selection-list" onLayout={onSectionListLayout} style={[(!maxToRenderPerBatch || (shouldHideListOnInitialRender && isInitialSectionListRender)) && styles.opacity0, sectionListStyle]} ListHeaderComponent={shouldShowTextInput && shouldShowTextInputAfterHeader ? (<>
                                    {listHeaderContent}
                                    {renderInput()}
                                    {shouldShowHeaderMessageAfterHeader && headerMessageContent()}
                                </>) : (listHeaderContent)} scrollEnabled={scrollEnabled} ListFooterComponent={<>
                                {footerContentAbovePagination}
                                {listFooterContent}
                            </>} onEndReached={onEndReached ?? incrementPage} onEndReachedThreshold={onEndReachedThreshold} scrollEventThrottle={scrollEventThrottle} addBottomSafeAreaPadding={!shouldHideContentBottomSafeAreaPadding && addBottomSafeAreaPadding} addOfflineIndicatorBottomSafeAreaPadding={!shouldHideContentBottomSafeAreaPadding && addOfflineIndicatorBottomSafeAreaPadding} contentContainerStyle={contentContainerStyle} CellRendererComponent={shouldPreventActiveCellVirtualization ? FocusAwareCellRendererComponent_1.default : undefined}/>
                    {children}
                </>)}
            {showConfirmButton && (<FixedFooter_1.default style={styles.mtAuto} addBottomSafeAreaPadding={addBottomSafeAreaPadding} addOfflineIndicatorBottomSafeAreaPadding={addOfflineIndicatorBottomSafeAreaPadding}>
                    <Button_1.default success={!shouldUseDefaultTheme} large style={[styles.w100, confirmButtonStyles]} text={confirmButtonText || translate('common.confirm')} onPress={onConfirm} pressOnEnter enterKeyEventListenerPriority={1} isDisabled={isConfirmButtonDisabled}/>
                </FixedFooter_1.default>)}
            {!!footerContent && (<FixedFooter_1.default style={styles.mtAuto} addBottomSafeAreaPadding={addBottomSafeAreaPadding} addOfflineIndicatorBottomSafeAreaPadding={addOfflineIndicatorBottomSafeAreaPadding}>
                    {footerContent}
                </FixedFooter_1.default>)}
        </react_native_1.View>);
}
BaseSelectionList.displayName = 'BaseSelectionList';
exports.default = BaseSelectionList;
