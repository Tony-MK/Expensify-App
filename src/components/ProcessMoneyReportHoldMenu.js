"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const DecisionModal_1 = require("./DecisionModal");
function ProcessMoneyReportHoldMenu({ requestType, nonHeldAmount, fullAmount, onClose, isVisible, paymentType, chatReport, moneyRequestReport, transactionCount, startAnimation, }) {
    const { translate } = (0, useLocalize_1.default)();
    const isApprove = requestType === CONST_1.default.IOU.REPORT_ACTION_TYPE.APPROVE;
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to apply the correct modal type
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const onSubmit = (full) => {
        if (isApprove) {
            if (startAnimation) {
                startAnimation();
            }
            (0, IOU_1.approveMoneyRequest)(moneyRequestReport, full);
            if (!full && (0, ReportActionsUtils_1.isLinkedTransactionHeld)(Navigation_1.default.getTopmostReportActionId(), moneyRequestReport?.reportID)) {
                Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID.getRoute(moneyRequestReport?.reportID));
            }
        }
        else if (chatReport && paymentType) {
            if (startAnimation) {
                startAnimation();
            }
            (0, IOU_1.payMoneyRequest)(paymentType, chatReport, moneyRequestReport, undefined, full);
        }
        onClose();
    };
    const promptText = (0, react_1.useMemo)(() => {
        if (nonHeldAmount) {
            return translate(isApprove ? 'iou.confirmApprovalAmount' : 'iou.confirmPayAmount');
        }
        return translate(isApprove ? 'iou.confirmApprovalAllHoldAmount' : 'iou.confirmPayAllHoldAmount', { count: transactionCount });
    }, [nonHeldAmount, transactionCount, translate, isApprove]);
    return (<DecisionModal_1.default title={translate(isApprove ? 'iou.confirmApprove' : 'iou.confirmPay')} onClose={onClose} isVisible={isVisible} prompt={promptText} firstOptionText={nonHeldAmount ? `${translate(isApprove ? 'iou.approveOnly' : 'iou.payOnly')} ${nonHeldAmount}` : undefined} secondOptionText={`${translate(isApprove ? 'iou.approve' : 'iou.pay')} ${fullAmount}`} onFirstOptionSubmit={() => onSubmit(false)} onSecondOptionSubmit={() => onSubmit(true)} isSmallScreenWidth={isSmallScreenWidth}/>);
}
ProcessMoneyReportHoldMenu.displayName = 'ProcessMoneyReportHoldMenu';
exports.default = ProcessMoneyReportHoldMenu;
