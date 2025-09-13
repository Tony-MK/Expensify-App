"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const CollapsibleSection_1 = require("@components/CollapsibleSection");
const ConfirmModal_1 = require("@components/ConfirmModal");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemList_1 = require("@components/MenuItemList");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
const useExpensifyCardFeeds_1 = require("@hooks/useExpensifyCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const connections_1 = require("@libs/actions/connections");
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const CardUtils_1 = require("@libs/CardUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Link_1 = require("@userActions/Link");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const AccountingContext_1 = require("./AccountingContext");
const utils_1 = require("./utils");
function PolicyAccountingPage({ policy }) {
    const [connectionSyncProgress] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policy?.id}`, { canBeMissing: true });
    const [conciergeReportID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CONCIERGE_REPORT_ID, { canBeMissing: true });
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate, datetimeToRelative: getDatetimeToRelative, getLocalDateFromDatetime } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [isDisconnectModalOpen, setIsDisconnectModalOpen] = (0, react_1.useState)(false);
    const [datetimeToRelative, setDateTimeToRelative] = (0, react_1.useState)('');
    const { startIntegrationFlow, popoverAnchorRefs } = (0, AccountingContext_1.useAccountingContext)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const { isLargeScreenWidth } = (0, useResponsiveLayout_1.default)();
    const route = (0, native_1.useRoute)();
    const params = route.params;
    const newConnectionName = params?.newConnectionName;
    const integrationToDisconnect = params?.integrationToDisconnect;
    const shouldDisconnectIntegrationBeforeConnecting = params?.shouldDisconnectIntegrationBeforeConnecting;
    const policyID = policy?.id;
    const allCardSettings = (0, useExpensifyCardFeeds_1.default)(policyID);
    const isSyncInProgress = (0, connections_1.isConnectionInProgress)(connectionSyncProgress, policy);
    const connectionNames = CONST_1.default.POLICY.CONNECTIONS.NAME;
    const accountingIntegrations = Object.values(connectionNames);
    const connectedIntegration = (0, PolicyUtils_1.getConnectedIntegration)(policy, accountingIntegrations) ?? connectionSyncProgress?.connectionName;
    const synchronizationError = connectedIntegration && (0, utils_1.getSynchronizationErrorMessage)(policy, connectedIntegration, isSyncInProgress, translate, styles);
    const shouldShowEnterCredentials = connectedIntegration && !!synchronizationError && (0, connections_1.isAuthenticationError)(policy, connectedIntegration);
    // Get the last successful date of the integration. Then, if `connectionSyncProgress` is the same integration displayed and the state is 'jobDone', get the more recent update time of the two.
    const successfulDate = (0, PolicyUtils_1.getIntegrationLastSuccessfulDate)(getLocalDateFromDatetime, connectedIntegration ? policy?.connections?.[connectedIntegration] : undefined, connectedIntegration === connectionSyncProgress?.connectionName ? connectionSyncProgress : undefined);
    const hasSyncError = (0, PolicyUtils_1.shouldShowSyncError)(policy, isSyncInProgress);
    const hasUnsupportedNDIntegration = !(0, EmptyObject_1.isEmptyObject)(policy?.connections) && (0, PolicyUtils_1.hasSupportedOnlyOnOldDotIntegration)(policy);
    const tenants = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getXeroTenants)(policy), [policy]);
    const currentXeroOrganization = (0, PolicyUtils_1.findCurrentXeroOrganization)(tenants, policy?.connections?.xero?.config?.tenantID);
    const shouldShowSynchronizationError = !!synchronizationError;
    const shouldShowReinstallConnectorMenuItem = shouldShowSynchronizationError && connectedIntegration === CONST_1.default.POLICY.CONNECTIONS.NAME.QBD;
    const shouldShowCardReconciliationOption = Object.values(allCardSettings ?? {})?.some((cardSetting) => (0, CardUtils_1.isExpensifyCardFullySetUp)(policy, cardSetting));
    const overflowMenu = (0, react_1.useMemo)(() => [
        ...(shouldShowReinstallConnectorMenuItem
            ? [
                {
                    icon: Expensicons.CircularArrowBackwards,
                    text: translate('workspace.accounting.reinstall'),
                    onSelected: () => startIntegrationFlow({ name: CONST_1.default.POLICY.CONNECTIONS.NAME.QBD }),
                    shouldCallAfterModalHide: true,
                    disabled: isOffline,
                    iconRight: Expensicons.NewWindow,
                },
            ]
            : []),
        ...(shouldShowEnterCredentials
            ? [
                {
                    icon: Expensicons.Key,
                    text: translate('workspace.accounting.enterCredentials'),
                    onSelected: () => startIntegrationFlow({ name: connectedIntegration }),
                    shouldCallAfterModalHide: true,
                    disabled: isOffline,
                    iconRight: Expensicons.NewWindow,
                },
            ]
            : [
                {
                    icon: Expensicons.Sync,
                    text: translate('workspace.accounting.syncNow'),
                    onSelected: () => (0, connections_1.syncConnection)(policy, connectedIntegration),
                    disabled: isOffline,
                },
            ]),
        {
            icon: Expensicons.Trashcan,
            text: translate('workspace.accounting.disconnect'),
            onSelected: () => setIsDisconnectModalOpen(true),
            shouldCallAfterModalHide: true,
        },
    ], [shouldShowEnterCredentials, shouldShowReinstallConnectorMenuItem, translate, isOffline, policy, connectedIntegration, startIntegrationFlow]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (!newConnectionName || !(0, PolicyUtils_1.isControlPolicy)(policy)) {
            return;
        }
        startIntegrationFlow({
            name: newConnectionName,
            integrationToDisconnect,
            shouldDisconnectIntegrationBeforeConnecting,
        });
    }, [newConnectionName, integrationToDisconnect, shouldDisconnectIntegrationBeforeConnecting, policy, startIntegrationFlow]));
    (0, react_1.useEffect)(() => {
        if (successfulDate) {
            setDateTimeToRelative(getDatetimeToRelative(successfulDate));
            return;
        }
        setDateTimeToRelative('');
    }, [getDatetimeToRelative, successfulDate]);
    const integrationSpecificMenuItems = (0, react_1.useMemo)(() => {
        const sageIntacctEntityList = policy?.connections?.intacct?.data?.entities ?? [];
        const netSuiteSubsidiaryList = policy?.connections?.netsuite?.options?.data?.subsidiaryList ?? [];
        switch (connectedIntegration) {
            case CONST_1.default.POLICY.CONNECTIONS.NAME.XERO:
                return !policy?.connections?.xero?.data?.tenants
                    ? {}
                    : {
                        description: translate('workspace.xero.organization'),
                        iconRight: Expensicons.ArrowRight,
                        title: (0, PolicyUtils_1.getCurrentXeroOrganizationName)(policy),
                        wrapperStyle: [styles.sectionMenuItemTopDescription],
                        titleStyle: styles.fontWeightNormal,
                        shouldShowRightIcon: tenants.length > 1,
                        shouldShowDescriptionOnTop: true,
                        onPress: () => {
                            if (!(tenants.length > 1)) {
                                return;
                            }
                            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_ORGANIZATION.getRoute(policyID, currentXeroOrganization?.id));
                        },
                        pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.TENANT_ID], policy?.connections?.xero?.config?.pendingFields),
                        brickRoadIndicator: (0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.XERO_CONFIG.TENANT_ID], policy?.connections?.xero?.config?.errorFields)
                            ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
                            : undefined,
                    };
            case CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE:
                return !policy?.connections?.netsuite?.options?.config?.subsidiary
                    ? {}
                    : {
                        description: translate('workspace.netsuite.subsidiary'),
                        iconRight: Expensicons.ArrowRight,
                        title: policy?.connections?.netsuite?.options?.config?.subsidiary ?? '',
                        wrapperStyle: [styles.sectionMenuItemTopDescription],
                        titleStyle: styles.fontWeightNormal,
                        shouldShowRightIcon: netSuiteSubsidiaryList?.length > 1,
                        shouldShowDescriptionOnTop: true,
                        pendingAction: policy?.connections?.netsuite?.options?.config?.pendingFields?.subsidiary,
                        brickRoadIndicator: policy?.connections?.netsuite?.options?.config?.errorFields?.subsidiary ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                        onPress: () => {
                            if (!(netSuiteSubsidiaryList?.length > 1)) {
                                return;
                            }
                            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_SUBSIDIARY_SELECTOR.getRoute(policyID));
                        },
                    };
            case CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT:
                return !sageIntacctEntityList.length
                    ? {}
                    : {
                        description: translate('workspace.intacct.entity'),
                        iconRight: Expensicons.ArrowRight,
                        title: (0, PolicyUtils_1.getCurrentSageIntacctEntityName)(policy, translate('workspace.common.topLevel')),
                        wrapperStyle: [styles.sectionMenuItemTopDescription],
                        titleStyle: styles.fontWeightNormal,
                        shouldShowRightIcon: true,
                        shouldShowDescriptionOnTop: true,
                        pendingAction: policy?.connections?.intacct?.config?.pendingFields?.entity,
                        brickRoadIndicator: policy?.connections?.intacct?.config?.errorFields?.entity ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                        onPress: () => {
                            if (!sageIntacctEntityList.length) {
                                return;
                            }
                            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ENTITY.getRoute(policyID));
                        },
                    };
            case CONST_1.default.POLICY.CONNECTIONS.NAME.QBO:
                return !policy?.connections?.quickbooksOnline?.config?.companyName
                    ? {}
                    : {
                        description: translate('workspace.qbo.connectedTo'),
                        title: policy?.connections?.quickbooksOnline?.config?.companyName,
                        wrapperStyle: [styles.sectionMenuItemTopDescription],
                        titleStyle: styles.fontWeightNormal,
                        shouldShowDescriptionOnTop: true,
                        interactive: false,
                    };
            default:
                return undefined;
        }
    }, [connectedIntegration, currentXeroOrganization?.id, policy, policyID, styles.fontWeightNormal, styles.sectionMenuItemTopDescription, tenants.length, translate]);
    const connectionsMenuItems = (0, react_1.useMemo)(() => {
        if ((0, EmptyObject_1.isEmptyObject)(policy?.connections) && !isSyncInProgress && policyID) {
            return accountingIntegrations
                .map((integration) => {
                const integrationData = (0, utils_1.getAccountingIntegrationData)(integration, policyID, translate);
                if (!integrationData) {
                    return undefined;
                }
                const iconProps = integrationData?.icon
                    ? {
                        icon: integrationData.icon,
                        iconType: CONST_1.default.ICON_TYPE_AVATAR,
                    }
                    : {};
                return {
                    ...iconProps,
                    interactive: false,
                    wrapperStyle: [styles.sectionMenuItemTopDescription],
                    shouldShowRightComponent: true,
                    title: integrationData?.title,
                    rightComponent: (<Button_1.default onPress={() => startIntegrationFlow({ name: integration })} text={translate('workspace.accounting.setup')} style={styles.justifyContentCenter} small isDisabled={isOffline} ref={(ref) => {
                            if (!popoverAnchorRefs?.current) {
                                return;
                            }
                            // eslint-disable-next-line react-compiler/react-compiler
                            popoverAnchorRefs.current[integration].current = ref;
                        }}/>),
                };
            })
                .filter(Boolean);
        }
        if (!connectedIntegration || !policyID) {
            return [];
        }
        const isConnectionVerified = !(0, connections_1.isConnectionUnverified)(policy, connectedIntegration);
        const integrationData = (0, utils_1.getAccountingIntegrationData)(connectedIntegration, policyID, translate, policy, undefined, undefined, undefined, isBetaEnabled(CONST_1.default.BETAS.NETSUITE_USA_TAX));
        const iconProps = integrationData?.icon ? { icon: integrationData.icon, iconType: CONST_1.default.ICON_TYPE_AVATAR } : {};
        let connectionMessage;
        if (isSyncInProgress && connectionSyncProgress?.stageInProgress) {
            connectionMessage = translate('workspace.accounting.connections.syncStageName', { stage: connectionSyncProgress?.stageInProgress });
        }
        else if (!isConnectionVerified) {
            connectionMessage = translate('workspace.accounting.notSync');
        }
        else {
            connectionMessage = translate('workspace.accounting.lastSync', { relativeDate: datetimeToRelative });
        }
        const configurationOptions = [
            {
                icon: Expensicons.Pencil,
                iconRight: Expensicons.ArrowRight,
                shouldShowRightIcon: true,
                title: translate('workspace.accounting.import'),
                wrapperStyle: [styles.sectionMenuItemTopDescription],
                onPress: integrationData?.onImportPagePress,
                brickRoadIndicator: (0, PolicyUtils_1.areSettingsInErrorFields)(integrationData?.subscribedImportSettings, integrationData?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                pendingAction: (0, PolicyUtils_1.settingsPendingAction)(integrationData?.subscribedImportSettings, integrationData?.pendingFields),
            },
            {
                icon: Expensicons.Send,
                iconRight: Expensicons.ArrowRight,
                shouldShowRightIcon: true,
                title: translate('workspace.accounting.export'),
                wrapperStyle: [styles.sectionMenuItemTopDescription],
                onPress: integrationData?.onExportPagePress,
                brickRoadIndicator: (0, PolicyUtils_1.areSettingsInErrorFields)(integrationData?.subscribedExportSettings, integrationData?.errorFields) || (0, QuickbooksOnline_1.shouldShowQBOReimbursableExportDestinationAccountError)(policy)
                    ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
                    : undefined,
                pendingAction: (0, PolicyUtils_1.settingsPendingAction)(integrationData?.subscribedExportSettings, integrationData?.pendingFields),
            },
            ...(shouldShowCardReconciliationOption
                ? [
                    {
                        icon: Expensicons.ExpensifyCard,
                        iconRight: Expensicons.ArrowRight,
                        shouldShowRightIcon: true,
                        title: translate('workspace.accounting.cardReconciliation'),
                        wrapperStyle: [styles.sectionMenuItemTopDescription],
                        onPress: integrationData?.onCardReconciliationPagePress,
                    },
                ]
                : []),
            {
                icon: Expensicons.Gear,
                iconRight: Expensicons.ArrowRight,
                shouldShowRightIcon: true,
                title: translate('workspace.accounting.advanced'),
                wrapperStyle: [styles.sectionMenuItemTopDescription],
                onPress: integrationData?.onAdvancedPagePress,
                brickRoadIndicator: (0, PolicyUtils_1.areSettingsInErrorFields)(integrationData?.subscribedAdvancedSettings, integrationData?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                pendingAction: (0, PolicyUtils_1.settingsPendingAction)(integrationData?.subscribedAdvancedSettings, integrationData?.pendingFields),
            },
        ];
        return [
            {
                ...iconProps,
                interactive: false,
                wrapperStyle: [styles.sectionMenuItemTopDescription, shouldShowSynchronizationError && styles.pb0],
                shouldShowRightComponent: true,
                title: integrationData?.title,
                errorText: synchronizationError,
                errorTextStyle: [styles.mt5],
                shouldShowRedDotIndicator: true,
                description: connectionMessage,
                rightComponent: isSyncInProgress ? (<react_native_1.ActivityIndicator style={[styles.popoverMenuIcon]} color={theme.spinner}/>) : (<ThreeDotsMenu_1.default shouldSelfPosition menuItems={overflowMenu} anchorAlignment={{
                        horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                        vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
                    }}/>),
            },
            ...((0, EmptyObject_1.isEmptyObject)(integrationSpecificMenuItems) || shouldShowSynchronizationError || (0, EmptyObject_1.isEmptyObject)(policy?.connections) ? [] : [integrationSpecificMenuItems]),
            ...((0, EmptyObject_1.isEmptyObject)(policy?.connections) || !isConnectionVerified ? [] : configurationOptions),
        ];
    }, [
        policy,
        isSyncInProgress,
        policyID,
        connectedIntegration,
        translate,
        isBetaEnabled,
        connectionSyncProgress?.stageInProgress,
        styles.sectionMenuItemTopDescription,
        styles.pb0,
        styles.mt5,
        styles.popoverMenuIcon,
        styles.justifyContentCenter,
        shouldShowCardReconciliationOption,
        shouldShowSynchronizationError,
        synchronizationError,
        theme.spinner,
        overflowMenu,
        integrationSpecificMenuItems,
        accountingIntegrations,
        isOffline,
        startIntegrationFlow,
        popoverAnchorRefs,
        datetimeToRelative,
    ]);
    const otherIntegrationsItems = (0, react_1.useMemo)(() => {
        if (((0, EmptyObject_1.isEmptyObject)(policy?.connections) && !isSyncInProgress) || !policyID) {
            return;
        }
        const otherIntegrations = accountingIntegrations.filter((integration) => (isSyncInProgress && integration !== connectionSyncProgress?.connectionName) || integration !== connectedIntegration);
        return otherIntegrations
            .map((integration) => {
            const integrationData = (0, utils_1.getAccountingIntegrationData)(integration, policyID, translate);
            if (!integrationData) {
                return undefined;
            }
            const iconProps = integrationData?.icon ? { icon: integrationData.icon, iconType: CONST_1.default.ICON_TYPE_AVATAR } : {};
            return {
                ...iconProps,
                title: integrationData?.title,
                rightComponent: (<Button_1.default onPress={() => startIntegrationFlow({
                        name: integration,
                        integrationToDisconnect: connectedIntegration,
                        shouldDisconnectIntegrationBeforeConnecting: true,
                    })} text={translate('workspace.accounting.setup')} style={styles.justifyContentCenter} small isDisabled={isOffline} ref={(r) => {
                        if (!popoverAnchorRefs?.current) {
                            return;
                        }
                        popoverAnchorRefs.current[integration].current = r;
                    }}/>),
                interactive: false,
                shouldShowRightComponent: true,
                wrapperStyle: styles.sectionMenuItemTopDescription,
            };
        })
            .filter(Boolean);
    }, [
        policy?.connections,
        isSyncInProgress,
        accountingIntegrations,
        connectionSyncProgress?.connectionName,
        connectedIntegration,
        policyID,
        translate,
        styles.justifyContentCenter,
        styles.sectionMenuItemTopDescription,
        isOffline,
        startIntegrationFlow,
        popoverAnchorRefs,
    ]);
    const [chatTextLink, chatReportID] = (0, react_1.useMemo)(() => {
        // If they have an onboarding specialist assigned display the following and link to the #admins room with the setup specialist.
        if (policy?.chatReportIDAdmins) {
            return [translate('workspace.accounting.talkYourOnboardingSpecialist'), policy?.chatReportIDAdmins];
        }
        // If not, if they have an account manager assigned display the following and link to the DM with their account manager.
        if (account?.accountManagerAccountID) {
            return [translate('workspace.accounting.talkYourAccountManager'), account?.accountManagerReportID];
        }
        // Else, display the following and link to their Concierge DM.
        return [translate('workspace.accounting.talkToConcierge'), conciergeReportID];
    }, [account?.accountManagerAccountID, account?.accountManagerReportID, conciergeReportID, policy?.chatReportIDAdmins, translate]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}>
            <ScreenWrapper_1.default testID={PolicyAccountingPage.displayName} shouldShowOfflineIndicatorInWideScreen>
                <HeaderWithBackButton_1.default title={translate('workspace.common.accounting')} shouldShowBackButton={shouldUseNarrowLayout} icon={Illustrations.Accounting} shouldUseHeadlineHeader onBackButtonPress={Navigation_1.default.popToSidebar}/>
                <ScrollView_1.default contentContainerStyle={styles.pt3} addBottomSafeAreaPadding>
                    <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                        <Section_1.default title={translate('workspace.accounting.title')} subtitle={translate('workspace.accounting.subtitle')} isCentralPane subtitleMuted titleStyles={styles.accountSettingsSectionTitle} childrenStyles={styles.pt5}>
                            {!hasUnsupportedNDIntegration &&
            connectionsMenuItems.map((menuItem) => (<OfflineWithFeedback_1.default pendingAction={menuItem.pendingAction} key={menuItem.title} shouldDisableStrikeThrough>
                                        <MenuItem_1.default brickRoadIndicator={menuItem.brickRoadIndicator} key={menuItem.title} 
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...menuItem}/>
                                    </OfflineWithFeedback_1.default>))}
                            {hasUnsupportedNDIntegration && hasSyncError && !!policyID && (<FormHelpMessage_1.default isError style={styles.menuItemError}>
                                    <Text_1.default style={[{ color: theme.textError }]}>
                                        {translate('workspace.accounting.errorODIntegration')}
                                        <TextLink_1.default onPress={() => {
                // Go to Expensify Classic.
                (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.POLICY_CONNECTIONS_URL(policyID));
            }}>
                                            {translate('workspace.accounting.goToODToFix')}
                                        </TextLink_1.default>
                                    </Text_1.default>
                                </FormHelpMessage_1.default>)}
                            {hasUnsupportedNDIntegration && !hasSyncError && !!policyID && (<FormHelpMessage_1.default shouldShowRedDotIndicator={false}>
                                    <Text_1.default>
                                        <TextLink_1.default onPress={() => {
                // Go to Expensify Classic.
                (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.POLICY_CONNECTIONS_URL(policyID));
            }}>
                                            {translate('workspace.accounting.goToODToSettings')}
                                        </TextLink_1.default>
                                    </Text_1.default>
                                </FormHelpMessage_1.default>)}
                            {!!otherIntegrationsItems && (<CollapsibleSection_1.default title={translate('workspace.accounting.other')} wrapperStyle={[styles.pr3, styles.mt5, styles.pv3]} titleStyle={[styles.textNormal, styles.colorMuted]} textStyle={[styles.flex1, styles.userSelectNone, styles.textNormal, styles.colorMuted]}>
                                    <MenuItemList_1.default menuItems={otherIntegrationsItems} shouldUseSingleExecution/>
                                </CollapsibleSection_1.default>)}
                            {!!account?.guideDetails?.email && !(0, PolicyUtils_1.hasAccountingConnections)(policy) && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mt7]}>
                                    <Icon_1.default src={Expensicons.QuestionMark} width={20} height={20} fill={theme.icon} additionalStyles={styles.mr3}/>
                                    <react_native_1.View style={[!isLargeScreenWidth ? styles.flexColumn : styles.flexRow]}>
                                        <Text_1.default style={styles.textSupporting}>{translate('workspace.accounting.needAnotherAccounting')}</Text_1.default>
                                        <TextLink_1.default onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(String(chatReportID)))}>{chatTextLink}</TextLink_1.default>
                                    </react_native_1.View>
                                </react_native_1.View>)}
                        </Section_1.default>
                    </react_native_1.View>
                </ScrollView_1.default>
                <ConfirmModal_1.default title={translate('workspace.accounting.disconnectTitle', { connectionName: connectedIntegration })} isVisible={isDisconnectModalOpen} onConfirm={() => {
            if (connectedIntegration && policyID) {
                (0, connections_1.removePolicyConnection)(policy, connectedIntegration);
            }
            setIsDisconnectModalOpen(false);
        }} onCancel={() => setIsDisconnectModalOpen(false)} prompt={translate('workspace.accounting.disconnectPrompt', { connectionName: connectedIntegration })} confirmText={translate('workspace.accounting.disconnect')} cancelText={translate('common.cancel')} danger/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
function PolicyAccountingPageWrapper(props) {
    return (<AccountingContext_1.AccountingContextProvider policy={props.policy}>
            <PolicyAccountingPage 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>
        </AccountingContext_1.AccountingContextProvider>);
}
PolicyAccountingPage.displayName = 'PolicyAccountingPage';
exports.default = (0, withPolicyConnections_1.default)(PolicyAccountingPageWrapper);
