"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const WorkspaceConfirmationForm_1 = require("@components/WorkspaceConfirmationForm");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const App_1 = require("@libs/actions/App");
const Policy_1 = require("@libs/actions/Policy/Policy");
const currentUrl_1 = require("@libs/Navigation/currentUrl");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceConfirmationPage() {
    // It is necessary to use here isSmallScreenWidth because on a wide layout we should always navigate to ROUTES.WORKSPACE_OVERVIEW.
    // shouldUseNarrowLayout cannot be used to determine that as this screen is displayed in RHP and shouldUseNarrowLayout always returns true.
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [lastPaymentMethod] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, { canBeMissing: true });
    const onSubmit = (params) => {
        const policyID = params.policyID || (0, Policy_1.generatePolicyID)();
        const routeToNavigate = isSmallScreenWidth ? ROUTES_1.default.WORKSPACE_INITIAL.getRoute(policyID) : ROUTES_1.default.WORKSPACE_OVERVIEW.getRoute(policyID);
        (0, App_1.createWorkspaceWithPolicyDraftAndNavigateToIt)('', params.name, false, false, '', policyID, params.currency, params.avatarFile, routeToNavigate, lastPaymentMethod?.[policyID]);
    };
    const currentUrl = (0, currentUrl_1.default)();
    // Approved Accountants and Guides can enter a flow where they make a workspace for other users,
    // and those are passed as a search parameter when using transition links
    const policyOwnerEmail = currentUrl ? (new URL(currentUrl).searchParams.get('ownerEmail') ?? '') : '';
    return (<ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={WorkspaceConfirmationPage.displayName}>
            <WorkspaceConfirmationForm_1.default policyOwnerEmail={policyOwnerEmail} onSubmit={onSubmit}/>
        </ScreenWrapper_1.default>);
}
WorkspaceConfirmationPage.displayName = 'WorkspaceConfirmationPage';
exports.default = WorkspaceConfirmationPage;
