"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var EmojiUtils_1 = require("@libs/EmojiUtils");
var Parser_1 = require("@libs/Parser");
var StringUtils_1 = require("@libs/StringUtils");
var TextWithEmojiFragment_1 = require("@pages/home/report/comment/TextWithEmojiFragment");
// As we don't have to show tooltips of the Native platform so we simply render the full display names list.
function DisplayNames(_a) {
    var accessibilityLabel = _a.accessibilityLabel, fullTitle = _a.fullTitle, _b = _a.textStyles, textStyles = _b === void 0 ? [] : _b, _c = _a.numberOfLines, numberOfLines = _c === void 0 ? 1 : _c, renderAdditionalText = _a.renderAdditionalText, forwardedFSClass = _a.forwardedFSClass;
    var translate = (0, useLocalize_1.default)().translate;
    var titleContainsTextAndCustomEmoji = (0, react_1.useMemo)(function () { return (0, EmojiUtils_1.containsCustomEmoji)(fullTitle) && !(0, EmojiUtils_1.containsOnlyCustomEmoji)(fullTitle); }, [fullTitle]);
    return (<Text_1.default accessibilityLabel={accessibilityLabel} style={textStyles} numberOfLines={numberOfLines} testID={DisplayNames.displayName} fsClass={forwardedFSClass}>
            {titleContainsTextAndCustomEmoji ? (<TextWithEmojiFragment_1.default message={StringUtils_1.default.lineBreaksToSpaces(Parser_1.default.htmlToText(fullTitle)) || translate('common.hidden')} style={textStyles}/>) : (StringUtils_1.default.lineBreaksToSpaces(Parser_1.default.htmlToText(fullTitle)) || translate('common.hidden'))}
            {renderAdditionalText === null || renderAdditionalText === void 0 ? void 0 : renderAdditionalText()}
        </Text_1.default>);
}
DisplayNames.displayName = 'DisplayNames';
exports.default = DisplayNames;
