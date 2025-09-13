"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function useWorkspaceList({ policies, currentUserLogin, selectedPolicyIDs, searchTerm, shouldShowPendingDeletePolicy, localeCompare, additionalFilter }) {
    const usersWorkspaces = (0, react_1.useMemo)(() => {
        if (!policies || (0, EmptyObject_1.isEmptyObject)(policies)) {
            return [];
        }
        return Object.values(policies)
            .filter((policy) => !!policy &&
            (0, PolicyUtils_1.shouldShowPolicy)(policy, shouldShowPendingDeletePolicy, currentUserLogin) &&
            !policy?.isJoinRequestPending &&
            (additionalFilter ? additionalFilter(policy) : true))
            .map((policy) => ({
            text: policy?.name ?? '',
            policyID: policy?.id,
            icons: [
                {
                    source: policy?.avatarURL ? policy.avatarURL : (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy?.name),
                    fallbackIcon: Expensicons.FallbackWorkspaceAvatar,
                    name: policy?.name,
                    type: CONST_1.default.ICON_TYPE_WORKSPACE,
                    id: policy?.id,
                },
            ],
            keyForList: policy?.id,
            isPolicyAdmin: (0, PolicyUtils_1.isPolicyAdmin)(policy),
            isSelected: policy?.id && selectedPolicyIDs ? selectedPolicyIDs.includes(policy.id) : false,
        }));
    }, [policies, shouldShowPendingDeletePolicy, currentUserLogin, additionalFilter, selectedPolicyIDs]);
    const filteredAndSortedUserWorkspaces = (0, react_1.useMemo)(() => (0, tokenizedSearch_1.default)(usersWorkspaces, searchTerm, (policy) => [policy.text]).sort((policy1, policy2) => (0, PolicyUtils_1.sortWorkspacesBySelected)({ policyID: policy1.policyID, name: policy1.text }, { policyID: policy2.policyID, name: policy2.text }, selectedPolicyIDs, localeCompare)), [searchTerm, usersWorkspaces, selectedPolicyIDs, localeCompare]);
    const sections = (0, react_1.useMemo)(() => {
        const options = [
            {
                data: filteredAndSortedUserWorkspaces,
                shouldShow: true,
                indexOffset: 1,
            },
        ];
        return options;
    }, [filteredAndSortedUserWorkspaces]);
    const shouldShowNoResultsFoundMessage = filteredAndSortedUserWorkspaces.length === 0 && usersWorkspaces.length;
    const shouldShowSearchInput = usersWorkspaces.length >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
    return {
        sections,
        shouldShowNoResultsFoundMessage,
        shouldShowSearchInput,
    };
}
exports.default = useWorkspaceList;
