"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const UploadFile_1 = require("@components/UploadFile");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const getNeededDocumentsStatusForBeneficialOwner_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getNeededDocumentsStatusForBeneficialOwner");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { PROOF_OF_OWNERSHIP, ADDRESS_PROOF, COPY_OF_ID, CODICE_FISCALE, COUNTRY, PREFIX } = CONST_1.default.NON_USD_BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA;
function Documents({ onNext, isEditing, ownerBeingModifiedID }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: false });
    const countryStepCountryValue = reimbursementAccountDraft?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.COUNTRY] ?? '';
    const policyID = reimbursementAccount?.achData?.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const currency = policy?.outputCurrency ?? '';
    const proofOfOwnershipInputID = `${PREFIX}_${ownerBeingModifiedID}_${PROOF_OF_OWNERSHIP}`;
    const copyOfIDInputID = `${PREFIX}_${ownerBeingModifiedID}_${COPY_OF_ID}`;
    const addressProofInputID = `${PREFIX}_${ownerBeingModifiedID}_${ADDRESS_PROOF}`;
    const codiceFiscaleInputID = `${PREFIX}_${ownerBeingModifiedID}_${CODICE_FISCALE}`;
    const beneficialOwnerCountryInputID = `${PREFIX}_${ownerBeingModifiedID}_${COUNTRY}`;
    const beneficialOwnerCountry = String(reimbursementAccountDraft?.[beneficialOwnerCountryInputID] ?? '');
    const isDocumentNeededStatus = (0, getNeededDocumentsStatusForBeneficialOwner_1.default)(currency, countryStepCountryValue, beneficialOwnerCountry);
    const defaultValues = {
        [proofOfOwnershipInputID]: Array.isArray(reimbursementAccountDraft?.[proofOfOwnershipInputID]) ? (reimbursementAccountDraft?.[proofOfOwnershipInputID] ?? []) : [],
        [copyOfIDInputID]: Array.isArray(reimbursementAccountDraft?.[copyOfIDInputID]) ? (reimbursementAccountDraft?.[copyOfIDInputID] ?? []) : [],
        [addressProofInputID]: Array.isArray(reimbursementAccountDraft?.[addressProofInputID]) ? (reimbursementAccountDraft?.[addressProofInputID] ?? []) : [],
        [codiceFiscaleInputID]: Array.isArray(reimbursementAccountDraft?.[codiceFiscaleInputID]) ? (reimbursementAccountDraft?.[codiceFiscaleInputID] ?? []) : [],
    };
    const [uploadedProofOfOwnership, setUploadedProofOfOwnership] = (0, react_1.useState)(defaultValues[proofOfOwnershipInputID]);
    const [uploadedCopyOfID, setUploadedCopyOfID] = (0, react_1.useState)(defaultValues[copyOfIDInputID]);
    const [uploadedAddressProof, setUploadedAddressProof] = (0, react_1.useState)(defaultValues[addressProofInputID]);
    const [uploadedCodiceFiscale, setUploadedCodiceFiscale] = (0, react_1.useState)(defaultValues[codiceFiscaleInputID]);
    const STEP_FIELDS = (0, react_1.useMemo)(() => [proofOfOwnershipInputID, addressProofInputID, copyOfIDInputID, codiceFiscaleInputID], [addressProofInputID, codiceFiscaleInputID, copyOfIDInputID, proofOfOwnershipInputID]);
    const validate = (0, react_1.useCallback)((values) => (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS), [STEP_FIELDS]);
    const handleSelectFile = (files, uploadedFiles, inputID, setFiles) => {
        (0, FormActions_1.setDraftValues)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, { [inputID]: [...uploadedFiles, ...files] });
        setFiles((prev) => [...prev, ...files]);
    };
    const handleRemoveFile = (fileName, uploadedFiles, inputID, setFiles) => {
        const newUploadedIDs = uploadedFiles.filter((file) => file.name !== fileName);
        (0, FormActions_1.setDraftValues)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, { [inputID]: newUploadedIDs });
        setFiles(newUploadedIDs);
    };
    const setUploadError = (error, inputID) => {
        if (!error) {
            (0, FormActions_1.clearErrorFields)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
            return;
        }
        (0, FormActions_1.setErrorFields)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, { [inputID]: { onUpload: error } });
    };
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    const testForShouldHideFixErrorsAlert = [
        isDocumentNeededStatus.isProofOfOwnershipNeeded,
        isDocumentNeededStatus.isCopyOfIDNeeded,
        isDocumentNeededStatus.isProofOfAddressNeeded,
        isDocumentNeededStatus.isCodiceFiscaleNeeded,
    ].filter(Boolean).length <= 1;
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} validate={validate} onSubmit={handleSubmit} style={[styles.mh5, styles.flexGrow1]} submitButtonStyles={[styles.mb0]} shouldHideFixErrorsAlert={testForShouldHideFixErrorsAlert}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb5]}>{translate('ownershipInfoStep.uploadDocuments')}</Text_1.default>
            <Text_1.default style={[styles.textSupporting, styles.mb5]}>{translate('ownershipInfoStep.pleaseUpload')}</Text_1.default>
            <Text_1.default style={[styles.textSupporting, styles.mb6]}>{translate('ownershipInfoStep.acceptedFiles')}</Text_1.default>
            {isDocumentNeededStatus.isProofOfOwnershipNeeded && (<react_native_1.View>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mb3]}>{translate('ownershipInfoStep.proofOfBeneficialOwner')}</Text_1.default>
                    <InputWrapper_1.default InputComponent={UploadFile_1.default} buttonText={translate('ownershipInfoStep.chooseFile')} uploadedFiles={uploadedProofOfOwnership} onUpload={(files) => {
                handleSelectFile(files, uploadedProofOfOwnership, proofOfOwnershipInputID, setUploadedProofOfOwnership);
            }} onRemove={(fileName) => {
                handleRemoveFile(fileName, uploadedProofOfOwnership, proofOfOwnershipInputID, setUploadedProofOfOwnership);
            }} setError={(error) => {
                setUploadError(error, proofOfOwnershipInputID);
            }} fileLimit={CONST_1.default.NON_USD_BANK_ACCOUNT.FILE_LIMIT} acceptedFileTypes={[...CONST_1.default.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]} value={defaultValues[proofOfOwnershipInputID]} inputID={proofOfOwnershipInputID}/>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mt6]}>{translate('ownershipInfoStep.proofOfBeneficialOwnerDescription')}</Text_1.default>
                    {(isDocumentNeededStatus.isCopyOfIDNeeded || isDocumentNeededStatus.isProofOfAddressNeeded || isDocumentNeededStatus.isCodiceFiscaleNeeded) && (<react_native_1.View style={[styles.sectionDividerLine, styles.mv6]}/>)}
                </react_native_1.View>)}

            {isDocumentNeededStatus.isCopyOfIDNeeded && (<react_native_1.View>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mb3]}>{translate('ownershipInfoStep.copyOfID')}</Text_1.default>
                    <InputWrapper_1.default InputComponent={UploadFile_1.default} buttonText={translate('ownershipInfoStep.chooseFile')} uploadedFiles={uploadedCopyOfID} onUpload={(files) => {
                handleSelectFile(files, uploadedCopyOfID, copyOfIDInputID, setUploadedCopyOfID);
            }} onRemove={(fileName) => {
                handleRemoveFile(fileName, uploadedCopyOfID, copyOfIDInputID, setUploadedCopyOfID);
            }} setError={(error) => {
                setUploadError(error, copyOfIDInputID);
            }} fileLimit={CONST_1.default.NON_USD_BANK_ACCOUNT.FILE_LIMIT} acceptedFileTypes={[...CONST_1.default.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]} value={defaultValues[copyOfIDInputID]} inputID={copyOfIDInputID}/>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mt6]}>{translate('ownershipInfoStep.copyOfIDDescription')}</Text_1.default>
                    {(isDocumentNeededStatus.isProofOfAddressNeeded || isDocumentNeededStatus.isCodiceFiscaleNeeded) && <react_native_1.View style={[styles.sectionDividerLine, styles.mv6]}/>}
                </react_native_1.View>)}

            {isDocumentNeededStatus.isProofOfAddressNeeded && (<react_native_1.View>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mb3]}>{translate('ownershipInfoStep.proofOfAddress')}</Text_1.default>
                    <InputWrapper_1.default InputComponent={UploadFile_1.default} buttonText={translate('ownershipInfoStep.chooseFile')} uploadedFiles={uploadedAddressProof} onUpload={(files) => {
                handleSelectFile(files, uploadedAddressProof, addressProofInputID, setUploadedAddressProof);
            }} onRemove={(fileName) => {
                handleRemoveFile(fileName, uploadedAddressProof, addressProofInputID, setUploadedAddressProof);
            }} setError={(error) => {
                setUploadError(error, addressProofInputID);
            }} fileLimit={CONST_1.default.NON_USD_BANK_ACCOUNT.FILE_LIMIT} acceptedFileTypes={[...CONST_1.default.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]} value={defaultValues[addressProofInputID]} inputID={addressProofInputID}/>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mt6]}>{translate('ownershipInfoStep.proofOfAddressDescription')}</Text_1.default>
                    {isDocumentNeededStatus.isCodiceFiscaleNeeded && <react_native_1.View style={[styles.sectionDividerLine, styles.mv6]}/>}
                </react_native_1.View>)}

            {isDocumentNeededStatus.isCodiceFiscaleNeeded && (<react_native_1.View>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mb3]}>{translate('ownershipInfoStep.codiceFiscale')}</Text_1.default>
                    <InputWrapper_1.default InputComponent={UploadFile_1.default} buttonText={translate('ownershipInfoStep.chooseFile')} uploadedFiles={uploadedCodiceFiscale} onUpload={(files) => {
                handleSelectFile(files, uploadedCodiceFiscale, codiceFiscaleInputID, setUploadedCodiceFiscale);
            }} onRemove={(fileName) => {
                handleRemoveFile(fileName, uploadedCodiceFiscale, codiceFiscaleInputID, setUploadedCodiceFiscale);
            }} setError={(error) => {
                setUploadError(error, codiceFiscaleInputID);
            }} fileLimit={CONST_1.default.NON_USD_BANK_ACCOUNT.FILE_LIMIT} acceptedFileTypes={[...CONST_1.default.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]} value={defaultValues[codiceFiscaleInputID]} inputID={codiceFiscaleInputID}/>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mb3, styles.mt6]}>{translate('ownershipInfoStep.codiceFiscaleDescription')}</Text_1.default>
                </react_native_1.View>)}
        </FormProvider_1.default>);
}
Documents.displayName = 'Documents';
exports.default = Documents;
