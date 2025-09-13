"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const AvatarWithImagePicker_1 = require("@components/AvatarWithImagePicker");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const ConfirmModal_1 = require("@components/ConfirmModal");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Illustrations_1 = require("@components/Icon/Illustrations");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Section_1 = require("@components/Section");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useDefaultFundID_1 = require("@hooks/useDefaultFundID");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePayAndDowngrade_1 = require("@hooks/usePayAndDowngrade");
const usePermissions_1 = require("@hooks/usePermissions");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Member_1 = require("@libs/actions/Policy/Member");
const Policy_1 = require("@libs/actions/Policy/Policy");
const CardUtils_1 = require("@libs/CardUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const shouldRenderTransferOwnerButton_1 = require("@libs/shouldRenderTransferOwnerButton");
const StringUtils_1 = require("@libs/StringUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const UserUtils_1 = require("@libs/UserUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const WorkspaceReceiptPartnersPromotionBanner_1 = require("./receiptPartners/WorkspaceReceiptPartnersPromotionBanner");
const withPolicy_1 = require("./withPolicy");
const WorkspacePageWithSections_1 = require("./WorkspacePageWithSections");
function WorkspaceOverviewPage({ policyDraft, policy: policyProp, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const backTo = route.params.backTo;
    const [currencyList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: true });
    const [currentUserAccountID = -1] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, {
        selector: (session) => session?.accountID,
        canBeMissing: true,
    });
    const [fundList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, { canBeMissing: true });
    const [isComingFromGlobalReimbursementsFlow] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_COMING_FROM_GLOBAL_REIMBURSEMENTS_FLOW, { canBeMissing: true });
    const [lastAccessedWorkspacePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LAST_ACCESSED_WORKSPACE_POLICY_ID, { canBeMissing: true });
    // When we create a new workspace, the policy prop will be empty on the first render. Therefore, we have to use policyDraft until policy has been set in Onyx.
    const policy = policyDraft?.id ? policyDraft : policyProp;
    const defaultFundID = (0, useDefaultFundID_1.default)(policy?.id);
    const [cardSettings] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${defaultFundID}`, { canBeMissing: true });
    const isBankAccountVerified = !!cardSettings?.paymentBankAccountID;
    const isPolicyAdmin = (0, PolicyUtils_1.isPolicyAdmin)(policy);
    const outputCurrency = policy?.outputCurrency ?? '';
    const currencySymbol = currencyList?.[outputCurrency]?.symbol ?? '';
    const formattedCurrency = !(0, EmptyObject_1.isEmptyObject)(policy) && !(0, EmptyObject_1.isEmptyObject)(currencyList) ? `${outputCurrency} - ${currencySymbol}` : '';
    // We need this to update translation for deleting a workspace when it has third party card feeds or expensify card assigned.
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [cardFeeds] = (0, useCardFeeds_1.default)(policy?.id);
    const [cardsList] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`, {
        selector: CardUtils_1.filterInactiveCards,
        canBeMissing: true,
    });
    const hasCardFeedOrExpensifyCard = 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    !(0, EmptyObject_1.isEmptyObject)(cardFeeds) || !(0, EmptyObject_1.isEmptyObject)(cardsList) || ((policy?.areExpensifyCardsEnabled || policy?.areCompanyCardsEnabled) && policy?.workspaceAccountID);
    const [street1, street2] = (policy?.address?.addressStreet ?? '').split('\n');
    const formattedAddress = !(0, EmptyObject_1.isEmptyObject)(policy) && !(0, EmptyObject_1.isEmptyObject)(policy.address)
        ? `${street1?.trim()}, ${street2 ? `${street2.trim()}, ` : ''}${policy.address.city}, ${policy.address.state} ${policy.address.zipCode ?? ''}`
        : '';
    const onPressCurrency = (0, react_1.useCallback)(() => {
        if (!policy?.id) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OVERVIEW_CURRENCY.getRoute(policy.id));
    }, [policy?.id]);
    const onPressAddress = (0, react_1.useCallback)(() => {
        if (!policy?.id) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OVERVIEW_ADDRESS.getRoute(policy.id));
    }, [policy?.id]);
    const onPressName = (0, react_1.useCallback)(() => {
        if (!policy?.id) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OVERVIEW_NAME.getRoute(policy.id));
    }, [policy?.id]);
    const onPressDescription = (0, react_1.useCallback)(() => {
        if (!policy?.id) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OVERVIEW_DESCRIPTION.getRoute(policy.id));
    }, [policy?.id]);
    const onPressShare = (0, react_1.useCallback)(() => {
        if (!policy?.id) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OVERVIEW_SHARE.getRoute(policy.id));
    }, [policy?.id]);
    const onPressPlanType = (0, react_1.useCallback)(() => {
        if (!policy?.id) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OVERVIEW_PLAN.getRoute(policy.id));
    }, [policy?.id]);
    const policyName = policy?.name ?? '';
    const policyDescription = policy?.description ?? translate('workspace.common.defaultDescription');
    const policyCurrency = policy?.outputCurrency ?? '';
    const readOnly = !(0, PolicyUtils_1.isPolicyAdmin)(policy);
    const currencyReadOnly = readOnly || isBankAccountVerified;
    const isOwner = (0, PolicyUtils_1.isPolicyOwner)(policy, currentUserAccountID);
    const imageStyle = shouldUseNarrowLayout ? [styles.mhv12, styles.mhn5, styles.mbn5] : [styles.mhv8, styles.mhn8, styles.mbn5];
    const shouldShowAddress = !readOnly || !!formattedAddress;
    const { isAccountLocked, showLockedAccountModal } = (0, react_1.useContext)(LockedAccountModalProvider_1.LockedAccountContext);
    const [lastPaymentMethod] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, { canBeMissing: true });
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const fetchPolicyData = (0, react_1.useCallback)(() => {
        if (policyDraft?.id) {
            return;
        }
        (0, Policy_1.openPolicyProfilePage)(route.params.policyID);
    }, [policyDraft?.id, route.params.policyID]);
    (0, useNetwork_1.default)({ onReconnect: fetchPolicyData });
    // We have the same focus effect in the WorkspaceInitialPage, this way we can get the policy data in narrow
    // as well as in the wide layout when looking at policy settings.
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        fetchPolicyData();
    }, [fetchPolicyData]));
    const DefaultAvatar = (0, react_1.useCallback)(() => (<Avatar_1.default containerStyles={styles.avatarXLarge} imageStyles={[styles.avatarXLarge, styles.alignSelfCenter]} 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing cannot be used if left side can be empty string
    source={policy?.avatarURL || (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policyName)} fallbackIcon={Expensicons_1.FallbackWorkspaceAvatar} size={CONST_1.default.AVATAR_SIZE.X_LARGE} name={policyName} avatarID={policy?.id} type={CONST_1.default.ICON_TYPE_WORKSPACE}/>), [policy?.avatarURL, policy?.id, policyName, styles.alignSelfCenter, styles.avatarXLarge]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = (0, react_1.useState)(false);
    const { setIsDeletingPaidWorkspace, isLoadingBill } = (0, usePayAndDowngrade_1.default)(setIsDeleteModalOpen);
    const dropdownMenuRef = (0, react_1.useRef)(null);
    const confirmDeleteAndHideModal = (0, react_1.useCallback)(() => {
        if (!policy?.id || !policyName) {
            return;
        }
        (0, Policy_1.deleteWorkspace)(policy.id, policyName, lastAccessedWorkspacePolicyID, lastPaymentMethod);
        setIsDeleteModalOpen(false);
        (0, PolicyUtils_1.goBackFromInvalidPolicy)();
    }, [policy?.id, policyName, lastAccessedWorkspacePolicyID, lastPaymentMethod]);
    (0, react_1.useEffect)(() => {
        if (isLoadingBill) {
            return;
        }
        dropdownMenuRef.current?.setIsMenuVisible(false);
    }, [isLoadingBill]);
    const onDeleteWorkspace = (0, react_1.useCallback)(() => {
        if ((0, SubscriptionUtils_1.shouldCalculateBillNewDot)()) {
            setIsDeletingPaidWorkspace(true);
            (0, Policy_1.calculateBillNewDot)();
            return;
        }
        setIsDeleteModalOpen(true);
    }, [setIsDeletingPaidWorkspace]);
    const handleBackButtonPress = () => {
        if (isComingFromGlobalReimbursementsFlow) {
            (0, Policy_1.setIsComingFromGlobalReimbursementsFlow)(false);
            Navigation_1.default.goBack();
            return;
        }
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        Navigation_1.default.popToSidebar();
    };
    const startChangeOwnershipFlow = (0, react_1.useCallback)(() => {
        const policyID = policy?.id;
        (0, Member_1.clearWorkspaceOwnerChangeFlow)(policyID);
        (0, Member_1.requestWorkspaceOwnerChange)(policyID);
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OWNER_CHANGE_CHECK.getRoute(policyID, currentUserAccountID, 'amountOwed', Navigation_1.default.getActiveRoute()));
    }, [currentUserAccountID, policy?.id]);
    const getHeaderButtons = () => {
        if (readOnly) {
            return null;
        }
        const secondaryActions = [];
        if (isPolicyAdmin) {
            secondaryActions.push({
                value: 'invite',
                text: translate('common.invite'),
                icon: Expensicons_1.UserPlus,
                onSelected: () => {
                    if (isAccountLocked) {
                        showLockedAccountModal();
                        return;
                    }
                    (0, Member_1.clearInviteDraft)(route.params.policyID);
                    Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_INVITE.getRoute(route.params.policyID, Navigation_1.default.getActiveRouteWithoutParams()));
                },
            });
        }
        secondaryActions.push({
            value: 'share',
            text: translate('common.share'),
            icon: Expensicons_1.QrCode,
            onSelected: isAccountLocked ? showLockedAccountModal : onPressShare,
        });
        if (isOwner) {
            secondaryActions.push({
                value: 'delete',
                text: translate('common.delete'),
                icon: Expensicons_1.Trashcan,
                onSelected: onDeleteWorkspace,
                disabled: isLoadingBill,
                shouldShowLoadingSpinnerIcon: isLoadingBill,
                shouldCloseModalOnSelect: !(0, SubscriptionUtils_1.shouldCalculateBillNewDot)(),
            });
        }
        const isCurrentUserAdmin = policy?.employeeList?.[currentUserPersonalDetails?.login ?? '']?.role === CONST_1.default.POLICY.ROLE.ADMIN;
        const isCurrentUserOwner = policy?.owner === currentUserPersonalDetails?.login;
        if (isCurrentUserAdmin && !isCurrentUserOwner && (0, shouldRenderTransferOwnerButton_1.default)(fundList)) {
            secondaryActions.push({
                value: 'transferOwner',
                text: translate('workspace.people.transferOwner'),
                icon: Expensicons_1.Transfer,
                onSelected: startChangeOwnershipFlow,
            });
        }
        return (<react_native_1.View style={[!shouldUseNarrowLayout && styles.flexRow, !shouldUseNarrowLayout && styles.gap2]}>
                <ButtonWithDropdownMenu_1.default ref={dropdownMenuRef} success={false} onPress={() => { }} shouldAlwaysShowDropdownMenu customText={translate('common.more')} options={secondaryActions} isSplitButton={false} wrapperStyle={styles.flexGrow1}/>
            </react_native_1.View>);
    };
    return (<WorkspacePageWithSections_1.default headerText={translate('workspace.common.profile')} route={route} 
    // When we create a new workspaces, the policy prop will not be set on the first render. Therefore, we have to delay rendering until it has been set in Onyx.
    shouldShowLoading={policy === undefined} shouldUseScrollView shouldShowOfflineIndicatorInWideScreen shouldShowNonAdmin icon={Illustrations_1.Building} shouldShowNotFoundPage={policy === undefined} onBackButtonPress={handleBackButtonPress} addBottomSafeAreaPadding headerContent={!shouldUseNarrowLayout && getHeaderButtons()}>
            {(hasVBA) => (<react_native_1.View style={[styles.flex1, styles.mt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                    {shouldUseNarrowLayout && <react_native_1.View style={[styles.pl5, styles.pr5, styles.pb5]}>{getHeaderButtons()}</react_native_1.View>}
                    <WorkspaceReceiptPartnersPromotionBanner_1.default policy={policy} readOnly={readOnly}/>
                    <Section_1.default isCentralPane title="">
                        <react_native_1.Image style={react_native_1.StyleSheet.flatten([styles.wAuto, styles.h68, imageStyle])} source={illustrations.WorkspaceProfile} resizeMode="cover"/>
                        <AvatarWithImagePicker_1.default onViewPhotoPress={() => {
                if (!policy?.id) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_AVATAR.getRoute(policy.id));
            }} source={policy?.avatarURL ?? ''} avatarID={policy?.id} size={CONST_1.default.AVATAR_SIZE.X_LARGE} avatarStyle={styles.avatarXLarge} enablePreview DefaultAvatar={DefaultAvatar} type={CONST_1.default.ICON_TYPE_WORKSPACE} fallbackIcon={Expensicons_1.FallbackWorkspaceAvatar} style={[
                (policy?.errorFields?.avatarURL ?? shouldUseNarrowLayout) ? styles.mb1 : styles.mb3,
                shouldUseNarrowLayout ? styles.mtn17 : styles.mtn20,
                styles.alignItemsStart,
                styles.sectionMenuItemTopDescription,
            ]} editIconStyle={styles.smallEditIconWorkspace} isUsingDefaultAvatar={!policy?.avatarURL} onImageSelected={(file) => {
                if (!policy?.id) {
                    return;
                }
                (0, Policy_1.updateWorkspaceAvatar)(policy.id, file);
            }} onImageRemoved={() => {
                if (!policy?.id) {
                    return;
                }
                (0, Policy_1.deleteWorkspaceAvatar)(policy.id);
            }} editorMaskImage={Expensicons_1.ImageCropSquareMask} pendingAction={policy?.pendingFields?.avatarURL} errors={policy?.errorFields?.avatarURL} onErrorClose={() => {
                if (!policy?.id) {
                    return;
                }
                (0, Policy_1.clearAvatarErrors)(policy.id);
            }} previewSource={(0, UserUtils_1.getFullSizeAvatar)(policy?.avatarURL ?? '')} headerTitle={translate('workspace.common.workspaceAvatar')} originalFileName={policy?.originalFileName} disabled={readOnly} disabledStyle={styles.cursorDefault} errorRowStyles={styles.mt3}/>
                        <OfflineWithFeedback_1.default pendingAction={policy?.pendingFields?.name}>
                            <MenuItemWithTopDescription_1.default title={policyName} titleStyle={styles.workspaceTitleStyle} description={translate('workspace.common.workspaceName')} shouldShowRightIcon={!readOnly} interactive={!readOnly} wrapperStyle={[styles.sectionMenuItemTopDescription, shouldUseNarrowLayout ? styles.mt3 : {}]} onPress={onPressName} shouldBreakWord numberOfLinesTitle={0}/>
                        </OfflineWithFeedback_1.default>
                        {(!StringUtils_1.default.isEmptyString(policy?.description ?? '') || !readOnly) && (<OfflineWithFeedback_1.default pendingAction={policy?.pendingFields?.description} errors={(0, ErrorUtils_1.getLatestErrorField)(policy ?? {}, CONST_1.default.POLICY.COLLECTION_KEYS.DESCRIPTION)} onClose={() => {
                    if (!policy?.id) {
                        return;
                    }
                    (0, Policy_1.clearPolicyErrorField)(policy.id, CONST_1.default.POLICY.COLLECTION_KEYS.DESCRIPTION);
                }}>
                                <MenuItemWithTopDescription_1.default title={policyDescription} description={translate('workspace.editor.descriptionInputLabel')} shouldShowRightIcon={!readOnly} interactive={!readOnly} wrapperStyle={styles.sectionMenuItemTopDescription} onPress={onPressDescription} shouldRenderAsHTML/>
                            </OfflineWithFeedback_1.default>)}
                        <OfflineWithFeedback_1.default pendingAction={policy?.pendingFields?.outputCurrency} errors={(0, ErrorUtils_1.getLatestErrorField)(policy ?? {}, CONST_1.default.POLICY.COLLECTION_KEYS.GENERAL_SETTINGS)} onClose={() => {
                if (!policy?.id) {
                    return;
                }
                (0, Policy_1.clearPolicyErrorField)(policy.id, CONST_1.default.POLICY.COLLECTION_KEYS.GENERAL_SETTINGS);
            }} errorRowStyles={[styles.mt2]}>
                            <react_native_1.View>
                                <MenuItemWithTopDescription_1.default title={formattedCurrency} description={translate('workspace.editor.currencyInputLabel')} shouldShowRightIcon={hasVBA ? false : !currencyReadOnly} interactive={hasVBA ? false : !currencyReadOnly} wrapperStyle={styles.sectionMenuItemTopDescription} onPress={onPressCurrency} hintText={
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            hasVBA || isBankAccountVerified
                ? translate('workspace.editor.currencyInputDisabledText', { currency: policyCurrency })
                : translate('workspace.editor.currencyInputHelpText')}/>
                            </react_native_1.View>
                        </OfflineWithFeedback_1.default>
                        {shouldShowAddress && (<OfflineWithFeedback_1.default pendingAction={policy?.pendingFields?.address}>
                                <react_native_1.View>
                                    <MenuItemWithTopDescription_1.default title={formattedAddress} description={translate('common.companyAddress')} shouldShowRightIcon={!readOnly} interactive={!readOnly} wrapperStyle={styles.sectionMenuItemTopDescription} onPress={onPressAddress} copyValue={readOnly ? formattedAddress : undefined}/>
                                </react_native_1.View>
                            </OfflineWithFeedback_1.default>)}

                        {!readOnly && !!policy?.type && (<OfflineWithFeedback_1.default pendingAction={policy?.pendingFields?.type}>
                                <react_native_1.View>
                                    <MenuItemWithTopDescription_1.default title={(0, PolicyUtils_1.getUserFriendlyWorkspaceType)(policy.type)} description={translate('workspace.common.planType')} shouldShowRightIcon wrapperStyle={styles.sectionMenuItemTopDescription} onPress={onPressPlanType}/>
                                </react_native_1.View>
                            </OfflineWithFeedback_1.default>)}
                    </Section_1.default>
                    {isBetaEnabled(CONST_1.default.BETAS.CUSTOM_RULES) ? (<Section_1.default isCentralPane title={translate('workspace.editor.policy')} titleStyles={[styles.textHeadline, styles.cardSectionTitle, styles.accountSettingsSectionTitle, styles.mb0]} subtitle={translate('workspace.rules.customRules.cardSubtitle')} subtitleStyles={[styles.mb6]} subtitleTextStyles={[styles.textNormal, styles.colorMuted, styles.mr5]} containerStyles={shouldUseNarrowLayout ? styles.p5 : styles.p8}>
                            <OfflineWithFeedback_1.default pendingAction={policy?.pendingFields?.customRules}>
                                <MenuItemWithTopDescription_1.default title={policy?.customRules ?? ''} description={translate('workspace.editor.policy')} shouldShowRightIcon={!readOnly} interactive={!readOnly} wrapperStyle={styles.sectionMenuItemTopDescription} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.RULES_CUSTOM.getRoute(route.params.policyID))} shouldRenderAsHTML/>
                            </OfflineWithFeedback_1.default>
                        </Section_1.default>) : null}
                    <ConfirmModal_1.default title={translate('workspace.common.delete')} isVisible={isDeleteModalOpen} onConfirm={confirmDeleteAndHideModal} onCancel={() => setIsDeleteModalOpen(false)} prompt={hasCardFeedOrExpensifyCard ? translate('workspace.common.deleteWithCardsConfirmation') : translate('workspace.common.deleteConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                </react_native_1.View>)}
        </WorkspacePageWithSections_1.default>);
}
WorkspaceOverviewPage.displayName = 'WorkspaceOverviewPage';
exports.default = (0, withPolicy_1.default)(WorkspaceOverviewPage);
