"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var ConfirmModal_1 = require("@components/ConfirmModal");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var SelectionList_1 = require("@components/SelectionList");
var MultiSelectListItem_1 = require("@components/SelectionList/MultiSelectListItem");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var usePolicy_1 = require("@hooks/usePolicy");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var Navigation_1 = require("@navigation/Navigation");
var Policy_1 = require("@userActions/Policy/Policy");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var utils_1 = require("./utils");
var DEFAULT_SELECT_ALL = 'selectAll';
function WorkspaceDuplicateSelectFeaturesForm(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    var policyID = _a.policyID;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var policy = (0, usePolicy_1.default)(policyID);
    var isCollect = (0, PolicyUtils_1.isCollectPolicy)(policy);
    var duplicateWorkspace = (0, useOnyx_1.default)(ONYXKEYS_1.default.DUPLICATE_WORKSPACE, { canBeMissing: false })[0];
    var _v = (0, react_1.useState)(false), isDuplicateModalOpen = _v[0], setIsDuplicateModalOpen = _v[1];
    var allIds = (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy === null || policy === void 0 ? void 0 : policy.employeeList);
    var totalMembers = Object.keys(allIds).length;
    var policyTags = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS).concat(policyID), { canBeMissing: false })[0];
    var taxesLength = (_d = Object.keys((_c = (_b = policy === null || policy === void 0 ? void 0 : policy.taxRates) === null || _b === void 0 ? void 0 : _b.taxes) !== null && _c !== void 0 ? _c : {}).length) !== null && _d !== void 0 ? _d : 0;
    var policyCategories = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES).concat(policyID), { canBeMissing: true })[0];
    var categoriesCount = Object.keys(policyCategories !== null && policyCategories !== void 0 ? policyCategories : {}).length;
    var _w = (0, react_1.useState)([]), selectedItems = _w[0], setSelectedItems = _w[1];
    var reportFields = (_e = Object.keys((0, ReportUtils_1.getReportFieldsByPolicyID)(policyID)).length) !== null && _e !== void 0 ? _e : 0;
    var customUnits = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    var customUnitRates = (_f = customUnits === null || customUnits === void 0 ? void 0 : customUnits.rates) !== null && _f !== void 0 ? _f : {};
    var allRates = (_g = Object.values(customUnitRates)) === null || _g === void 0 ? void 0 : _g.length;
    var bankAccountList = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true })[0];
    var accountingIntegrations = Object.values(CONST_1.default.POLICY.CONNECTIONS.NAME);
    var connectedIntegration = (0, utils_1.getAllValidConnectedIntegration)(policy, accountingIntegrations);
    var customUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    var ratesCount = Object.keys((_h = customUnit === null || customUnit === void 0 ? void 0 : customUnit.rates) !== null && _h !== void 0 ? _h : {}).length;
    var invoiceCompany = ((_j = policy === null || policy === void 0 ? void 0 : policy.invoice) === null || _j === void 0 ? void 0 : _j.companyName) && ((_k = policy === null || policy === void 0 ? void 0 : policy.invoice) === null || _k === void 0 ? void 0 : _k.companyWebsite)
        ? "".concat((_l = policy === null || policy === void 0 ? void 0 : policy.invoice) === null || _l === void 0 ? void 0 : _l.companyName, ", ").concat((_m = policy === null || policy === void 0 ? void 0 : policy.invoice) === null || _m === void 0 ? void 0 : _m.companyWebsite)
        : ((_r = (_p = (_o = policy === null || policy === void 0 ? void 0 : policy.invoice) === null || _o === void 0 ? void 0 : _o.companyName) !== null && _p !== void 0 ? _p : (_q = policy === null || policy === void 0 ? void 0 : policy.invoice) === null || _q === void 0 ? void 0 : _q.companyWebsite) !== null && _r !== void 0 ? _r : '');
    var totalTags = (0, react_1.useMemo)(function () {
        if (!policyTags) {
            return 0;
        }
        return Object.values(policyTags).reduce(function (sum, tagGroup) { var _a, _b; return sum + Number((_b = (_a = Object.values(tagGroup.tags)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0); }, 0);
    }, [policyTags]);
    var _x = ((_t = (_s = policy === null || policy === void 0 ? void 0 : policy.address) === null || _s === void 0 ? void 0 : _s.addressStreet) !== null && _t !== void 0 ? _t : '').split('\n'), street1 = _x[0], street2 = _x[1];
    var formattedAddress = !(0, EmptyObject_1.isEmptyObject)(policy) && !(0, EmptyObject_1.isEmptyObject)(policy.address)
        ? "".concat(street1 === null || street1 === void 0 ? void 0 : street1.trim(), ", ").concat(street2 ? "".concat(street2.trim(), ", ") : '').concat(policy.address.city, ", ").concat(policy.address.state, " ").concat((_u = policy.address.zipCode) !== null && _u !== void 0 ? _u : '')
        : '';
    var items = (0, react_1.useMemo)(function () {
        var rules = (0, utils_1.getWorkspaceRules)(policy, translate);
        var workflows = (0, utils_1.getWorkflowRules)(policy, translate);
        var result = [
            {
                translation: translate('workspace.common.selectAll'),
                value: DEFAULT_SELECT_ALL,
            },
            {
                translation: translate('workspace.common.profile'),
                value: 'overview',
                alternateText: "".concat(policy === null || policy === void 0 ? void 0 : policy.outputCurrency, " ").concat(translate('common.currency'), ", ").concat(formattedAddress),
            },
            totalMembers > 1
                ? {
                    translation: translate('workspace.common.members'),
                    value: 'members',
                    alternateText: totalMembers ? "".concat(totalMembers, " ").concat(translate('workspace.common.members').toLowerCase()) : undefined,
                }
                : undefined,
            reportFields > 0
                ? {
                    translation: translate('workspace.common.reports'),
                    value: 'reports',
                    alternateText: reportFields ? "".concat(reportFields, " ").concat(translate('workspace.common.reportFields').toLowerCase()) : undefined,
                }
                : undefined,
            connectedIntegration && (connectedIntegration === null || connectedIntegration === void 0 ? void 0 : connectedIntegration.length) > 0
                ? {
                    translation: translate('workspace.common.accounting'),
                    value: 'accounting',
                    alternateText: connectedIntegration.map(function (connectionName) { return CONST_1.default.POLICY.CONNECTIONS.NAME_USER_FRIENDLY[connectionName]; }).join(', '),
                }
                : undefined,
            totalTags > 0
                ? {
                    translation: translate('workspace.common.tags'),
                    value: 'tags',
                    alternateText: totalTags ? "".concat(totalTags, " ").concat(translate('workspace.common.tags').toLowerCase()) : undefined,
                }
                : undefined,
            categoriesCount > 0
                ? {
                    translation: translate('workspace.common.categories'),
                    value: 'categories',
                    alternateText: categoriesCount ? "".concat(categoriesCount, " ").concat(translate('workspace.duplicateWorkspace.categories').toLowerCase()) : undefined,
                }
                : undefined,
            taxesLength > 0
                ? {
                    translation: translate('workspace.common.taxes'),
                    value: 'taxes',
                    alternateText: taxesLength ? "".concat(taxesLength, " ").concat(translate('workspace.common.taxes').toLowerCase()) : undefined,
                }
                : undefined,
            workflows && (workflows === null || workflows === void 0 ? void 0 : workflows.length) > 0
                ? {
                    translation: translate('workspace.common.workflows'),
                    value: 'workflows',
                    alternateText: workflows === null || workflows === void 0 ? void 0 : workflows.join(', '),
                }
                : undefined,
            rules && rules.length > 0 && !isCollect
                ? {
                    translation: translate('workspace.common.rules'),
                    value: 'rules',
                    alternateText: rules.length
                        ? "".concat(rules.length, " ").concat(translate('workspace.common.workspace').toLowerCase(), " ").concat(translate('workspace.common.rules').toLowerCase(), ": ").concat(rules.join(', '))
                        : undefined,
                }
                : undefined,
            ratesCount > 0
                ? {
                    translation: translate('workspace.common.distanceRates'),
                    value: 'distanceRates',
                    alternateText: ratesCount ? "".concat(ratesCount, " ").concat(translate('iou.rates').toLowerCase()) : undefined,
                }
                : undefined,
            allRates > 0
                ? {
                    translation: translate('workspace.common.perDiem'),
                    value: 'perDiem',
                    alternateText: allRates ? "".concat(allRates, " ").concat(translate('workspace.common.perDiem').toLowerCase()) : undefined,
                }
                : undefined,
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            (bankAccountList && Object.keys(bankAccountList).length) || !!invoiceCompany
                ? {
                    translation: translate('workspace.common.invoices'),
                    value: 'invoices',
                    alternateText: bankAccountList ? "".concat(Object.keys(bankAccountList).length, " ").concat(translate('common.bankAccounts').toLowerCase(), ", ").concat(invoiceCompany) : invoiceCompany,
                }
                : undefined,
        ];
        return result.filter(function (item) { return !!item; });
    }, [
        policy,
        translate,
        formattedAddress,
        totalMembers,
        reportFields,
        connectedIntegration,
        totalTags,
        categoriesCount,
        taxesLength,
        ratesCount,
        isCollect,
        allRates,
        bankAccountList,
        invoiceCompany,
    ]);
    var listData = (0, react_1.useMemo)(function () {
        return items.map(function (option) {
            var alternateText = (option === null || option === void 0 ? void 0 : option.alternateText) ? option.alternateText.trim().replace(/,$/, '') : undefined;
            return {
                text: option.translation,
                keyForList: option.value,
                isSelected: selectedItems.includes(option.value),
                alternateText: alternateText,
            };
        });
    }, [items, selectedItems]);
    var fetchWorkspaceRelatedData = (0, react_1.useCallback)(function () {
        if (!policyID) {
            return;
        }
        (0, Policy_1.openDuplicatePolicyPage)(policyID);
    }, [policyID]);
    var confirmDuplicate = (0, react_1.useCallback)(function () {
        if (!policy || !(duplicateWorkspace === null || duplicateWorkspace === void 0 ? void 0 : duplicateWorkspace.name) || !(duplicateWorkspace === null || duplicateWorkspace === void 0 ? void 0 : duplicateWorkspace.policyID)) {
            return;
        }
        (0, Policy_1.duplicateWorkspace)(policy, {
            policyName: duplicateWorkspace.name,
            policyID: policy.id,
            targetPolicyID: duplicateWorkspace.policyID,
            welcomeNote: "".concat(translate('workspace.duplicateWorkspace.welcomeNote'), " ").concat(duplicateWorkspace.name),
            policyCategories: selectedItems.includes('categories') ? policyCategories : undefined,
            parts: {
                people: selectedItems.includes('members'),
                reports: selectedItems.includes('reports'),
                connections: selectedItems.includes('accounting'),
                categories: selectedItems.includes('categories'),
                tags: selectedItems.includes('tags'),
                taxes: selectedItems.includes('taxes'),
                perDiem: selectedItems.includes('perDiem'),
                reimbursements: selectedItems.includes('invoices'),
                expenses: selectedItems.includes('rules'),
                customUnits: selectedItems.includes('distanceRates'),
                invoices: selectedItems.includes('invoices'),
                exportLayouts: selectedItems.includes('workflows'),
            },
            file: duplicateWorkspace === null || duplicateWorkspace === void 0 ? void 0 : duplicateWorkspace.file,
        });
        Navigation_1.default.closeRHPFlow();
    }, [duplicateWorkspace === null || duplicateWorkspace === void 0 ? void 0 : duplicateWorkspace.file, duplicateWorkspace === null || duplicateWorkspace === void 0 ? void 0 : duplicateWorkspace.name, duplicateWorkspace === null || duplicateWorkspace === void 0 ? void 0 : duplicateWorkspace.policyID, policy, policyCategories, selectedItems, translate]);
    var confirmDuplicateAndHideModal = (0, react_1.useCallback)(function () {
        setIsDuplicateModalOpen(false);
        if (!policy || !(duplicateWorkspace === null || duplicateWorkspace === void 0 ? void 0 : duplicateWorkspace.name) || !(duplicateWorkspace === null || duplicateWorkspace === void 0 ? void 0 : duplicateWorkspace.policyID)) {
            return;
        }
        confirmDuplicate();
    }, [confirmDuplicate, duplicateWorkspace === null || duplicateWorkspace === void 0 ? void 0 : duplicateWorkspace.name, duplicateWorkspace === null || duplicateWorkspace === void 0 ? void 0 : duplicateWorkspace.policyID, policy]);
    var onConfirmSelectList = (0, react_1.useCallback)(function () {
        if (!totalMembers || totalMembers < 2 || !selectedItems.includes('members')) {
            confirmDuplicate();
            return;
        }
        setIsDuplicateModalOpen(true);
    }, [confirmDuplicate, selectedItems, totalMembers]);
    var updateSelectedItems = (0, react_1.useCallback)(function (listItem) {
        var _a;
        if (listItem.isSelected) {
            if (listItem.keyForList === DEFAULT_SELECT_ALL) {
                setSelectedItems([]);
                return;
            }
            setSelectedItems(selectedItems.filter(function (i) { return i !== listItem.keyForList && i !== DEFAULT_SELECT_ALL; }));
            return;
        }
        if (listItem.keyForList === DEFAULT_SELECT_ALL) {
            setSelectedItems(items.map(function (i) { return i.value; }));
            return;
        }
        var newItem = (_a = items.find(function (i) { return i.value === listItem.keyForList; })) === null || _a === void 0 ? void 0 : _a.value;
        if (newItem) {
            var newSelectedItems = __spreadArray(__spreadArray([], selectedItems, true), [newItem], false);
            var featuresOptions = items.filter(function (i) { return i.value !== DEFAULT_SELECT_ALL; });
            var allItemsSelected = featuresOptions.length === newSelectedItems.length;
            if (allItemsSelected) {
                setSelectedItems(__spreadArray(__spreadArray([], newSelectedItems, true), [DEFAULT_SELECT_ALL], false));
            }
            else {
                setSelectedItems(newSelectedItems);
            }
        }
    }, [items, selectedItems]);
    (0, react_1.useEffect)(function () {
        if (!items.length) {
            return;
        }
        setSelectedItems(items.map(function (i) { return i.value; }));
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items.length]);
    (0, react_1.useEffect)(function () {
        fetchWorkspaceRelatedData();
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (<>
            <HeaderWithBackButton_1.default onBackButtonPress={policyID ? function () { return Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_DUPLICATE.getRoute(policyID)); } : undefined} title={translate('workspace.common.duplicateWorkspace')}/>
            <>
                <react_native_1.View style={[styles.ph5, styles.pv3]}>
                    <Text_1.default style={[styles.textHeadline]}>{translate('workspace.duplicateWorkspace.selectFeatures')}</Text_1.default>
                    <Text_1.default style={[styles.webViewStyles.baseFontStyle, styles.textSupporting]}>{translate('workspace.duplicateWorkspace.whichFeatures')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.flex1]}>
                    <SelectionList_1.default shouldSingleExecuteRowSelect sections={[{ data: listData }]} ListItem={MultiSelectListItem_1.default} onSelectRow={updateSelectedItems} isAlternateTextMultilineSupported addBottomSafeAreaPadding showConfirmButton confirmButtonText={translate('common.continue')} onConfirm={onConfirmSelectList}/>
                </react_native_1.View>
            </>
            <ConfirmModal_1.default title={translate('workspace.common.duplicateWorkspace')} isVisible={isDuplicateModalOpen} onConfirm={confirmDuplicateAndHideModal} onCancel={function () { return setIsDuplicateModalOpen(false); }} prompt={<Text_1.default>
                        <Text_1.default style={[styles.webViewStyles.baseFontStyle, styles.textSupporting, styles.mb3]}>
                            {translate('workspace.duplicateWorkspace.confirmTitle', {
                newWorkspaceName: duplicateWorkspace === null || duplicateWorkspace === void 0 ? void 0 : duplicateWorkspace.name,
                totalMembers: totalMembers,
            })}
                        </Text_1.default>
                        <Text_1.default style={[styles.webViewStyles.baseFontStyle, styles.textSupporting]}>{translate('workspace.duplicateWorkspace.confirmDuplicate')}</Text_1.default>
                    </Text_1.default>} confirmText={translate('common.proceed')} cancelText={translate('common.cancel')} success/>
        </>);
}
WorkspaceDuplicateSelectFeaturesForm.displayName = 'WorkspaceDuplicateSelectFeaturesForm';
exports.default = WorkspaceDuplicateSelectFeaturesForm;
