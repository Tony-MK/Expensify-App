"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDraftValues = clearDraftValues;
exports.clearErrorFields = clearErrorFields;
exports.clearErrors = clearErrors;
exports.setDraftValues = setDraftValues;
exports.setErrorFields = setErrorFields;
exports.setErrors = setErrors;
exports.setIsLoading = setIsLoading;
const react_native_onyx_1 = require("react-native-onyx");
function setIsLoading(formID, isLoading) {
    react_native_onyx_1.default.merge(formID, { isLoading });
}
function setErrors(formID, errors) {
    react_native_onyx_1.default.merge(formID, { errors });
}
function setErrorFields(formID, errorFields) {
    react_native_onyx_1.default.merge(formID, { errorFields });
}
function clearErrors(formID) {
    react_native_onyx_1.default.merge(formID, { errors: null });
}
function clearErrorFields(formID) {
    react_native_onyx_1.default.merge(formID, { errorFields: null });
}
function setDraftValues(formID, draftValues) {
    return react_native_onyx_1.default.merge(`${formID}Draft`, draftValues ?? null);
}
function clearDraftValues(formID) {
    react_native_onyx_1.default.set(`${formID}Draft`, null);
}
