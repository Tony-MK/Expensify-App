"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = shouldRenderAsText;
const expensify_common_1 = require("expensify-common");
const EmojiUtils_1 = require("@libs/EmojiUtils");
/**
 * Whether to render the report action as text
 */
function shouldRenderAsText(html, text) {
    // On native, we render emoji as text to prevent the large emoji is cut off when the action is edited.
    // More info: https://github.com/Expensify/App/pull/35838#issuecomment-1964839350
    const htmlWithoutLineBreak = expensify_common_1.Str.replaceAll(html, '<br />', '\n');
    const htmlWithoutEmojiOpenTag = expensify_common_1.Str.replaceAll(htmlWithoutLineBreak, '<emoji>', '');
    return expensify_common_1.Str.replaceAll(htmlWithoutEmojiOpenTag, '</emoji>', '') === text && !(0, EmojiUtils_1.containsCustomEmoji)(text);
}
