"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Section_1 = require("@components/Section");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceInvoicingDetailsSection({ policyID }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`);
    const horizontalPadding = (0, react_1.useMemo)(() => (shouldUseNarrowLayout ? styles.ph5 : styles.ph8), [shouldUseNarrowLayout, styles]);
    return (<Section_1.default title={translate('workspace.invoices.invoicingDetails')} subtitle={translate('workspace.invoices.invoicingDetailsDescription')} containerStyles={[styles.ph0, shouldUseNarrowLayout ? styles.pt5 : styles.pt8]} subtitleStyles={horizontalPadding} titleStyles={[styles.accountSettingsSectionTitle, horizontalPadding]} childrenStyles={styles.pt5} subtitleMuted>
            <MenuItemWithTopDescription_1.default key={translate('workspace.invoices.companyName')} shouldShowRightIcon title={policy?.invoice?.companyName} description={translate('workspace.invoices.companyName')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_INVOICES_COMPANY_NAME.getRoute(policyID))} style={horizontalPadding}/>
            <MenuItemWithTopDescription_1.default key={translate('workspace.invoices.companyWebsite')} shouldShowRightIcon title={policy?.invoice?.companyWebsite} description={translate('workspace.invoices.companyWebsite')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_INVOICES_COMPANY_WEBSITE.getRoute(policyID))} style={horizontalPadding}/>
        </Section_1.default>);
}
WorkspaceInvoicingDetailsSection.displayName = 'WorkspaceInvoicingDetailsSection';
exports.default = WorkspaceInvoicingDetailsSection;
