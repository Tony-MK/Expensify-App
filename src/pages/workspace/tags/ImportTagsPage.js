"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ImportSpreadsheet_1 = require("@components/ImportSpreadsheet");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function ImportTagsPage({ route }) {
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const backTo = route.params.backTo;
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_IMPORT;
    const [spreadsheet, spreadsheetMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { canBeMissing: true });
    if (!spreadsheet && (0, isLoadingOnyxValue_1.default)(spreadsheetMetadata)) {
        return;
    }
    if (hasAccountingConnections) {
        return <NotFoundPage_1.default />;
    }
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} fullPageNotFoundViewProps={{ subtitleKey: (0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized', onLinkPress: PolicyUtils_1.goBackFromInvalidPolicy }}>
            <ImportSpreadsheet_1.default backTo={backTo} goTo={(() => {
            if (isQuickSettingsFlow) {
                return ROUTES_1.default.SETTINGS_TAGS_IMPORTED.getRoute(policyID, backTo);
            }
            if (spreadsheet?.isImportingMultiLevelTags) {
                return ROUTES_1.default.WORKSPACE_MULTI_LEVEL_TAGS_IMPORT_SETTINGS.getRoute(policyID);
            }
            return ROUTES_1.default.WORKSPACE_TAGS_IMPORTED.getRoute(policyID);
        })()} isImportingMultiLevelTags={spreadsheet?.isImportingMultiLevelTags}/>
        </AccessOrNotFoundWrapper_1.default>);
}
exports.default = ImportTagsPage;
