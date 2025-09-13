"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useLocalize_1 = require("@hooks/useLocalize");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ValidationUtils_1 = require("@libs/ValidationUtils");
var FormActions_1 = require("@userActions/FormActions");
var IOU_1 = require("@userActions/IOU");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var MoneyRequestRejectReasonForm_1 = require("@src/types/form/MoneyRequestRejectReasonForm");
var RejectReasonFormView_1 = require("./RejectReasonFormView");
function RejectReasonPage(_a) {
    var route = _a.route;
    var translate = (0, useLocalize_1.default)().translate;
    var _b = route.params, transactionID = _b.transactionID, reportID = _b.reportID, backTo = _b.backTo;
    var onSubmit = function (values) {
        var urlToNavigateBack = (0, IOU_1.rejectMoneyRequest)(transactionID, reportID, values.comment);
        Navigation_1.default.dismissModal();
        if (urlToNavigateBack) {
            Navigation_1.default.goBack(urlToNavigateBack);
        }
    };
    var validate = (0, react_1.useCallback)(function (values) {
        var errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [MoneyRequestRejectReasonForm_1.default.COMMENT]);
        if (!values.comment) {
            errors.comment = translate('common.error.fieldRequired');
        }
        return errors;
    }, [translate]);
    (0, react_1.useEffect)(function () {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.MONEY_REQUEST_REJECT_FORM);
        (0, FormActions_1.clearErrorFields)(ONYXKEYS_1.default.FORMS.MONEY_REQUEST_REJECT_FORM);
    }, []);
    return (<RejectReasonFormView_1.default onSubmit={onSubmit} validate={validate} backTo={backTo}/>);
}
RejectReasonPage.displayName = 'RejectReasonPage';
exports.default = RejectReasonPage;
