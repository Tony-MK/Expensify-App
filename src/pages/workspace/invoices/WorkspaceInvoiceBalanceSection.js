"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Section_1 = require("@components/Section");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils = require("@libs/CurrencyUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function WorkspaceInvoiceBalanceSection({ policyID }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`);
    return (<Section_1.default title={translate('workspace.invoices.invoiceBalance')} subtitle={translate('workspace.invoices.invoiceBalanceSubtitle')} isCentralPane titleStyles={styles.accountSettingsSectionTitle} childrenStyles={styles.pt5} subtitleMuted>
            <MenuItemWithTopDescription_1.default description={translate('walletPage.balance')} title={CurrencyUtils.convertToDisplayString(policy?.invoice?.bankAccount?.stripeConnectAccountBalance ?? 0, policy?.outputCurrency)} titleStyle={styles.textHeadlineH2} interactive={false} wrapperStyle={styles.sectionMenuItemTopDescription}/>
        </Section_1.default>);
}
exports.default = WorkspaceInvoiceBalanceSection;
