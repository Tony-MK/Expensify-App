"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Checkbox_1 = require("@components/Checkbox");
const Icon_1 = require("@components/Icon");
const BankIcons_1 = require("@components/Icon/BankIcons");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const CONST_1 = require("@src/CONST");
const TotalCell_1 = require("./TotalCell");
function WithdrawalIDListItemHeader({ withdrawalID: withdrawalIDItem, onCheckboxPress, isDisabled, canSelectMultiple, isIndeterminate, isSelectAllChecked, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { icon, iconSize, iconStyles } = (0, BankIcons_1.default)({ bankName: withdrawalIDItem.bankName, styles });
    const formattedBankName = CONST_1.default.BANK_NAMES_USER_FRIENDLY[withdrawalIDItem.bankName] ?? CONST_1.default.BANK_NAMES_USER_FRIENDLY[CONST_1.default.BANK_NAMES.GENERIC_BANK];
    const formattedWithdrawalDate = DateUtils_1.default.formatWithUTCTimeZone(withdrawalIDItem.debitPosted, DateUtils_1.default.doesDateBelongToAPastYear(withdrawalIDItem.debitPosted) ? CONST_1.default.DATE.MONTH_DAY_YEAR_ABBR_FORMAT : CONST_1.default.DATE.MONTH_DAY_ABBR_FORMAT);
    return (<react_native_1.View>
            <react_native_1.View style={[styles.pv1Half, styles.ph3, styles.flexRow, styles.alignItemsCenter, styles.justifyContentStart]}>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mnh40, styles.flex1, styles.gap3]}>
                    {!!canSelectMultiple && (<Checkbox_1.default onPress={() => onCheckboxPress?.(withdrawalIDItem)} isChecked={isSelectAllChecked} disabled={!!isDisabled || withdrawalIDItem.isDisabledCheckbox} accessibilityLabel={translate('common.select')} isIndeterminate={isIndeterminate}/>)}
                    <react_native_1.View style={[styles.flexRow, styles.flex1, styles.gap3]}>
                        <Icon_1.default src={icon} width={iconSize} height={iconSize} additionalStyles={iconStyles}/>
                        <react_native_1.View style={[styles.gapHalf, styles.flexShrink1]}>
                            <TextWithTooltip_1.default text={`${formattedBankName} xx${withdrawalIDItem.accountNumber.slice(-4)}`} style={[styles.optionDisplayName, styles.sidebarLinkTextBold, styles.pre]}/>
                            <TextWithTooltip_1.default text={`${formattedWithdrawalDate}  ${translate('common.withdrawalID')}: ${withdrawalIDItem.entryID}`} style={[styles.textLabelSupporting, styles.lh16, styles.pre]}/>
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
