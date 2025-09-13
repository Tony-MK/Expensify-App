"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var utils_1 = require("@components/Button/utils");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
var SearchContext_1 = require("@components/Search/SearchContext");
var TransactionItemRow_1 = require("@components/TransactionItemRow");
var useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
var useOnyx_1 = require("@hooks/useOnyx");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useSyncFocus_1 = require("@hooks/useSyncFocus");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Search_1 = require("@libs/actions/Search");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var UserInfoAndActionButtonRow_1 = require("./UserInfoAndActionButtonRow");
function TransactionListItem(_a) {
    var _b;
    var _c, _d, _e;
    var item = _a.item, isFocused = _a.isFocused, showTooltip = _a.showTooltip, isDisabled = _a.isDisabled, canSelectMultiple = _a.canSelectMultiple, onSelectRow = _a.onSelectRow, onCheckboxPress = _a.onCheckboxPress, onFocus = _a.onFocus, onLongPressRow = _a.onLongPressRow, shouldSyncFocus = _a.shouldSyncFocus, columns = _a.columns, isLoading = _a.isLoading, areAllOptionalColumnsHidden = _a.areAllOptionalColumnsHidden, violations = _a.violations;
    var transactionItem = item;
    var styles = (0, useThemeStyles_1.default)();
    var theme = (0, useTheme_1.default)();
    var _f = (0, useResponsiveLayout_1.default)(), isLargeScreenWidth = _f.isLargeScreenWidth, shouldUseNarrowLayout = _f.shouldUseNarrowLayout;
    var _g = (0, SearchContext_1.useSearchContext)(), currentSearchHash = _g.currentSearchHash, currentSearchKey = _g.currentSearchKey;
    var snapshot = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(currentSearchHash), { canBeMissing: true })[0];
    var snapshotReport = (0, react_1.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = snapshot === null || snapshot === void 0 ? void 0 : snapshot.data) === null || _a === void 0 ? void 0 : _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transactionItem.reportID)]) !== null && _b !== void 0 ? _b : {});
    }, [snapshot, transactionItem.reportID]);
    var snapshotPolicy = (0, react_1.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = snapshot === null || snapshot === void 0 ? void 0 : snapshot.data) === null || _a === void 0 ? void 0 : _a["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(transactionItem.policyID)]) !== null && _b !== void 0 ? _b : {});
    }, [snapshot, transactionItem.policyID]);
    var lastPaymentMethod = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD), { canBeMissing: true })[0];
    var pressableStyle = [
        styles.transactionListItemStyle,
        !isLargeScreenWidth && styles.pt3,
        item.isSelected && styles.activeComponentBG,
        isLargeScreenWidth ? __assign(__assign(__assign({}, styles.flexRow), styles.justifyContentBetween), styles.alignItemsCenter) : __assign(__assign({}, styles.flexColumn), styles.alignItemsStretch),
    ];
    var animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: variables_1.default.componentBorderRadius,
        shouldHighlight: (_c = item === null || item === void 0 ? void 0 : item.shouldAnimateInHighlight) !== null && _c !== void 0 ? _c : false,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.highlightBG,
    });
    var _h = (0, react_1.useMemo)(function () {
        return {
            amountColumnSize: transactionItem.isAmountColumnWide ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
            taxAmountColumnSize: transactionItem.isTaxAmountColumnWide ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
            dateColumnSize: transactionItem.shouldShowYear ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
        };
    }, [transactionItem]), amountColumnSize = _h.amountColumnSize, dateColumnSize = _h.dateColumnSize, taxAmountColumnSize = _h.taxAmountColumnSize;
    var handleActionButtonPress = (0, react_1.useCallback)(function () {
        (0, Search_1.handleActionButtonPress)(currentSearchHash, transactionItem, function () { return onSelectRow(item); }, shouldUseNarrowLayout && !!canSelectMultiple, snapshotReport, snapshotPolicy, lastPaymentMethod, currentSearchKey);
    }, [currentSearchHash, transactionItem, shouldUseNarrowLayout, canSelectMultiple, snapshotReport, snapshotPolicy, lastPaymentMethod, currentSearchKey, onSelectRow, item]);
    var handleCheckboxPress = (0, react_1.useCallback)(function () {
        onCheckboxPress === null || onCheckboxPress === void 0 ? void 0 : onCheckboxPress(item);
    }, [item, onCheckboxPress]);
    var onPress = (0, react_1.useCallback)(function () {
        onSelectRow(item);
    }, [item, onSelectRow]);
    var onLongPress = (0, react_1.useCallback)(function () {
        onLongPressRow === null || onLongPressRow === void 0 ? void 0 : onLongPressRow(item);
    }, [item, onLongPressRow]);
    var StyleUtils = (0, useStyleUtils_1.default)();
    var pressableRef = (0, react_1.useRef)(null);
    (0, useSyncFocus_1.default)(pressableRef, !!isFocused, shouldSyncFocus);
    return (<OfflineWithFeedback_1.default pendingAction={item.pendingAction}>
            <PressableWithFeedback_1.default ref={pressableRef} onLongPress={onLongPress} onPress={onPress} disabled={isDisabled && !item.isSelected} accessibilityLabel={(_d = item.text) !== null && _d !== void 0 ? _d : ''} role={(0, utils_1.getButtonRole)(true)} isNested onMouseDown={function (e) { return e.preventDefault(); }} hoverStyle={[!item.isDisabled && styles.hoveredComponentBG, item.isSelected && styles.activeComponentBG]} dataSet={_b = {}, _b[CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT] = true, _b[CONST_1.default.INNER_BOX_SHADOW_ELEMENT] = false, _b} id={(_e = item.keyForList) !== null && _e !== void 0 ? _e : ''} style={[
            pressableStyle,
            isFocused && StyleUtils.getItemBackgroundColorStyle(!!item.isSelected, !!isFocused, !!item.isDisabled, theme.activeComponentBG, theme.hoverComponentBG),
        ]} onFocus={onFocus} wrapperStyle={[styles.mb2, styles.mh5, styles.flex1, animatedHighlightStyle, styles.userSelectNone]}>
                {!isLargeScreenWidth && (<UserInfoAndActionButtonRow_1.default item={transactionItem} handleActionButtonPress={handleActionButtonPress} shouldShowUserInfo={!!(transactionItem === null || transactionItem === void 0 ? void 0 : transactionItem.from)}/>)}
                <TransactionItemRow_1.default transactionItem={transactionItem} report={transactionItem.report} shouldShowTooltip={showTooltip} onButtonPress={handleActionButtonPress} onCheckboxPress={handleCheckboxPress} shouldUseNarrowLayout={!isLargeScreenWidth} columns={columns} isActionLoading={isLoading !== null && isLoading !== void 0 ? isLoading : transactionItem.isActionLoading} isSelected={!!transactionItem.isSelected} dateColumnSize={dateColumnSize} amountColumnSize={amountColumnSize} taxAmountColumnSize={taxAmountColumnSize} shouldShowCheckbox={!!canSelectMultiple} style={[styles.p3, shouldUseNarrowLayout ? styles.pt2 : {}]} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden} violations={violations === null || violations === void 0 ? void 0 : violations["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transactionItem.transactionID)]}/>
            </PressableWithFeedback_1.default>
        </OfflineWithFeedback_1.default>);
}
TransactionListItem.displayName = 'TransactionListItem';
exports.default = TransactionListItem;
