"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ImportSpreadsheetColumns_1 = require("@components/ImportSpreadsheetColumns");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useCloseImportPage_1 = require("@hooks/useCloseImportPage");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const PerDiem_1 = require("@libs/actions/Policy/PerDiem");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const importSpreadsheetUtils_1 = require("@libs/importSpreadsheetUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function generatePerDiemUnits(perDiemDestination, perDiemSubRate, perDiemCurrency, perDiemAmount) {
    const perDiemUnits = {};
    for (let i = 0; i < perDiemDestination.length; i++) {
        perDiemUnits[perDiemDestination[i]] = perDiemUnits[perDiemDestination[i]] ?? {
            customUnitRateID: perDiemDestination.at(i),
            name: perDiemDestination.at(i),
            rate: 0,
            currency: perDiemCurrency.at(i),
            enabled: true,
            attributes: [],
            subRates: [],
        };
        perDiemUnits[perDiemDestination[i]].subRates?.push({
            id: (0, PerDiem_1.generateCustomUnitID)(),
            name: perDiemSubRate.at(i) ?? '',
            // Use Math.round to avoid floating point errors when converting decimal amounts to cents (e.g., 16.4 * 100 = 1639.9999...)
            rate: Math.round((Number(perDiemAmount.at(i)) ?? 0) * CONST_1.default.POLICY.CUSTOM_UNIT_RATE_BASE_OFFSET),
        });
    }
    return Object.values(perDiemUnits);
}
function ImportedPerDiemPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const [spreadsheet, spreadsheetMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { canBeMissing: true });
    const [isImportingPerDiemRates, setIsImportingPerDiemRates] = (0, react_1.useState)(false);
    const { containsHeader = true } = spreadsheet ?? {};
    const [isValidationEnabled, setIsValidationEnabled] = (0, react_1.useState)(false);
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const perDiemCustomUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const columnNames = (0, importSpreadsheetUtils_1.generateColumnNames)(spreadsheet?.data?.length ?? 0);
    const { setIsClosing } = (0, useCloseImportPage_1.default)();
    const getColumnRoles = () => {
        const roles = [];
        roles.push({ text: translate('common.ignore'), value: CONST_1.default.CSV_IMPORT_COLUMNS.IGNORE }, { text: translate('common.destination'), value: CONST_1.default.CSV_IMPORT_COLUMNS.DESTINATION, isRequired: true }, { text: translate('common.subrate'), value: CONST_1.default.CSV_IMPORT_COLUMNS.SUBRATE, isRequired: true }, { text: translate('common.currency'), value: CONST_1.default.CSV_IMPORT_COLUMNS.CURRENCY, isRequired: true }, { text: translate('workspace.perDiem.amount'), value: CONST_1.default.CSV_IMPORT_COLUMNS.AMOUNT, isRequired: true });
        return roles;
    };
    const columnRoles = getColumnRoles();
    const requiredColumns = columnRoles.filter((role) => role.isRequired).map((role) => role);
    const validate = (0, react_1.useCallback)(() => {
        const columns = Object.values(spreadsheet?.columns ?? {});
        let errors = {};
        const missingRequiredColumns = requiredColumns.find((requiredColumn) => !columns.includes(requiredColumn.value));
        if (missingRequiredColumns) {
            errors.required = translate('spreadsheet.fieldNotMapped', { fieldName: missingRequiredColumns.text });
        }
        else {
            const duplicate = (0, importSpreadsheetUtils_1.findDuplicate)(columns);
            const duplicateColumn = columnRoles.find((role) => role.value === duplicate);
            if (duplicateColumn) {
                errors.duplicates = translate('spreadsheet.singleFieldMultipleColumns', { fieldName: duplicateColumn.text });
            }
            else {
                errors = {};
            }
        }
        return errors;
    }, [requiredColumns, spreadsheet?.columns, translate, columnRoles]);
    const importRates = (0, react_1.useCallback)(() => {
        setIsValidationEnabled(true);
        const errors = validate();
        if (Object.keys(errors).length > 0 || !perDiemCustomUnit?.customUnitID) {
            return;
        }
        const columns = Object.values(spreadsheet?.columns ?? {});
        const perDiemDestinationColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.DESTINATION);
        const perDiemSubRateColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.SUBRATE);
        const perDiemCurrencyColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.CURRENCY);
        const perDiemAmountColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.AMOUNT);
        const perDiemDestination = spreadsheet?.data[perDiemDestinationColumn].map((destination) => destination) ?? [];
        const perDiemSubRate = spreadsheet?.data[perDiemSubRateColumn].map((subRate) => subRate) ?? [];
        const perDiemCurrency = spreadsheet?.data[perDiemCurrencyColumn].map((currency) => (0, CurrencyUtils_1.sanitizeCurrencyCode)(currency)) ?? [];
        const perDiemAmount = spreadsheet?.data[perDiemAmountColumn].map((amount) => amount) ?? [];
        const perDiemUnits = generatePerDiemUnits(perDiemDestination?.slice(containsHeader ? 1 : 0), perDiemSubRate?.slice(containsHeader ? 1 : 0), perDiemCurrency?.slice(containsHeader ? 1 : 0), perDiemAmount?.slice(containsHeader ? 1 : 0));
        const rowsLength = perDiemDestination.length - (containsHeader ? 1 : 0);
        if (perDiemUnits) {
            setIsImportingPerDiemRates(true);
            (0, PerDiem_1.importPerDiemRates)(policyID, perDiemCustomUnit.customUnitID, perDiemUnits, rowsLength);
        }
    }, [validate, spreadsheet?.columns, spreadsheet?.data, containsHeader, policyID, perDiemCustomUnit?.customUnitID]);
    if (!spreadsheet && (0, isLoadingOnyxValue_1.default)(spreadsheetMetadata)) {
        return;
    }
    const spreadsheetColumns = spreadsheet?.data;
    if (!spreadsheetColumns) {
        return <NotFoundPage_1.default />;
    }
    const closeImportPageAndModal = () => {
        setIsClosing(true);
        setIsImportingPerDiemRates(false);
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_PER_DIEM.getRoute(policyID));
    };
    return (<ScreenWrapper_1.default testID={ImportedPerDiemPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('workspace.perDiem.importPerDiemRates')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_PER_DIEM_IMPORT.getRoute(policyID))}/>
            <ImportSpreadsheetColumns_1.default spreadsheetColumns={spreadsheetColumns} columnNames={columnNames} importFunction={importRates} errors={isValidationEnabled ? validate() : undefined} columnRoles={columnRoles} isButtonLoading={isImportingPerDiemRates} learnMoreLink={CONST_1.default.IMPORT_SPREADSHEET.CATEGORIES_ARTICLE_LINK}/>

            <ConfirmModal_1.default isVisible={spreadsheet?.shouldFinalModalBeOpened} title={spreadsheet?.importFinalModal?.title ?? ''} prompt={spreadsheet?.importFinalModal?.prompt ?? ''} onConfirm={closeImportPageAndModal} onCancel={closeImportPageAndModal} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
        </ScreenWrapper_1.default>);
}
ImportedPerDiemPage.displayName = 'ImportedPerDiemPage';
exports.default = ImportedPerDiemPage;
