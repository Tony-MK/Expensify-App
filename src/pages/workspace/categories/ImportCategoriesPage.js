"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ImportSpreadsheet_1 = require("@components/ImportSpreadsheet");
const usePolicy_1 = require("@hooks/usePolicy");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function ImportCategoriesPage({ route }) {
    const policyID = route.params.policyID;
    const backTo = route.params.backTo;
    const policy = (0, usePolicy_1.default)(policyID);
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_IMPORT;
    if (hasAccountingConnections) {
        return <NotFoundPage_1.default />;
    }
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} fullPageNotFoundViewProps={{ subtitleKey: (0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized', onLinkPress: PolicyUtils_1.goBackFromInvalidPolicy }}>
            <ImportSpreadsheet_1.default backTo={backTo} goTo={isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_CATEGORIES_IMPORTED.getRoute(policyID, backTo) : ROUTES_1.default.WORKSPACE_CATEGORIES_IMPORTED.getRoute(policyID)}/>
        </AccessOrNotFoundWrapper_1.default>);
}
exports.default = ImportCategoriesPage;
