"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const Text_1 = require("@components/Text");
const ZeroWidthView_1 = require("@components/ZeroWidthView");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const convertToLTR_1 = require("@libs/convertToLTR");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const Parser_1 = require("@libs/Parser");
const Performance_1 = require("@libs/Performance");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const variables_1 = require("@styles/variables");
const Timing_1 = require("@userActions/Timing");
const CONST_1 = require("@src/CONST");
const RenderCommentHTML_1 = require("./RenderCommentHTML");
const shouldRenderAsText_1 = require("./shouldRenderAsText");
const TextWithEmojiFragment_1 = require("./TextWithEmojiFragment");
function TextCommentFragment({ fragment, styleAsDeleted, reportActionID, styleAsMuted = false, source, style, displayAsGroup, iouMessage = '' }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { html = '' } = fragment ?? {};
    const text = (0, ReportActionsUtils_1.getTextFromHtml)(html);
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const message = (0, isEmpty_1.default)(iouMessage) ? text : iouMessage;
    const processedTextArray = (0, react_1.useMemo)(() => (0, EmojiUtils_1.splitTextWithEmojis)(message), [message]);
    (0, react_1.useEffect)(() => {
        Performance_1.default.markEnd(CONST_1.default.TIMING.SEND_MESSAGE, { message: text });
        Timing_1.default.end(CONST_1.default.TIMING.SEND_MESSAGE);
    }, [text]);
    // If the only difference between fragment.text and fragment.html is <br /> tags and emoji tag
    // on native, we render it as text, not as html
    // on other device, only render it as text if the only difference is <br /> tag
    const containsOnlyEmojis = (0, EmojiUtils_1.containsOnlyEmojis)(text ?? '');
    const containsOnlyCustomEmoji = (0, react_1.useMemo)(() => (0, EmojiUtils_1.containsOnlyCustomEmoji)(text), [text]);
    const containsEmojis = CONST_1.default.REGEX.ALL_EMOJIS.test(text ?? '');
    if (!(0, shouldRenderAsText_1.default)(html, text ?? '') && !(containsOnlyEmojis && styleAsDeleted) && (containsOnlyEmojis || !(0, EmojiUtils_1.containsCustomEmoji)(text))) {
        const editedTag = fragment?.isEdited ? `<edited ${styleAsDeleted ? 'deleted' : ''}></edited>` : '';
        // We need to replace the space at the beginning of each line with &nbsp;
        const escapedHtml = html.replace(/(^|<br \/>)[ ]+/gm, (match, p1) => p1 + '&nbsp;'.repeat(match.length - p1.length));
        const htmlWithDeletedTag = styleAsDeleted ? `<del>${escapedHtml}</del>` : escapedHtml;
        let htmlContent = htmlWithDeletedTag;
        if (containsOnlyEmojis) {
            htmlContent = expensify_common_1.Str.replaceAll(htmlContent, '<emoji>', '<emoji islarge>');
        }
        else if (containsEmojis) {
            htmlContent = htmlWithDeletedTag;
            if (!htmlContent.includes('<emoji>')) {
                htmlContent = Parser_1.default.replace(htmlContent, { filterRules: ['emoji'], shouldEscapeText: false });
            }
            htmlContent = expensify_common_1.Str.replaceAll(htmlContent, '<emoji>', '<emoji ismedium>');
        }
        let htmlWithTag = editedTag ? `${htmlContent}${editedTag}` : htmlContent;
        if (styleAsMuted) {
            htmlWithTag = `<muted-text>${htmlWithTag}<muted-text>`;
        }
        htmlWithTag = (0, ReportActionsUtils_1.getHtmlWithAttachmentID)(htmlWithTag, reportActionID);
        return (<RenderCommentHTML_1.default containsOnlyEmojis={containsOnlyEmojis} source={source} html={htmlWithTag}/>);
    }
    return (<Text_1.default style={[containsOnlyEmojis && styles.onlyEmojisText, styles.ltr, style]}>
            <ZeroWidthView_1.default text={text} displayAsGroup={displayAsGroup}/>
            {processedTextArray.length !== 0 && !containsOnlyEmojis ? (<TextWithEmojiFragment_1.default message={message} style={[
                styles.ltr,
                style,
                styleAsDeleted ? styles.offlineFeedback.deleted : undefined,
                styleAsMuted ? styles.colorMuted : undefined,
                !(0, DeviceCapabilities_1.canUseTouchScreen)() || !shouldUseNarrowLayout ? styles.userSelectText : styles.userSelectNone,
            ]}/>) : (<Text_1.default style={[
                containsOnlyEmojis ? styles.onlyEmojisText : undefined,
                styles.ltr,
                style,
                styleAsDeleted ? styles.offlineFeedback.deleted : undefined,
                styleAsMuted ? styles.colorMuted : undefined,
                !(0, DeviceCapabilities_1.canUseTouchScreen)() || !shouldUseNarrowLayout ? styles.userSelectText : styles.userSelectNone,
                containsOnlyCustomEmoji && styles.customEmojiFont,
            ]}>
                    {(0, convertToLTR_1.default)(message ?? '')}
                </Text_1.default>)}
            {!!fragment?.isEdited && (<>
                    <Text_1.default style={[containsOnlyEmojis && styles.onlyEmojisTextLineHeight]}> </Text_1.default>
                    <Text_1.default fontSize={variables_1.default.fontSizeSmall} color={theme.textSupporting} style={[styles.editedLabelStyles, styleAsDeleted && styles.offlineFeedback.deleted, style]}>
                        {translate('reportActionCompose.edited')}
                    </Text_1.default>
                </>)}
        </Text_1.default>);
}
TextCommentFragment.displayName = 'TextCommentFragment';
exports.default = (0, react_1.memo)(TextCommentFragment);
