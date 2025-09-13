"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Fullstory_1 = require("@libs/Fullstory");
const ReportActionItem_1 = require("@pages/home/report/ReportActionItem");
const variables_1 = require("@styles/variables");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const BaseListItem_1 = require("./BaseListItem");
function ChatListItem({ item, isFocused, showTooltip, isDisabled, canSelectMultiple, onSelectRow, onDismissError, onFocus, onLongPressRow, shouldSyncFocus, policies, allReports, userWalletTierName, isUserValidated, personalDetails, userBillingFundID, }) {
    const reportActionItem = item;
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportActionItem?.reportID}`];
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: variables_1.default.componentBorderRadius,
        shouldHighlight: item?.shouldAnimateInHighlight ?? false,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.highlightBG,
    });
    const pressableStyle = [
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
    const fsClass = Fullstory_1.default.getChatFSClass(personalDetails, report);
    return (<BaseListItem_1.default item={item} pressableStyle={pressableStyle} wrapperStyle={[styles.flex1, styles.justifyContentBetween, styles.userSelectNone]} containerStyle={styles.mb2} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} canSelectMultiple={canSelectMultiple} onLongPressRow={onLongPressRow} onSelectRow={onSelectRow} onDismissError={onDismissError} pendingAction={item.pendingAction} keyForList={item.keyForList} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus} pressableWrapperStyle={[styles.mh5, animatedHighlightStyle]} hoverStyle={item.isSelected && styles.activeComponentBG} forwardedFSClass={fsClass}>
            <ReportActionItem_1.default allReports={allReports} action={reportActionItem} report={report} reportActions={[]} onPress={() => onSelectRow(item)} parentReportAction={undefined} displayAsGroup={false} isMostRecentIOUReportAction={false} shouldDisplayNewMarker={false} index={item.index ?? 0} isFirstVisibleReportAction={false} shouldDisplayContextMenu={false} shouldShowDraftMessage={false} policies={policies} shouldShowBorder userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} userBillingFundID={userBillingFundID}/>
        </BaseListItem_1.default>);
}
ChatListItem.displayName = 'ChatListItem';
exports.default = ChatListItem;
