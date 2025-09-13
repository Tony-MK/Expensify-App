"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCustomUnitID = generateCustomUnitID;
exports.enablePerDiem = enablePerDiem;
exports.openPolicyPerDiemPage = openPolicyPerDiemPage;
exports.importPerDiemRates = importPerDiemRates;
exports.downloadPerDiemCSV = downloadPerDiemCSV;
exports.clearPolicyPerDiemRatesErrorFields = clearPolicyPerDiemRatesErrorFields;
exports.deleteWorkspacePerDiemRates = deleteWorkspacePerDiemRates;
exports.editPerDiemRateDestination = editPerDiemRateDestination;
exports.editPerDiemRateSubrate = editPerDiemRateSubrate;
exports.editPerDiemRateAmount = editPerDiemRateAmount;
exports.editPerDiemRateCurrency = editPerDiemRateCurrency;
const cloneDeep_1 = require("lodash/cloneDeep");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ApiUtils_1 = require("@libs/ApiUtils");
const fileDownload_1 = require("@libs/fileDownload");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const Localize_1 = require("@libs/Localize");
const enhanceParameters_1 = require("@libs/Network/enhanceParameters");
const NumberUtils_1 = require("@libs/NumberUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
/**
 * Returns a client generated 13 character hexadecimal value for a custom unit ID
 */
function generateCustomUnitID() {
    return (0, NumberUtils_1.generateHexadecimalValue)(13);
}
function enablePerDiem(policyID, enabled, customUnitID, shouldGoBack) {
    const doesCustomUnitExists = !!customUnitID;
    const finalCustomUnitID = doesCustomUnitExists ? customUnitID : generateCustomUnitID();
    const optimisticCustomUnit = {
        name: CONST_1.default.CUSTOM_UNITS.NAME_PER_DIEM_INTERNATIONAL,
        customUnitID: finalCustomUnitID,
        enabled: true,
        defaultCategory: '',
        rates: {},
    };
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    arePerDiemRatesEnabled: enabled,
                    pendingFields: {
                        arePerDiemRatesEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                    ...(doesCustomUnitExists ? {} : { customUnits: { [finalCustomUnitID]: optimisticCustomUnit } }),
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        arePerDiemRatesEnabled: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    arePerDiemRatesEnabled: !enabled,
                    pendingFields: {
                        arePerDiemRatesEnabled: null,
                    },
                },
            },
        ],
    };
    const parameters = { policyID, enabled, customUnitID: finalCustomUnitID };
    API.write(types_1.WRITE_COMMANDS.TOGGLE_POLICY_PER_DIEM, parameters, onyxData);
    if (enabled && (0, getIsNarrowLayout_1.default)() && shouldGoBack) {
        (0, PolicyUtils_1.goBackWhenEnableFeature)(policyID);
    }
}
function openPolicyPerDiemPage(policyID) {
    if (!policyID) {
        return;
    }
    const params = { policyID };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_PER_DIEM_RATES_PAGE, params);
}
function updateImportSpreadsheetData(ratesLength) {
    const onyxData = {
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                value: {
                    shouldFinalModalBeOpened: true,
                    importFinalModal: {
                        title: (0, Localize_1.translateLocal)('spreadsheet.importSuccessfulTitle'),
                        prompt: (0, Localize_1.translateLocal)('spreadsheet.importPerDiemRatesSuccessfulDescription', { rates: ratesLength }),
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                value: {
                    shouldFinalModalBeOpened: true,
                    importFinalModal: { title: (0, Localize_1.translateLocal)('spreadsheet.importFailedTitle'), prompt: (0, Localize_1.translateLocal)('spreadsheet.importFailedDescription') },
                },
            },
        ],
    };
    return onyxData;
}
function importPerDiemRates(policyID, customUnitID, rates, rowsLength) {
    const onyxData = updateImportSpreadsheetData(rowsLength);
    const parameters = {
        policyID,
        customUnitID,
        customUnitRates: JSON.stringify(rates),
    };
    API.write(types_1.WRITE_COMMANDS.IMPORT_PER_DIEM_RATES, parameters, onyxData);
}
function downloadPerDiemCSV(policyID, onDownloadFailed) {
    const finalParameters = (0, enhanceParameters_1.default)(types_1.WRITE_COMMANDS.EXPORT_PER_DIEM_CSV, {
        policyID,
    });
    const fileName = 'PerDiem.csv';
    const formData = new FormData();
    Object.entries(finalParameters).forEach(([key, value]) => {
        formData.append(key, String(value));
    });
    (0, fileDownload_1.default)((0, ApiUtils_1.getCommandURL)({ command: types_1.WRITE_COMMANDS.EXPORT_PER_DIEM_CSV }), fileName, '', false, formData, CONST_1.default.NETWORK.METHOD.POST, onDownloadFailed);
}
function clearPolicyPerDiemRatesErrorFields(policyID, customUnitID, updatedErrorFields) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        customUnits: {
            [customUnitID]: {
                errorFields: updatedErrorFields,
            },
        },
    });
}
function prepareNewCustomUnit(customUnit, subRatesToBeDeleted) {
    const mappedDeletedSubRatesToRate = subRatesToBeDeleted.reduce((acc, subRate) => {
        if (subRate.rateID in acc) {
            acc[subRate.rateID].push(subRate);
        }
        else {
            acc[subRate.rateID] = [subRate];
        }
        return acc;
    }, {});
    // Copy the custom unit and remove the sub rates that are to be deleted
    const newCustomUnit = (0, cloneDeep_1.default)(customUnit);
    const customUnitOnyxUpdate = (0, cloneDeep_1.default)(customUnit);
    for (const rateID in mappedDeletedSubRatesToRate) {
        if (!(rateID in newCustomUnit.rates)) {
            continue;
        }
        const subRates = mappedDeletedSubRatesToRate[rateID];
        if (subRates.length === newCustomUnit.rates[rateID].subRates?.length) {
            delete newCustomUnit.rates[rateID];
            customUnitOnyxUpdate.rates[rateID] = null;
        }
        else {
            const newSubRates = newCustomUnit.rates[rateID].subRates?.filter((subRate) => !subRates.some((subRateToBeDeleted) => subRateToBeDeleted.subRateID === subRate.id));
            newCustomUnit.rates[rateID].subRates = newSubRates;
            customUnitOnyxUpdate.rates[rateID] = { ...customUnitOnyxUpdate.rates[rateID], subRates: newSubRates };
        }
    }
    return { newCustomUnit, customUnitOnyxUpdate };
}
function deleteWorkspacePerDiemRates(policyID, customUnit, subRatesToBeDeleted) {
    if (!policyID || (0, EmptyObject_1.isEmptyObject)(customUnit) || !subRatesToBeDeleted.length) {
        return;
    }
    const { newCustomUnit, customUnitOnyxUpdate } = prepareNewCustomUnit(customUnit, subRatesToBeDeleted);
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    customUnits: {
                        [customUnit.customUnitID]: customUnitOnyxUpdate,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        customUnit: JSON.stringify(newCustomUnit),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_WORKSPACE_CUSTOM_UNIT, parameters, onyxData);
}
function editPerDiemRateDestination(policyID, rateID, customUnit, newDestination) {
    if (!policyID || !rateID || (0, EmptyObject_1.isEmptyObject)(customUnit) || !newDestination) {
        return;
    }
    const newCustomUnit = (0, cloneDeep_1.default)(customUnit);
    newCustomUnit.rates[rateID].name = newDestination;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    customUnits: {
                        [customUnit.customUnitID]: newCustomUnit,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        customUnit: JSON.stringify(newCustomUnit),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_WORKSPACE_CUSTOM_UNIT, parameters, onyxData);
}
function editPerDiemRateSubrate(policyID, rateID, subRateID, customUnit, newSubrate) {
    if (!policyID || !rateID || (0, EmptyObject_1.isEmptyObject)(customUnit) || !newSubrate) {
        return;
    }
    const newCustomUnit = (0, cloneDeep_1.default)(customUnit);
    newCustomUnit.rates[rateID].subRates = newCustomUnit.rates[rateID].subRates?.map((subRate) => {
        if (subRate.id === subRateID) {
            return { ...subRate, name: newSubrate };
        }
        return subRate;
    });
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    customUnits: {
                        [customUnit.customUnitID]: newCustomUnit,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        customUnit: JSON.stringify(newCustomUnit),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_WORKSPACE_CUSTOM_UNIT, parameters, onyxData);
}
function editPerDiemRateAmount(policyID, rateID, subRateID, customUnit, newAmount) {
    if (!policyID || !rateID || (0, EmptyObject_1.isEmptyObject)(customUnit) || !newAmount) {
        return;
    }
    const newCustomUnit = (0, cloneDeep_1.default)(customUnit);
    newCustomUnit.rates[rateID].subRates = newCustomUnit.rates[rateID].subRates?.map((subRate) => {
        if (subRate.id === subRateID) {
            return { ...subRate, rate: newAmount };
        }
        return subRate;
    });
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    customUnits: {
                        [customUnit.customUnitID]: newCustomUnit,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        customUnit: JSON.stringify(newCustomUnit),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_WORKSPACE_CUSTOM_UNIT, parameters, onyxData);
}
function editPerDiemRateCurrency(policyID, rateID, customUnit, newCurrency) {
    if (!policyID || !rateID || (0, EmptyObject_1.isEmptyObject)(customUnit) || !newCurrency) {
        return;
    }
    const newCustomUnit = (0, cloneDeep_1.default)(customUnit);
    newCustomUnit.rates[rateID].currency = newCurrency;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    customUnits: {
                        [customUnit.customUnitID]: newCustomUnit,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        customUnit: JSON.stringify(newCustomUnit),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_WORKSPACE_CUSTOM_UNIT, parameters, onyxData);
}
