"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiUtils = require("@libs/EmojiUtils");
const GetStyledTextArray_1 = require("@libs/GetStyledTextArray");
const AutoCompleteSuggestions_1 = require("./AutoCompleteSuggestions");
const Text_1 = require("./Text");
/**
 * Create unique keys for each emoji item
 */
const keyExtractor = (item, index) => `${item.name}+${index}}`;
function EmojiSuggestions({ emojis, onSelect, prefix, isEmojiPickerLarge, preferredSkinToneIndex, highlightedEmojiIndex = 0, measureParentContainerAndReportCursor = () => { }, resetSuggestions, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    /**
     * Render an emoji suggestion menu item component.
     */
    const renderSuggestionMenuItem = (0, react_1.useCallback)((item) => {
        const styledTextArray = (0, GetStyledTextArray_1.default)(item.name, prefix);
        return (<react_native_1.View style={styles.autoCompleteSuggestionContainer}>
                    <Text_1.default style={styles.emojiSuggestionsEmoji}>{EmojiUtils.getEmojiCodeWithSkinColor(item, preferredSkinToneIndex)}</Text_1.default>
                    <Text_1.default numberOfLines={2} style={styles.emojiSuggestionsText}>
                        :
                        {styledTextArray.map(({ text, isColored }) => (<Text_1.default key={`${text}+${isColored}`} style={StyleUtils.getColoredBackgroundStyle(isColored)}>
                                {text}
                            </Text_1.default>))}
                        :
                    </Text_1.default>
                </react_native_1.View>);
    }, [prefix, styles.autoCompleteSuggestionContainer, styles.emojiSuggestionsEmoji, styles.emojiSuggestionsText, preferredSkinToneIndex, StyleUtils]);
    return (<AutoCompleteSuggestions_1.default suggestions={emojis} renderSuggestionMenuItem={renderSuggestionMenuItem} keyExtractor={keyExtractor} highlightedSuggestionIndex={highlightedEmojiIndex} onSelect={onSelect} isSuggestionPickerLarge={isEmojiPickerLarge} accessibilityLabelExtractor={keyExtractor} measureParentContainerAndReportCursor={measureParentContainerAndReportCursor} resetSuggestions={resetSuggestions}/>);
}
EmojiSuggestions.displayName = 'EmojiSuggestions';
exports.default = EmojiSuggestions;
