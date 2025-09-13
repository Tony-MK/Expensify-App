"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var TextWithTooltip_1 = require("@components/TextWithTooltip");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
function TotalCell(_a) {
    var total = _a.total, currency = _a.currency;
    var styles = (0, useThemeStyles_1.default)();
    return (<TextWithTooltip_1.default shouldShowTooltip text={(0, CurrencyUtils_1.convertToDisplayString)(total, currency)} style={[styles.optionDisplayName, styles.pre, styles.justifyContentCenter, styles.textBold, styles.textAlignRight]}/>);
}
TotalCell.displayName = 'TotalCell';
exports.default = TotalCell;
