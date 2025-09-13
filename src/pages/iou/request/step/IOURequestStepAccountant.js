"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const IOU_1 = require("@libs/actions/IOU");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const MoneyRequestAccountantSelector_1 = require("@pages/iou/request/MoneyRequestAccountantSelector");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepAccountant({ route: { params: { transactionID, reportID, iouType, backTo, action }, }, }) {
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email, canBeMissing: false });
    const { translate } = (0, useLocalize_1.default)();
    const setAccountant = (0, react_1.useCallback)((accountant) => {
        (0, IOU_1.setMoneyRequestAccountant)(transactionID, accountant, true);
    }, [transactionID]);
    const navigateToNextStep = (0, react_1.useCallback)(() => {
        // Sharing with an accountant involves inviting them to the workspace and that requires admin access.
        const hasActiveAdminWorkspaces = (0, PolicyUtils_1.hasActiveAdminWorkspaces)(currentUserLogin);
        if (!hasActiveAdminWorkspaces) {
            (0, ReportUtils_1.createDraftWorkspaceAndNavigateToConfirmationScreen)(transactionID, action);
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_PARTICIPANTS.getRoute(iouType, transactionID, reportID, Navigation_1.default.getActiveRoute(), action));
    }, [iouType, transactionID, reportID, action, currentUserLogin]);
    const navigateBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo);
    }, [backTo]);
    return (<StepScreenWrapper_1.default headerTitle={translate('iou.whoIsYourAccountant')} onBackButtonPress={navigateBack} shouldShowWrapper testID={IOURequestStepAccountant.displayName}>
            <MoneyRequestAccountantSelector_1.default onFinish={navigateToNextStep} onAccountantSelected={setAccountant} iouType={iouType} action={action}/>
        </StepScreenWrapper_1.default>);
}
IOURequestStepAccountant.displayName = 'IOURequestStepAccountant';
exports.default = (0, withWritableReportOrNotFound_1.default)(IOURequestStepAccountant);
