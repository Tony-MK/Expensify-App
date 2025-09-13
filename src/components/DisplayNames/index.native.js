"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const Parser_1 = require("@libs/Parser");
const StringUtils_1 = require("@libs/StringUtils");
const TextWithEmojiFragment_1 = require("@pages/home/report/comment/TextWithEmojiFragment");
// As we don't have to show tooltips of the Native platform so we simply render the full display names list.
function DisplayNames({ accessibilityLabel, fullTitle, textStyles = [], numberOfLines = 1, renderAdditionalText, forwardedFSClass }) {
    const { translate } = (0, useLocalize_1.default)();
    const titleContainsTextAndCustomEmoji = (0, react_1.useMemo)(() => (0, EmojiUtils_1.containsCustomEmoji)(fullTitle) && !(0, EmojiUtils_1.containsOnlyCustomEmoji)(fullTitle), [fullTitle]);
    return (<Text_1.default accessibilityLabel={accessibilityLabel} style={textStyles} numberOfLines={numberOfLines} testID={DisplayNames.displayName} fsClass={forwardedFSClass}>
            {titleContainsTextAndCustomEmoji ? (<TextWithEmojiFragment_1.default message={StringUtils_1.default.lineBreaksToSpaces(Parser_1.default.htmlToText(fullTitle)) || translate('common.hidden')} style={textStyles}/>) : (StringUtils_1.default.lineBreaksToSpaces(Parser_1.default.htmlToText(fullTitle)) || translate('common.hidden'))}
            {renderAdditionalText?.()}
        </Text_1.default>);
}
DisplayNames.displayName = 'DisplayNames';
exports.default = DisplayNames;
