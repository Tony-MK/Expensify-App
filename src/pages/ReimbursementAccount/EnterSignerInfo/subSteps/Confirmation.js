"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ConfirmationStep_1 = require("@components/SubStepForms/ConfirmationStep");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var mapCurrencyToCountry_1 = require("@libs/mapCurrencyToCountry");
var getNeededDocumentsStatusForSignerInfo_1 = require("@pages/ReimbursementAccount/utils/getNeededDocumentsStatusForSignerInfo");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EnterSignerInfoForm_1 = require("@src/types/form/EnterSignerInfoForm");
function Confirmation(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var onNext = _a.onNext, onMove = _a.onMove, isEditing = _a.isEditing, policyID = _a.policyID;
    var translate = (0, useLocalize_1.default)().translate;
    var enterSignerInfoForm = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM, { canBeMissing: true })[0];
    var enterSignerInfoFormDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM_DRAFT, { canBeMissing: false })[0];
    var policy = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), { canBeMissing: true })[0];
    var currency = (_b = policy === null || policy === void 0 ? void 0 : policy.outputCurrency) !== null && _b !== void 0 ? _b : '';
    var country = (0, mapCurrencyToCountry_1.default)(currency);
    var isDocumentNeededStatus = (0, getNeededDocumentsStatusForSignerInfo_1.default)(currency, country);
    var copyOfID = (_c = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[EnterSignerInfoForm_1.default.SIGNER_COPY_OF_ID]) !== null && _c !== void 0 ? _c : [];
    var addressProof = (_d = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[EnterSignerInfoForm_1.default.SIGNER_ADDRESS_PROOF]) !== null && _d !== void 0 ? _d : [];
    var proofOfDirectors = (_e = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[EnterSignerInfoForm_1.default.PROOF_OF_DIRECTORS]) !== null && _e !== void 0 ? _e : [];
    var codiceFiscale = (_f = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[EnterSignerInfoForm_1.default.SIGNER_CODICE_FISCALE]) !== null && _f !== void 0 ? _f : [];
    var summaryItems = [
        {
            title: (_g = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[EnterSignerInfoForm_1.default.SIGNER_FULL_NAME]) !== null && _g !== void 0 ? _g : '',
            description: translate('signerInfoStep.legalName'),
            shouldShowRightIcon: true,
            onPress: function () {
                onMove(0);
            },
        },
        {
            title: (_h = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[EnterSignerInfoForm_1.default.SIGNER_JOB_TITLE]) !== null && _h !== void 0 ? _h : '',
            description: translate('signerInfoStep.jobTitle'),
            shouldShowRightIcon: true,
            onPress: function () {
                onMove(1);
            },
        },
        {
            title: (_j = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[EnterSignerInfoForm_1.default.SIGNER_DATE_OF_BIRTH]) !== null && _j !== void 0 ? _j : '',
            description: translate('common.dob'),
            shouldShowRightIcon: true,
            onPress: function () {
                onMove(2);
            },
        },
        {
            title: "".concat(enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[EnterSignerInfoForm_1.default.SIGNER_STREET], ", ").concat(enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[EnterSignerInfoForm_1.default.SIGNER_CITY], ", ").concat(enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[EnterSignerInfoForm_1.default.SIGNER_STATE], ", ").concat(enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[EnterSignerInfoForm_1.default.SIGNER_ZIP_CODE]),
            description: translate('ownershipInfoStep.address'),
            shouldShowRightIcon: true,
            onPress: function () {
                onMove(3);
            },
        },
    ];
    if (isDocumentNeededStatus.isCopyOfIDNeeded && copyOfID.length > 0) {
        summaryItems.push({
            title: copyOfID.map(function (id) { return id.name; }).join(', '),
            description: translate('signerInfoStep.id'),
            shouldShowRightIcon: true,
            onPress: function () {
                onMove(4);
            },
        });
    }
    if (isDocumentNeededStatus.isAddressProofNeeded && addressProof.length > 0) {
        summaryItems.push({
            title: addressProof.map(function (proof) { return proof.name; }).join(', '),
            description: translate('signerInfoStep.proofOf'),
            shouldShowRightIcon: true,
            onPress: function () {
                onMove(4);
            },
        });
    }
    if (isDocumentNeededStatus.isProofOfDirectorsNeeded && proofOfDirectors.length > 0) {
        summaryItems.push({
            title: proofOfDirectors.map(function (proof) { return proof.name; }).join(', '),
            description: translate('signerInfoStep.proofOfDirectors'),
            shouldShowRightIcon: true,
            onPress: function () {
                onMove(4);
            },
        });
    }
    if (isDocumentNeededStatus.isCodiceFiscaleNeeded && codiceFiscale.length > 0) {
        summaryItems.push({
            title: codiceFiscale.map(function (fiscale) { return fiscale.name; }).join(', '),
            description: translate('signerInfoStep.codiceFiscale'),
            shouldShowRightIcon: true,
            onPress: function () {
                onMove(4);
            },
        });
    }
    return (<ConfirmationStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} pageTitle={translate('signerInfoStep.letsDoubleCheck')} summaryItems={summaryItems} showOnfidoLinks={false} isLoading={enterSignerInfoForm === null || enterSignerInfoForm === void 0 ? void 0 : enterSignerInfoForm.isSavingSignerInformation} error={(_l = Object.values((_k = enterSignerInfoForm === null || enterSignerInfoForm === void 0 ? void 0 : enterSignerInfoForm.errors) !== null && _k !== void 0 ? _k : []).at(0)) !== null && _l !== void 0 ? _l : ''}/>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
