"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepSendFrom({ route, transaction }) {
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const { transactionID, backTo } = route.params;
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email, canBeMissing: false });
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const selectedWorkspace = (0, react_1.useMemo)(() => transaction?.participants?.find((participant) => participant.isSender), [transaction]);
    const workspaceOptions = (0, react_1.useMemo)(() => {
        const availableWorkspaces = (0, PolicyUtils_1.getActiveAdminWorkspaces)(allPolicies, currentUserLogin).filter((policy) => (0, PolicyUtils_1.canSendInvoiceFromWorkspace)(policy.id));
        return availableWorkspaces
            .sort((policy1, policy2) => (0, PolicyUtils_1.sortWorkspacesBySelected)({ policyID: policy1.id, name: policy1.name }, { policyID: policy2.id, name: policy2.name }, selectedWorkspace?.policyID ? [selectedWorkspace?.policyID] : [], localeCompare))
            .map((policy) => ({
            text: policy.name,
            value: policy.id,
            keyForList: policy.id,
            icons: [
                {
                    id: policy.id,
                    source: policy?.avatarURL ? policy.avatarURL : (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy.name),
                    fallbackIcon: Expensicons.FallbackWorkspaceAvatar,
                    name: policy.name,
                    type: CONST_1.default.ICON_TYPE_WORKSPACE,
                },
            ],
            isSelected: selectedWorkspace?.policyID === policy.id,
        }));
    }, [allPolicies, currentUserLogin, selectedWorkspace, localeCompare]);
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const selectWorkspace = (item) => {
        const newParticipants = (transaction?.participants ?? []).filter((participant) => participant.accountID);
        newParticipants.push({
            policyID: item.value,
            isSender: true,
            selected: false,
        });
        (0, IOU_1.setMoneyRequestParticipants)(transactionID, newParticipants);
        navigateBack();
    };
    return (<StepScreenWrapper_1.default headerTitle={translate('workspace.invoices.sendFrom')} onBackButtonPress={navigateBack} shouldShowWrapper testID={IOURequestStepSendFrom.displayName} includeSafeAreaPaddingBottom>
            <SelectionList_1.default sections={[{ data: workspaceOptions, title: translate('common.workspaces') }]} onSelectRow={selectWorkspace} shouldSingleExecuteRowSelect ListItem={UserListItem_1.default} initiallyFocusedOptionKey={selectedWorkspace?.policyID}/>
        </StepScreenWrapper_1.default>);
}
IOURequestStepSendFrom.displayName = 'IOURequestStepSendFrom';
exports.default = (0, withWritableReportOrNotFound_1.default)((0, withFullTransactionOrNotFound_1.default)(IOURequestStepSendFrom));
