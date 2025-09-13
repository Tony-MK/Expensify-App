"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const CONST_1 = require("@src/CONST");
function DateCell({ created, showTooltip, isLargeScreenWidth }) {
    const styles = (0, useThemeStyles_1.default)();
    const date = DateUtils_1.default.formatWithUTCTimeZone(created, DateUtils_1.default.doesDateBelongToAPastYear(created) ? CONST_1.default.DATE.MONTH_DAY_YEAR_ABBR_FORMAT : CONST_1.default.DATE.MONTH_DAY_ABBR_FORMAT);
    return (<TextWithTooltip_1.default text={date} shouldShowTooltip={showTooltip} style={[styles.lineHeightLarge, styles.pre, styles.justifyContentCenter, isLargeScreenWidth ? undefined : [styles.textMicro, styles.textSupporting]]}/>);
}
DateCell.displayName = 'DateCell';
exports.default = DateCell;
