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
const Tag_1 = require("@libs/actions/Policy/Tag");
const importSpreadsheetUtils_1 = require("@libs/importSpreadsheetUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function ImportedMultiLevelTagsPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const [spreadsheet, spreadsheetMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { canBeMissing: true });
    const [isImportingTags, setIsImportingTags] = (0, react_1.useState)(false);
    const policyID = route.params.policyID;
    const columnNames = (0, importSpreadsheetUtils_1.generateColumnNames)(spreadsheet?.data?.length ?? 0);
    const { setIsClosing } = (0, useCloseImportPage_1.default)();
    const importTags = (0, react_1.useCallback)(() => {
        setIsImportingTags(true);
        (0, Tag_1.importMultiLevelTags)(policyID, spreadsheet);
    }, [spreadsheet, policyID]);
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
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_TAGS.getRoute(policyID));
    };
    return (<ScreenWrapper_1.default testID={ImportedMultiLevelTagsPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('workspace.tags.importTags')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_MULTI_LEVEL_TAGS_IMPORT_SETTINGS.getRoute(policyID))}/>
            <ImportSpreadsheetColumns_1.default spreadsheetColumns={spreadsheetColumns} columnNames={columnNames} importFunction={importTags} isButtonLoading={isImportingTags} learnMoreLink={CONST_1.default.IMPORT_SPREADSHEET.MULTI_LEVEL_TAGS_ARTICLE_LINK} shouldShowColumnHeader={false} shouldShowDropdownMenu={false} customHeaderText={translate('workspace.tags.importMultiLevelTagsSupportingText')}/>

            <ConfirmModal_1.default isVisible={spreadsheet?.shouldFinalModalBeOpened} title={spreadsheet?.importFinalModal?.title ?? ''} prompt={spreadsheet?.importFinalModal?.prompt ?? ''} onConfirm={closeImportPageAndModal} onCancel={closeImportPageAndModal} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false} shouldHandleNavigationBack/>
        </ScreenWrapper_1.default>);
}
ImportedMultiLevelTagsPage.displayName = 'ImportedMultiLevelTagsPage';
exports.default = ImportedMultiLevelTagsPage;
