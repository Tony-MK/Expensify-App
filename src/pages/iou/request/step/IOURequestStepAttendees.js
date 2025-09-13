"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useTransactionViolations_1 = require("@hooks/useTransactionViolations");
const IOU_1 = require("@libs/actions/IOU");
const Navigation_1 = require("@libs/Navigation/Navigation");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const MoneyRequestAttendeeSelector_1 = require("@pages/iou/request/MoneyRequestAttendeeSelector");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepAttendees({ route: { params: { transactionID, reportID, iouType, backTo, action }, }, policy, policyTags, policyCategories, }) {
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    // eslint-disable-next-line rulesdir/no-default-id-values
    const [transaction] = (0, useOnyx_1.default)(`${isEditing ? ONYXKEYS_1.default.COLLECTION.TRANSACTION : ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID || CONST_1.default.DEFAULT_NUMBER_ID}`, { canBeMissing: true });
    const [attendees, setAttendees] = (0, react_1.useState)(() => (0, TransactionUtils_1.getAttendees)(transaction));
    const previousAttendees = (0, usePrevious_1.default)(attendees);
    const { translate } = (0, useLocalize_1.default)();
    const transactionViolations = (0, useTransactionViolations_1.default)(transactionID);
    const saveAttendees = (0, react_1.useCallback)(() => {
        if (attendees.length <= 0) {
            return;
        }
        if (!(0, fast_equals_1.deepEqual)(previousAttendees, attendees)) {
            (0, IOU_1.setMoneyRequestAttendees)(transactionID, attendees, !isEditing);
            if (isEditing) {
                (0, IOU_1.updateMoneyRequestAttendees)(transactionID, reportID, attendees, policy, policyTags, policyCategories, transactionViolations ?? undefined);
            }
        }
        Navigation_1.default.goBack(backTo);
    }, [attendees, backTo, isEditing, policy, policyCategories, policyTags, previousAttendees, reportID, transactionID, transactionViolations]);
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    return (<StepScreenWrapper_1.default headerTitle={translate('iou.attendees')} onBackButtonPress={navigateBack} shouldShowWrapper testID={IOURequestStepAttendees.displayName}>
            <MoneyRequestAttendeeSelector_1.default onFinish={saveAttendees} onAttendeesAdded={(v) => setAttendees(v)} attendees={attendees} iouType={iouType} action={action}/>
        </StepScreenWrapper_1.default>);
}
IOURequestStepAttendees.displayName = 'IOURequestStepAttendees';
exports.default = (0, withWritableReportOrNotFound_1.default)(IOURequestStepAttendees);
