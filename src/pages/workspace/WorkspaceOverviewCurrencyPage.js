"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CurrencySelectionList_1 = require("@components/CurrencySelectionList");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const mapCurrencyToCountry_1 = require("@libs/mapCurrencyToCountry");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const BankAccounts_1 = require("@userActions/BankAccounts");
const FormActions_1 = require("@userActions/FormActions");
const Policy_1 = require("@userActions/Policy/Policy");
const ReimbursementAccount_1 = require("@userActions/ReimbursementAccount");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const AccessOrNotFoundWrapper_1 = require("./AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("./withPolicyAndFullscreenLoading");
const { COUNTRY } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA;
function WorkspaceOverviewCurrencyPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [isForcedToChangeCurrency] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_FORCED_TO_CHANGE_CURRENCY, { canBeMissing: true });
    const [hasVBA = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { selector: (value) => value?.achData?.state === CONST_1.default.BANK_ACCOUNT.STATE.OPEN, canBeMissing: true });
    const onSelectCurrency = (item) => {
        if (!policy) {
            return;
        }
        (0, FormActions_1.clearDraftValues)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
        (0, FormActions_1.setDraftValues)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, { [COUNTRY]: (0, mapCurrencyToCountry_1.default)(item.currencyCode) });
        (0, Policy_1.updateGeneralSettings)(policy.id, policy?.name ?? '', item.currencyCode);
        (0, BankAccounts_1.clearCorpayBankAccountFields)();
        if (isForcedToChangeCurrency) {
            (0, Policy_1.setIsForcedToChangeCurrency)(false);
            if ((0, Policy_1.isCurrencySupportedForGlobalReimbursement)(item.currencyCode, isBetaEnabled(CONST_1.default.BETAS.GLOBAL_REIMBURSEMENTS_ON_ND))) {
                (0, ReimbursementAccount_1.navigateToBankAccountRoute)(policy.id, ROUTES_1.default.WORKSPACE_WORKFLOWS.getRoute(policy.id), { forceReplace: true });
                return;
            }
        }
        Navigation_1.default.setNavigationActionToMicrotaskQueue(Navigation_1.default.goBack);
    };
    return (<AccessOrNotFoundWrapper_1.default policyID={policy?.id} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} shouldBeBlocked={hasVBA} fullPageNotFoundViewProps={{
            onLinkPress: hasVBA ? () => Navigation_1.default.goBack() : PolicyUtils_1.goBackFromInvalidPolicy,
            subtitleKey: hasVBA || (0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized',
        }}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={WorkspaceOverviewCurrencyPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.editor.currencyInputLabel')} onBackButtonPress={() => Navigation_1.default.goBack()}/>

                <CurrencySelectionList_1.default searchInputLabel={translate('workspace.editor.currencyInputLabel')} onSelect={onSelectCurrency} initiallySelectedCurrencyCode={policy?.outputCurrency} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceOverviewCurrencyPage.displayName = 'WorkspaceOverviewCurrencyPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceOverviewCurrencyPage);
