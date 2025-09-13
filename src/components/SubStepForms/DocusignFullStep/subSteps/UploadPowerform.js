"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const UploadFile_1 = require("@components/UploadFile");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const mapCurrencyToCountry_1 = require("@libs/mapCurrencyToCountry");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const FormActions_1 = require("@userActions/FormActions");
const Link_1 = require("@userActions/Link");
const CONST_1 = require("@src/CONST");
function UploadPowerform({ defaultValue, formID, inputID, isLoading, onNext, currency }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const [uploadedFiles, setUploadedFiles] = (0, react_1.useState)(defaultValue);
    const validate = (0, react_1.useCallback)((values) => {
        return (0, ValidationUtils_1.getFieldRequiredErrors)(values, [inputID]);
    }, [inputID]);
    const handleSelectFile = (files) => {
        (0, FormActions_1.setDraftValues)(formID, { [inputID]: [...uploadedFiles, ...files] });
        setUploadedFiles((prev) => [...prev, ...files]);
    };
    const handleRemoveFile = (fileName) => {
        const newUploadedFiles = uploadedFiles.filter((file) => file.name !== fileName);
        (0, FormActions_1.setDraftValues)(formID, { [inputID]: newUploadedFiles });
        setUploadedFiles(newUploadedFiles);
    };
    const setUploadError = (error) => {
        if (!error) {
            (0, FormActions_1.clearErrorFields)(formID);
            return;
        }
        (0, FormActions_1.setErrorFields)(formID, { [inputID]: { onUpload: error } });
    };
    const country = (0, mapCurrencyToCountry_1.default)(currency ?? '');
    return (<FormProvider_1.default formID={formID} submitButtonText={translate('common.submit')} onSubmit={onNext} validate={validate} style={[styles.mh5, styles.flexGrow1]} submitButtonStyles={[styles.mb0]} enabledWhenOffline={false} isLoading={isLoading}>
            {(country === CONST_1.default.COUNTRY.CA || country === CONST_1.default.COUNTRY.US) && (<Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb10]}>{translate('docusignStep.pleaseComplete')}</Text_1.default>)}
            {country === CONST_1.default.COUNTRY.AU && (<>
                    <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb3]}>{translate('docusignStep.pleaseCompleteTheBusinessAccount')}</Text_1.default>
                    <Text_1.default style={[styles.textSupporting, styles.mb10]}>{translate('docusignStep.pleaseCompleteTheDirect')}</Text_1.default>
                </>)}
            <Button_1.default success large style={[styles.w100, styles.mb15]} onPress={() => {
            (0, Link_1.openLink)(CONST_1.default.DOCUSIGN_POWERFORM_LINK[country], environmentURL);
        }} text={translate('docusignStep.takeMeTo')}/>
            {(country === CONST_1.default.COUNTRY.CA || country === CONST_1.default.COUNTRY.US) && (<Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb5]}>{translate('docusignStep.uploadAdditional')}</Text_1.default>)}
            {country === CONST_1.default.COUNTRY.AU && <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb5]}>{translate('docusignStep.pleaseUploadTheDirect')}</Text_1.default>}
            <Text_1.default style={[styles.textHeadlineH2, styles.colorMuted, styles.mb10]}>{translate('docusignStep.pleaseUpload')}</Text_1.default>
            <InputWrapper_1.default InputComponent={UploadFile_1.default} buttonText={translate('common.chooseFile')} uploadedFiles={uploadedFiles} onUpload={(files) => {
            handleSelectFile(files);
        }} onRemove={(fileName) => {
            handleRemoveFile(fileName);
        }} acceptedFileTypes={[...CONST_1.default.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]} value={uploadedFiles} inputID={inputID} setError={(error) => {
            setUploadError(error);
        }} fileLimit={1}/>
        </FormProvider_1.default>);
}
UploadPowerform.displayName = 'UploadPowerform';
exports.default = UploadPowerform;
