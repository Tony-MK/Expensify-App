"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const ReportActionItem_1 = require("@pages/home/report/ReportActionItem");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function DuplicateTransactionItem({ transaction, index, allReports, policies }) {
    const styles = (0, useThemeStyles_1.default)();
    const [userWalletTierName] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { selector: (wallet) => wallet?.tierName, canBeMissing: false });
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: true });
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [userBillingFundID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BILLING_FUND_ID, { canBeMissing: true });
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction?.reportID}`];
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report?.reportID}`, { canBeMissing: false });
    const [tryNewDot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: false });
    const isTryNewDotNVPDismissed = !!tryNewDot?.classicRedirect?.dismissed;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/non-nullable-type-assertion-style
    const action = Object.values(reportActions ?? {})?.find((reportAction) => {
        const IOUTransactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(reportAction)?.IOUTransactionID : CONST_1.default.DEFAULT_NUMBER_ID;
        return IOUTransactionID === transaction?.transactionID;
    });
    const originalReportID = (0, ReportUtils_1.getOriginalReportID)(report?.reportID, action);
    const [draftMessage] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}${originalReportID}`, {
        canBeMissing: true,
    });
    const [emojiReactions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${action?.reportActionID}`, {
        canBeMissing: true,
    });
    const [linkedTransactionRouteError] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, ReportActionsUtils_1.isMoneyRequestAction)(action) && (0, ReportActionsUtils_1.getOriginalMessage)(action)?.IOUTransactionID}`, {
        canBeMissing: true,
        selector: (transactionItem) => transactionItem?.errorFields?.route ?? null,
    });
    if (!action || !report) {
        return null;
    }
    const reportDraftMessage = draftMessage?.[action.reportActionID];
    const matchingDraftMessage = typeof reportDraftMessage === 'string' ? reportDraftMessage : reportDraftMessage?.message;
    return (<react_native_1.View style={styles.pb2}>
            <ReportActionItem_1.default allReports={allReports} policies={policies} action={action} report={report} parentReportAction={(0, ReportActionsUtils_1.getReportAction)(report?.parentReportID, report?.parentReportActionID)} index={index} reportActions={Object.values(reportActions ?? {})} displayAsGroup={false} shouldDisplayNewMarker={false} isMostRecentIOUReportAction={false} isFirstVisibleReportAction={false} shouldDisplayContextMenu={false} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} draftMessage={matchingDraftMessage} emojiReactions={emojiReactions} linkedTransactionRouteError={linkedTransactionRouteError} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed}/>
        </react_native_1.View>);
}
DuplicateTransactionItem.displayName = 'DuplicateTransactionItem';
exports.default = DuplicateTransactionItem;
