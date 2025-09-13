"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useDefaultFundID_1 = require("@hooks/useDefaultFundID");
const useIsPolicyConnectedToUberReceiptPartner_1 = require("@hooks/useIsPolicyConnectedToUberReceiptPartner");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Category_1 = require("@userActions/Policy/Category");
const DistanceRate_1 = require("@userActions/Policy/DistanceRate");
const PerDiem_1 = require("@userActions/Policy/PerDiem");
const Policy_1 = require("@userActions/Policy/Policy");
const Tag_1 = require("@userActions/Policy/Tag");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const AccessOrNotFoundWrapper_1 = require("./AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("./withPolicyAndFullscreenLoading");
const ToggleSettingsOptionRow_1 = require("./workflows/ToggleSettingsOptionRow");
function WorkspaceMoreFeaturesPage({ policy, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const hasAccountingConnection = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const isAccountingEnabled = !!policy?.areConnectionsEnabled || !(0, EmptyObject_1.isEmptyObject)(policy?.connections);
    const isSyncTaxEnabled = !!policy?.connections?.quickbooksOnline?.config?.syncTax ||
        !!policy?.connections?.xero?.config?.importTaxRates ||
        !!policy?.connections?.netsuite?.options?.config?.syncOptions?.syncTax;
    const policyID = policy?.id;
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [cardsList] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID.toString()}_${CONST_1.default.EXPENSIFY_CARD.BANK}`, {
        selector: CardUtils_1.filterInactiveCards,
        canBeMissing: true,
    });
    const isUberConnected = (0, useIsPolicyConnectedToUberReceiptPartner_1.default)({ policyID });
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const [isOrganizeWarningModalOpen, setIsOrganizeWarningModalOpen] = (0, react_1.useState)(false);
    const [isIntegrateWarningModalOpen, setIsIntegrateWarningModalOpen] = (0, react_1.useState)(false);
    const [isReceiptPartnersWarningModalOpen, setIsReceiptPartnersWarningModalOpen] = (0, react_1.useState)(false);
    const [isDisableExpensifyCardWarningModalOpen, setIsDisableExpensifyCardWarningModalOpen] = (0, react_1.useState)(false);
    const [isDisableCompanyCardsWarningModalOpen, setIsDisableCompanyCardsWarningModalOpen] = (0, react_1.useState)(false);
    const [isDisableWorkflowWarningModalOpen, setIsDisableWorkflowWarningModalOpen] = (0, react_1.useState)(false);
    const perDiemCustomUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const distanceRateCustomUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const [cardList] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}`, { canBeMissing: true });
    const workspaceCards = (0, CardUtils_1.getAllCardsForWorkspace)(workspaceAccountID, cardList, cardFeeds);
    const isSmartLimitEnabled = (0, CardUtils_1.isSmartLimitEnabled)(workspaceCards);
    const [allTransactionViolations] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, { canBeMissing: true });
    const [policyTagLists] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policy?.id}`, { canBeMissing: true });
    const defaultFundID = (0, useDefaultFundID_1.default)(policyID);
    const [cardSettings] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${defaultFundID}`, { canBeMissing: true });
    const paymentBankAccountID = cardSettings?.paymentBankAccountID;
    const onDisabledOrganizeSwitchPress = (0, react_1.useCallback)(() => {
        if (!hasAccountingConnection) {
            return;
        }
        setIsOrganizeWarningModalOpen(true);
    }, [hasAccountingConnection]);
    const onDisabledWorkflowPress = (0, react_1.useCallback)(() => {
        if (!isSmartLimitEnabled) {
            return;
        }
        setIsDisableWorkflowWarningModalOpen(true);
    }, [isSmartLimitEnabled]);
    const spendItems = [
        {
            icon: Illustrations.Car,
            titleTranslationKey: 'workspace.moreFeatures.distanceRates.title',
            subtitleTranslationKey: 'workspace.moreFeatures.distanceRates.subtitle',
            isActive: policy?.areDistanceRatesEnabled ?? false,
            pendingAction: policy?.pendingFields?.areDistanceRatesEnabled,
            action: (isEnabled) => {
                if (!policyID) {
                    return;
                }
                (0, DistanceRate_1.enablePolicyDistanceRates)(policyID, isEnabled, distanceRateCustomUnit);
            },
        },
        {
            icon: Illustrations.HandCard,
            titleTranslationKey: 'workspace.moreFeatures.expensifyCard.title',
            subtitleTranslationKey: 'workspace.moreFeatures.expensifyCard.subtitle',
            isActive: policy?.areExpensifyCardsEnabled ?? false,
            pendingAction: policy?.pendingFields?.areExpensifyCardsEnabled,
            disabled: (!!policy?.areExpensifyCardsEnabled && !!paymentBankAccountID) || !(0, EmptyObject_1.isEmptyObject)(cardsList),
            action: (isEnabled) => {
                if (!policyID) {
                    return;
                }
                (0, Policy_1.enableExpensifyCard)(policyID, isEnabled);
            },
            disabledAction: () => {
                setIsDisableExpensifyCardWarningModalOpen(true);
            },
        },
    ];
    spendItems.push({
        icon: Illustrations.CompanyCard,
        titleTranslationKey: 'workspace.moreFeatures.companyCards.title',
        subtitleTranslationKey: 'workspace.moreFeatures.companyCards.subtitle',
        isActive: policy?.areCompanyCardsEnabled ?? false,
        pendingAction: policy?.pendingFields?.areCompanyCardsEnabled,
        disabled: !(0, EmptyObject_1.isEmptyObject)((0, CardUtils_1.getCompanyFeeds)(cardFeeds)),
        action: (isEnabled) => {
            if (!policyID) {
                return;
            }
            (0, Policy_1.enableCompanyCards)(policyID, isEnabled, true);
        },
        disabledAction: () => {
            setIsDisableCompanyCardsWarningModalOpen(true);
        },
    });
    spendItems.push({
        icon: Illustrations.PerDiem,
        titleTranslationKey: 'workspace.moreFeatures.perDiem.title',
        subtitleTranslationKey: 'workspace.moreFeatures.perDiem.subtitle',
        isActive: policy?.arePerDiemRatesEnabled ?? false,
        pendingAction: policy?.pendingFields?.arePerDiemRatesEnabled,
        action: (isEnabled) => {
            if (!policyID) {
                return;
            }
            if (isEnabled && !(0, PolicyUtils_1.isControlPolicy)(policy)) {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.perDiem.alias, ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID)));
                return;
            }
            (0, PerDiem_1.enablePerDiem)(policyID, isEnabled, perDiemCustomUnit?.customUnitID, true);
        },
    });
    const manageItems = [
        {
            icon: Illustrations.Workflows,
            titleTranslationKey: 'workspace.moreFeatures.workflows.title',
            subtitleTranslationKey: 'workspace.moreFeatures.workflows.subtitle',
            isActive: policy?.areWorkflowsEnabled ?? false,
            pendingAction: policy?.pendingFields?.areWorkflowsEnabled,
            action: (isEnabled) => {
                if (!policyID) {
                    return;
                }
                (0, Policy_1.enablePolicyWorkflows)(policyID, isEnabled);
            },
            disabled: isSmartLimitEnabled,
            disabledAction: onDisabledWorkflowPress,
        },
        {
            icon: Illustrations.Rules,
            titleTranslationKey: 'workspace.moreFeatures.rules.title',
            subtitleTranslationKey: 'workspace.moreFeatures.rules.subtitle',
            isActive: policy?.areRulesEnabled ?? false,
            pendingAction: policy?.pendingFields?.areRulesEnabled,
            action: (isEnabled) => {
                if (!policyID) {
                    return;
                }
                if (isEnabled && !(0, PolicyUtils_1.isControlPolicy)(policy)) {
                    Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.rules.alias, ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID)));
                    return;
                }
                (0, Policy_1.enablePolicyRules)(policyID, isEnabled);
            },
        },
    ];
    const earnItems = [
        {
            icon: Illustrations.InvoiceBlue,
            titleTranslationKey: 'workspace.moreFeatures.invoices.title',
            subtitleTranslationKey: 'workspace.moreFeatures.invoices.subtitle',
            isActive: policy?.areInvoicesEnabled ?? false,
            pendingAction: policy?.pendingFields?.areInvoicesEnabled,
            action: (isEnabled) => {
                if (!policyID) {
                    return;
                }
                (0, Policy_1.enablePolicyInvoicing)(policyID, isEnabled);
            },
        },
    ];
    const organizeItems = [
        {
            icon: Illustrations.FolderOpen,
            titleTranslationKey: 'workspace.moreFeatures.categories.title',
            subtitleTranslationKey: 'workspace.moreFeatures.categories.subtitle',
            isActive: policy?.areCategoriesEnabled ?? false,
            disabled: hasAccountingConnection,
            disabledAction: onDisabledOrganizeSwitchPress,
            pendingAction: policy?.pendingFields?.areCategoriesEnabled,
            action: (isEnabled) => {
                if (!policyID) {
                    return;
                }
                (0, Category_1.enablePolicyCategories)(policyID, isEnabled, policyTagLists, allTransactionViolations, true);
            },
        },
        {
            icon: Illustrations.Tag,
            titleTranslationKey: 'workspace.moreFeatures.tags.title',
            subtitleTranslationKey: 'workspace.moreFeatures.tags.subtitle',
            isActive: policy?.areTagsEnabled ?? false,
            disabled: hasAccountingConnection,
            pendingAction: policy?.pendingFields?.areTagsEnabled,
            disabledAction: onDisabledOrganizeSwitchPress,
            action: (isEnabled) => {
                if (!policyID) {
                    return;
                }
                (0, Tag_1.enablePolicyTags)(policyID, isEnabled);
            },
        },
        {
            icon: Illustrations.Coins,
            titleTranslationKey: 'workspace.moreFeatures.taxes.title',
            subtitleTranslationKey: 'workspace.moreFeatures.taxes.subtitle',
            isActive: (policy?.tax?.trackingEnabled ?? false) || isSyncTaxEnabled,
            disabled: hasAccountingConnection,
            pendingAction: policy?.pendingFields?.tax,
            disabledAction: onDisabledOrganizeSwitchPress,
            action: (isEnabled) => {
                if (!policyID) {
                    return;
                }
                (0, Policy_1.enablePolicyTaxes)(policyID, isEnabled);
            },
        },
    ];
    const integrateItems = [
        {
            icon: Illustrations.Accounting,
            titleTranslationKey: 'workspace.moreFeatures.connections.title',
            subtitleTranslationKey: 'workspace.moreFeatures.connections.subtitle',
            isActive: isAccountingEnabled,
            pendingAction: policy?.pendingFields?.areConnectionsEnabled,
            disabledAction: () => {
                if (!hasAccountingConnection) {
                    return;
                }
                setIsIntegrateWarningModalOpen(true);
            },
            action: (isEnabled) => {
                if (!policyID) {
                    return;
                }
                (0, Policy_1.enablePolicyConnections)(policyID, isEnabled);
            },
            disabled: hasAccountingConnection,
            errors: (0, ErrorUtils_1.getLatestErrorField)(policy ?? {}, CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED),
            onCloseError: () => {
                if (!policyID) {
                    return;
                }
                (0, Policy_1.clearPolicyErrorField)(policyID, CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED);
            },
        },
    ];
    if (isBetaEnabled(CONST_1.default.BETAS.UBER_FOR_BUSINESS)) {
        integrateItems.push({
            icon: Illustrations.ReceiptPartners,
            titleTranslationKey: 'workspace.moreFeatures.receiptPartners.title',
            subtitleTranslationKey: 'workspace.moreFeatures.receiptPartners.subtitle',
            isActive: policy?.areReceiptPartnersEnabled ?? false,
            pendingAction: policy?.pendingFields?.areReceiptPartnersEnabled,
            disabledAction: () => {
                if (!isUberConnected) {
                    return;
                }
                setIsReceiptPartnersWarningModalOpen(true);
            },
            action: (isEnabled) => {
                if (!policyID) {
                    return;
                }
                (0, Policy_1.enablePolicyReceiptPartners)(policyID, isEnabled);
            },
            disabled: isUberConnected,
            errors: (0, ErrorUtils_1.getLatestErrorField)(policy ?? {}, CONST_1.default.POLICY.MORE_FEATURES.ARE_RECEIPT_PARTNERS_ENABLED),
            onCloseError: () => {
                if (!policyID) {
                    return;
                }
                (0, Policy_1.clearPolicyErrorField)(policyID, CONST_1.default.POLICY.MORE_FEATURES.ARE_RECEIPT_PARTNERS_ENABLED);
            },
        });
    }
    const sections = [
        {
            titleTranslationKey: 'workspace.moreFeatures.integrateSection.title',
            subtitleTranslationKey: 'workspace.moreFeatures.integrateSection.subtitle',
            items: integrateItems,
        },
        {
            titleTranslationKey: 'workspace.moreFeatures.organizeSection.title',
            subtitleTranslationKey: 'workspace.moreFeatures.organizeSection.subtitle',
            items: organizeItems,
        },
        {
            titleTranslationKey: 'workspace.moreFeatures.manageSection.title',
            subtitleTranslationKey: 'workspace.moreFeatures.manageSection.subtitle',
            items: manageItems,
        },
        {
            titleTranslationKey: 'workspace.moreFeatures.spendSection.title',
            subtitleTranslationKey: 'workspace.moreFeatures.spendSection.subtitle',
            items: spendItems,
        },
        {
            titleTranslationKey: 'workspace.moreFeatures.earnSection.title',
            subtitleTranslationKey: 'workspace.moreFeatures.earnSection.subtitle',
            items: earnItems,
        },
    ];
    const renderItem = (0, react_1.useCallback)((item) => (<react_native_1.View key={item.titleTranslationKey} style={[styles.workspaceSectionMoreFeaturesItem, shouldUseNarrowLayout && styles.flexBasis100, shouldUseNarrowLayout && StyleUtils.getMinimumWidth(0)]}>
                <ToggleSettingsOptionRow_1.default icon={item.icon} disabled={item.disabled} disabledAction={item.disabledAction} title={translate(item.titleTranslationKey)} titleStyle={styles.textStrong} subtitle={translate(item.subtitleTranslationKey)} switchAccessibilityLabel={translate(item.subtitleTranslationKey)} isActive={item.isActive} pendingAction={item.pendingAction} onToggle={item.action} showLockIcon={item.disabled} errors={item.errors} onCloseError={item.onCloseError}/>
            </react_native_1.View>), [styles, StyleUtils, shouldUseNarrowLayout, translate]);
    /** Used to fill row space in the Section items when there are odd number of items to create equal margins for last odd item. */
    const sectionRowFillerItem = (0, react_1.useCallback)((section) => {
        if (section.items.length % 2 === 0) {
            return null;
        }
        return (<react_native_1.View key="section-filler-col" aria-hidden accessibilityElementsHidden style={[
                styles.workspaceSectionMoreFeaturesItem,
                shouldUseNarrowLayout && StyleUtils.getMinimumWidth(0),
                styles.p0,
                styles.mt0,
                styles.visibilityHidden,
                styles.bgTransparent,
            ]}/>);
    }, [styles, StyleUtils, shouldUseNarrowLayout]);
    const renderSection = (0, react_1.useCallback)((section) => (<react_native_1.View key={section.titleTranslationKey} style={[styles.mt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : {}]}>
                <Section_1.default containerStyles={[styles.ph1, styles.pv0, styles.bgTransparent, styles.noBorderRadius]} childrenStyles={[styles.flexRow, styles.flexWrap, styles.columnGap3]} renderTitle={() => <Text_1.default style={styles.mutedNormalTextLabel}>{translate(section.titleTranslationKey)}</Text_1.default>} subtitleMuted>
                    {section.items.map(renderItem)}
                    {sectionRowFillerItem(section)}
                </Section_1.default>
            </react_native_1.View>), [shouldUseNarrowLayout, styles, renderItem, translate, sectionRowFillerItem]);
    const fetchFeatures = (0, react_1.useCallback)(() => {
        (0, Policy_1.openPolicyMoreFeaturesPage)(route.params.policyID);
    }, [route.params.policyID]);
    (0, react_1.useEffect)(() => {
        fetchFeatures();
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, useNetwork_1.default)({ onReconnect: fetchFeatures });
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={route.params.policyID}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={WorkspaceMoreFeaturesPage.displayName} shouldShowOfflineIndicatorInWideScreen>
                <HeaderWithBackButton_1.default icon={Illustrations.Gears} shouldUseHeadlineHeader title={translate('workspace.common.moreFeatures')} shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={() => Navigation_1.default.goBack()}/>

                <ScrollView_1.default addBottomSafeAreaPadding>
                    <Text_1.default style={[styles.ph5, styles.mb5, styles.mt3, styles.textSupporting, styles.workspaceSectionMobile]}>{translate('workspace.moreFeatures.subtitle')}</Text_1.default>
                    {sections.map(renderSection)}
                </ScrollView_1.default>

                <ConfirmModal_1.default title={translate('workspace.moreFeatures.connectionsWarningModal.featureEnabledTitle')} onConfirm={() => {
            if (!policyID) {
                return;
            }
            setIsOrganizeWarningModalOpen(false);
            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID));
        }} onCancel={() => setIsOrganizeWarningModalOpen(false)} isVisible={isOrganizeWarningModalOpen} prompt={translate('workspace.moreFeatures.connectionsWarningModal.featureEnabledText')} confirmText={translate('workspace.moreFeatures.connectionsWarningModal.manageSettings')} cancelText={translate('common.cancel')}/>
                <ConfirmModal_1.default title={translate('workspace.moreFeatures.connectionsWarningModal.featureEnabledTitle')} onConfirm={() => {
            if (!policyID) {
                return;
            }
            setIsIntegrateWarningModalOpen(false);
            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID));
        }} onCancel={() => setIsIntegrateWarningModalOpen(false)} isVisible={isIntegrateWarningModalOpen} prompt={translate('workspace.moreFeatures.connectionsWarningModal.disconnectText')} confirmText={translate('workspace.moreFeatures.connectionsWarningModal.manageSettings')} cancelText={translate('common.cancel')}/>
                {isBetaEnabled(CONST_1.default.BETAS.UBER_FOR_BUSINESS) && (<ConfirmModal_1.default title={translate('workspace.moreFeatures.receiptPartnersWarningModal.featureEnabledTitle')} onConfirm={() => {
                if (!policyID) {
                    return;
                }
                setIsReceiptPartnersWarningModalOpen(false);
                // TODO: Navigate to Receipt Partners settings page when it exists
                // Navigation.navigate(ROUTES.POLICY_RECEIPT_PARTNERS.getRoute(policyID));
            }} isVisible={isReceiptPartnersWarningModalOpen} prompt={translate('workspace.moreFeatures.receiptPartnersWarningModal.disconnectText')} confirmText={translate('workspace.moreFeatures.receiptPartnersWarningModal.confirmText')} shouldShowCancelButton={false}/>)}
                <ConfirmModal_1.default title={translate('workspace.moreFeatures.expensifyCard.disableCardTitle')} isVisible={isDisableExpensifyCardWarningModalOpen} onConfirm={() => {
            setIsDisableExpensifyCardWarningModalOpen(false);
            (0, Report_1.navigateToConciergeChat)();
        }} onCancel={() => setIsDisableExpensifyCardWarningModalOpen(false)} prompt={translate('workspace.moreFeatures.expensifyCard.disableCardPrompt')} confirmText={translate('workspace.moreFeatures.expensifyCard.disableCardButton')} cancelText={translate('common.cancel')}/>
                <ConfirmModal_1.default title={translate('workspace.moreFeatures.companyCards.disableCardTitle')} isVisible={isDisableCompanyCardsWarningModalOpen} onConfirm={() => {
            setIsDisableCompanyCardsWarningModalOpen(false);
            (0, Report_1.navigateToConciergeChat)();
        }} onCancel={() => setIsDisableCompanyCardsWarningModalOpen(false)} prompt={translate('workspace.moreFeatures.companyCards.disableCardPrompt')} confirmText={translate('workspace.moreFeatures.companyCards.disableCardButton')} cancelText={translate('common.cancel')}/>
                <ConfirmModal_1.default title={translate('workspace.moreFeatures.workflowWarningModal.featureEnabledTitle')} isVisible={isDisableWorkflowWarningModalOpen} onConfirm={() => {
            setIsDisableWorkflowWarningModalOpen(false);
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD.getRoute(policyID));
        }} onCancel={() => setIsDisableWorkflowWarningModalOpen(false)} prompt={translate('workspace.moreFeatures.workflowWarningModal.featureEnabledText')} confirmText={translate('workspace.moreFeatures.workflowWarningModal.confirmText')} cancelText={translate('common.cancel')}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceMoreFeaturesPage.displayName = 'WorkspaceMoreFeaturesPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceMoreFeaturesPage);
