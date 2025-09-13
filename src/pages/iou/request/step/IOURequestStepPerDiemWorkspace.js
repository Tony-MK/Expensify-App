"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepPerDiemWorkspace({ route: { params: { transactionID, action, iouType }, }, transaction, }) {
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const { login: currentUserLogin, accountID } = (0, useCurrentUserPersonalDetails_1.default)();
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const selectedWorkspace = (0, react_1.useMemo)(() => transaction?.participants?.[0], [transaction]);
    const workspaceOptions = (0, react_1.useMemo)(() => {
        const availableWorkspaces = (0, PolicyUtils_1.getActivePolicies)(allPolicies, currentUserLogin).filter((policy) => (0, PolicyUtils_1.canSubmitPerDiemExpenseFromWorkspace)(policy));
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
    const selectWorkspace = (item) => {
        const policyExpenseReportID = (0, ReportUtils_1.getPolicyExpenseChat)(accountID, item.value)?.reportID;
        if (!policyExpenseReportID) {
            return;
        }
        // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
        // eslint-disable-next-line deprecation/deprecation
        const selectedPolicy = (0, PolicyUtils_1.getPolicy)(item.value, allPolicies);
        const perDiemUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(selectedPolicy);
        (0, IOU_1.setMoneyRequestParticipants)(transactionID, [
            {
                selected: true,
                accountID: 0,
                isPolicyExpenseChat: true,
                reportID: policyExpenseReportID,
                policyID: item.value,
            },
        ]);
        (0, IOU_1.setCustomUnitID)(transactionID, perDiemUnit?.customUnitID ?? CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID);
        (0, IOU_1.setMoneyRequestCategory)(transactionID, perDiemUnit?.defaultCategory ?? '');
        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DESTINATION.getRoute(action, iouType, transactionID, policyExpenseReportID));
    };
    return (<SelectionList_1.default key={selectedWorkspace?.policyID} sections={[{ data: workspaceOptions, title: translate('common.workspaces') }]} onSelectRow={selectWorkspace} shouldSingleExecuteRowSelect ListItem={UserListItem_1.default} initiallyFocusedOptionKey={selectedWorkspace?.policyID}/>);
}
IOURequestStepPerDiemWorkspace.displayName = 'IOURequestStepPerDiemWorkspace';
exports.default = (0, withWritableReportOrNotFound_1.default)((0, withFullTransactionOrNotFound_1.default)(IOURequestStepPerDiemWorkspace));
