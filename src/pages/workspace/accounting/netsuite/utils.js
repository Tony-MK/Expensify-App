"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldHideReimbursedReportsSection = shouldHideReimbursedReportsSection;
exports.shouldHideReportsExportTo = shouldHideReportsExportTo;
exports.shouldHideExportVendorBillsTo = shouldHideExportVendorBillsTo;
exports.shouldHideExportJournalsTo = shouldHideExportJournalsTo;
exports.shouldHideCustomFormIDOptions = shouldHideCustomFormIDOptions;
exports.exportExpensesDestinationSettingName = exportExpensesDestinationSettingName;
exports.shouldHideReimbursableDefaultVendor = shouldHideReimbursableDefaultVendor;
exports.shouldHideNonReimbursableJournalPostingAccount = shouldHideNonReimbursableJournalPostingAccount;
exports.shouldHideReimbursableJournalPostingAccount = shouldHideReimbursableJournalPostingAccount;
exports.shouldHideJournalPostingPreference = shouldHideJournalPostingPreference;
exports.shouldShowInvoiceItemMenuItem = shouldShowInvoiceItemMenuItem;
exports.shouldHideProvincialTaxPostingAccountSelect = shouldHideProvincialTaxPostingAccountSelect;
exports.shouldHideTaxPostingAccountSelect = shouldHideTaxPostingAccountSelect;
exports.shouldHideExportForeignCurrencyAmount = shouldHideExportForeignCurrencyAmount;
exports.getImportCustomFieldsSettings = getImportCustomFieldsSettings;
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
function shouldHideReimbursedReportsSection(config) {
    return config?.reimbursableExpensesExportDestination === CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY;
}
function shouldHideReportsExportTo(config) {
    return config?.reimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.EXPENSE_REPORT;
}
function shouldHideExportVendorBillsTo(config) {
    return (config?.reimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.VENDOR_BILL &&
        config?.nonreimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.VENDOR_BILL);
}
function shouldHideExportJournalsTo(config) {
    return (config?.reimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY &&
        config?.nonreimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY);
}
function shouldHideCustomFormIDOptions(config) {
    return !config?.customFormIDOptions?.enabled;
}
function exportExpensesDestinationSettingName(isReimbursable) {
    return isReimbursable ? CONST_1.default.NETSUITE_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION : CONST_1.default.NETSUITE_CONFIG.NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION;
}
function shouldHideReimbursableDefaultVendor(isReimbursable, config) {
    return isReimbursable || config?.nonreimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.VENDOR_BILL;
}
function shouldHideNonReimbursableJournalPostingAccount(isReimbursable, config) {
    return isReimbursable || config?.nonreimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY;
}
function shouldHideReimbursableJournalPostingAccount(isReimbursable, config) {
    return !isReimbursable || config?.reimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY;
}
function shouldHideJournalPostingPreference(isReimbursable, config) {
    return config?.[exportExpensesDestinationSettingName(isReimbursable)] !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY;
}
function shouldShowInvoiceItemMenuItem(config) {
    return config?.invoiceItemPreference === CONST_1.default.NETSUITE_INVOICE_ITEM_PREFERENCE.SELECT;
}
function shouldHideProvincialTaxPostingAccountSelect(selectedSubsidiary, config) {
    return !!config?.suiteTaxEnabled || !config?.syncOptions.syncTax || !(0, PolicyUtils_1.canUseProvincialTaxNetSuite)(selectedSubsidiary?.country);
}
function shouldHideTaxPostingAccountSelect(canUseNetSuiteUSATax, selectedSubsidiary, config) {
    return !!config?.suiteTaxEnabled || !config?.syncOptions.syncTax || !(0, PolicyUtils_1.canUseTaxNetSuite)(canUseNetSuiteUSATax, selectedSubsidiary?.country);
}
function shouldHideExportForeignCurrencyAmount(config) {
    return (config?.reimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.EXPENSE_REPORT &&
        config?.nonreimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.EXPENSE_REPORT);
}
function getImportCustomFieldsSettings(importField, config) {
    const data = config?.syncOptions?.[importField] ?? [];
    return data.map((_, index) => `${importField}_${index}`);
}
