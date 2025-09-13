"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ScrollView_1 = require("@components/ScrollView");
const useOnyx_1 = require("@hooks/useOnyx");
const ReportActionItem_1 = require("@pages/home/report/ReportActionItem");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function DebugReportActionPreview({ reportAction, reportID }) {
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [userWalletTierName] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { selector: (wallet) => wallet?.tierName, canBeMissing: false });
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: true });
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [userBillingFundID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BILLING_FUND_ID, { canBeMissing: true });
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const [tryNewDot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: false });
    const isTryNewDotNVPDismissed = !!tryNewDot?.classicRedirect?.dismissed;
    return (<ScrollView_1.default>
            <ReportActionItem_1.default allReports={allReports} policies={policies} action={reportAction ?? {}} report={report ?? {}} reportActions={[]} parentReportAction={undefined} displayAsGroup={false} isMostRecentIOUReportAction={false} shouldDisplayNewMarker={false} index={0} isFirstVisibleReportAction={false} shouldDisplayContextMenu={false} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed}/>
        </ScrollView_1.default>);
}
DebugReportActionPreview.displayName = 'DebugReportActionPreview';
exports.default = DebugReportActionPreview;
