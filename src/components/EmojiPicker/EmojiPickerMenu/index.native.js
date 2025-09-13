"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
const react_native_1 = require("react-native");
const EmojiPickerMenuItem_1 = require("@components/EmojiPicker/EmojiPickerMenuItem");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSingleExecution_1 = require("@hooks/useSingleExecution");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const CONST_1 = require("@src/CONST");
const BaseEmojiPickerMenu_1 = require("./BaseEmojiPickerMenu");
const useEmojiPickerMenu_1 = require("./useEmojiPickerMenu");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function EmojiPickerMenu({ onEmojiSelected, activeEmoji }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { singleExecution } = (0, useSingleExecution_1.default)();
    const { allEmojis, headerEmojis, headerRowIndices, filteredEmojis, headerIndices, setFilteredEmojis, setHeaderIndices, isListFiltered, suggestEmojis, preferredSkinTone, listStyle, emojiListRef, } = (0, useEmojiPickerMenu_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const updateEmojiList = (emojiData, headerData = []) => {
        setFilteredEmojis(emojiData);
        setHeaderIndices(headerData);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            requestAnimationFrame(() => {
                emojiListRef.current?.scrollToOffset({ offset: 0, animated: false });
            });
        });
    };
    /**
     * Filter the entire list of emojis to only emojis that have the search term in their keywords
     */
    const filterEmojis = (0, debounce_1.default)((searchTerm) => {
        const [normalizedSearchTerm, newFilteredEmojiList] = suggestEmojis(searchTerm);
        if (normalizedSearchTerm === '') {
            updateEmojiList(allEmojis, headerRowIndices);
        }
        else {
            updateEmojiList(newFilteredEmojiList ?? [], []);
        }
    }, 300);
    const scrollToHeader = (0, react_1.useCallback)((headerIndex) => {
        const calculatedOffset = Math.floor(headerIndex / CONST_1.default.EMOJI_NUM_PER_ROW) * CONST_1.default.EMOJI_PICKER_HEADER_HEIGHT;
        emojiListRef.current?.scrollToOffset({ offset: calculatedOffset, animated: true });
    }, [emojiListRef]);
    /**
     * Given an emoji item object, render a component based on its type.
     * Items with the code "SPACER" return nothing and are used to fill rows up to 8
     * so that the sticky headers function properly.
     */
    const renderItem = (0, react_1.useCallback)(({ item, target }) => {
        const code = item.code;
        const types = 'types' in item ? item.types : undefined;
        if ('spacer' in item && item.spacer) {
            return null;
        }
        if ('header' in item && item.header) {
            return (<react_native_1.View style={[styles.emojiHeaderContainer, target === 'StickyHeader' ? styles.mh4 : { width: windowWidth }]}>
                        <Text_1.default style={styles.textLabelSupporting}>{translate(`emojiPicker.headers.${code}`)}</Text_1.default>
                    </react_native_1.View>);
        }
        const emojiCode = typeof preferredSkinTone === 'number' && preferredSkinTone !== -1 && types?.at(preferredSkinTone) ? types.at(preferredSkinTone) : code;
        const shouldEmojiBeHighlighted = !!activeEmoji && (0, EmojiUtils_1.getRemovedSkinToneEmoji)(emojiCode) === (0, EmojiUtils_1.getRemovedSkinToneEmoji)(activeEmoji);
        return (<EmojiPickerMenuItem_1.default onPress={singleExecution((emoji) => {
                if (!('name' in item)) {
                    return;
                }
                onEmojiSelected(emoji, item);
            })} emoji={emojiCode ?? ''} isHighlighted={shouldEmojiBeHighlighted}/>);
    }, [styles, windowWidth, preferredSkinTone, singleExecution, onEmojiSelected, translate, activeEmoji]);
    return (<react_native_1.View style={[styles.emojiPickerContainer, StyleUtils.getEmojiPickerStyle(shouldUseNarrowLayout)]}>
            <react_native_1.View style={[styles.p4, styles.pb3]}>
                <TextInput_1.default label={translate('common.search')} accessibilityLabel={translate('common.search')} role={CONST_1.default.ROLE.PRESENTATION} onChangeText={filterEmojis} blurOnSubmit={filteredEmojis.length > 0}/>
            </react_native_1.View>
            <BaseEmojiPickerMenu_1.default isFiltered={isListFiltered} headerEmojis={headerEmojis} scrollToHeader={scrollToHeader} listWrapperStyle={[
            listStyle,
            {
                width: Math.floor(windowWidth),
            },
        ]} ref={emojiListRef} data={filteredEmojis} renderItem={renderItem} extraData={[filteredEmojis, preferredSkinTone]} stickyHeaderIndices={headerIndices} alwaysBounceVertical={filteredEmojis.length !== 0}/>
        </react_native_1.View>);
}
EmojiPickerMenu.displayName = 'EmojiPickerMenu';
exports.default = react_1.default.forwardRef(EmojiPickerMenu);
