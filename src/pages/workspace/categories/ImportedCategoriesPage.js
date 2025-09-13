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
const Category_1 = require("@libs/actions/Policy/Category");
const importSpreadsheetUtils_1 = require("@libs/importSpreadsheetUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function ImportedCategoriesPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const [spreadsheet, spreadsheetMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { canBeMissing: true });
    const [isImportingCategories, setIsImportingCategories] = (0, react_1.useState)(false);
    const { containsHeader = true } = spreadsheet ?? {};
    const [isValidationEnabled, setIsValidationEnabled] = (0, react_1.useState)(false);
    const policyID = route.params.policyID;
    const backTo = route.params.backTo;
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, { canBeMissing: true });
    const { setIsClosing } = (0, useCloseImportPage_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const columnNames = (0, importSpreadsheetUtils_1.generateColumnNames)(spreadsheet?.data?.length ?? 0);
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_IMPORTED;
    const getColumnRoles = () => {
        const roles = [];
        roles.push({ text: translate('common.ignore'), value: CONST_1.default.CSV_IMPORT_COLUMNS.IGNORE }, { text: translate('common.name'), value: CONST_1.default.CSV_IMPORT_COLUMNS.NAME, isRequired: true }, { text: translate('common.enabled'), value: CONST_1.default.CSV_IMPORT_COLUMNS.ENABLED });
        if ((0, PolicyUtils_1.isControlPolicy)(policy)) {
            roles.push({ text: translate('workspace.categories.glCode'), value: CONST_1.default.CSV_IMPORT_COLUMNS.GL_CODE });
        }
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
            const categoriesNamesColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.NAME);
            const categoriesNames = categoriesNamesColumn !== -1 ? spreadsheet?.data[categoriesNamesColumn] : [];
            const containsEmptyName = categoriesNames?.some((name, index) => (!containsHeader || index > 0) && !name?.toString().trim());
            if (duplicateColumn) {
                errors.duplicates = translate('spreadsheet.singleFieldMultipleColumns', { fieldName: duplicateColumn.text });
            }
            else if (containsEmptyName) {
                errors.emptyNames = translate('spreadsheet.emptyMappedField', { fieldName: translate('common.name') });
            }
            else {
                errors = {};
            }
        }
        return errors;
    }, [spreadsheet?.columns, spreadsheet?.data, requiredColumns, translate, columnRoles, containsHeader]);
    const importCategories = (0, react_1.useCallback)(() => {
        setIsValidationEnabled(true);
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            return;
        }
        const columns = Object.values(spreadsheet?.columns ?? {});
        const categoriesNamesColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.NAME);
        const categoriesGLCodeColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.GL_CODE);
        const categoriesEnabledColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.ENABLED);
        const categoriesNames = spreadsheet?.data[categoriesNamesColumn].map((name) => name);
        const categoriesEnabled = categoriesEnabledColumn !== -1 ? spreadsheet?.data[categoriesEnabledColumn].map((enabled) => enabled) : [];
        const categoriesGLCode = categoriesGLCodeColumn !== -1 ? spreadsheet?.data[categoriesGLCodeColumn].map((glCode) => glCode) : [];
        const categories = categoriesNames?.slice(containsHeader ? 1 : 0).map((name, index) => {
            const categoryAlreadyExists = policyCategories?.[name];
            const existingGLCodeOrDefault = categoryAlreadyExists?.['GL Code'] ?? '';
            return {
                name,
                enabled: categoriesEnabledColumn !== -1 ? categoriesEnabled?.[containsHeader ? index + 1 : index] === 'true' : true,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'GL Code': categoriesGLCodeColumn !== -1 ? (categoriesGLCode?.[containsHeader ? index + 1 : index] ?? '') : existingGLCodeOrDefault,
            };
        });
        if (categories) {
            setIsImportingCategories(true);
            (0, Category_1.importPolicyCategories)(policyID, categories);
        }
    }, [validate, spreadsheet, containsHeader, policyID, policyCategories]);
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    if (!spreadsheet && (0, isLoadingOnyxValue_1.default)(spreadsheetMetadata)) {
        return;
    }
    const spreadsheetColumns = spreadsheet?.data;
    if (hasAccountingConnections || !spreadsheetColumns) {
        return <NotFoundPage_1.default />;
    }
    const closeImportPageAndModal = () => {
        setIsClosing(true);
        setIsImportingCategories(false);
        Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_CATEGORIES_ROOT.getRoute(policyID, backTo) : ROUTES_1.default.WORKSPACE_CATEGORIES.getRoute(policyID));
    };
    return (<ScreenWrapper_1.default testID={ImportedCategoriesPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('workspace.categories.importCategories')} onBackButtonPress={() => Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_CATEGORIES_IMPORT.getRoute(policyID, backTo) : ROUTES_1.default.WORKSPACE_CATEGORIES_IMPORT.getRoute(policyID))}/>
            <ImportSpreadsheetColumns_1.default spreadsheetColumns={spreadsheetColumns} columnNames={columnNames} importFunction={importCategories} errors={isValidationEnabled ? validate() : undefined} columnRoles={columnRoles} isButtonLoading={isImportingCategories} learnMoreLink={CONST_1.default.IMPORT_SPREADSHEET.CATEGORIES_ARTICLE_LINK}/>

            <ConfirmModal_1.default isVisible={spreadsheet?.shouldFinalModalBeOpened} title={spreadsheet?.importFinalModal?.title ?? ''} prompt={spreadsheet?.importFinalModal?.prompt ?? ''} onConfirm={closeImportPageAndModal} onCancel={closeImportPageAndModal} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false} shouldHandleNavigationBack/>
        </ScreenWrapper_1.default>);
}
ImportedCategoriesPage.displayName = 'ImportedCategoriesPage';
exports.default = ImportedCategoriesPage;
