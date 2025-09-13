"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExportMenuItem = getExportMenuItem;
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function getExportMenuItem(connectionName, policyID, translate, policy, companyCard, backTo) {
    const currentConnectionName = (0, PolicyUtils_1.getCurrentConnectionName)(policy);
    const defaultCard = translate('workspace.moreFeatures.companyCards.defaultCard');
    const defaultMenuItem = {
        name: defaultCard,
        value: defaultCard,
        id: defaultCard,
        currency: '',
    };
    const { nonReimbursableExpensesExportDestination, nonReimbursableExpensesAccount, reimbursableExpensesExportDestination, reimbursableExpensesAccount } = policy?.connections?.quickbooksOnline?.config ?? {};
    const { export: exportConfig } = policy?.connections?.intacct?.config ?? {};
    const { export: exportConfiguration } = policy?.connections?.xero?.config ?? {};
    const config = policy?.connections?.netsuite?.options?.config;
    const { bankAccounts } = policy?.connections?.xero?.data ?? {};
    const { creditCards, bankAccounts: quickbooksOnlineBankAccounts } = policy?.connections?.quickbooksOnline?.data ?? {};
    const { creditCardAccounts } = policy?.connections?.quickbooksDesktop?.data ?? {};
    const { export: exportQBD } = policy?.connections?.quickbooksDesktop?.config ?? {};
    switch (connectionName) {
        case CONST_1.default.POLICY.CONNECTIONS.NAME.QBO: {
            const typeNonReimbursable = nonReimbursableExpensesExportDestination ? translate(`workspace.qbo.accounts.${nonReimbursableExpensesExportDestination}`) : undefined;
            const typeReimbursable = reimbursableExpensesExportDestination ? translate(`workspace.qbo.accounts.${reimbursableExpensesExportDestination}`) : undefined;
            const type = typeNonReimbursable ?? typeReimbursable;
            const description = currentConnectionName && type ? translate('workspace.moreFeatures.companyCards.integrationExport', { integration: currentConnectionName, type }) : undefined;
            let data;
            let shouldShowMenuItem = nonReimbursableExpensesExportDestination !== CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL;
            let selectedAccount;
            const defaultAccount = nonReimbursableExpensesAccount?.name ?? reimbursableExpensesAccount?.name;
            let isDefaultTitle = false;
            let exportType;
            const qboConfig = nonReimbursableExpensesExportDestination ?? reimbursableExpensesExportDestination;
            switch (qboConfig) {
                case CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY:
                case CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.CHECK:
                case CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL:
                case CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CREDIT_CARD: {
                    data = creditCards ?? [];
                    isDefaultTitle = !!(defaultAccount &&
                        (!companyCard?.nameValuePairs?.quickbooks_online_export_account ||
                            companyCard?.nameValuePairs?.quickbooks_online_export_account === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE));
                    selectedAccount = (creditCards ?? []).find((currentCard) => currentCard.id === (companyCard?.nameValuePairs?.quickbooks_online_export_account ?? defaultAccount));
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_QUICKBOOKS_ONLINE_EXPORT_ACCOUNT;
                    break;
                }
                case CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.DEBIT_CARD: {
                    data = quickbooksOnlineBankAccounts ?? [];
                    isDefaultTitle = !!(defaultAccount &&
                        (!companyCard?.nameValuePairs?.quickbooks_online_export_account_debit ||
                            companyCard?.nameValuePairs?.quickbooks_online_export_account_debit === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE));
                    selectedAccount = (quickbooksOnlineBankAccounts ?? []).find((bank) => bank.id === (companyCard?.nameValuePairs?.quickbooks_online_export_account_debit ?? defaultAccount));
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_QUICKBOOKS_ONLINE_EXPORT_ACCOUNT_DEBIT;
                    break;
                }
                default:
                    shouldShowMenuItem = false;
                    data = [];
            }
            const resultData = data.length > 0 ? [defaultMenuItem, ...data] : data;
            return {
                description,
                title: isDefaultTitle ? defaultCard : selectedAccount?.name,
                exportType,
                shouldShowMenuItem,
                exportPageLink: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT.getRoute(policyID, backTo),
                data: resultData.map((card) => ({
                    value: card.id,
                    text: card.name,
                    keyForList: card.name,
                    isSelected: isDefaultTitle ? card.name === defaultCard : card.id === selectedAccount?.id,
                })),
            };
        }
        case CONST_1.default.POLICY.CONNECTIONS.NAME.XERO: {
            const type = translate('workspace.xero.xeroBankAccount');
            const description = currentConnectionName && type ? translate('workspace.moreFeatures.companyCards.integrationExport', { integration: type }) : undefined;
            const exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_XERO_EXPORT_BANK_ACCOUNT;
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            const defaultAccount = exportConfiguration?.nonReimbursableAccount || bankAccounts?.[0]?.id;
            const isDefaultTitle = !!(defaultAccount &&
                (!companyCard?.nameValuePairs?.xero_export_bank_account || companyCard?.nameValuePairs?.xero_export_bank_account === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE));
            const selectedAccount = (bankAccounts ?? []).find((bank) => bank.id === (companyCard?.nameValuePairs?.xero_export_bank_account ?? defaultAccount));
            const resultData = (bankAccounts ?? [])?.length > 0 ? [defaultMenuItem, ...(bankAccounts ?? [])] : bankAccounts;
            return {
                description,
                exportType,
                shouldShowMenuItem: !!exportConfiguration?.nonReimbursableAccount,
                title: isDefaultTitle ? defaultCard : selectedAccount?.name,
                exportPageLink: ROUTES_1.default.POLICY_ACCOUNTING_XERO_EXPORT.getRoute(policyID, backTo),
                data: (resultData ?? []).map((card) => {
                    return {
                        value: card.id,
                        text: card.name,
                        keyForList: card.id,
                        isSelected: isDefaultTitle ? card.name === defaultCard : selectedAccount?.id === card.id,
                    };
                }),
            };
        }
        case CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE: {
            const typeNonreimbursable = config?.nonreimbursableExpensesExportDestination
                ? translate(`workspace.netsuite.exportDestination.values.${config.nonreimbursableExpensesExportDestination}.label`)
                : undefined;
            const typeReimbursable = config?.reimbursableExpensesExportDestination
                ? translate(`workspace.netsuite.exportDestination.values.${config.reimbursableExpensesExportDestination}.label`)
                : undefined;
            const type = typeNonreimbursable ?? typeReimbursable;
            let title = '';
            let exportType;
            let shouldShowMenuItem = true;
            const description = currentConnectionName && type ? translate('workspace.moreFeatures.companyCards.integrationExport', { integration: currentConnectionName, type }) : undefined;
            let data;
            let defaultAccount = '';
            let isDefaultTitle = false;
            const netSuiteConfig = config?.nonreimbursableExpensesExportDestination ?? config?.reimbursableExpensesExportDestination;
            switch (netSuiteConfig) {
                case CONST_1.default.NETSUITE_EXPORT_DESTINATION.VENDOR_BILL: {
                    const vendors = policy?.connections?.netsuite?.options.data.vendors;
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    defaultAccount = config?.defaultVendor || vendors?.[0]?.id;
                    isDefaultTitle = !!(defaultAccount &&
                        (!companyCard?.nameValuePairs?.netsuite_export_vendor || companyCard?.nameValuePairs?.netsuite_export_vendor === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE));
                    const selectedVendor = (0, PolicyUtils_1.findSelectedVendorWithDefaultSelect)(vendors, companyCard?.nameValuePairs?.netsuite_export_vendor ?? defaultAccount);
                    title = isDefaultTitle ? defaultCard : selectedVendor?.name;
                    const resultData = (vendors ?? []).length > 0 ? [defaultMenuItem, ...(vendors ?? [])] : vendors;
                    data = (resultData ?? []).map(({ id, name }) => {
                        return {
                            value: id,
                            text: name,
                            keyForList: id,
                            isSelected: isDefaultTitle ? name === defaultCard : selectedVendor?.id === id,
                        };
                    });
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_NETSUITE_EXPORT_VENDOR;
                    break;
                }
                case CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY: {
                    const payableAccounts = policy?.connections?.netsuite?.options.data.payableList;
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    defaultAccount = config?.payableAcct || payableAccounts?.[0]?.id;
                    isDefaultTitle = !!(defaultAccount &&
                        (!companyCard?.nameValuePairs?.netsuite_export_payable_account ||
                            companyCard?.nameValuePairs?.netsuite_export_payable_account === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE));
                    const selectedPayableAccount = (0, PolicyUtils_1.findSelectedBankAccountWithDefaultSelect)(payableAccounts, companyCard?.nameValuePairs?.netsuite_export_payable_account ?? defaultAccount);
                    title = isDefaultTitle ? defaultCard : selectedPayableAccount?.name;
                    const resultData = (payableAccounts ?? []).length > 0 ? [defaultMenuItem, ...(payableAccounts ?? [])] : payableAccounts;
                    data = (resultData ?? []).map(({ id, name }) => {
                        return {
                            value: id,
                            text: name,
                            keyForList: id,
                            isSelected: isDefaultTitle ? name === defaultCard : selectedPayableAccount?.id === id,
                        };
                    });
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_NETSUITE_EXPORT_ACCOUNT;
                    break;
                }
                default:
                    shouldShowMenuItem = false;
                    data = [];
            }
            return {
                description,
                title,
                shouldShowMenuItem,
                exportType,
                data,
                exportPageLink: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT.getRoute(policyID, backTo),
            };
        }
        case CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT: {
            const isNonReimbursable = !!exportConfig?.nonReimbursable;
            const isReimbursable = !!exportConfig?.reimbursable;
            const typeNonReimbursable = isNonReimbursable ? translate(`workspace.sageIntacct.nonReimbursableExpenses.values.${exportConfig.nonReimbursable}`) : undefined;
            const typeReimbursable = isReimbursable ? translate(`workspace.sageIntacct.reimbursableExpenses.values.${exportConfig.reimbursable}`) : undefined;
            const type = typeNonReimbursable ?? typeReimbursable;
            const description = currentConnectionName && type ? translate('workspace.moreFeatures.companyCards.integrationExport', { integration: currentConnectionName, type }) : undefined;
            let exportType;
            let title = '';
            let isDefaultTitle = false;
            let shouldShowMenuItem = true;
            let data;
            const sageConfig = exportConfig?.nonReimbursable ?? exportConfig?.reimbursable;
            switch (sageConfig) {
                case CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.VENDOR_BILL:
                case CONST_1.default.SAGE_INTACCT_REIMBURSABLE_EXPENSE_TYPE.VENDOR_BILL: {
                    const defaultAccount = isNonReimbursable ? (0, PolicyUtils_1.getSageIntacctNonReimbursableActiveDefaultVendor)(policy) : exportConfig?.reimbursableExpenseReportDefaultVendor;
                    isDefaultTitle = !!(companyCard?.nameValuePairs?.intacct_export_vendor === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE ||
                        (defaultAccount && !companyCard?.nameValuePairs?.intacct_export_vendor));
                    const vendors = policy?.connections?.intacct?.data?.vendors ?? [];
                    const selectedVendorID = companyCard?.nameValuePairs?.intacct_export_vendor ?? defaultAccount;
                    const selectedVendor = (vendors ?? []).find(({ id }) => id === selectedVendorID);
                    title = isDefaultTitle ? defaultCard : selectedVendor?.value;
                    const resultData = (vendors ?? []).length > 0 ? [defaultMenuItem, ...(vendors ?? [])] : vendors;
                    data = (resultData ?? []).map(({ id, value }) => {
                        return {
                            value: id,
                            text: value,
                            keyForList: id,
                            isSelected: isDefaultTitle ? value === defaultCard : selectedVendor?.id === id,
                        };
                    });
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_INTACCT_EXPORT_VENDOR;
                    break;
                }
                case CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.CREDIT_CARD_CHARGE: {
                    const intacctCreditCards = policy?.connections?.intacct?.data?.creditCards ?? [];
                    const activeDefaultVendor = (0, PolicyUtils_1.getSageIntacctNonReimbursableActiveDefaultVendor)(policy);
                    const defaultVendorAccount = (policy?.connections?.intacct?.data?.vendors ?? []).find((vendor) => vendor.id === activeDefaultVendor);
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    const defaultAccount = exportConfig?.nonReimbursableAccount || defaultVendorAccount;
                    isDefaultTitle = !!(companyCard?.nameValuePairs?.intacct_export_charge_card === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE ||
                        (defaultAccount && !companyCard?.nameValuePairs?.intacct_export_charge_card));
                    const selectedVendorID = companyCard?.nameValuePairs?.intacct_export_charge_card ?? defaultAccount;
                    const selectedCard = (intacctCreditCards ?? []).find(({ id }) => id === selectedVendorID);
                    title = isDefaultTitle ? defaultCard : selectedCard?.name;
                    const resultData = (intacctCreditCards ?? []).length > 0 ? [defaultMenuItem, ...(intacctCreditCards ?? [])] : intacctCreditCards;
                    data = (resultData ?? []).map(({ id, name }) => {
                        return {
                            value: id,
                            text: name,
                            keyForList: id,
                            isSelected: isDefaultTitle ? name === defaultCard : selectedCard?.id === id,
                        };
                    });
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_INTACCT_EXPORT_CHARGE_CARD;
                    break;
                }
                default:
                    shouldShowMenuItem = false;
                    data = [];
            }
            return {
                description,
                shouldShowMenuItem,
                exportType,
                title,
                exportPageLink: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_EXPORT.getRoute(policyID, backTo),
                data,
            };
        }
        case CONST_1.default.POLICY.CONNECTIONS.NAME.QBD: {
            const nonReimbursableExpenses = exportQBD?.nonReimbursable;
            const reimbursableExpenses = exportQBD?.reimbursable;
            const typeNonReimbursable = nonReimbursableExpenses ? translate(`workspace.qbd.accounts.${nonReimbursableExpenses}`) : undefined;
            const typeReimbursable = reimbursableExpenses ? translate(`workspace.qbd.accounts.${reimbursableExpenses}`) : undefined;
            const type = typeNonReimbursable ?? typeReimbursable;
            const description = currentConnectionName && type ? translate('workspace.moreFeatures.companyCards.integrationExport', { integration: currentConnectionName, type }) : undefined;
            let data;
            let shouldShowMenuItem = nonReimbursableExpenses !== CONST_1.default.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CHECK &&
                nonReimbursableExpenses !== CONST_1.default.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL;
            let title = '';
            let selectedAccount = '';
            const defaultAccount = exportQBD?.nonReimbursableAccount ?? exportQBD?.reimbursableAccount;
            let isDefaultTitle = false;
            let exportType;
            const qbdConfig = nonReimbursableExpenses ?? reimbursableExpenses;
            switch (qbdConfig) {
                case CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY:
                case CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.CHECK:
                case CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL:
                case CONST_1.default.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CREDIT_CARD: {
                    data = creditCardAccounts ?? [];
                    isDefaultTitle = !!(companyCard?.nameValuePairs?.quickbooks_desktop_export_account_credit === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE ||
                        (defaultAccount && !companyCard?.nameValuePairs?.quickbooks_desktop_export_account_credit));
                    title = isDefaultTitle ? defaultCard : companyCard?.nameValuePairs?.quickbooks_desktop_export_account_credit;
                    selectedAccount = companyCard?.nameValuePairs?.quickbooks_desktop_export_account_credit ?? defaultAccount;
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_QUICKBOOKS_DESKTOP_EXPORT_ACCOUNT_CREDIT;
                    break;
                }
                default:
                    shouldShowMenuItem = false;
                    data = [];
            }
            const resultData = data.length > 0 ? [defaultMenuItem, ...data] : data;
            return {
                description,
                title,
                exportType,
                shouldShowMenuItem,
                exportPageLink: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT.getRoute(policyID, backTo),
                data: resultData.map((card) => ({
                    value: card.name,
                    text: card.name,
                    keyForList: card.name,
                    isSelected: isDefaultTitle ? card.name === defaultCard : card.name === selectedAccount,
                })),
            };
        }
        default:
            return undefined;
    }
}
