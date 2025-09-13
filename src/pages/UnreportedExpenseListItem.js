"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var utils_1 = require("@components/Button/utils");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var Pressable_1 = require("@components/Pressable");
var TransactionItemRow_1 = require("@components/TransactionItemRow");
var useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useSyncFocus_1 = require("@hooks/useSyncFocus");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function UnreportedExpenseListItem(_a) {
    var _b;
    var _c, _d, _e;
    var item = _a.item, isFocused = _a.isFocused, showTooltip = _a.showTooltip, isDisabled = _a.isDisabled, onFocus = _a.onFocus, shouldSyncFocus = _a.shouldSyncFocus, onSelectRow = _a.onSelectRow, violations = _a.violations;
    var styles = (0, useThemeStyles_1.default)();
    var transactionItem = item;
    var _f = (0, react_1.useState)(false), isSelected = _f[0], setIsSelected = _f[1];
    var theme = (0, useTheme_1.default)();
    var pressableStyle = [styles.transactionListItemStyle, isSelected && styles.activeComponentBG];
    var animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: variables_1.default.componentBorderRadius,
        shouldHighlight: (_c = item === null || item === void 0 ? void 0 : item.shouldAnimateInHighlight) !== null && _c !== void 0 ? _c : false,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.highlightBG,
    });
    var StyleUtils = (0, useStyleUtils_1.default)();
    var pressableRef = (0, react_1.useRef)(null);
    (0, useSyncFocus_1.default)(pressableRef, !!isFocused, shouldSyncFocus);
    return (<OfflineWithFeedback_1.default pendingAction={item.pendingAction}>
            <Pressable_1.PressableWithFeedback ref={pressableRef} onPress={function () {
            onSelectRow(item);
            setIsSelected(function (val) { return !val; });
        }} disabled={isDisabled && !isSelected} accessibilityLabel={(_d = item.text) !== null && _d !== void 0 ? _d : ''} role={(0, utils_1.getButtonRole)(true)} isNested onMouseDown={function (e) { return e.preventDefault(); }} hoverStyle={[!item.isDisabled && styles.hoveredComponentBG, isSelected && styles.activeComponentBG]} dataSet={_b = {}, _b[CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT] = true, _b[CONST_1.default.INNER_BOX_SHADOW_ELEMENT] = false, _b} id={(_e = item.keyForList) !== null && _e !== void 0 ? _e : ''} style={[pressableStyle, isFocused && StyleUtils.getItemBackgroundColorStyle(!!isSelected, !!isFocused, !!item.isDisabled, theme.activeComponentBG, theme.hoverComponentBG)]} onFocus={onFocus} wrapperStyle={[styles.mb2, styles.mh5, styles.flex1, animatedHighlightStyle, styles.userSelectNone]}>
                <TransactionItemRow_1.default transactionItem={transactionItem} violations={violations === null || violations === void 0 ? void 0 : violations["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transactionItem.transactionID)]} shouldUseNarrowLayout isSelected={isSelected} shouldShowTooltip={showTooltip} dateColumnSize={CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL} amountColumnSize={CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL} taxAmountColumnSize={CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL} onCheckboxPress={function () {
            onSelectRow(item);
            setIsSelected(function (val) { return !val; });
        }} shouldShowCheckbox style={styles.p3}/>
            </Pressable_1.PressableWithFeedback>
        </OfflineWithFeedback_1.default>);
}
UnreportedExpenseListItem.displayName = 'UnreportedExpenseListItem';
exports.default = UnreportedExpenseListItem;
