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
const Tag_1 = require("@libs/actions/Policy/Tag");
const importSpreadsheetUtils_1 = require("@libs/importSpreadsheetUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function ImportedTagsPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const [spreadsheet, spreadsheetMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { canBeMissing: true });
    const [isImportingTags, setIsImportingTags] = (0, react_1.useState)(false);
    const { containsHeader = true } = spreadsheet ?? {};
    const [isValidationEnabled, setIsValidationEnabled] = (0, react_1.useState)(false);
    const policyID = route.params.policyID;
    const backTo = route.params.backTo;
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const policyTagLists = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getTagLists)(policyTags), [policyTags]);
    const policy = (0, usePolicy_1.default)(policyID);
    const columnNames = (0, importSpreadsheetUtils_1.generateColumnNames)(spreadsheet?.data?.length ?? 0);
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_IMPORTED;
    const { setIsClosing } = (0, useCloseImportPage_1.default)();
    const getColumnRoles = () => {
        const roles = [];
        roles.push({ text: translate('common.ignore'), value: CONST_1.default.CSV_IMPORT_COLUMNS.IGNORE }, { text: translate('common.name'), value: CONST_1.default.CSV_IMPORT_COLUMNS.NAME, isRequired: true }, { text: translate('common.enabled'), value: CONST_1.default.CSV_IMPORT_COLUMNS.ENABLED });
        if ((0, PolicyUtils_1.isControlPolicy)(policy)) {
            roles.push({ text: translate('workspace.tags.glCode'), value: CONST_1.default.CSV_IMPORT_COLUMNS.GL_CODE });
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
            const tagsNamesColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.NAME);
            const tagsNames = tagsNamesColumn !== -1 ? spreadsheet?.data[tagsNamesColumn] : [];
            const containsEmptyName = tagsNames?.some((name, index) => (!containsHeader || index > 0) && !name?.toString().trim());
            if (duplicate) {
                errors.duplicates = translate('spreadsheet.singleFieldMultipleColumns', { fieldName: duplicate });
            }
            else if (containsEmptyName) {
                errors.emptyNames = translate('spreadsheet.emptyMappedField', { fieldName: translate('common.name') });
            }
            else {
                errors = {};
            }
        }
        return errors;
    }, [requiredColumns, spreadsheet?.columns, translate, containsHeader, spreadsheet?.data]);
    const importTags = (0, react_1.useCallback)(() => {
        setIsValidationEnabled(true);
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            return;
        }
        const columns = Object.values(spreadsheet?.columns ?? {});
        const tagsNamesColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.NAME);
        const tagsGLCodeColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.GL_CODE);
        const tagsEnabledColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.ENABLED);
        const tagsNames = spreadsheet?.data[tagsNamesColumn].map((name) => name);
        const tagsEnabled = tagsEnabledColumn !== -1 ? spreadsheet?.data[tagsEnabledColumn].map((enabled) => enabled) : [];
        const tagsGLCode = tagsGLCodeColumn !== -1 ? spreadsheet?.data[tagsGLCodeColumn].map((glCode) => glCode) : [];
        const tags = tagsNames?.slice(containsHeader ? 1 : 0).map((name, index) => {
            // Right now we support only single-level tags, this check should be updated when we add multi-level support
            const tagAlreadyExists = policyTagLists.at(0)?.tags?.[name];
            const existingGLCodeOrDefault = tagAlreadyExists?.['GL Code'] ?? '';
            return {
                name,
                enabled: tagsEnabledColumn !== -1 ? tagsEnabled?.[containsHeader ? index + 1 : index] === 'true' : true,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'GL Code': tagsGLCodeColumn !== -1 ? (tagsGLCode?.[containsHeader ? index + 1 : index] ?? '') : existingGLCodeOrDefault,
            };
        });
        if (tags) {
            setIsImportingTags(true);
            (0, Tag_1.importPolicyTags)(policyID, tags);
        }
    }, [validate, spreadsheet, containsHeader, policyTagLists, policyID]);
    if (!spreadsheet && (0, isLoadingOnyxValue_1.default)(spreadsheetMetadata)) {
        return;
    }
    const spreadsheetColumns = spreadsheet?.data;
    if (!spreadsheetColumns) {
        return <NotFoundPage_1.default />;
    }
    const closeImportPageAndModal = () => {
        setIsClosing(true);
        setIsImportingTags(false);
        Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID, backTo) : ROUTES_1.default.WORKSPACE_TAGS.getRoute(policyID));
    };
    return (<ScreenWrapper_1.default testID={ImportedTagsPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('workspace.tags.importTags')} onBackButtonPress={() => Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAGS_IMPORT.getRoute(policyID, backTo) : ROUTES_1.default.WORKSPACE_TAGS_IMPORT.getRoute(policyID))}/>
            <ImportSpreadsheetColumns_1.default spreadsheetColumns={spreadsheetColumns} columnNames={columnNames} importFunction={importTags} errors={isValidationEnabled ? validate() : undefined} columnRoles={columnRoles} isButtonLoading={isImportingTags} learnMoreLink={CONST_1.default.IMPORT_SPREADSHEET.TAGS_ARTICLE_LINK}/>

            <ConfirmModal_1.default isVisible={spreadsheet?.shouldFinalModalBeOpened} title={spreadsheet?.importFinalModal?.title ?? ''} prompt={spreadsheet?.importFinalModal?.prompt ?? ''} onConfirm={closeImportPageAndModal} onCancel={closeImportPageAndModal} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false} shouldHandleNavigationBack/>
        </ScreenWrapper_1.default>);
}
ImportedTagsPage.displayName = 'ImportedTagsPage';
exports.default = ImportedTagsPage;
