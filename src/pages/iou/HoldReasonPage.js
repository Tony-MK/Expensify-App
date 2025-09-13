"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useAncestorReportsAndReportActions_1 = require("@hooks/useAncestorReportsAndReportActions");
const useLocalize_1 = require("@hooks/useLocalize");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const FormActions_1 = require("@userActions/FormActions");
const IOU_1 = require("@userActions/IOU");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MoneyRequestHoldReasonForm_1 = require("@src/types/form/MoneyRequestHoldReasonForm");
const HoldReasonFormView_1 = require("./HoldReasonFormView");
function HoldReasonPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const { transactionID, reportID, backTo, searchHash } = route.params;
    const { report, ancestorReportsAndReportActions } = (0, useAncestorReportsAndReportActions_1.default)(reportID, true);
    // We first check if the report is part of a policy - if not, then it's a personal request (1:1 request)
    // For personal requests, we need to allow both users to put the request on hold
    const isWorkspaceRequest = (0, ReportUtils_1.isReportInGroupPolicy)(report);
    const parentReportAction = ancestorReportsAndReportActions.at(-1)?.reportAction;
    const onSubmit = (values) => {
        // We have extra isWorkspaceRequest condition since, for 1:1 requests, canEditMoneyRequest will rightly return false
        // as we do not allow requestee to edit fields like description and amount.
        // But, we still want the requestee to be able to put the request on hold
        if ((0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportAction) && !(0, ReportUtils_1.canEditMoneyRequest)(parentReportAction) && isWorkspaceRequest) {
            return;
        }
        (0, IOU_1.putOnHold)(transactionID, values.comment, ancestorReportsAndReportActions, reportID, searchHash);
        Navigation_1.default.goBack(backTo);
    };
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [MoneyRequestHoldReasonForm_1.default.COMMENT]);
        if (!values.comment) {
            errors.comment = translate('common.error.fieldRequired');
        }
        // We have extra isWorkspaceRequest condition since, for 1:1 requests, canEditMoneyRequest will rightly return false
        // as we do not allow requestee to edit fields like description and amount.
        // But, we still want the requestee to be able to put the request on hold
        if ((0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportAction) && !(0, ReportUtils_1.canEditMoneyRequest)(parentReportAction) && isWorkspaceRequest) {
            const formErrors = {};
            (0, ErrorUtils_1.addErrorMessage)(formErrors, 'reportModified', translate('common.error.requestModified'));
            (0, FormActions_1.setErrors)(ONYXKEYS_1.default.FORMS.MONEY_REQUEST_HOLD_FORM, formErrors);
        }
        return errors;
    }, [parentReportAction, isWorkspaceRequest, translate]);
    (0, react_1.useEffect)(() => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.MONEY_REQUEST_HOLD_FORM);
        (0, FormActions_1.clearErrorFields)(ONYXKEYS_1.default.FORMS.MONEY_REQUEST_HOLD_FORM);
    }, []);
    return (<HoldReasonFormView_1.default onSubmit={onSubmit} validate={validate} backTo={backTo}/>);
}
HoldReasonPage.displayName = 'MoneyRequestHoldReasonPage';
exports.default = HoldReasonPage;
