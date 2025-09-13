"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const UploadFile_1 = require("@components/UploadFile");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Environment_1 = require("@libs/Environment/Environment");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const getNeededDocumentsStatusForSignerInfo_1 = require("@pages/ReimbursementAccount/utils/getNeededDocumentsStatusForSignerInfo");
const WhyLink_1 = require("@pages/ReimbursementAccount/WhyLink");
const FormActions_1 = require("@userActions/FormActions");
const Link_1 = require("@userActions/Link");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { ADDRESS_PROOF, PROOF_OF_DIRECTORS, COPY_OF_ID, CODICE_FISCALE } = CONST_1.default.NON_USD_BANK_ACCOUNT.SIGNER_INFO_STEP.SIGNER_INFO_DATA;
const signerInfoKeys = CONST_1.default.NON_USD_BANK_ACCOUNT.SIGNER_INFO_STEP.SIGNER_INFO_DATA;
function UploadDocuments({ onNext, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: false });
    const policyID = reimbursementAccount?.achData?.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const [environmentUrl, setEnvironmentUrl] = (0, react_1.useState)(null);
    const currency = policy?.outputCurrency ?? '';
    const countryStepCountryValue = reimbursementAccount?.achData?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.COUNTRY] ?? '';
    const isDocumentNeededStatus = (0, getNeededDocumentsStatusForSignerInfo_1.default)(currency, countryStepCountryValue);
    const isPDSandFSGDownloaded = reimbursementAccount?.achData?.corpay?.downloadedPDSandFSG ?? reimbursementAccountDraft?.[signerInfoKeys.DOWNLOADED_PDS_AND_FSG] ?? false;
    const [isPDSandFSGDownloadedTouched, setIsPDSandFSGDownloadedTouched] = (0, react_1.useState)(false);
    const copyOfIDInputID = COPY_OF_ID;
    const addressProofInputID = ADDRESS_PROOF;
    const directorsProofInputID = PROOF_OF_DIRECTORS;
    const codiceFiscaleInputID = CODICE_FISCALE;
    const defaultValues = {
        [copyOfIDInputID]: Array.isArray(reimbursementAccountDraft?.[copyOfIDInputID]) ? (reimbursementAccountDraft?.[copyOfIDInputID] ?? []) : [],
        [addressProofInputID]: Array.isArray(reimbursementAccountDraft?.[addressProofInputID]) ? (reimbursementAccountDraft?.[addressProofInputID] ?? []) : [],
        [directorsProofInputID]: Array.isArray(reimbursementAccountDraft?.[directorsProofInputID]) ? (reimbursementAccountDraft?.[directorsProofInputID] ?? []) : [],
        [codiceFiscaleInputID]: Array.isArray(reimbursementAccountDraft?.[codiceFiscaleInputID]) ? (reimbursementAccountDraft?.[codiceFiscaleInputID] ?? []) : [],
    };
    const [uploadedIDs, setUploadedID] = (0, react_1.useState)(defaultValues[copyOfIDInputID]);
    const [uploadedProofsOfAddress, setUploadedProofOfAddress] = (0, react_1.useState)(defaultValues[addressProofInputID]);
    const [uploadedProofsOfDirectors, setUploadedProofsOfDirectors] = (0, react_1.useState)(defaultValues[directorsProofInputID]);
    const [uploadedCodiceFiscale, setUploadedCodiceFiscale] = (0, react_1.useState)(defaultValues[codiceFiscaleInputID]);
    (0, react_1.useEffect)(() => {
        (0, Environment_1.getEnvironmentURL)().then(setEnvironmentUrl);
    }, []);
    const STEP_FIELDS = (0, react_1.useMemo)(() => [copyOfIDInputID, addressProofInputID, directorsProofInputID, codiceFiscaleInputID], [copyOfIDInputID, addressProofInputID, directorsProofInputID, codiceFiscaleInputID]);
    const validate = (0, react_1.useCallback)((values) => {
        setIsPDSandFSGDownloadedTouched(true);
        return (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS);
    }, [STEP_FIELDS]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    const handleSubmitWithDownload = (values) => {
        if (isDocumentNeededStatus.isPRDAndFSGNeeded && !isPDSandFSGDownloaded) {
            return;
        }
        handleSubmit(values);
    };
    const handleRemoveFile = (fileName, uploadedFiles, inputID, setFiles) => {
        const newUploadedIDs = uploadedFiles.filter((file) => file.name !== fileName);
        (0, FormActions_1.setDraftValues)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, { [inputID]: newUploadedIDs });
        setFiles(newUploadedIDs);
    };
    const handleSelectFile = (files, uploadedFiles, inputID, setFiles) => {
        (0, FormActions_1.setDraftValues)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, { [inputID]: [...uploadedFiles, ...files] });
        setFiles((prev) => [...prev, ...files]);
    };
    const setUploadError = (error, inputID) => {
        if (!error) {
            (0, FormActions_1.clearErrorFields)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
            return;
        }
        (0, FormActions_1.setErrorFields)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, { [inputID]: { onUpload: error } });
    };
    const handleDownload = () => {
        (0, Link_1.openExternalLink)(`${environmentUrl}/pdfs/PDSAndFSG.pdf`);
        setIsPDSandFSGDownloadedTouched(true);
        (0, FormActions_1.setDraftValues)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, { [signerInfoKeys.DOWNLOADED_PDS_AND_FSG]: true });
    };
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={handleSubmitWithDownload} validate={validate} style={[styles.mh5, styles.flexGrow1]} submitButtonStyles={[styles.mb0]}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb5]}>{translate('ownershipInfoStep.uploadDocuments')}</Text_1.default>
            <Text_1.default style={[styles.textSupporting, styles.mb5]}>{translate('signerInfoStep.pleaseUpload')}</Text_1.default>
            <Text_1.default style={[styles.textSupporting, styles.mb6]}>{translate('ownershipInfoStep.acceptedFiles')}</Text_1.default>
            {isDocumentNeededStatus.isCopyOfIDNeeded && (<react_native_1.View>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mb3]}>{translate('signerInfoStep.id')}</Text_1.default>
                    <InputWrapper_1.default InputComponent={UploadFile_1.default} buttonText={translate('signerInfoStep.chooseFile')} uploadedFiles={uploadedIDs} onUpload={(files) => {
                handleSelectFile(files, uploadedIDs, copyOfIDInputID, setUploadedID);
            }} onRemove={(fileName) => {
                handleRemoveFile(fileName, uploadedIDs, copyOfIDInputID, setUploadedID);
            }} acceptedFileTypes={[...CONST_1.default.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]} value={uploadedIDs} inputID={copyOfIDInputID} setError={(error) => {
                setUploadError(error, copyOfIDInputID);
            }} fileLimit={1}/>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mt6]}>{translate('ownershipInfoStep.copyOfIDDescription')}</Text_1.default>
                    {(isDocumentNeededStatus.isAddressProofNeeded ||
                isDocumentNeededStatus.isProofOfDirectorsNeeded ||
                isDocumentNeededStatus.isCodiceFiscaleNeeded ||
                isDocumentNeededStatus.isPRDAndFSGNeeded) && <react_native_1.View style={[styles.sectionDividerLine, styles.mt6, styles.mb6]}/>}
                </react_native_1.View>)}
            {isDocumentNeededStatus.isAddressProofNeeded && (<react_native_1.View>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mb3]}>{translate('signerInfoStep.proofOf')}</Text_1.default>
                    <InputWrapper_1.default InputComponent={UploadFile_1.default} buttonText={translate('signerInfoStep.chooseFile')} uploadedFiles={uploadedProofsOfAddress} onUpload={(files) => {
                handleSelectFile(files, uploadedProofsOfAddress, addressProofInputID, setUploadedProofOfAddress);
            }} onRemove={(fileName) => {
                handleRemoveFile(fileName, uploadedProofsOfAddress, addressProofInputID, setUploadedProofOfAddress);
            }} acceptedFileTypes={[...CONST_1.default.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]} value={uploadedProofsOfAddress} inputID={addressProofInputID} setError={(error) => {
                setUploadError(error, addressProofInputID);
            }} fileLimit={1}/>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mt6]}>{translate('ownershipInfoStep.proofOfAddressDescription')}</Text_1.default>
                    {(isDocumentNeededStatus.isProofOfDirectorsNeeded || isDocumentNeededStatus.isCodiceFiscaleNeeded || isDocumentNeededStatus.isPRDAndFSGNeeded) && (<react_native_1.View style={[styles.sectionDividerLine, styles.mt6, styles.mb6]}/>)}
                </react_native_1.View>)}
            {isDocumentNeededStatus.isProofOfDirectorsNeeded && (<react_native_1.View>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mb3]}>{translate('signerInfoStep.proofOfDirectors')}</Text_1.default>
                    <InputWrapper_1.default InputComponent={UploadFile_1.default} buttonText={translate('signerInfoStep.chooseFile')} uploadedFiles={uploadedProofsOfDirectors} onUpload={(files) => {
                handleSelectFile(files, uploadedProofsOfDirectors, directorsProofInputID, setUploadedProofsOfDirectors);
            }} onRemove={(fileName) => {
                handleRemoveFile(fileName, uploadedProofsOfDirectors, directorsProofInputID, setUploadedProofsOfDirectors);
            }} acceptedFileTypes={[...CONST_1.default.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]} value={uploadedProofsOfDirectors} inputID={directorsProofInputID} setError={(error) => {
                setUploadError(error, directorsProofInputID);
            }} fileLimit={1}/>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mt6]}>{translate('signerInfoStep.proofOfDirectorsDescription')}</Text_1.default>
                    {(isDocumentNeededStatus.isCodiceFiscaleNeeded || isDocumentNeededStatus.isPRDAndFSGNeeded) && <react_native_1.View style={[styles.sectionDividerLine, styles.mt6, styles.mb6]}/>}
                </react_native_1.View>)}
            {isDocumentNeededStatus.isCodiceFiscaleNeeded && (<react_native_1.View>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mb3]}>{translate('signerInfoStep.codiceFiscale')}</Text_1.default>
                    <InputWrapper_1.default InputComponent={UploadFile_1.default} buttonText={translate('signerInfoStep.chooseFile')} uploadedFiles={uploadedCodiceFiscale} onUpload={(files) => {
                handleSelectFile(files, uploadedCodiceFiscale, codiceFiscaleInputID, setUploadedCodiceFiscale);
            }} onRemove={(fileName) => {
                handleRemoveFile(fileName, uploadedCodiceFiscale, codiceFiscaleInputID, setUploadedCodiceFiscale);
            }} acceptedFileTypes={[...CONST_1.default.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]} value={uploadedCodiceFiscale} inputID={codiceFiscaleInputID} setError={(error) => {
                setUploadError(error, codiceFiscaleInputID);
            }} fileLimit={1}/>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mt6]}>{translate('signerInfoStep.codiceFiscaleDescription')}</Text_1.default>
                    {isDocumentNeededStatus.isPRDAndFSGNeeded && <react_native_1.View style={[styles.sectionDividerLine, styles.mt6, styles.mb6]}/>}
                </react_native_1.View>)}
            {isDocumentNeededStatus.isPRDAndFSGNeeded && (<react_native_1.View style={[styles.alignItemsStart]}>
                    <Text_1.default style={[styles.mutedTextLabel, styles.mb3]}>{translate('signerInfoStep.PDSandFSG')}</Text_1.default>
                    <Button_1.default onPress={handleDownload} text={translate('common.download')}/>
                    {!isPDSandFSGDownloaded && isPDSandFSGDownloadedTouched && (<DotIndicatorMessage_1.default style={[styles.formError, styles.mt3]} type="error" messages={{ [signerInfoKeys.DOWNLOADED_PDS_AND_FSG]: translate('common.error.fieldRequired') }}/>)}
                    <Text_1.default style={[styles.mutedTextLabel, styles.mt6]}>{translate('signerInfoStep.PDSandFSGDescription')}</Text_1.default>
                </react_native_1.View>)}
            <WhyLink_1.default containerStyles={[styles.mt6]}/>
        </FormProvider_1.default>);
}
UploadDocuments.displayName = 'UploadDocuments';
exports.default = UploadDocuments;
