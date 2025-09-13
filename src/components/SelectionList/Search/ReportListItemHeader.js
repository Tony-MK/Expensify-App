"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Checkbox_1 = require("@components/Checkbox");
var ReportSearchHeader_1 = require("@components/ReportSearchHeader");
var SearchContext_1 = require("@components/Search/SearchContext");
var useOnyx_1 = require("@hooks/useOnyx");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Search_1 = require("@userActions/Search");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ActionCell_1 = require("./ActionCell");
var TotalCell_1 = require("./TotalCell");
var UserInfoAndActionButtonRow_1 = require("./UserInfoAndActionButtonRow");
function HeaderFirstRow(_a) {
    var _b;
    var reportItem = _a.report, onCheckboxPress = _a.onCheckboxPress, isDisabled = _a.isDisabled, canSelectMultiple = _a.canSelectMultiple, _c = _a.handleOnButtonPress, handleOnButtonPress = _c === void 0 ? function () { } : _c, _d = _a.shouldShowAction, shouldShowAction = _d === void 0 ? false : _d, avatarBorderColor = _a.avatarBorderColor, isSelectAllChecked = _a.isSelectAllChecked, isIndeterminate = _a.isIndeterminate;
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var _e = (0, react_1.useMemo)(function () {
        var _a, _b;
        var reportTotal = (_a = reportItem.total) !== null && _a !== void 0 ? _a : 0;
        if (reportTotal) {
            if (reportItem.type === CONST_1.default.REPORT.TYPE.IOU) {
                reportTotal = Math.abs(reportTotal !== null && reportTotal !== void 0 ? reportTotal : 0);
            }
            else {
                reportTotal *= reportItem.type === CONST_1.default.REPORT.TYPE.EXPENSE || reportItem.type === CONST_1.default.REPORT.TYPE.INVOICE ? -1 : 1;
            }
        }
        var reportCurrency = (_b = reportItem.currency) !== null && _b !== void 0 ? _b : CONST_1.default.CURRENCY.USD;
        return { total: reportTotal, currency: reportCurrency };
    }, [reportItem.type, reportItem.total, reportItem.currency]), total = _e.total, currency = _e.currency;
    return (<react_native_1.View style={[styles.pt0, styles.flexRow, styles.alignItemsCenter, styles.justifyContentStart, styles.pr3, styles.pl3]}>
            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mnh40, styles.flex1, styles.gap3]}>
                {!!canSelectMultiple && (<Checkbox_1.default onPress={function () { return onCheckboxPress === null || onCheckboxPress === void 0 ? void 0 : onCheckboxPress(reportItem); }} isChecked={isSelectAllChecked} isIndeterminate={isIndeterminate} containerStyle={[StyleUtils.getCheckboxContainerStyle(20), StyleUtils.getMultiselectListStyles(!!reportItem.isSelected, !!reportItem.isDisabled)]} disabled={!!isDisabled || reportItem.isDisabledCheckbox} accessibilityLabel={(_b = reportItem.text) !== null && _b !== void 0 ? _b : ''} shouldStopMouseDownPropagation style={[styles.cursorUnset, StyleUtils.getCheckboxPressableStyle(), reportItem.isDisabledCheckbox && styles.cursorDisabled]}/>)}
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
function ReportListItemHeader(_a) {
    var _b, _c;
    var reportItem = _a.report, onSelectRow = _a.onSelectRow, onCheckboxPress = _a.onCheckboxPress, isDisabled = _a.isDisabled, isFocused = _a.isFocused, canSelectMultiple = _a.canSelectMultiple, isSelectAllChecked = _a.isSelectAllChecked, isIndeterminate = _a.isIndeterminate;
    var StyleUtils = (0, useStyleUtils_1.default)();
    var theme = (0, useTheme_1.default)();
    var _d = (0, SearchContext_1.useSearchContext)(), currentSearchHash = _d.currentSearchHash, currentSearchKey = _d.currentSearchKey;
    var _e = (0, useResponsiveLayout_1.default)(), isLargeScreenWidth = _e.isLargeScreenWidth, shouldUseNarrowLayout = _e.shouldUseNarrowLayout;
    var lastPaymentMethod = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, { canBeMissing: true })[0];
    var thereIsFromAndTo = !!(reportItem === null || reportItem === void 0 ? void 0 : reportItem.from) && !!(reportItem === null || reportItem === void 0 ? void 0 : reportItem.to);
    var showUserInfo = (reportItem.type === CONST_1.default.REPORT.TYPE.IOU && thereIsFromAndTo) || (reportItem.type === CONST_1.default.REPORT.TYPE.EXPENSE && !!(reportItem === null || reportItem === void 0 ? void 0 : reportItem.from));
    var snapshot = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(currentSearchHash), { canBeMissing: true })[0];
    var snapshotReport = (0, react_1.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = snapshot === null || snapshot === void 0 ? void 0 : snapshot.data) === null || _a === void 0 ? void 0 : _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportItem.reportID)]) !== null && _b !== void 0 ? _b : {});
    }, [snapshot, reportItem.reportID]);
    var snapshotPolicy = (0, react_1.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = snapshot === null || snapshot === void 0 ? void 0 : snapshot.data) === null || _a === void 0 ? void 0 : _a["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(reportItem.policyID)]) !== null && _b !== void 0 ? _b : {});
    }, [snapshot, reportItem.policyID]);
    var avatarBorderColor = (_c = (_b = StyleUtils.getItemBackgroundColorStyle(!!reportItem.isSelected, !!isFocused, !!isDisabled, theme.activeComponentBG, theme.hoverComponentBG)) === null || _b === void 0 ? void 0 : _b.backgroundColor) !== null && _c !== void 0 ? _c : theme.highlightBG;
    var handleOnButtonPress = function () {
        (0, Search_1.handleActionButtonPress)(currentSearchHash, reportItem, function () { return onSelectRow(reportItem); }, shouldUseNarrowLayout && !!canSelectMultiple, snapshotReport, snapshotPolicy, lastPaymentMethod, currentSearchKey);
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
