"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const GetStyledTextArray_1 = require("@libs/GetStyledTextArray");
const CONST_1 = require("@src/CONST");
const AutoCompleteSuggestions_1 = require("./AutoCompleteSuggestions");
const Avatar_1 = require("./Avatar");
const Text_1 = require("./Text");
/**
 * Create unique keys for each mention item
 */
const keyExtractor = (item) => item.alternateText;
function MentionSuggestions({ prefix, mentions, highlightedMentionIndex = 0, onSelect, isMentionPickerLarge, measureParentContainerAndReportCursor = () => { }, resetSuggestions, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    /**
     * Render a suggestion menu item component.
     */
    const renderSuggestionMenuItem = (0, react_1.useCallback)((item) => {
        const isIcon = item.text === CONST_1.default.AUTO_COMPLETE_SUGGESTER.HERE_TEXT;
        const styledDisplayName = (0, GetStyledTextArray_1.default)(item.text, prefix);
        const styledHandle = item.text === item.alternateText ? undefined : (0, GetStyledTextArray_1.default)(item.alternateText, prefix);
        return (<react_native_1.View style={[styles.autoCompleteSuggestionContainer, styles.ph2]}>
                    {!!item.icons && !!item.icons.length && (<react_native_1.View style={styles.mentionSuggestionsAvatarContainer}>
                            <Avatar_1.default source={item.icons.at(0)?.source} size={isIcon ? CONST_1.default.AVATAR_SIZE.MENTION_ICON : CONST_1.default.AVATAR_SIZE.SMALLER} name={item.icons.at(0)?.name} avatarID={item.icons.at(0)?.id} type={item.icons.at(0)?.type ?? CONST_1.default.ICON_TYPE_AVATAR} fill={isIcon ? theme.success : undefined} fallbackIcon={item.icons.at(0)?.fallbackIcon}/>
                        </react_native_1.View>)}
                    <Text_1.default style={[styles.mentionSuggestionsText, styles.flexShrink1]} numberOfLines={1}>
                        {styledDisplayName?.map(({ text, isColored }, i) => (<Text_1.default 
            // eslint-disable-next-line react/no-array-index-key
            key={`${text}${i}`} style={[StyleUtils.getColoredBackgroundStyle(isColored), styles.mentionSuggestionsDisplayName]}>
                                {text}
                            </Text_1.default>))}
                    </Text_1.default>
                    <Text_1.default style={[styles.mentionSuggestionsText, styles.flex1]} numberOfLines={1}>
                        {styledHandle?.map(({ text, isColored }, i) => !!text && (<Text_1.default 
            // eslint-disable-next-line react/no-array-index-key
            key={`${text}${i}`} style={[StyleUtils.getColoredBackgroundStyle(isColored), styles.textSupporting]}>
                                        {text}
                                    </Text_1.default>))}
                    </Text_1.default>
                </react_native_1.View>);
    }, [
        prefix,
        styles.autoCompleteSuggestionContainer,
        styles.ph2,
        styles.mentionSuggestionsAvatarContainer,
        styles.mentionSuggestionsText,
        styles.flexShrink1,
        styles.flex1,
        styles.mentionSuggestionsDisplayName,
        styles.textSupporting,
        theme.success,
        StyleUtils,
    ]);
    return (<AutoCompleteSuggestions_1.default suggestions={mentions} renderSuggestionMenuItem={renderSuggestionMenuItem} keyExtractor={keyExtractor} highlightedSuggestionIndex={highlightedMentionIndex} onSelect={onSelect} isSuggestionPickerLarge={isMentionPickerLarge} accessibilityLabelExtractor={keyExtractor} measureParentContainerAndReportCursor={measureParentContainerAndReportCursor} resetSuggestions={resetSuggestions}/>);
}
MentionSuggestions.displayName = 'MentionSuggestions';
exports.default = MentionSuggestions;
