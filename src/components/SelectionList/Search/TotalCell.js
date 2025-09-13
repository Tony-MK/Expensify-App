"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
function TotalCell({ total, currency }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<TextWithTooltip_1.default shouldShowTooltip text={(0, CurrencyUtils_1.convertToDisplayString)(total, currency)} style={[styles.optionDisplayName, styles.pre, styles.justifyContentCenter, styles.textBold, styles.textAlignRight]}/>);
}
TotalCell.displayName = 'TotalCell';
exports.default = TotalCell;
