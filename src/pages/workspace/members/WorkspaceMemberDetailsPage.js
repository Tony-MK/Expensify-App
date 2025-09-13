"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const Button_1 = require("@components/Button");
const ButtonDisabledWhenOffline_1 = require("@components/Button/ButtonDisabledWhenOffline");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useExpensifyCardFeeds_1 = require("@hooks/useExpensifyCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Workflow_1 = require("@libs/actions/Workflow");
const CardUtils_1 = require("@libs/CardUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const navigateAfterInteraction_1 = require("@libs/Navigation/navigateAfterInteraction");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const shouldRenderTransferOwnerButton_1 = require("@libs/shouldRenderTransferOwnerButton");
const WorkflowUtils_1 = require("@libs/WorkflowUtils");
const Navigation_1 = require("@navigation/Navigation");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const WorkspaceMemberRoleSelectionModal_1 = require("@pages/workspace/WorkspaceMemberRoleSelectionModal");
const variables_1 = require("@styles/variables");
const Card_1 = require("@userActions/Card");
const Member_1 = require("@userActions/Policy/Member");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceMemberDetailsPage({ personalDetails, policy, route }) {
    const policyID = route.params.policyID;
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const styles = (0, useThemeStyles_1.default)();
    const { formatPhoneNumber, translate, localeCompare } = (0, useLocalize_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const [cardList] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}`, { canBeMissing: true });
    const [customCardNames] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_EXPENSIFY_COMPANY_CARDS_CUSTOM_NAMES, { canBeMissing: true });
    const [fundList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, { canBeMissing: true });
    const expensifyCardSettings = (0, useExpensifyCardFeeds_1.default)(policyID);
    const [isRemoveMemberConfirmModalVisible, setIsRemoveMemberConfirmModalVisible] = (0, react_1.useState)(false);
    const [isRoleSelectionModalVisible, setIsRoleSelectionModalVisible] = (0, react_1.useState)(false);
    const accountID = Number(route.params.accountID);
    const memberLogin = personalDetails?.[accountID]?.login ?? '';
    const member = policy?.employeeList?.[memberLogin];
    const prevMember = (0, usePrevious_1.default)(member);
    const details = personalDetails?.[accountID] ?? {};
    const fallbackIcon = details.fallbackIcon ?? '';
    const displayName = formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(details));
    const isSelectedMemberOwner = policy?.owner === details.login;
    const isSelectedMemberCurrentUser = accountID === currentUserPersonalDetails?.accountID;
    const isCurrentUserAdmin = policy?.employeeList?.[personalDetails?.[currentUserPersonalDetails?.accountID]?.login ?? '']?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    const isCurrentUserOwner = policy?.owner === currentUserPersonalDetails?.login;
    const ownerDetails = (0, react_1.useMemo)(() => personalDetails?.[policy?.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID] ?? {}, [personalDetails, policy?.ownerAccountID]);
    const policyOwnerDisplayName = formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(ownerDetails)) ?? policy?.owner ?? '';
    const hasMultipleFeeds = Object.keys((0, CardUtils_1.getCompanyFeeds)(cardFeeds, false, true)).length > 0;
    const workspaceCards = (0, CardUtils_1.getAllCardsForWorkspace)(workspaceAccountID, cardList, cardFeeds, expensifyCardSettings);
    const isSMSLogin = expensify_common_1.Str.isSMSLogin(memberLogin);
    const phoneNumber = (0, PersonalDetailsUtils_1.getPhoneNumber)(details);
    const { isAccountLocked, showLockedAccountModal } = (0, react_1.useContext)(LockedAccountModalProvider_1.LockedAccountContext);
    const { approvalWorkflows } = (0, react_1.useMemo)(() => (0, WorkflowUtils_1.convertPolicyEmployeesToApprovalWorkflows)({
        policy,
        personalDetails: personalDetails ?? {},
        localeCompare,
    }), [personalDetails, policy, localeCompare]);
    (0, react_1.useEffect)(() => {
        (0, Member_1.openPolicyMemberProfilePage)(policyID, accountID);
    }, [policyID, accountID]);
    const memberCards = (0, react_1.useMemo)(() => {
        if (!workspaceCards) {
            return [];
        }
        return Object.values(workspaceCards ?? {}).filter((card) => card.accountID === accountID);
    }, [accountID, workspaceCards]);
    const confirmModalPrompt = (0, react_1.useMemo)(() => {
        const isApprover = (0, Member_1.isApprover)(policy, accountID);
        if (!isApprover) {
            return translate('workspace.people.removeMemberPrompt', { memberName: displayName });
        }
        return translate('workspace.people.removeMembersWarningPrompt', {
            memberName: displayName,
            ownerName: policyOwnerDisplayName,
        });
    }, [accountID, policy, displayName, policyOwnerDisplayName, translate]);
    const roleItems = (0, react_1.useMemo)(() => [
        {
            value: CONST_1.default.POLICY.ROLE.ADMIN,
            text: translate('common.admin'),
            alternateText: translate('workspace.common.adminAlternateText'),
            isSelected: member?.role === CONST_1.default.POLICY.ROLE.ADMIN,
            keyForList: CONST_1.default.POLICY.ROLE.ADMIN,
        },
        {
            value: CONST_1.default.POLICY.ROLE.AUDITOR,
            text: translate('common.auditor'),
            alternateText: translate('workspace.common.auditorAlternateText'),
            isSelected: member?.role === CONST_1.default.POLICY.ROLE.AUDITOR,
            keyForList: CONST_1.default.POLICY.ROLE.AUDITOR,
        },
        {
            value: CONST_1.default.POLICY.ROLE.USER,
            text: translate('common.member'),
            alternateText: translate('workspace.common.memberAlternateText'),
            isSelected: member?.role === CONST_1.default.POLICY.ROLE.USER,
            keyForList: CONST_1.default.POLICY.ROLE.USER,
        },
    ], [member?.role, translate]);
    (0, react_1.useEffect)(() => {
        if (!prevMember || prevMember?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || member?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
            return;
        }
        (0, navigateAfterInteraction_1.default)(() => Navigation_1.default.goBack());
    }, [member, prevMember]);
    const askForConfirmationToRemove = () => {
        setIsRemoveMemberConfirmModalVisible(true);
    };
    // Function to remove a member and close the modal
    const removeMemberAndCloseModal = (0, react_1.useCallback)(() => {
        (0, Member_1.removeMembers)([accountID], policyID);
        const previousEmployeesCount = Object.keys(policy?.employeeList ?? {}).length;
        const remainingEmployeeCount = previousEmployeesCount - 1;
        if (remainingEmployeeCount === 1 && policy?.preventSelfApproval) {
            // We can't let the "Prevent Self Approvals" enabled if there's only one workspace user
            (0, Policy_1.setPolicyPreventSelfApproval)(route.params.policyID, false);
        }
        setIsRemoveMemberConfirmModalVisible(false);
    }, [accountID, policy?.employeeList, policy?.preventSelfApproval, policyID, route.params.policyID]);
    const removeUser = (0, react_1.useCallback)(() => {
        const ownerEmail = ownerDetails?.login;
        const removedApprover = personalDetails?.[accountID];
        // If the user is not an approver, proceed with member removal
        if (!(0, Member_1.isApprover)(policy, accountID) || !removedApprover?.login || !ownerEmail) {
            removeMemberAndCloseModal();
            return;
        }
        // Update approval workflows after approver removal
        const updatedWorkflows = (0, WorkflowUtils_1.updateWorkflowDataOnApproverRemoval)({
            approvalWorkflows,
            removedApprover,
            ownerDetails,
        });
        updatedWorkflows.forEach((workflow) => {
            if (workflow?.removeApprovalWorkflow) {
                const { removeApprovalWorkflow, ...updatedWorkflow } = workflow;
                (0, Workflow_1.removeApprovalWorkflow)(policyID, updatedWorkflow);
            }
            else {
                (0, Workflow_1.updateApprovalWorkflow)(policyID, workflow, [], []);
            }
        });
        // Remove the member and close the modal
        removeMemberAndCloseModal();
    }, [accountID, approvalWorkflows, ownerDetails, personalDetails, policy, policyID, removeMemberAndCloseModal]);
    const navigateToProfile = (0, react_1.useCallback)(() => {
        Navigation_1.default.navigate(ROUTES_1.default.PROFILE.getRoute(accountID, Navigation_1.default.getActiveRoute()));
    }, [accountID]);
    const navigateToDetails = (0, react_1.useCallback)((card) => {
        if (card.bank === CONST_1.default.EXPENSIFY_CARD.BANK) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_DETAILS.getRoute(policyID, card.cardID.toString(), Navigation_1.default.getActiveRoute()));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARD_DETAILS.getRoute(policyID, card.cardID.toString(), card.bank, Navigation_1.default.getActiveRoute()));
    }, [policyID]);
    const handleIssueNewCard = (0, react_1.useCallback)(() => {
        if (isAccountLocked) {
            showLockedAccountModal();
            return;
        }
        if (hasMultipleFeeds) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MEMBER_NEW_CARD.getRoute(policyID, accountID));
            return;
        }
        const activeRoute = Navigation_1.default.getActiveRoute();
        (0, Card_1.setIssueNewCardStepAndData)({
            step: CONST_1.default.EXPENSIFY_CARD.STEP.CARD_TYPE,
            data: {
                assigneeEmail: memberLogin,
            },
            isEditing: false,
            isChangeAssigneeDisabled: true,
            policyID,
        });
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_ISSUE_NEW.getRoute(policyID, activeRoute));
    }, [accountID, hasMultipleFeeds, memberLogin, policyID, isAccountLocked, showLockedAccountModal]);
    const openRoleSelectionModal = (0, react_1.useCallback)(() => {
        setIsRoleSelectionModalVisible(true);
    }, []);
    const changeRole = (0, react_1.useCallback)(({ value }) => {
        setIsRoleSelectionModalVisible(false);
        (0, Member_1.updateWorkspaceMembersRole)(policyID, [accountID], value);
    }, [accountID, policyID]);
    const startChangeOwnershipFlow = (0, react_1.useCallback)(() => {
        (0, Member_1.clearWorkspaceOwnerChangeFlow)(policyID);
        (0, Member_1.requestWorkspaceOwnerChange)(policyID);
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OWNER_CHANGE_CHECK.getRoute(policyID, accountID, 'amountOwed'));
    }, [accountID, policyID]);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = !member || (member.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE && prevMember?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
    if (shouldShowNotFoundPage) {
        return <NotFoundPage_1.default />;
    }
    const shouldShowCardsSection = Object.values(expensifyCardSettings ?? {}).some((cardSettings) => (0, CardUtils_1.isExpensifyCardFullySetUp)(policy, cardSettings)) || hasMultipleFeeds;
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding testID={WorkspaceMemberDetailsPage.displayName}>
                <HeaderWithBackButton_1.default title={displayName} subtitle={policy?.name}/>
                <ScrollView_1.default addBottomSafeAreaPadding>
                    <react_native_1.View style={[styles.containerWithSpaceBetween, styles.pointerEventsBoxNone, styles.justifyContentStart]}>
                        <react_native_1.View style={[styles.avatarSectionWrapper, styles.pb0]}>
                            <OfflineWithFeedback_1.default pendingAction={details.pendingFields?.avatar}>
                                <Avatar_1.default containerStyles={[styles.avatarXLarge, styles.mb4, styles.noOutline]} imageStyles={[styles.avatarXLarge]} source={details.avatar} avatarID={accountID} type={CONST_1.default.ICON_TYPE_AVATAR} size={CONST_1.default.AVATAR_SIZE.X_LARGE} fallbackIcon={fallbackIcon}/>
                            </OfflineWithFeedback_1.default>
                            {!!(details.displayName ?? '') && (<Text_1.default style={[styles.textHeadline, styles.pre, styles.mb8, styles.w100, styles.textAlignCenter]} numberOfLines={1}>
                                    {displayName}
                                </Text_1.default>)}
                            {isSelectedMemberOwner && isCurrentUserAdmin && !isCurrentUserOwner ? ((0, shouldRenderTransferOwnerButton_1.default)(fundList) && (<ButtonDisabledWhenOffline_1.default text={translate('workspace.people.transferOwner')} onPress={startChangeOwnershipFlow} icon={Expensicons.Transfer} style={styles.mb5}/>)) : (<Button_1.default text={translate('workspace.people.removeWorkspaceMemberButtonTitle')} onPress={isAccountLocked ? showLockedAccountModal : askForConfirmationToRemove} isDisabled={isSelectedMemberOwner || isSelectedMemberCurrentUser} icon={Expensicons.RemoveMembers} style={styles.mb5}/>)}
                            <ConfirmModal_1.default danger title={translate('workspace.people.removeMemberTitle')} isVisible={isRemoveMemberConfirmModalVisible} onConfirm={removeUser} onCancel={() => setIsRemoveMemberConfirmModalVisible(false)} prompt={confirmModalPrompt} confirmText={translate('common.remove')} cancelText={translate('common.cancel')}/>
                        </react_native_1.View>
                        <react_native_1.View style={styles.w100}>
                            <MenuItemWithTopDescription_1.default title={isSMSLogin ? formatPhoneNumber(phoneNumber ?? '') : memberLogin} copyValue={isSMSLogin ? formatPhoneNumber(phoneNumber ?? '') : memberLogin} description={translate(isSMSLogin ? 'common.phoneNumber' : 'common.email')} interactive={false} copyable/>
                            <MenuItemWithTopDescription_1.default disabled={isSelectedMemberOwner || isSelectedMemberCurrentUser} title={translate(`workspace.common.roleName`, { role: member?.role })} description={translate('common.role')} shouldShowRightIcon onPress={openRoleSelectionModal}/>
                            {(0, PolicyUtils_1.isControlPolicy)(policy) && (<>
                                    <OfflineWithFeedback_1.default pendingAction={member?.pendingFields?.employeeUserID}>
                                        <MenuItemWithTopDescription_1.default description={translate('workspace.common.customField1')} title={member?.employeeUserID} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CUSTOM_FIELDS.getRoute(policyID, accountID, 'customField1'))}/>
                                    </OfflineWithFeedback_1.default>
                                    <OfflineWithFeedback_1.default pendingAction={member?.pendingFields?.employeePayrollID}>
                                        <MenuItemWithTopDescription_1.default description={translate('workspace.common.customField2')} title={member?.employeePayrollID} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CUSTOM_FIELDS.getRoute(policyID, accountID, 'customField2'))}/>
                                    </OfflineWithFeedback_1.default>
                                </>)}
                            <MenuItem_1.default style={styles.mb5} title={translate('common.profile')} icon={Expensicons.Info} onPress={navigateToProfile} shouldShowRightIcon/>
                            <WorkspaceMemberRoleSelectionModal_1.default isVisible={isRoleSelectionModalVisible} items={roleItems} onRoleChange={changeRole} onClose={() => setIsRoleSelectionModalVisible(false)}/>
                            {shouldShowCardsSection && (<>
                                    <react_native_1.View style={[styles.ph5, styles.pv3]}>
                                        <Text_1.default style={StyleUtils.combineStyles([styles.sidebarLinkText, styles.optionAlternateText, styles.textLabelSupporting])}>
                                            {translate('walletPage.assignedCards')}
                                        </Text_1.default>
                                    </react_native_1.View>
                                    {memberCards.map((memberCard) => {
                const isCardDeleted = memberCard.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
                const plaidUrl = (0, CardUtils_1.getPlaidInstitutionIconUrl)(memberCard?.bank);
                return (<OfflineWithFeedback_1.default key={`${memberCard.nameValuePairs?.cardTitle}_${memberCard.cardID}`} errorRowStyles={styles.ph5} errors={memberCard.errors} pendingAction={memberCard.pendingAction}>
                                                <MenuItem_1.default key={memberCard.cardID} title={memberCard.nameValuePairs?.cardTitle ??
                        customCardNames?.[memberCard.cardID] ??
                        (0, CardUtils_1.maskCardNumber)(memberCard?.cardName ?? '', memberCard.bank)} description={memberCard?.lastFourPAN ?? (0, CardUtils_1.lastFourNumbersFromCardName)(memberCard?.cardName)} badgeText={memberCard.bank === CONST_1.default.EXPENSIFY_CARD.BANK ? (0, CurrencyUtils_1.convertToDisplayString)(memberCard.nameValuePairs?.unapprovedExpenseLimit) : ''} icon={(0, CardUtils_1.getCardFeedIcon)(memberCard.bank, illustrations)} plaidUrl={plaidUrl} displayInDefaultIconColor iconStyles={styles.cardIcon} iconType={plaidUrl ? CONST_1.default.ICON_TYPE_PLAID : CONST_1.default.ICON_TYPE_ICON} iconWidth={variables_1.default.cardIconWidth} iconHeight={variables_1.default.cardIconHeight} onPress={() => navigateToDetails(memberCard)} shouldRemoveHoverBackground={isCardDeleted} disabled={isCardDeleted} shouldShowRightIcon={!isCardDeleted} style={[isCardDeleted ? styles.offlineFeedback.deleted : {}]}/>
                                            </OfflineWithFeedback_1.default>);
            })}
                                    <MenuItem_1.default title={translate('workspace.expensifyCard.newCard')} icon={Expensicons.Plus} onPress={handleIssueNewCard}/>
                                </>)}
                        </react_native_1.View>
                    </react_native_1.View>
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceMemberDetailsPage.displayName = 'WorkspaceMemberDetailsPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceMemberDetailsPage);
