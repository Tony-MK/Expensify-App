"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const Parser_1 = require("@libs/Parser");
const StringUtils_1 = require("@libs/StringUtils");
const DisplayNamesWithoutTooltip_1 = require("./DisplayNamesWithoutTooltip");
const DisplayNamesWithTooltip_1 = require("./DisplayNamesWithTooltip");
function DisplayNames({ fullTitle, tooltipEnabled, textStyles, numberOfLines, shouldAddEllipsis, shouldUseFullTitle, displayNamesWithTooltips, renderAdditionalText, forwardedFSClass, }) {
    const { translate } = (0, useLocalize_1.default)();
    const title = StringUtils_1.default.lineBreaksToSpaces(Parser_1.default.htmlToText(fullTitle)) || translate('common.hidden');
    if (!tooltipEnabled) {
        return (<DisplayNamesWithoutTooltip_1.default textStyles={textStyles} numberOfLines={numberOfLines} fullTitle={title} renderAdditionalText={renderAdditionalText} forwardedFSClass={forwardedFSClass}/>);
    }
    if (shouldUseFullTitle) {
        return (<DisplayNamesWithTooltip_1.default shouldUseFullTitle fullTitle={title} textStyles={textStyles} numberOfLines={numberOfLines} renderAdditionalText={renderAdditionalText} forwardedFSClass={forwardedFSClass}/>);
    }
    return (<DisplayNamesWithTooltip_1.default fullTitle={title} displayNamesWithTooltips={displayNamesWithTooltips} textStyles={textStyles} shouldAddEllipsis={shouldAddEllipsis} numberOfLines={numberOfLines} renderAdditionalText={renderAdditionalText} forwardedFSClass={forwardedFSClass}/>);
}
DisplayNames.displayName = 'DisplayNames';
exports.default = DisplayNames;
