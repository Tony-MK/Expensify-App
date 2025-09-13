"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const throttle_1 = require("lodash/throttle");
const react_1 = require("react");
const react_native_1 = require("react-native");
const EmojiPickerMenuItem_1 = require("@components/EmojiPicker/EmojiPickerMenuItem");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const isTextInputFocused_1 = require("@components/TextInput/BaseTextInput/isTextInputFocused");
const useArrowKeyFocusManager_1 = require("@hooks/useArrowKeyFocusManager");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSingleExecution_1 = require("@hooks/useSingleExecution");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Browser_1 = require("@libs/Browser");
const canFocusInputOnScreenFocus_1 = require("@libs/canFocusInputOnScreenFocus");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const isEnterWhileComposition_1 = require("@libs/KeyboardShortcut/isEnterWhileComposition");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const BaseEmojiPickerMenu_1 = require("./BaseEmojiPickerMenu");
const useEmojiPickerMenu_1 = require("./useEmojiPickerMenu");
const throttleTime = (0, Browser_1.isMobile)() ? 200 : 50;
function EmojiPickerMenu({ onEmojiSelected, activeEmoji }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { singleExecution } = (0, useSingleExecution_1.default)();
    const { allEmojis, headerEmojis, headerRowIndices, filteredEmojis, headerIndices, setFilteredEmojis, setHeaderIndices, isListFiltered, suggestEmojis, preferredSkinTone, listStyle, emojiListRef, spacersIndexes, } = (0, useEmojiPickerMenu_1.default)();
    // Ref for the emoji search input
    const searchInputRef = (0, react_1.useRef)(null);
    // We want consistent auto focus behavior on input between native and mWeb so we have some auto focus management code that will
    // prevent auto focus when open picker for mobile device
    const shouldFocusInputOnScreenFocus = (0, canFocusInputOnScreenFocus_1.default)();
    const [arePointerEventsDisabled, setArePointerEventsDisabled] = (0, react_1.useState)(false);
    const [isFocused, setIsFocused] = (0, react_1.useState)(false);
    const [isUsingKeyboardMovement, setIsUsingKeyboardMovement] = (0, react_1.useState)(false);
    const [highlightEmoji, setHighlightEmoji] = (0, react_1.useState)(false);
    const [highlightFirstEmoji, setHighlightFirstEmoji] = (0, react_1.useState)(false);
    const mouseMoveHandler = (0, react_1.useCallback)(() => {
        if (!arePointerEventsDisabled) {
            return;
        }
        setArePointerEventsDisabled(false);
    }, [arePointerEventsDisabled]);
    const onFocusedIndexChange = (0, react_1.useCallback)((newIndex) => {
        if (filteredEmojis.length === 0) {
            return;
        }
        if (highlightFirstEmoji) {
            setHighlightFirstEmoji(false);
        }
        if (!isUsingKeyboardMovement) {
            setIsUsingKeyboardMovement(true);
        }
        // If the input is not focused and the new index is out of range, focus the input
        if (newIndex < 0 && !(0, isTextInputFocused_1.default)(searchInputRef) && shouldFocusInputOnScreenFocus) {
            searchInputRef.current?.focus();
        }
    }, [filteredEmojis.length, highlightFirstEmoji, isUsingKeyboardMovement, shouldFocusInputOnScreenFocus]);
    const disabledIndexes = (0, react_1.useMemo)(() => (isListFiltered ? [] : [...headerIndices, ...spacersIndexes]), [headerIndices, isListFiltered, spacersIndexes]);
    const [focusedIndex, setFocusedIndex] = (0, useArrowKeyFocusManager_1.default)({
        maxIndex: filteredEmojis.length - 1,
        // Spacers indexes need to be disabled so that the arrow keys don't focus them. All headers are hidden when list is filtered
        disabledIndexes,
        itemsPerRow: CONST_1.default.EMOJI_NUM_PER_ROW,
        initialFocusedIndex: -1,
        disableCyclicTraversal: true,
        onFocusedIndexChange,
        allowHorizontalArrowKeys: !isFocused,
        // We pass true without checking visibility of the component because if the popover is not visible this picker won't be mounted
        isActive: true,
        allowNegativeIndexes: true,
    });
    const filterEmojis = (0, throttle_1.default)((searchTerm) => {
        const [normalizedSearchTerm, newFilteredEmojiList] = suggestEmojis(searchTerm);
        emojiListRef.current?.scrollToOffset({ offset: 0, animated: false });
        if (normalizedSearchTerm === '') {
            // There are no headers when searching, so we need to re-make them sticky when there is no search term
            setFilteredEmojis(allEmojis);
            setHeaderIndices(headerRowIndices);
            setFocusedIndex(-1);
            setHighlightFirstEmoji(false);
            setHighlightEmoji(false);
            return;
        }
        // Remove sticky header indices. There are no headers while searching and we don't want to make emojis sticky
        setFilteredEmojis(newFilteredEmojiList ?? []);
        setHeaderIndices([]);
        setHighlightFirstEmoji(true);
        setIsUsingKeyboardMovement(false);
    }, throttleTime);
    const keyDownHandler = (0, react_1.useCallback)((keyBoardEvent) => {
        if (keyBoardEvent.key.startsWith('Arrow')) {
            if (!isFocused || keyBoardEvent.key === 'ArrowUp' || keyBoardEvent.key === 'ArrowDown') {
                keyBoardEvent.preventDefault();
            }
            return;
        }
        // Enable keyboard movement if tab or enter is pressed or if shift is pressed while the input
        // is not focused, so that the navigation and tab cycling can be done using the keyboard without
        // interfering with the input behaviour.
        if (keyBoardEvent.key === 'Tab' || keyBoardEvent.key === 'Enter' || (keyBoardEvent.key === 'Shift' && searchInputRef.current && !(0, isTextInputFocused_1.default)(searchInputRef))) {
            setIsUsingKeyboardMovement(true);
        }
        // We allow typing in the search box if any key is pressed apart from Arrow keys.
        if (searchInputRef.current && !(0, isTextInputFocused_1.default)(searchInputRef) && (0, ReportUtils_1.shouldAutoFocusOnKeyPress)(keyBoardEvent)) {
            searchInputRef.current.focus();
        }
    }, [isFocused]);
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ENTER, (keyBoardEvent) => {
        if (!(keyBoardEvent instanceof KeyboardEvent) || (0, isEnterWhileComposition_1.default)(keyBoardEvent) || keyBoardEvent.key !== CONST_1.default.KEYBOARD_SHORTCUTS.ENTER.shortcutKey) {
            return;
        }
        // Select the currently highlighted emoji if enter is pressed
        let indexToSelect = focusedIndex;
        if (highlightFirstEmoji) {
            indexToSelect = 0;
        }
        const item = filteredEmojis.at(indexToSelect);
        if (indexToSelect === -1 || !item) {
            return;
        }
        if ('types' in item || 'name' in item) {
            const emoji = typeof preferredSkinTone === 'number' && preferredSkinTone !== -1 && item?.types?.at(preferredSkinTone) ? item.types.at(preferredSkinTone) : item.code;
            onEmojiSelected(emoji ?? '', item);
            // On web, avoid this Enter default input action; otherwise, it will add a new line in the subsequently focused composer.
            keyBoardEvent.preventDefault();
            // On mWeb, avoid propagating this Enter keystroke to Pressable child component; otherwise, it will trigger the onEmojiSelected callback again.
            keyBoardEvent.stopPropagation();
        }
    }, { shouldPreventDefault: false });
    /**
     * Setup and attach keypress/mouse handlers for highlight navigation.
     */
    const setupEventHandlers = (0, react_1.useCallback)(() => {
        if (!document) {
            return;
        }
        // Keyboard events are not bubbling on TextInput in RN-Web, Bubbling was needed for this event to trigger
        // event handler attached to document root. To fix this, trigger event handler in Capture phase.
        document.addEventListener('keydown', keyDownHandler, true);
        // Re-enable pointer events and hovering over EmojiPickerItems when the mouse moves
        document.addEventListener('mousemove', mouseMoveHandler);
    }, [keyDownHandler, mouseMoveHandler]);
    /**
     * Cleanup all mouse/keydown event listeners that we've set up
     */
    const cleanupEventHandlers = (0, react_1.useCallback)(() => {
        if (!document) {
            return;
        }
        document.removeEventListener('keydown', keyDownHandler, true);
        document.removeEventListener('mousemove', mouseMoveHandler);
    }, [keyDownHandler, mouseMoveHandler]);
    (0, react_1.useEffect)(() => {
        // This callback prop is used by the parent component using the constructor to
        // get a ref to the inner textInput element e.g. if we do
        // <constructor ref={el => this.textInput = el} /> this will not
        // return a ref to the component, but rather the HTML element by default
        if (shouldFocusInputOnScreenFocus && ref && typeof ref === 'function') {
            ref(searchInputRef.current);
        }
        setupEventHandlers();
        return () => {
            cleanupEventHandlers();
        };
    }, [ref, shouldFocusInputOnScreenFocus, cleanupEventHandlers, setupEventHandlers]);
    const scrollToHeader = (0, react_1.useCallback)((headerIndex) => {
        if (!emojiListRef.current) {
            return;
        }
        const calculatedOffset = Math.floor(headerIndex / CONST_1.default.EMOJI_NUM_PER_ROW) * CONST_1.default.EMOJI_PICKER_HEADER_HEIGHT;
        emojiListRef.current?.scrollToOffset({ offset: calculatedOffset, animated: true });
        setFocusedIndex(headerIndex);
    }, [emojiListRef, setFocusedIndex]);
    /**
     * Given an emoji item object, render a component based on its type.
     * Items with the code "SPACER" return nothing and are used to fill rows up to 8
     * so that the sticky headers function properly.
     *
     */
    const renderItem = (0, react_1.useCallback)(({ item, index, target }) => {
        const code = item.code;
        const types = 'types' in item ? item.types : undefined;
        if ('spacer' in item && item.spacer) {
            return null;
        }
        if ('header' in item && item.header) {
            return (<react_native_1.View style={[styles.emojiHeaderContainer, target === 'StickyHeader' ? styles.stickyHeaderEmoji(shouldUseNarrowLayout, windowWidth) : undefined]}>
                        <Text_1.default style={styles.textLabelSupporting}>{translate(`emojiPicker.headers.${code}`)}</Text_1.default>
                    </react_native_1.View>);
        }
        const emojiCode = typeof preferredSkinTone === 'number' && types?.at(preferredSkinTone) && preferredSkinTone !== -1 ? types.at(preferredSkinTone) : code;
        const isEmojiFocused = index === focusedIndex && isUsingKeyboardMovement;
        const shouldEmojiBeHighlighted = (index === focusedIndex && highlightEmoji) || (!!activeEmoji && (0, EmojiUtils_1.getRemovedSkinToneEmoji)(emojiCode) === (0, EmojiUtils_1.getRemovedSkinToneEmoji)(activeEmoji));
        const shouldFirstEmojiBeHighlighted = index === 0 && highlightFirstEmoji;
        return (<EmojiPickerMenuItem_1.default onPress={singleExecution((emoji) => {
                if (!('name' in item)) {
                    return;
                }
                onEmojiSelected(emoji, item);
            })} onHoverIn={() => {
                setHighlightEmoji(false);
                setHighlightFirstEmoji(false);
                if (!isUsingKeyboardMovement) {
                    return;
                }
                setIsUsingKeyboardMovement(false);
            }} emoji={emojiCode ?? ''} onFocus={() => setFocusedIndex(index)} isFocused={isEmojiFocused} isHighlighted={shouldFirstEmojiBeHighlighted || shouldEmojiBeHighlighted}/>);
    }, [
        preferredSkinTone,
        focusedIndex,
        isUsingKeyboardMovement,
        highlightEmoji,
        highlightFirstEmoji,
        singleExecution,
        styles,
        shouldUseNarrowLayout,
        windowWidth,
        translate,
        onEmojiSelected,
        setFocusedIndex,
        activeEmoji,
    ]);
    return (<react_native_1.View style={[
            styles.emojiPickerContainer,
            StyleUtils.getEmojiPickerStyle(shouldUseNarrowLayout),
            // Disable pointer events so that onHover doesn't get triggered when the items move while we're scrolling
            arePointerEventsDisabled ? styles.pointerEventsNone : styles.pointerEventsAuto,
        ]}>
            <react_native_1.View style={[styles.p4, styles.pb3]}>
                <TextInput_1.default label={translate('common.search')} accessibilityLabel={translate('common.search')} role={CONST_1.default.ROLE.PRESENTATION} onChangeText={filterEmojis} defaultValue="" ref={searchInputRef} autoFocus={shouldFocusInputOnScreenFocus} onFocus={() => {
            setFocusedIndex(-1);
            setIsFocused(true);
            setIsUsingKeyboardMovement(false);
        }} onBlur={() => setIsFocused(false)} autoCorrect={false} blurOnSubmit={filteredEmojis.length > 0}/>
            </react_native_1.View>
            <BaseEmojiPickerMenu_1.default isFiltered={isListFiltered} headerEmojis={headerEmojis} scrollToHeader={scrollToHeader} listWrapperStyle={[listStyle, styles.flexShrink1]} ref={emojiListRef} data={filteredEmojis} renderItem={renderItem} extraData={[focusedIndex, preferredSkinTone]} stickyHeaderIndices={headerIndices}/>
        </react_native_1.View>);
}
EmojiPickerMenu.displayName = 'EmojiPickerMenu';
exports.default = react_1.default.forwardRef(EmojiPickerMenu);
