"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Checkbox_1 = require("@components/Checkbox");
var Icon_1 = require("@components/Icon");
var BankIcons_1 = require("@components/Icon/BankIcons");
var TextWithTooltip_1 = require("@components/TextWithTooltip");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var DateUtils_1 = require("@libs/DateUtils");
var CONST_1 = require("@src/CONST");
var TotalCell_1 = require("./TotalCell");
function WithdrawalIDListItemHeader(_a) {
    var _b;
    var withdrawalIDItem = _a.withdrawalID, onCheckboxPress = _a.onCheckboxPress, isDisabled = _a.isDisabled, canSelectMultiple = _a.canSelectMultiple, isIndeterminate = _a.isIndeterminate, isSelectAllChecked = _a.isSelectAllChecked;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var _c = (0, BankIcons_1.default)({ bankName: withdrawalIDItem.bankName, styles: styles }), icon = _c.icon, iconSize = _c.iconSize, iconStyles = _c.iconStyles;
    var formattedBankName = (_b = CONST_1.default.BANK_NAMES_USER_FRIENDLY[withdrawalIDItem.bankName]) !== null && _b !== void 0 ? _b : CONST_1.default.BANK_NAMES_USER_FRIENDLY[CONST_1.default.BANK_NAMES.GENERIC_BANK];
    var formattedWithdrawalDate = DateUtils_1.default.formatWithUTCTimeZone(withdrawalIDItem.debitPosted, DateUtils_1.default.doesDateBelongToAPastYear(withdrawalIDItem.debitPosted) ? CONST_1.default.DATE.MONTH_DAY_YEAR_ABBR_FORMAT : CONST_1.default.DATE.MONTH_DAY_ABBR_FORMAT);
    return (<react_native_1.View>
            <react_native_1.View style={[styles.pv1Half, styles.ph3, styles.flexRow, styles.alignItemsCenter, styles.justifyContentStart]}>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mnh40, styles.flex1, styles.gap3]}>
                    {!!canSelectMultiple && (<Checkbox_1.default onPress={function () { return onCheckboxPress === null || onCheckboxPress === void 0 ? void 0 : onCheckboxPress(withdrawalIDItem); }} isChecked={isSelectAllChecked} disabled={!!isDisabled || withdrawalIDItem.isDisabledCheckbox} accessibilityLabel={translate('common.select')} isIndeterminate={isIndeterminate}/>)}
                    <react_native_1.View style={[styles.flexRow, styles.flex1, styles.gap3]}>
                        <Icon_1.default src={icon} width={iconSize} height={iconSize} additionalStyles={iconStyles}/>
                        <react_native_1.View style={[styles.gapHalf, styles.flexShrink1]}>
                            <TextWithTooltip_1.default text={"".concat(formattedBankName, " xx").concat(withdrawalIDItem.accountNumber.slice(-4))} style={[styles.optionDisplayName, styles.sidebarLinkTextBold, styles.pre]}/>
                            <TextWithTooltip_1.default text={"".concat(formattedWithdrawalDate, "  ").concat(translate('common.withdrawalID'), ": ").concat(withdrawalIDItem.entryID)} style={[styles.textLabelSupporting, styles.lh16, styles.pre]}/>
                        </react_native_1.View>
                    </react_native_1.View>
                </react_native_1.View>
                <react_native_1.View style={[styles.flexShrink0, styles.mr3]}>
                    <TotalCell_1.default total={withdrawalIDItem.total} currency={withdrawalIDItem.currency}/>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
WithdrawalIDListItemHeader.displayName = 'WithdrawalIDListItemHeader';
exports.default = WithdrawalIDListItemHeader;
