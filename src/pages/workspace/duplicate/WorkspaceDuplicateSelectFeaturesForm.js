"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const SelectionList_1 = require("@components/SelectionList");
const MultiSelectListItem_1 = require("@components/SelectionList/MultiSelectListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Navigation_1 = require("@navigation/Navigation");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const utils_1 = require("./utils");
const DEFAULT_SELECT_ALL = 'selectAll';
function WorkspaceDuplicateSelectFeaturesForm({ policyID }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const isCollect = (0, PolicyUtils_1.isCollectPolicy)(policy);
    const [duplicateWorkspace] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DUPLICATE_WORKSPACE, { canBeMissing: false });
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = (0, react_1.useState)(false);
    const allIds = (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList);
    const totalMembers = Object.keys(allIds).length;
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: false });
    const taxesLength = Object.keys(policy?.taxRates?.taxes ?? {}).length ?? 0;
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, { canBeMissing: true });
    const categoriesCount = Object.keys(policyCategories ?? {}).length;
    const [selectedItems, setSelectedItems] = (0, react_1.useState)([]);
    const reportFields = Object.keys((0, ReportUtils_1.getReportFieldsByPolicyID)(policyID)).length ?? 0;
    const customUnits = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const customUnitRates = customUnits?.rates ?? {};
    const allRates = Object.values(customUnitRates)?.length;
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const accountingIntegrations = Object.values(CONST_1.default.POLICY.CONNECTIONS.NAME);
    const connectedIntegration = (0, utils_1.getAllValidConnectedIntegration)(policy, accountingIntegrations);
    const customUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const ratesCount = Object.keys(customUnit?.rates ?? {}).length;
    const invoiceCompany = policy?.invoice?.companyName && policy?.invoice?.companyWebsite
        ? `${policy?.invoice?.companyName}, ${policy?.invoice?.companyWebsite}`
        : (policy?.invoice?.companyName ?? policy?.invoice?.companyWebsite ?? '');
    const totalTags = (0, react_1.useMemo)(() => {
        if (!policyTags) {
            return 0;
        }
        return Object.values(policyTags).reduce((sum, tagGroup) => sum + Number(Object.values(tagGroup.tags)?.length ?? 0), 0);
    }, [policyTags]);
    const [street1, street2] = (policy?.address?.addressStreet ?? '').split('\n');
    const formattedAddress = !(0, EmptyObject_1.isEmptyObject)(policy) && !(0, EmptyObject_1.isEmptyObject)(policy.address)
        ? `${street1?.trim()}, ${street2 ? `${street2.trim()}, ` : ''}${policy.address.city}, ${policy.address.state} ${policy.address.zipCode ?? ''}`
        : '';
    const items = (0, react_1.useMemo)(() => {
        const rules = (0, utils_1.getWorkspaceRules)(policy, translate);
        const workflows = (0, utils_1.getWorkflowRules)(policy, translate);
        const result = [
            {
                translation: translate('workspace.common.selectAll'),
                value: DEFAULT_SELECT_ALL,
            },
            {
                translation: translate('workspace.common.profile'),
                value: 'overview',
                alternateText: `${policy?.outputCurrency} ${translate('common.currency')}, ${formattedAddress}`,
            },
            totalMembers > 1
                ? {
                    translation: translate('workspace.common.members'),
                    value: 'members',
                    alternateText: totalMembers ? `${totalMembers} ${translate('workspace.common.members').toLowerCase()}` : undefined,
                }
                : undefined,
            reportFields > 0
                ? {
                    translation: translate('workspace.common.reports'),
                    value: 'reports',
                    alternateText: reportFields ? `${reportFields} ${translate('workspace.common.reportFields').toLowerCase()}` : undefined,
                }
                : undefined,
            connectedIntegration && connectedIntegration?.length > 0
                ? {
                    translation: translate('workspace.common.accounting'),
                    value: 'accounting',
                    alternateText: connectedIntegration.map((connectionName) => CONST_1.default.POLICY.CONNECTIONS.NAME_USER_FRIENDLY[connectionName]).join(', '),
                }
                : undefined,
            totalTags > 0
                ? {
                    translation: translate('workspace.common.tags'),
                    value: 'tags',
                    alternateText: totalTags ? `${totalTags} ${translate('workspace.common.tags').toLowerCase()}` : undefined,
                }
                : undefined,
            categoriesCount > 0
                ? {
                    translation: translate('workspace.common.categories'),
                    value: 'categories',
                    alternateText: categoriesCount ? `${categoriesCount} ${translate('workspace.duplicateWorkspace.categories').toLowerCase()}` : undefined,
                }
                : undefined,
            taxesLength > 0
                ? {
                    translation: translate('workspace.common.taxes'),
                    value: 'taxes',
                    alternateText: taxesLength ? `${taxesLength} ${translate('workspace.common.taxes').toLowerCase()}` : undefined,
                }
                : undefined,
            workflows && workflows?.length > 0
                ? {
                    translation: translate('workspace.common.workflows'),
                    value: 'workflows',
                    alternateText: workflows?.join(', '),
                }
                : undefined,
            rules && rules.length > 0 && !isCollect
                ? {
                    translation: translate('workspace.common.rules'),
                    value: 'rules',
                    alternateText: rules.length
                        ? `${rules.length} ${translate('workspace.common.workspace').toLowerCase()} ${translate('workspace.common.rules').toLowerCase()}: ${rules.join(', ')}`
                        : undefined,
                }
                : undefined,
            ratesCount > 0
                ? {
                    translation: translate('workspace.common.distanceRates'),
                    value: 'distanceRates',
                    alternateText: ratesCount ? `${ratesCount} ${translate('iou.rates').toLowerCase()}` : undefined,
                }
                : undefined,
            allRates > 0
                ? {
                    translation: translate('workspace.common.perDiem'),
                    value: 'perDiem',
                    alternateText: allRates ? `${allRates} ${translate('workspace.common.perDiem').toLowerCase()}` : undefined,
                }
                : undefined,
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            (bankAccountList && Object.keys(bankAccountList).length) || !!invoiceCompany
                ? {
                    translation: translate('workspace.common.invoices'),
                    value: 'invoices',
                    alternateText: bankAccountList ? `${Object.keys(bankAccountList).length} ${translate('common.bankAccounts').toLowerCase()}, ${invoiceCompany}` : invoiceCompany,
                }
                : undefined,
        ];
        return result.filter((item) => !!item);
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
    const listData = (0, react_1.useMemo)(() => {
        return items.map((option) => {
            const alternateText = option?.alternateText ? option.alternateText.trim().replace(/,$/, '') : undefined;
            return {
                text: option.translation,
                keyForList: option.value,
                isSelected: selectedItems.includes(option.value),
                alternateText,
            };
        });
    }, [items, selectedItems]);
    const fetchWorkspaceRelatedData = (0, react_1.useCallback)(() => {
        if (!policyID) {
            return;
        }
        (0, Policy_1.openDuplicatePolicyPage)(policyID);
    }, [policyID]);
    const confirmDuplicate = (0, react_1.useCallback)(() => {
        if (!policy || !duplicateWorkspace?.name || !duplicateWorkspace?.policyID) {
            return;
        }
        (0, Policy_1.duplicateWorkspace)(policy, {
            policyName: duplicateWorkspace.name,
            policyID: policy.id,
            targetPolicyID: duplicateWorkspace.policyID,
            welcomeNote: `${translate('workspace.duplicateWorkspace.welcomeNote')} ${duplicateWorkspace.name}`,
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
            file: duplicateWorkspace?.file,
        });
        Navigation_1.default.closeRHPFlow();
    }, [duplicateWorkspace?.file, duplicateWorkspace?.name, duplicateWorkspace?.policyID, policy, policyCategories, selectedItems, translate]);
    const confirmDuplicateAndHideModal = (0, react_1.useCallback)(() => {
        setIsDuplicateModalOpen(false);
        if (!policy || !duplicateWorkspace?.name || !duplicateWorkspace?.policyID) {
            return;
        }
        confirmDuplicate();
    }, [confirmDuplicate, duplicateWorkspace?.name, duplicateWorkspace?.policyID, policy]);
    const onConfirmSelectList = (0, react_1.useCallback)(() => {
        if (!totalMembers || totalMembers < 2 || !selectedItems.includes('members')) {
            confirmDuplicate();
            return;
        }
        setIsDuplicateModalOpen(true);
    }, [confirmDuplicate, selectedItems, totalMembers]);
    const updateSelectedItems = (0, react_1.useCallback)((listItem) => {
        if (listItem.isSelected) {
            if (listItem.keyForList === DEFAULT_SELECT_ALL) {
                setSelectedItems([]);
                return;
            }
            setSelectedItems(selectedItems.filter((i) => i !== listItem.keyForList && i !== DEFAULT_SELECT_ALL));
            return;
        }
        if (listItem.keyForList === DEFAULT_SELECT_ALL) {
            setSelectedItems(items.map((i) => i.value));
            return;
        }
        const newItem = items.find((i) => i.value === listItem.keyForList)?.value;
        if (newItem) {
            const newSelectedItems = [...selectedItems, newItem];
            const featuresOptions = items.filter((i) => i.value !== DEFAULT_SELECT_ALL);
            const allItemsSelected = featuresOptions.length === newSelectedItems.length;
            if (allItemsSelected) {
                setSelectedItems([...newSelectedItems, DEFAULT_SELECT_ALL]);
            }
            else {
                setSelectedItems(newSelectedItems);
            }
        }
    }, [items, selectedItems]);
    (0, react_1.useEffect)(() => {
        if (!items.length) {
            return;
        }
        setSelectedItems(items.map((i) => i.value));
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items.length]);
    (0, react_1.useEffect)(() => {
        fetchWorkspaceRelatedData();
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (<>
            <HeaderWithBackButton_1.default onBackButtonPress={policyID ? () => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_DUPLICATE.getRoute(policyID)) : undefined} title={translate('workspace.common.duplicateWorkspace')}/>
            <>
                <react_native_1.View style={[styles.ph5, styles.pv3]}>
                    <Text_1.default style={[styles.textHeadline]}>{translate('workspace.duplicateWorkspace.selectFeatures')}</Text_1.default>
                    <Text_1.default style={[styles.webViewStyles.baseFontStyle, styles.textSupporting]}>{translate('workspace.duplicateWorkspace.whichFeatures')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.flex1]}>
                    <SelectionList_1.default shouldSingleExecuteRowSelect sections={[{ data: listData }]} ListItem={MultiSelectListItem_1.default} onSelectRow={updateSelectedItems} isAlternateTextMultilineSupported addBottomSafeAreaPadding showConfirmButton confirmButtonText={translate('common.continue')} onConfirm={onConfirmSelectList}/>
                </react_native_1.View>
            </>
            <ConfirmModal_1.default title={translate('workspace.common.duplicateWorkspace')} isVisible={isDuplicateModalOpen} onConfirm={confirmDuplicateAndHideModal} onCancel={() => setIsDuplicateModalOpen(false)} prompt={<Text_1.default>
                        <Text_1.default style={[styles.webViewStyles.baseFontStyle, styles.textSupporting, styles.mb3]}>
                            {translate('workspace.duplicateWorkspace.confirmTitle', {
                newWorkspaceName: duplicateWorkspace?.name,
                totalMembers,
            })}
                        </Text_1.default>
                        <Text_1.default style={[styles.webViewStyles.baseFontStyle, styles.textSupporting]}>{translate('workspace.duplicateWorkspace.confirmDuplicate')}</Text_1.default>
                    </Text_1.default>} confirmText={translate('common.proceed')} cancelText={translate('common.cancel')} success/>
        </>);
}
WorkspaceDuplicateSelectFeaturesForm.displayName = 'WorkspaceDuplicateSelectFeaturesForm';
exports.default = WorkspaceDuplicateSelectFeaturesForm;
