"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useSubStep_1 = require("@hooks/useSubStep");
var Navigation_1 = require("@navigation/Navigation");
var BankAccounts_1 = require("@userActions/BankAccounts");
var FormActions_1 = require("@userActions/FormActions");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var Address_1 = require("./subSteps/Address");
var Confirmation_1 = require("./subSteps/Confirmation");
var DateOfBirth_1 = require("./subSteps/DateOfBirth");
var JobTitle_1 = require("./subSteps/JobTitle");
var Name_1 = require("./subSteps/Name");
var UploadDocuments_1 = require("./subSteps/UploadDocuments");
var getSignerDetailsAndSignerFiles_1 = require("./utils/getSignerDetailsAndSignerFiles");
var bodyContent = [Name_1.default, JobTitle_1.default, DateOfBirth_1.default, Address_1.default, UploadDocuments_1.default, Confirmation_1.default];
function EnterSignerInfo(_a) {
    var route = _a.route;
    var translate = (0, useLocalize_1.default)().translate;
    var bankAccountID = Number(route.params.bankAccountID);
    var policyID = route.params.policyID;
    var account = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false })[0];
    var enterSignerInfoForm = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM, { canBeMissing: true })[0];
    var enterSignerInfoFormDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM_DRAFT, { canBeMissing: true })[0];
    var submit = (0, react_1.useCallback)(function () {
        var _a;
        var _b = (0, getSignerDetailsAndSignerFiles_1.default)(enterSignerInfoFormDraft, (_a = account === null || account === void 0 ? void 0 : account.primaryLogin) !== null && _a !== void 0 ? _a : ''), signerDetails = _b.signerDetails, signerFiles = _b.signerFiles;
        (0, BankAccounts_1.saveCorpayOnboardingDirectorInformation)(__assign(__assign({ inputs: JSON.stringify(signerDetails) }, signerFiles), { bankAccountID: bankAccountID }));
    }, [account === null || account === void 0 ? void 0 : account.primaryLogin, bankAccountID, enterSignerInfoFormDraft]);
    var _b = (0, useSubStep_1.default)({ bodyContent: bodyContent, startFrom: 0, onFinished: submit }), EnterSignerInfoForm = _b.componentToRender, isEditing = _b.isEditing, screenIndex = _b.screenIndex, nextScreen = _b.nextScreen, prevScreen = _b.prevScreen, moveTo = _b.moveTo, goToTheLastStep = _b.goToTheLastStep;
    (0, react_1.useEffect)(function () {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if ((enterSignerInfoForm === null || enterSignerInfoForm === void 0 ? void 0 : enterSignerInfoForm.errors) || (enterSignerInfoForm === null || enterSignerInfoForm === void 0 ? void 0 : enterSignerInfoForm.isSavingSignerInformation) || !(enterSignerInfoForm === null || enterSignerInfoForm === void 0 ? void 0 : enterSignerInfoForm.isSuccess)) {
            return;
        }
        if (enterSignerInfoForm === null || enterSignerInfoForm === void 0 ? void 0 : enterSignerInfoForm.isSuccess) {
            (0, BankAccounts_1.clearEnterSignerInformationFormSave)();
            Navigation_1.default.closeRHPFlow();
        }
        return function () {
            (0, BankAccounts_1.clearEnterSignerInformationFormSave)();
        };
    }, [enterSignerInfoForm]);
    (0, react_1.useEffect)(function () {
        return (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM);
    }, []);
    var handleBackButtonPress = (0, react_1.useCallback)(function () {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM);
        if (isEditing) {
            goToTheLastStep();
            return;
        }
        if (screenIndex > 0) {
            prevScreen();
        }
        else {
            Navigation_1.default.goBack();
        }
    }, [goToTheLastStep, isEditing, prevScreen, screenIndex]);
    return (<InteractiveStepWrapper_1.default wrapperID={EnterSignerInfo.displayName} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('signerInfoStep.signerInfo')}>
            <EnterSignerInfoForm isEditing={isEditing} onNext={nextScreen} onMove={moveTo} policyID={policyID}/>
        </InteractiveStepWrapper_1.default>);
}
EnterSignerInfo.displayName = 'EnterSignerInfo';
exports.default = EnterSignerInfo;
