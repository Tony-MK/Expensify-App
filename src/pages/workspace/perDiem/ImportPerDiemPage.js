"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ImportSpreadsheet_1 = require("@components/ImportSpreadsheet");
const usePolicy_1 = require("@hooks/usePolicy");
const PolicyUtils = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function ImportPerDiemPage({ route }) {
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} fullPageNotFoundViewProps={{ subtitleKey: (0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized', onLinkPress: PolicyUtils.goBackFromInvalidPolicy }}>
            <ImportSpreadsheet_1.default backTo={ROUTES_1.default.WORKSPACE_PER_DIEM.getRoute(policyID)} goTo={ROUTES_1.default.WORKSPACE_PER_DIEM_IMPORTED.getRoute(policyID)}/>
        </AccessOrNotFoundWrapper_1.default>);
}
exports.default = ImportPerDiemPage;
