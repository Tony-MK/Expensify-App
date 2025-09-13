"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Parser_1 = require("@libs/Parser");
function MerchantOrDescriptionCell({ merchantOrDescription, shouldShowTooltip, shouldUseNarrowLayout, isDescription, }) {
    const styles = (0, useThemeStyles_1.default)();
    const text = (0, react_1.useMemo)(() => {
        if (!isDescription) {
            return merchantOrDescription;
        }
        return Parser_1.default.htmlToText(merchantOrDescription).replace(/\n/g, ' ');
    }, [merchantOrDescription, isDescription]);
    return (<TextWithTooltip_1.default shouldShowTooltip={shouldShowTooltip} text={text} style={[!shouldUseNarrowLayout ? styles.lineHeightLarge : styles.lh20, styles.pre, styles.justifyContentCenter, styles.flex1]}/>);
}
MerchantOrDescriptionCell.displayName = 'MerchantOrDescriptionCell';
exports.default = MerchantOrDescriptionCell;
