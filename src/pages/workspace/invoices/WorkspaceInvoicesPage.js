"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Illustrations = require("@components/Icon/Illustrations");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const WorkspacePageWithSections_1 = require("@pages/workspace/WorkspacePageWithSections");
const CONST_1 = require("@src/CONST");
const WorkspaceInvoiceBalanceSection_1 = require("./WorkspaceInvoiceBalanceSection");
const WorkspaceInvoiceVBASection_1 = require("./WorkspaceInvoiceVBASection");
const WorkspaceInvoicingDetailsSection_1 = require("./WorkspaceInvoicingDetailsSection");
function WorkspaceInvoicesPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_INVOICES_ENABLED}>
            <WorkspacePageWithSections_1.default shouldUseScrollView headerText={translate('workspace.common.invoices')} shouldShowOfflineIndicatorInWideScreen shouldSkipVBBACall={false} route={route} icon={Illustrations.InvoiceBlue} addBottomSafeAreaPadding>
                {(_hasVBA, policyID) => (<react_native_1.View style={[styles.mt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                        {!!policyID && <WorkspaceInvoiceBalanceSection_1.default policyID={policyID}/>}
                        {!!policyID && <WorkspaceInvoiceVBASection_1.default policyID={policyID}/>}
                        {!!policyID && <WorkspaceInvoicingDetailsSection_1.default policyID={policyID}/>}
                    </react_native_1.View>)}
            </WorkspacePageWithSections_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceInvoicesPage.displayName = 'WorkspaceInvoicesPage';
exports.default = WorkspaceInvoicesPage;
