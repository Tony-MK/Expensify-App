"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const PushRowWithModal_1 = require("@components/PushRowWithModal");
function mapToPushRowWithModalListOptions(values) {
    return values.reduce((acc, curr) => {
        if (curr.code && curr.text) {
            acc[curr.code] = expensify_common_1.Str.recapitalize(curr.text);
        }
        return acc;
    }, {});
}
function getInputForValueSet(field, defaultValue, isEditing, styles) {
    return (<react_native_1.View style={[styles.mb6, styles.mhn5]} key={field.id}>
            <InputWrapper_1.default InputComponent={PushRowWithModal_1.default} optionsList={field.valueSet ? mapToPushRowWithModalListOptions(field.valueSet) : {}} description={field.label} shouldSaveDraft={!isEditing} defaultValue={String(defaultValue) ?? ''} modalHeaderTitle={field.label} searchInputTitle={field.label} inputID={field.id}/>
        </react_native_1.View>);
}
exports.default = getInputForValueSet;
