"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Checkbox_1 = require("@components/Checkbox");
const ReportSearchHeader_1 = require("@components/ReportSearchHeader");
const SearchContext_1 = require("@components/Search/SearchContext");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@userActions/Search");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ActionCell_1 = require("./ActionCell");
const TotalCell_1 = require("./TotalCell");
const UserInfoAndActionButtonRow_1 = require("./UserInfoAndActionButtonRow");
function HeaderFirstRow({ report: reportItem, onCheckboxPress, isDisabled, canSelectMultiple, handleOnButtonPress = () => { }, shouldShowAction = false, avatarBorderColor, isSelectAllChecked, isIndeterminate, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { total, currency } = (0, react_1.useMemo)(() => {
        let reportTotal = reportItem.total ?? 0;
        if (reportTotal) {
            if (reportItem.type === CONST_1.default.REPORT.TYPE.IOU) {
                reportTotal = Math.abs(reportTotal ?? 0);
            }
            else {
                reportTotal *= reportItem.type === CONST_1.default.REPORT.TYPE.EXPENSE || reportItem.type === CONST_1.default.REPORT.TYPE.INVOICE ? -1 : 1;
            }
        }
        const reportCurrency = reportItem.currency ?? CONST_1.default.CURRENCY.USD;
        return { total: reportTotal, currency: reportCurrency };
    }, [reportItem.type, reportItem.total, reportItem.currency]);
    return (<react_native_1.View style={[styles.pt0, styles.flexRow, styles.alignItemsCenter, styles.justifyContentStart, styles.pr3, styles.pl3]}>
            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mnh40, styles.flex1, styles.gap3]}>
                {!!canSelectMultiple && (<Checkbox_1.default onPress={() => onCheckboxPress?.(reportItem)} isChecked={isSelectAllChecked} isIndeterminate={isIndeterminate} containerStyle={[StyleUtils.getCheckboxContainerStyle(20), StyleUtils.getMultiselectListStyles(!!reportItem.isSelected, !!reportItem.isDisabled)]} disabled={!!isDisabled || reportItem.isDisabledCheckbox} accessibilityLabel={reportItem.text ?? ''} shouldStopMouseDownPropagation style={[styles.cursorUnset, StyleUtils.getCheckboxPressableStyle(), reportItem.isDisabledCheckbox && styles.cursorDisabled]}/>)}
                <react_native_1.View style={[{ flexShrink: 1, flexGrow: 1, minWidth: 0 }, styles.mr2]}>
                    <ReportSearchHeader_1.default report={reportItem} style={[{ maxWidth: 700 }]} transactions={reportItem.transactions} avatarBorderColor={avatarBorderColor}/>
                </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={[styles.flexShrink0, shouldShowAction && styles.mr3]}>
                <TotalCell_1.default total={total} currency={currency}/>
            </react_native_1.View>
            {shouldShowAction && (<react_native_1.View style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.ACTION)]}>
                    <ActionCell_1.default action={reportItem.action} goToItem={handleOnButtonPress} isSelected={reportItem.isSelected} isLoading={reportItem.isActionLoading} policyID={reportItem.policyID} reportID={reportItem.reportID} hash={reportItem.hash} amount={reportItem.total}/>
                </react_native_1.View>)}
        </react_native_1.View>);
}
function ReportListItemHeader({ report: reportItem, onSelectRow, onCheckboxPress, isDisabled, isFocused, canSelectMultiple, isSelectAllChecked, isIndeterminate, }) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const theme = (0, useTheme_1.default)();
    const { currentSearchHash, currentSearchKey } = (0, SearchContext_1.useSearchContext)();
    const { isLargeScreenWidth, shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [lastPaymentMethod] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, { canBeMissing: true });
    const thereIsFromAndTo = !!reportItem?.from && !!reportItem?.to;
    const showUserInfo = (reportItem.type === CONST_1.default.REPORT.TYPE.IOU && thereIsFromAndTo) || (reportItem.type === CONST_1.default.REPORT.TYPE.EXPENSE && !!reportItem?.from);
    const [snapshot] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${currentSearchHash}`, { canBeMissing: true });
    const snapshotReport = (0, react_1.useMemo)(() => {
        return (snapshot?.data?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportItem.reportID}`] ?? {});
    }, [snapshot, reportItem.reportID]);
    const snapshotPolicy = (0, react_1.useMemo)(() => {
        return (snapshot?.data?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${reportItem.policyID}`] ?? {});
    }, [snapshot, reportItem.policyID]);
    const avatarBorderColor = StyleUtils.getItemBackgroundColorStyle(!!reportItem.isSelected, !!isFocused, !!isDisabled, theme.activeComponentBG, theme.hoverComponentBG)?.backgroundColor ?? theme.highlightBG;
    const handleOnButtonPress = () => {
        (0, Search_1.handleActionButtonPress)(currentSearchHash, reportItem, () => onSelectRow(reportItem), shouldUseNarrowLayout && !!canSelectMultiple, snapshotReport, snapshotPolicy, lastPaymentMethod, currentSearchKey);
    };
    return !isLargeScreenWidth ? (<react_native_1.View>
            <HeaderFirstRow report={reportItem} onCheckboxPress={onCheckboxPress} isDisabled={isDisabled} canSelectMultiple={canSelectMultiple} avatarBorderColor={avatarBorderColor} isSelectAllChecked={isSelectAllChecked} isIndeterminate={isIndeterminate}/>
            <UserInfoAndActionButtonRow_1.default item={reportItem} handleActionButtonPress={handleOnButtonPress} shouldShowUserInfo={showUserInfo}/>
        </react_native_1.View>) : (<react_native_1.View>
            <HeaderFirstRow report={reportItem} onCheckboxPress={onCheckboxPress} isDisabled={isDisabled} canSelectMultiple={canSelectMultiple} shouldShowAction handleOnButtonPress={handleOnButtonPress} avatarBorderColor={avatarBorderColor} isSelectAllChecked={isSelectAllChecked} isIndeterminate={isIndeterminate}/>
        </react_native_1.View>);
}
ReportListItemHeader.displayName = 'ReportListItemHeader';
exports.default = ReportListItemHeader;
