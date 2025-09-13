"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FontUtils_1 = require("@styles/utils/FontUtils");
const variables_1 = require("@styles/variables");
const useTheme_1 = require("./useTheme");
const defaultEmptyArray = [];
function useMarkdownStyle(hasMessageOnlyEmojis, excludeStyles = defaultEmptyArray) {
    const theme = (0, useTheme_1.default)();
    const emojiFontSize = hasMessageOnlyEmojis ? variables_1.default.fontSizeOnlyEmojis : variables_1.default.fontSizeEmojisWithinText;
    // this map is used to reset the styles that are not needed - passing undefined value can break the native side
    const nonStylingDefaultValues = (0, react_1.useMemo)(() => ({
        color: theme.text,
        backgroundColor: 'transparent',
        marginLeft: 0,
        paddingLeft: 0,
        borderColor: 'transparent',
        borderWidth: 0,
    }), [theme]);
    const markdownStyle = (0, react_1.useMemo)(() => {
        const styling = {
            syntax: {
                color: theme.syntax,
            },
            link: {
                color: theme.link,
            },
            h1: {
                fontSize: variables_1.default.fontSizeLarge,
            },
            emoji: {
                ...FontUtils_1.default.fontFamily.platform.CUSTOM_EMOJI_FONT,
                fontSize: emojiFontSize,
                lineHeight: variables_1.default.lineHeightXLarge,
            },
            blockquote: {
                borderColor: theme.border,
                borderWidth: 4,
                marginLeft: 0,
                paddingLeft: 6,
                /**
                 * since blockquote has `inline-block` display -> padding-right is needed to prevent cursor overlapping
                 * with last character of the text node.
                 * As long as paddingRight > cursor.width, cursor will be displayed correctly.
                 */
                paddingRight: 1,
            },
            code: {
                fontFamily: FontUtils_1.default.fontFamily.platform.MONOSPACE.fontFamily,
                fontSize: 13, // TODO: should be 15 if inside h1, see StyleUtils.getCodeFontSize
                color: theme.text,
                paddingHorizontal: 5,
                borderColor: theme.border,
                backgroundColor: theme.textBackground,
                h1NestedFontSize: 15,
            },
            pre: {
                ...FontUtils_1.default.fontFamily.platform.MONOSPACE,
                fontSize: 13,
                color: theme.text,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderColor: theme.border,
                backgroundColor: theme.textBackground,
            },
            mentionHere: {
                color: theme.ourMentionText,
                backgroundColor: theme.ourMentionBG,
                borderRadius: variables_1.default.componentBorderRadiusSmall,
            },
            mentionUser: {
                color: theme.mentionText,
                backgroundColor: theme.mentionBG,
                borderRadius: variables_1.default.componentBorderRadiusSmall,
            },
            mentionReport: {
                color: theme.mentionText,
                backgroundColor: theme.mentionBG,
            },
            inlineImage: {
                minWidth: variables_1.default.inlineImagePreviewMinSize,
                minHeight: variables_1.default.inlineImagePreviewMinSize,
                maxWidth: variables_1.default.inlineImagePreviewMaxSize,
                maxHeight: variables_1.default.inlineImagePreviewMaxSize,
                borderRadius: variables_1.default.componentBorderRadius,
                marginTop: 4,
            },
            loadingIndicator: {
                primaryColor: theme.spinner,
                secondaryColor: `${theme.spinner}33`,
            },
            loadingIndicatorContainer: {},
        };
        if (excludeStyles.length) {
            excludeStyles.forEach((key) => {
                const style = styling[key];
                if (style) {
                    Object.keys(style).forEach((styleKey) => {
                        style[styleKey] = nonStylingDefaultValues[styleKey] ?? style[styleKey];
                    });
                }
            });
        }
        return styling;
    }, [theme, emojiFontSize, excludeStyles, nonStylingDefaultValues]);
    return markdownStyle;
}
exports.default = useMarkdownStyle;
