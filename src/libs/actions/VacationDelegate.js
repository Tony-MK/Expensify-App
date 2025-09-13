"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVacationDelegate = setVacationDelegate;
exports.deleteVacationDelegate = deleteVacationDelegate;
exports.clearVacationDelegateError = clearVacationDelegateError;
var react_native_onyx_1 = require("react-native-onyx");
var API = require("@libs/API");
var types_1 = require("@libs/API/types");
var ErrorUtils = require("@libs/ErrorUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
function setVacationDelegate(creator, delegate, shouldOverridePolicyDiffWarning, currentDelegate) {
    if (shouldOverridePolicyDiffWarning === void 0) { shouldOverridePolicyDiffWarning = false; }
    var optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE,
            value: {
                creator: creator,
                delegate: delegate,
                errors: null,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                previousDelegate: currentDelegate,
            },
        },
    ];
    var successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE,
            value: {
                errors: null,
                pendingAction: null,
                previousDelegate: null,
            },
        },
    ];
    var failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE,
            value: {
                errors: ErrorUtils.getMicroSecondTranslationErrorWithTranslationKey('statusPage.vacationDelegateError'),
            },
        },
    ];
    var parameters = {
        creator: creator,
        vacationDelegateEmail: delegate,
        overridePolicyDiffWarning: shouldOverridePolicyDiffWarning,
    };
    // We need to read the API response for showing a warning if there is a policy diff warning.
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    return API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.SET_VACATION_DELEGATE, parameters, { optimisticData: optimisticData, successData: successData, failureData: failureData });
}
function deleteVacationDelegate(vacationDelegate) {
    if ((0, EmptyObject_1.isEmptyObject)(vacationDelegate)) {
        return;
    }
    var creator = vacationDelegate.creator, delegate = vacationDelegate.delegate;
    var optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE,
            value: {
                creator: null,
                delegate: null,
                errors: null,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            },
        },
    ];
    var successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE,
            value: {
                errors: null,
                pendingAction: null,
            },
        },
    ];
    var failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE,
            value: {
                creator: creator,
                delegate: delegate,
                errors: ErrorUtils.getMicroSecondTranslationErrorWithTranslationKey('statusPage.vacationDelegateError'),
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.DELETE_VACATION_DELEGATE, null, { optimisticData: optimisticData, successData: successData, failureData: failureData });
}
function clearVacationDelegateError(previousDelegate) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE, {
        errors: null,
        pendingAction: null,
        delegate: previousDelegate !== null && previousDelegate !== void 0 ? previousDelegate : null,
        previousDelegate: null,
    });
}
