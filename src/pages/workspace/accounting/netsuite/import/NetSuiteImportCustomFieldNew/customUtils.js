"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubstepValues = getSubstepValues;
exports.getCustomListInitialSubstep = getCustomListInitialSubstep;
exports.getCustomSegmentInitialSubstep = getCustomSegmentInitialSubstep;
const CONST_1 = require("@src/CONST");
const NetSuiteCustomFieldForm_1 = require("@src/types/form/NetSuiteCustomFieldForm");
function getCustomListInitialSubstep(values) {
    if (!values[NetSuiteCustomFieldForm_1.default.LIST_NAME]) {
        return CONST_1.default.NETSUITE_CUSTOM_FIELD_SUBSTEP_INDEXES.CUSTOM_LISTS.CUSTOM_LIST_PICKER;
    }
    if (!values[NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID]) {
        return CONST_1.default.NETSUITE_CUSTOM_FIELD_SUBSTEP_INDEXES.CUSTOM_LISTS.TRANSACTION_FIELD_ID;
    }
    if (!values[NetSuiteCustomFieldForm_1.default.MAPPING]) {
        return CONST_1.default.NETSUITE_CUSTOM_FIELD_SUBSTEP_INDEXES.CUSTOM_LISTS.MAPPING;
    }
    return CONST_1.default.NETSUITE_CUSTOM_FIELD_SUBSTEP_INDEXES.CUSTOM_LISTS.CONFIRM;
}
function getCustomSegmentInitialSubstep(values) {
    if (!values[NetSuiteCustomFieldForm_1.default.SEGMENT_TYPE]) {
        return CONST_1.default.NETSUITE_CUSTOM_FIELD_SUBSTEP_INDEXES.CUSTOM_SEGMENTS.SEGMENT_TYPE;
    }
    if (!values[NetSuiteCustomFieldForm_1.default.SEGMENT_NAME]) {
        return CONST_1.default.NETSUITE_CUSTOM_FIELD_SUBSTEP_INDEXES.CUSTOM_SEGMENTS.SEGMENT_NAME;
    }
    if (!values[NetSuiteCustomFieldForm_1.default.INTERNAL_ID]) {
        return CONST_1.default.NETSUITE_CUSTOM_FIELD_SUBSTEP_INDEXES.CUSTOM_SEGMENTS.INTERNAL_ID;
    }
    if (!values[NetSuiteCustomFieldForm_1.default.SCRIPT_ID]) {
        return CONST_1.default.NETSUITE_CUSTOM_FIELD_SUBSTEP_INDEXES.CUSTOM_SEGMENTS.SCRIPT_ID;
    }
    if (!values[NetSuiteCustomFieldForm_1.default.MAPPING]) {
        return CONST_1.default.NETSUITE_CUSTOM_FIELD_SUBSTEP_INDEXES.CUSTOM_SEGMENTS.MAPPING;
    }
    return CONST_1.default.NETSUITE_CUSTOM_FIELD_SUBSTEP_INDEXES.CUSTOM_SEGMENTS.CONFIRM;
}
function getSubstepValues(NetSuitCustomFieldDraft) {
    return {
        [NetSuiteCustomFieldForm_1.default.LIST_NAME]: NetSuitCustomFieldDraft?.[NetSuiteCustomFieldForm_1.default.LIST_NAME] ?? '',
        [NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID]: NetSuitCustomFieldDraft?.[NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID] ?? '',
        [NetSuiteCustomFieldForm_1.default.MAPPING]: NetSuitCustomFieldDraft?.[NetSuiteCustomFieldForm_1.default.MAPPING] ?? '',
        [NetSuiteCustomFieldForm_1.default.INTERNAL_ID]: NetSuitCustomFieldDraft?.[NetSuiteCustomFieldForm_1.default.INTERNAL_ID] ?? '',
        [NetSuiteCustomFieldForm_1.default.SCRIPT_ID]: NetSuitCustomFieldDraft?.[NetSuiteCustomFieldForm_1.default.SCRIPT_ID] ?? '',
        [NetSuiteCustomFieldForm_1.default.SEGMENT_TYPE]: NetSuitCustomFieldDraft?.[NetSuiteCustomFieldForm_1.default.SEGMENT_TYPE] ?? '',
        [NetSuiteCustomFieldForm_1.default.SEGMENT_NAME]: NetSuitCustomFieldDraft?.[NetSuiteCustomFieldForm_1.default.SEGMENT_NAME] ?? '',
    };
}
