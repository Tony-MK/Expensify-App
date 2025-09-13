"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDefaultTaxRateText = formatDefaultTaxRateText;
exports.formatRequireReceiptsOverText = formatRequireReceiptsOverText;
exports.getCategoryApproverRule = getCategoryApproverRule;
exports.getCategoryExpenseRule = getCategoryExpenseRule;
exports.getCategoryDefaultTaxRate = getCategoryDefaultTaxRate;
exports.updateCategoryInMccGroup = updateCategoryInMccGroup;
exports.getEnabledCategoriesCount = getEnabledCategoriesCount;
exports.isCategoryMissing = isCategoryMissing;
const CONST_1 = require("@src/CONST");
const CurrencyUtils_1 = require("./CurrencyUtils");
function formatDefaultTaxRateText(translate, taxID, taxRate, policyTaxRates) {
    const taxRateText = `${taxRate.name} ${CONST_1.default.DOT_SEPARATOR} ${taxRate.value}`;
    if (!policyTaxRates) {
        return taxRateText;
    }
    const { defaultExternalID, foreignTaxDefault } = policyTaxRates;
    let suffix;
    if (taxID === defaultExternalID && taxID === foreignTaxDefault) {
        suffix = translate('common.default');
    }
    else if (taxID === defaultExternalID) {
        suffix = translate('workspace.taxes.workspaceDefault');
    }
    else if (taxID === foreignTaxDefault) {
        suffix = translate('workspace.taxes.foreignDefault');
    }
    return `${taxRateText}${suffix ? ` ${CONST_1.default.DOT_SEPARATOR} ${suffix}` : ``}`;
}
function formatRequireReceiptsOverText(translate, policy, categoryMaxAmountNoReceipt) {
    const isAlwaysSelected = categoryMaxAmountNoReceipt === 0;
    const isNeverSelected = categoryMaxAmountNoReceipt === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE;
    if (isAlwaysSelected) {
        return translate(`workspace.rules.categoryRules.requireReceiptsOverList.always`);
    }
    if (isNeverSelected) {
        return translate(`workspace.rules.categoryRules.requireReceiptsOverList.never`);
    }
    const maxExpenseAmountToDisplay = policy?.maxExpenseAmountNoReceipt === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE ? 0 : policy?.maxExpenseAmountNoReceipt;
    return translate(`workspace.rules.categoryRules.requireReceiptsOverList.default`, {
        defaultAmount: (0, CurrencyUtils_1.convertToShortDisplayString)(maxExpenseAmountToDisplay, policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD),
    });
}
function getCategoryApproverRule(approvalRules, categoryName) {
    const approverRule = approvalRules?.find((rule) => rule.applyWhen.find(({ condition, field, value }) => condition === CONST_1.default.POLICY.RULE_CONDITIONS.MATCHES && field === CONST_1.default.POLICY.FIELDS.CATEGORY && value === categoryName));
    return approverRule;
}
function getCategoryExpenseRule(expenseRules, categoryName) {
    const expenseRule = expenseRules?.find((rule) => rule.applyWhen.find(({ condition, field, value }) => condition === CONST_1.default.POLICY.RULE_CONDITIONS.MATCHES && field === CONST_1.default.POLICY.FIELDS.CATEGORY && value === categoryName));
    return expenseRule;
}
function getCategoryDefaultTaxRate(expenseRules, categoryName, defaultTaxRate) {
    const categoryDefaultTaxRate = expenseRules?.find((rule) => rule.applyWhen.some((when) => when.value === categoryName))?.tax?.field_id_TAX?.externalID;
    // If the default taxRate is not found in expenseRules, use the default value for policy
    if (!categoryDefaultTaxRate) {
        return defaultTaxRate;
    }
    return categoryDefaultTaxRate;
}
function updateCategoryInMccGroup(mccGroups, oldCategoryName, newCategoryName, shouldClearPendingAction) {
    if (oldCategoryName === newCategoryName) {
        return mccGroups;
    }
    const updatedGroups = {};
    for (const [key, group] of Object.entries(mccGroups || {})) {
        updatedGroups[key] =
            group.category === oldCategoryName ? { ...group, category: newCategoryName, pendingAction: shouldClearPendingAction ? null : CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE } : group;
    }
    return updatedGroups;
}
/**
 * Calculates count of all enabled options
 */
function getEnabledCategoriesCount(policyCategories) {
    if (policyCategories === undefined) {
        return 0;
    }
    return Object.values(policyCategories).filter((policyCategory) => policyCategory.enabled).length;
}
function isCategoryMissing(category) {
    if (!category) {
        return true;
    }
    const emptyCategories = CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE.split(',');
    return emptyCategories.includes(category ?? '');
}
