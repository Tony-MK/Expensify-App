"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Fullstory_1 = require("@libs/Fullstory");
var ReportActionItem_1 = require("@pages/home/report/ReportActionItem");
var variables_1 = require("@styles/variables");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var BaseListItem_1 = require("./BaseListItem");
function ChatListItem(_a) {
    var _b, _c;
    var item = _a.item, isFocused = _a.isFocused, showTooltip = _a.showTooltip, isDisabled = _a.isDisabled, canSelectMultiple = _a.canSelectMultiple, onSelectRow = _a.onSelectRow, onDismissError = _a.onDismissError, onFocus = _a.onFocus, onLongPressRow = _a.onLongPressRow, shouldSyncFocus = _a.shouldSyncFocus, policies = _a.policies, allReports = _a.allReports, userWalletTierName = _a.userWalletTierName, isUserValidated = _a.isUserValidated, personalDetails = _a.personalDetails, userBillingFundID = _a.userBillingFundID;
    var reportActionItem = item;
    var report = allReports === null || allReports === void 0 ? void 0 : allReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportActionItem === null || reportActionItem === void 0 ? void 0 : reportActionItem.reportID)];
    var styles = (0, useThemeStyles_1.default)();
    var theme = (0, useTheme_1.default)();
    var animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: variables_1.default.componentBorderRadius,
        shouldHighlight: (_b = item === null || item === void 0 ? void 0 : item.shouldAnimateInHighlight) !== null && _b !== void 0 ? _b : false,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.highlightBG,
    });
    var pressableStyle = [
        styles.selectionListPressableItemWrapper,
        styles.p0,
        styles.textAlignLeft,
        styles.overflowHidden,
        // Removing background style because they are added to the parent OpacityView via animatedHighlightStyle
        styles.bgTransparent,
        item.isSelected && styles.activeComponentBG,
        styles.mh0,
        item.cursorStyle,
    ];
    var fsClass = Fullstory_1.default.getChatFSClass(personalDetails, report);
    return (<BaseListItem_1.default item={item} pressableStyle={pressableStyle} wrapperStyle={[styles.flex1, styles.justifyContentBetween, styles.userSelectNone]} containerStyle={styles.mb2} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} canSelectMultiple={canSelectMultiple} onLongPressRow={onLongPressRow} onSelectRow={onSelectRow} onDismissError={onDismissError} pendingAction={item.pendingAction} keyForList={item.keyForList} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus} pressableWrapperStyle={[styles.mh5, animatedHighlightStyle]} hoverStyle={item.isSelected && styles.activeComponentBG} forwardedFSClass={fsClass}>
            <ReportActionItem_1.default allReports={allReports} action={reportActionItem} report={report} reportActions={[]} onPress={function () { return onSelectRow(item); }} parentReportAction={undefined} displayAsGroup={false} isMostRecentIOUReportAction={false} shouldDisplayNewMarker={false} index={(_c = item.index) !== null && _c !== void 0 ? _c : 0} isFirstVisibleReportAction={false} shouldDisplayContextMenu={false} shouldShowDraftMessage={false} policies={policies} shouldShowBorder userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} userBillingFundID={userBillingFundID}/>
        </BaseListItem_1.default>);
}
ChatListItem.displayName = 'ChatListItem';
exports.default = ChatListItem;
