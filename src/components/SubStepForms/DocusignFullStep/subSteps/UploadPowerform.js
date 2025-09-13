"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Button_1 = require("@components/Button");
var FormProvider_1 = require("@components/Form/FormProvider");
var InputWrapper_1 = require("@components/Form/InputWrapper");
var Text_1 = require("@components/Text");
var UploadFile_1 = require("@components/UploadFile");
var useEnvironment_1 = require("@hooks/useEnvironment");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var mapCurrencyToCountry_1 = require("@libs/mapCurrencyToCountry");
var ValidationUtils_1 = require("@libs/ValidationUtils");
var FormActions_1 = require("@userActions/FormActions");
var Link_1 = require("@userActions/Link");
var CONST_1 = require("@src/CONST");
function UploadPowerform(_a) {
    var defaultValue = _a.defaultValue, formID = _a.formID, inputID = _a.inputID, isLoading = _a.isLoading, onNext = _a.onNext, currency = _a.currency;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var environmentURL = (0, useEnvironment_1.default)().environmentURL;
    var _b = (0, react_1.useState)(defaultValue), uploadedFiles = _b[0], setUploadedFiles = _b[1];
    var validate = (0, react_1.useCallback)(function (values) {
        return (0, ValidationUtils_1.getFieldRequiredErrors)(values, [inputID]);
    }, [inputID]);
    var handleSelectFile = function (files) {
        var _a;
        (0, FormActions_1.setDraftValues)(formID, (_a = {}, _a[inputID] = __spreadArray(__spreadArray([], uploadedFiles, true), files, true), _a));
        setUploadedFiles(function (prev) { return __spreadArray(__spreadArray([], prev, true), files, true); });
    };
    var handleRemoveFile = function (fileName) {
        var _a;
        var newUploadedFiles = uploadedFiles.filter(function (file) { return file.name !== fileName; });
        (0, FormActions_1.setDraftValues)(formID, (_a = {}, _a[inputID] = newUploadedFiles, _a));
        setUploadedFiles(newUploadedFiles);
    };
    var setUploadError = function (error) {
        var _a;
        if (!error) {
            (0, FormActions_1.clearErrorFields)(formID);
            return;
        }
        (0, FormActions_1.setErrorFields)(formID, (_a = {}, _a[inputID] = { onUpload: error }, _a));
    };
    var country = (0, mapCurrencyToCountry_1.default)(currency !== null && currency !== void 0 ? currency : '');
    return (<FormProvider_1.default formID={formID} submitButtonText={translate('common.submit')} onSubmit={onNext} validate={validate} style={[styles.mh5, styles.flexGrow1]} submitButtonStyles={[styles.mb0]} enabledWhenOffline={false} isLoading={isLoading}>
            {(country === CONST_1.default.COUNTRY.CA || country === CONST_1.default.COUNTRY.US) && (<Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb10]}>{translate('docusignStep.pleaseComplete')}</Text_1.default>)}
            {country === CONST_1.default.COUNTRY.AU && (<>
                    <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb3]}>{translate('docusignStep.pleaseCompleteTheBusinessAccount')}</Text_1.default>
                    <Text_1.default style={[styles.textSupporting, styles.mb10]}>{translate('docusignStep.pleaseCompleteTheDirect')}</Text_1.default>
                </>)}
            <Button_1.default success large style={[styles.w100, styles.mb15]} onPress={function () {
            (0, Link_1.openLink)(CONST_1.default.DOCUSIGN_POWERFORM_LINK[country], environmentURL);
        }} text={translate('docusignStep.takeMeTo')}/>
            {(country === CONST_1.default.COUNTRY.CA || country === CONST_1.default.COUNTRY.US) && (<Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb5]}>{translate('docusignStep.uploadAdditional')}</Text_1.default>)}
            {country === CONST_1.default.COUNTRY.AU && <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb5]}>{translate('docusignStep.pleaseUploadTheDirect')}</Text_1.default>}
            <Text_1.default style={[styles.textHeadlineH2, styles.colorMuted, styles.mb10]}>{translate('docusignStep.pleaseUpload')}</Text_1.default>
            <InputWrapper_1.default InputComponent={UploadFile_1.default} buttonText={translate('common.chooseFile')} uploadedFiles={uploadedFiles} onUpload={function (files) {
            handleSelectFile(files);
        }} onRemove={function (fileName) {
            handleRemoveFile(fileName);
        }} acceptedFileTypes={__spreadArray([], CONST_1.default.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES, true)} value={uploadedFiles} inputID={inputID} setError={function (error) {
            setUploadError(error);
        }} fileLimit={1}/>
        </FormProvider_1.default>);
}
UploadPowerform.displayName = 'UploadPowerform';
exports.default = UploadPowerform;
