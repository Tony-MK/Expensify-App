"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const variables_1 = require("@styles/variables");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isReportUnread = ({ lastReadTime = '', lastVisibleActionCreated = '', lastMentionedTime = '' }) => lastReadTime < lastVisibleActionCreated || lastReadTime < (lastMentionedTime ?? '');
function ChatBubbleCell({ transaction, containerStyles, isInSingleTransactionReport }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const nonEmptyStringTransactionReportID = (0, getNonEmptyStringOnyxID_1.default)(transaction.reportID);
    const [iouReportAction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${nonEmptyStringTransactionReportID}`, {
        selector: (reportActions) => (0, ReportActionsUtils_1.getIOUActionForTransactionID)(Object.values(reportActions ?? {}), transaction.transactionID),
        canBeMissing: true,
    });
    const [childReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReportAction?.childReportID}`, {
        canBeMissing: true,
    });
    const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${nonEmptyStringTransactionReportID}`, {
        canBeMissing: false,
    });
    const transactionReport = isInSingleTransactionReport ? parentReport : childReport;
    const threadMessages = (0, react_1.useMemo)(() => ({
        count: (iouReportAction && iouReportAction?.childVisibleActionCount) ?? 0,
        isUnread: (0, ReportUtils_1.isChatThread)(transactionReport) && isReportUnread(transactionReport),
    }), [iouReportAction, transactionReport]);
    const StyleUtils = (0, useStyleUtils_1.default)();
    const iconSize = shouldUseNarrowLayout ? variables_1.default.iconSizeSmall : variables_1.default.iconSizeNormal;
    const fontSize = shouldUseNarrowLayout ? variables_1.default.fontSizeXXSmall : variables_1.default.fontSizeExtraSmall;
    return (threadMessages.count > 0 && (<react_native_1.View style={[styles.dFlex, styles.alignItemsCenter, styles.justifyContentCenter, styles.textAlignCenter, StyleUtils.getWidthAndHeightStyle(iconSize), containerStyles]}>
                <Icon_1.default src={Expensicons_1.ChatBubbleCounter} additionalStyles={[styles.pAbsolute]} fill={threadMessages.isUnread ? theme.iconMenu : theme.icon} width={iconSize} height={iconSize}/>
                <Text_1.default style={[
            styles.textBold,
            StyleUtils.getLineHeightStyle(variables_1.default.lineHeightXSmall),
            StyleUtils.getColorStyle(theme.appBG),
            StyleUtils.getFontSizeStyle(fontSize),
            { top: -1 },
        ]}>
                    {threadMessages.count > 99 ? '99+' : threadMessages.count}
                </Text_1.default>
            </react_native_1.View>));
}
ChatBubbleCell.displayName = 'ChatBubbleCell';
exports.default = ChatBubbleCell;
