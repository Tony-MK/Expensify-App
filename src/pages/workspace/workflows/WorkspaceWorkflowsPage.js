"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ApprovalWorkflowSection_1 = require("@components/ApprovalWorkflowSection");
const ConfirmModal_1 = require("@components/ConfirmModal");
const BankIcons_1 = require("@components/Icon/BankIcons");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Illustrations_1 = require("@components/Icon/Illustrations");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const RenderHTML_1 = require("@components/RenderHTML");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Workflow_1 = require("@libs/actions/Workflow");
const CardUtils_1 = require("@libs/CardUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PaymentUtils_1 = require("@libs/PaymentUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const WorkflowUtils_1 = require("@libs/WorkflowUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const WorkspacePageWithSections_1 = require("@pages/workspace/WorkspacePageWithSections");
const ReimbursementAccount_1 = require("@userActions/ReimbursementAccount");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const ToggleSettingsOptionRow_1 = require("./ToggleSettingsOptionRow");
const WorkspaceAutoReportingFrequencyPage_1 = require("./WorkspaceAutoReportingFrequencyPage");
function WorkspaceWorkflowsPage({ policy, route }) {
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to apply a correct padding style
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [cardFeeds] = (0, useCardFeeds_1.default)(policy?.id);
    const [cardList] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}`, { canBeMissing: false });
    const workspaceCards = (0, CardUtils_1.getAllCardsForWorkspace)(workspaceAccountID, cardList, cardFeeds);
    const isSmartLimitEnabled = (0, CardUtils_1.isSmartLimitEnabled)(workspaceCards);
    const [isUpdateWorkspaceCurrencyModalOpen, setIsUpdateWorkspaceCurrencyModalOpen] = (0, react_1.useState)(false);
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const { approvalWorkflows, availableMembers, usedApproverEmails } = (0, react_1.useMemo)(() => (0, WorkflowUtils_1.convertPolicyEmployeesToApprovalWorkflows)({
        policy,
        personalDetails: personalDetails ?? {},
        localeCompare,
    }), [personalDetails, policy, localeCompare]);
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const isAdvanceApproval = approvalWorkflows.length > 1 || (approvalWorkflows?.at(0)?.approvers ?? []).length > 1;
    const updateApprovalMode = isAdvanceApproval ? CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED : CONST_1.default.POLICY.APPROVAL_MODE.BASIC;
    const displayNameForAuthorizedPayer = (0, react_1.useMemo)(() => (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(policy?.achAccount?.reimburser ?? '')?.displayName ?? policy?.achAccount?.reimburser, [policy?.achAccount?.reimburser]);
    const onPressAutoReportingFrequency = (0, react_1.useCallback)(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_WORKFLOWS_AUTOREPORTING_FREQUENCY.getRoute(route.params.policyID)), [route.params.policyID]);
    const fetchData = (0, react_1.useCallback)(() => {
        (0, Policy_1.openPolicyWorkflowsPage)(route.params.policyID);
    }, [route.params.policyID]);
    const confirmCurrencyChangeAndHideModal = (0, react_1.useCallback)(() => {
        if (!policy) {
            return;
        }
        setIsUpdateWorkspaceCurrencyModalOpen(false);
        if (isBetaEnabled(CONST_1.default.BETAS.GLOBAL_REIMBURSEMENTS_ON_ND)) {
            (0, Policy_1.setIsForcedToChangeCurrency)(true);
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OVERVIEW_CURRENCY.getRoute(policy.id));
        }
        else {
            (0, Policy_1.updateGeneralSettings)(policy.id, policy.name, CONST_1.default.CURRENCY.USD);
            (0, ReimbursementAccount_1.navigateToBankAccountRoute)(route.params.policyID, ROUTES_1.default.WORKSPACE_WORKFLOWS.getRoute(route.params.policyID));
        }
    }, [isBetaEnabled, policy, route.params.policyID]);
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: fetchData });
    const isPolicyAdmin = (0, PolicyUtils_1.isPolicyAdmin)(policy);
    const { isAccountLocked, showLockedAccountModal } = (0, react_1.useContext)(LockedAccountModalProvider_1.LockedAccountContext);
    (0, react_1.useEffect)(() => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            fetchData();
        });
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // User should be allowed to add new Approval Workflow only if he's upgraded to Control Plan, otherwise redirected to the Upgrade Page
    const addApprovalAction = (0, react_1.useCallback)(() => {
        (0, Workflow_1.setApprovalWorkflow)({
            ...WorkflowUtils_1.INITIAL_APPROVAL_WORKFLOW,
            availableMembers,
            usedApproverEmails,
        });
        if (!(0, PolicyUtils_1.isControlPolicy)(policy)) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(route.params.policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.approvals.alias, ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_EXPENSES_FROM.getRoute(route.params.policyID)));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_EXPENSES_FROM.getRoute(route.params.policyID));
    }, [policy, route.params.policyID, availableMembers, usedApproverEmails]);
    const filteredApprovalWorkflows = (0, react_1.useMemo)(() => {
        if (policy?.approvalMode === CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED) {
            return approvalWorkflows;
        }
        return approvalWorkflows.filter((workflow) => workflow.isDefault);
    }, [policy?.approvalMode, approvalWorkflows]);
    const optionItems = (0, react_1.useMemo)(() => {
        const { addressName, bankName, bankAccountID } = policy?.achAccount ?? {};
        const shouldShowBankAccount = !!bankAccountID && policy?.reimbursementChoice === CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES;
        const bankIcon = (0, BankIcons_1.default)({ bankName: bankName, isCard: false, styles });
        const hasReimburserError = !!policy?.errorFields?.reimburser;
        const hasApprovalError = !!policy?.errorFields?.approvalMode;
        const hasDelayedSubmissionError = !!(policy?.errorFields?.autoReporting ?? policy?.errorFields?.autoReportingFrequency);
        return [
            {
                title: translate('workflowsPage.delaySubmissionTitle'),
                subtitle: translate('workflowsPage.delaySubmissionDescription'),
                switchAccessibilityLabel: translate('workflowsPage.delaySubmissionDescription'),
                onToggle: (isEnabled) => {
                    (0, Policy_1.setWorkspaceAutoReportingFrequency)(route.params.policyID, isEnabled ? CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.WEEKLY : CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT);
                },
                subMenuItems: (<MenuItemWithTopDescription_1.default title={(0, WorkspaceAutoReportingFrequencyPage_1.getAutoReportingFrequencyDisplayNames)(translate)[(0, PolicyUtils_1.getCorrectedAutoReportingFrequency)(policy) ?? CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.WEEKLY]} titleStyle={styles.textNormalThemeText} descriptionTextStyle={styles.textLabelSupportingNormal} onPress={onPressAutoReportingFrequency} 
                // Instant submit is the equivalent of delayed submissions being turned off, so we show the feature as disabled if the frequency is instant
                description={translate('workflowsPage.submissionFrequency')} shouldShowRightIcon wrapperStyle={[styles.sectionMenuItemTopDescription, styles.mt3, styles.mbn3]} brickRoadIndicator={hasDelayedSubmissionError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>),
                isActive: (policy?.autoReportingFrequency !== CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT && !hasDelayedSubmissionError) ?? false,
                pendingAction: policy?.pendingFields?.autoReporting ?? policy?.pendingFields?.autoReportingFrequency,
                errors: (0, ErrorUtils_1.getLatestErrorField)(policy ?? {}, CONST_1.default.POLICY.COLLECTION_KEYS.AUTOREPORTING),
                onCloseError: () => (0, Policy_1.clearPolicyErrorField)(route.params.policyID, CONST_1.default.POLICY.COLLECTION_KEYS.AUTOREPORTING),
            },
            {
                title: translate('workflowsPage.addApprovalsTitle'),
                subtitle: isSmartLimitEnabled ? translate('workspace.moreFeatures.workflows.disableApprovalPrompt') : translate('workflowsPage.addApprovalsDescription'),
                switchAccessibilityLabel: isSmartLimitEnabled ? translate('workspace.moreFeatures.workflows.disableApprovalPrompt') : translate('workflowsPage.addApprovalsDescription'),
                onToggle: (isEnabled) => {
                    (0, Policy_1.setWorkspaceApprovalMode)(route.params.policyID, policy?.owner ?? '', isEnabled ? updateApprovalMode : CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL);
                },
                subMenuItems: (<>
                        {filteredApprovalWorkflows.map((workflow, index) => (<OfflineWithFeedback_1.default 
                    // eslint-disable-next-line react/no-array-index-key
                    key={`workflow-${index}`} pendingAction={workflow.pendingAction}>
                                <ApprovalWorkflowSection_1.default approvalWorkflow={workflow} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_EDIT.getRoute(route.params.policyID, workflow.approvers.at(0)?.email ?? ''))}/>
                            </OfflineWithFeedback_1.default>))}
                        <MenuItem_1.default title={translate('workflowsPage.addApprovalButton')} titleStyle={styles.textStrong} icon={Expensicons_1.Plus} iconHeight={20} iconWidth={20} style={[styles.sectionMenuItemTopDescription, styles.mt6, styles.mbn3]} onPress={addApprovalAction}/>
                    </>),
                disabled: isSmartLimitEnabled,
                isActive: ([CONST_1.default.POLICY.APPROVAL_MODE.BASIC, CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED].some((approvalMode) => approvalMode === policy?.approvalMode) && !hasApprovalError) ?? false,
                pendingAction: policy?.pendingFields?.approvalMode,
                errors: (0, ErrorUtils_1.getLatestErrorField)(policy ?? {}, CONST_1.default.POLICY.COLLECTION_KEYS.APPROVAL_MODE),
                onCloseError: () => (0, Policy_1.clearPolicyErrorField)(route.params.policyID, CONST_1.default.POLICY.COLLECTION_KEYS.APPROVAL_MODE),
            },
            {
                title: translate('workflowsPage.makeOrTrackPaymentsTitle'),
                subtitle: translate('workflowsPage.makeOrTrackPaymentsDescription'),
                switchAccessibilityLabel: translate('workflowsPage.makeOrTrackPaymentsDescription'),
                onToggle: (isEnabled) => {
                    let newReimbursementChoice;
                    if (!isEnabled) {
                        newReimbursementChoice = CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO;
                    }
                    else if (!!policy?.achAccount && !(0, Policy_1.isCurrencySupportedForDirectReimbursement)((policy?.outputCurrency ?? ''))) {
                        newReimbursementChoice = CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_MANUAL;
                    }
                    else {
                        newReimbursementChoice = CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES;
                    }
                    const newReimburserEmail = policy?.achAccount?.reimburser ?? policy?.owner;
                    (0, Policy_1.setWorkspaceReimbursement)(route.params.policyID, newReimbursementChoice, newReimburserEmail ?? '');
                },
                subMenuItems: !isOffline && policy?.isLoadingWorkspaceReimbursement === true ? (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} color={theme.spinner} style={styles.mt7}/>) : (<>
                            {shouldShowBankAccount && (<react_native_1.View style={[styles.sectionMenuItemTopDescription, styles.mt5, styles.pb1, styles.pt1]}>
                                    <Text_1.default style={[styles.textLabelSupportingNormal, styles.colorMuted]}>{translate('workflowsPayerPage.paymentAccount')}</Text_1.default>
                                </react_native_1.View>)}
                            <MenuItem_1.default title={shouldShowBankAccount ? addressName : translate('bankAccount.addBankAccount')} titleStyle={shouldShowBankAccount ? undefined : styles.textStrong} description={(0, PaymentUtils_1.getPaymentMethodDescription)(CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT, policy?.achAccount ?? {})} onPress={() => {
                        if (isAccountLocked) {
                            showLockedAccountModal();
                            return;
                        }
                        if (!(0, Policy_1.isCurrencySupportedForGlobalReimbursement)((policy?.outputCurrency ?? ''), isBetaEnabled(CONST_1.default.BETAS.GLOBAL_REIMBURSEMENTS_ON_ND))) {
                            setIsUpdateWorkspaceCurrencyModalOpen(true);
                            return;
                        }
                        (0, ReimbursementAccount_1.navigateToBankAccountRoute)(route.params.policyID, ROUTES_1.default.WORKSPACE_WORKFLOWS.getRoute(route.params.policyID));
                    }} icon={shouldShowBankAccount ? bankIcon.icon : Expensicons_1.Plus} iconHeight={shouldShowBankAccount ? (bankIcon.iconHeight ?? bankIcon.iconSize) : 20} iconWidth={shouldShowBankAccount ? (bankIcon.iconWidth ?? bankIcon.iconSize) : 20} iconStyles={shouldShowBankAccount ? bankIcon.iconStyles : undefined} disabled={isOffline || !isPolicyAdmin} shouldGreyOutWhenDisabled={!policy?.pendingFields?.reimbursementChoice} wrapperStyle={[styles.sectionMenuItemTopDescription, styles.mt3, styles.mbn3]} displayInDefaultIconColor={shouldShowBankAccount} brickRoadIndicator={hasReimburserError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                            {shouldShowBankAccount && (<OfflineWithFeedback_1.default pendingAction={policy?.pendingFields?.reimburser} shouldDisableOpacity={isOffline && !!policy?.pendingFields?.reimbursementChoice && !!policy?.pendingFields?.reimburser} errors={(0, ErrorUtils_1.getLatestErrorField)(policy ?? {}, CONST_1.default.POLICY.COLLECTION_KEYS.REIMBURSER)} onClose={() => (0, Policy_1.clearPolicyErrorField)(policy?.id, CONST_1.default.POLICY.COLLECTION_KEYS.REIMBURSER)} errorRowStyles={[styles.ml7]}>
                                    <MenuItemWithTopDescription_1.default title={displayNameForAuthorizedPayer ?? ''} titleStyle={styles.textNormalThemeText} descriptionTextStyle={styles.textLabelSupportingNormal} description={translate('workflowsPayerPage.payer')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_WORKFLOWS_PAYER.getRoute(route.params.policyID))} shouldShowRightIcon wrapperStyle={[styles.sectionMenuItemTopDescription, styles.mt3, styles.mbn3]} brickRoadIndicator={hasReimburserError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                                </OfflineWithFeedback_1.default>)}
                        </>),
                isEndOptionRow: true,
                isActive: policy?.reimbursementChoice !== CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO,
                pendingAction: policy?.pendingFields?.reimbursementChoice,
                errors: (0, ErrorUtils_1.getLatestErrorField)(policy ?? {}, CONST_1.default.POLICY.COLLECTION_KEYS.REIMBURSEMENT_CHOICE),
                onCloseError: () => (0, Policy_1.clearPolicyErrorField)(route.params.policyID, CONST_1.default.POLICY.COLLECTION_KEYS.REIMBURSEMENT_CHOICE),
            },
        ];
    }, [
        policy,
        styles,
        translate,
        onPressAutoReportingFrequency,
        isSmartLimitEnabled,
        addApprovalAction,
        isOffline,
        theme.spinner,
        isPolicyAdmin,
        displayNameForAuthorizedPayer,
        route.params.policyID,
        updateApprovalMode,
        isBetaEnabled,
        isAccountLocked,
        showLockedAccountModal,
        filteredApprovalWorkflows,
    ]);
    const renderOptionItem = (item, index) => (<Section_1.default containerStyles={isSmallScreenWidth ? styles.p5 : styles.p8} key={`toggleSettingOptionItem-${index}`} renderTitle={() => <react_native_1.View />}>
            <ToggleSettingsOptionRow_1.default title={item.title} titleStyle={[styles.textHeadline, styles.cardSectionTitle, styles.accountSettingsSectionTitle, styles.mb1]} subtitle={item.subtitle} subtitleStyle={[styles.textLabelSupportingEmptyValue, styles.lh20]} switchAccessibilityLabel={item.switchAccessibilityLabel} onToggle={item.onToggle} subMenuItems={item.subMenuItems} isActive={item.isActive} pendingAction={item.pendingAction} errors={item.errors} onCloseError={item.onCloseError} disabled={item.disabled}/>
        </Section_1.default>);
    const updateWorkspaceCurrencyPrompt = (<react_native_1.View style={[styles.renderHTML, styles.flexRow]}>
            <RenderHTML_1.default html={translate('workspace.bankAccount.yourWorkspace')}/>
        </react_native_1.View>);
    const isPaidGroupPolicy = (0, PolicyUtils_1.isPaidGroupPolicy)(policy);
    const isLoading = !!(policy?.isLoading && policy?.reimbursementChoice === undefined);
    return (<AccessOrNotFoundWrapper_1.default policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_WORKFLOWS_ENABLED}>
            <WorkspacePageWithSections_1.default headerText={translate('workspace.common.workflows')} icon={Illustrations_1.Workflows} route={route} shouldShowOfflineIndicatorInWideScreen shouldShowNotFoundPage={!isPaidGroupPolicy || !isPolicyAdmin} isLoading={isLoading} shouldShowLoading={isLoading} shouldUseScrollView addBottomSafeAreaPadding>
                <react_native_1.View style={[styles.mt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                    {optionItems.map(renderOptionItem)}
                    {isBetaEnabled(CONST_1.default.BETAS.GLOBAL_REIMBURSEMENTS_ON_ND) ? (<ConfirmModal_1.default title={translate('workspace.bankAccount.workspaceCurrencyNotSupported')} isVisible={isUpdateWorkspaceCurrencyModalOpen} onConfirm={confirmCurrencyChangeAndHideModal} onCancel={() => setIsUpdateWorkspaceCurrencyModalOpen(false)} prompt={updateWorkspaceCurrencyPrompt} confirmText={translate('workspace.bankAccount.updateWorkspaceCurrency')} cancelText={translate('common.cancel')}/>) : (<ConfirmModal_1.default title={translate('workspace.bankAccount.workspaceCurrency')} isVisible={isUpdateWorkspaceCurrencyModalOpen} onConfirm={confirmCurrencyChangeAndHideModal} onCancel={() => setIsUpdateWorkspaceCurrencyModalOpen(false)} prompt={translate('workspace.bankAccount.updateCurrencyPrompt')} confirmText={translate('workspace.bankAccount.updateToUSD')} cancelText={translate('common.cancel')} danger/>)}
                </react_native_1.View>
            </WorkspacePageWithSections_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceWorkflowsPage.displayName = 'WorkspaceWorkflowsPage';
exports.default = (0, withPolicy_1.default)(WorkspaceWorkflowsPage);
