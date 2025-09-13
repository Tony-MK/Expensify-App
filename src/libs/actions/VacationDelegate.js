"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVacationDelegate = setVacationDelegate;
exports.deleteVacationDelegate = deleteVacationDelegate;
exports.clearVacationDelegateError = clearVacationDelegateError;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ErrorUtils = require("@libs/ErrorUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function setVacationDelegate(creator, delegate, shouldOverridePolicyDiffWarning = false, currentDelegate) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE,
            value: {
                creator,
                delegate,
                errors: null,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                previousDelegate: currentDelegate,
            },
        },
    ];
    const successData = [
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
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE,
            value: {
                errors: ErrorUtils.getMicroSecondTranslationErrorWithTranslationKey('statusPage.vacationDelegateError'),
            },
        },
    ];
    const parameters = {
        creator,
        vacationDelegateEmail: delegate,
        overridePolicyDiffWarning: shouldOverridePolicyDiffWarning,
    };
    // We need to read the API response for showing a warning if there is a policy diff warning.
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    return API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.SET_VACATION_DELEGATE, parameters, { optimisticData, successData, failureData });
}
function deleteVacationDelegate(vacationDelegate) {
    if ((0, EmptyObject_1.isEmptyObject)(vacationDelegate)) {
        return;
    }
    const { creator, delegate } = vacationDelegate;
    const optimisticData = [
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
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE,
            value: {
                errors: null,
                pendingAction: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE,
            value: {
                creator,
                delegate,
                errors: ErrorUtils.getMicroSecondTranslationErrorWithTranslationKey('statusPage.vacationDelegateError'),
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.DELETE_VACATION_DELEGATE, null, { optimisticData, successData, failureData });
}
function clearVacationDelegateError(previousDelegate) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE, {
        errors: null,
        pendingAction: null,
        delegate: previousDelegate ?? null,
        previousDelegate: null,
    });
}
