"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const FormActions_1 = require("@userActions/FormActions");
const IOU_1 = require("@userActions/IOU");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MoneyRequestRejectReasonForm_1 = require("@src/types/form/MoneyRequestRejectReasonForm");
const RejectReasonFormView_1 = require("./RejectReasonFormView");
function RejectReasonPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const { transactionID, reportID, backTo } = route.params;
    const onSubmit = (values) => {
        const urlToNavigateBack = (0, IOU_1.rejectMoneyRequest)(transactionID, reportID, values.comment);
        Navigation_1.default.dismissModal();
        if (urlToNavigateBack) {
            Navigation_1.default.goBack(urlToNavigateBack);
        }
    };
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [MoneyRequestRejectReasonForm_1.default.COMMENT]);
        if (!values.comment) {
            errors.comment = translate('common.error.fieldRequired');
        }
        return errors;
    }, [translate]);
    (0, react_1.useEffect)(() => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.MONEY_REQUEST_REJECT_FORM);
        (0, FormActions_1.clearErrorFields)(ONYXKEYS_1.default.FORMS.MONEY_REQUEST_REJECT_FORM);
    }, []);
    return (<RejectReasonFormView_1.default onSubmit={onSubmit} validate={validate} backTo={backTo}/>);
}
RejectReasonPage.displayName = 'RejectReasonPage';
exports.default = RejectReasonPage;
