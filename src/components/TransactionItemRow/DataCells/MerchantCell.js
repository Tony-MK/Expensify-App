"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var TextWithTooltip_1 = require("@components/TextWithTooltip");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Parser_1 = require("@libs/Parser");
function MerchantOrDescriptionCell(_a) {
    var merchantOrDescription = _a.merchantOrDescription, shouldShowTooltip = _a.shouldShowTooltip, shouldUseNarrowLayout = _a.shouldUseNarrowLayout, isDescription = _a.isDescription;
    var styles = (0, useThemeStyles_1.default)();
    var text = (0, react_1.useMemo)(function () {
        if (!isDescription) {
            return merchantOrDescription;
        }
        return Parser_1.default.htmlToText(merchantOrDescription).replace(/\n/g, ' ');
    }, [merchantOrDescription, isDescription]);
    return (<TextWithTooltip_1.default shouldShowTooltip={shouldShowTooltip} text={text} style={[!shouldUseNarrowLayout ? styles.lineHeightLarge : styles.lh20, styles.pre, styles.justifyContentCenter, styles.flex1]}/>);
}
MerchantOrDescriptionCell.displayName = 'MerchantOrDescriptionCell';
exports.default = MerchantOrDescriptionCell;
