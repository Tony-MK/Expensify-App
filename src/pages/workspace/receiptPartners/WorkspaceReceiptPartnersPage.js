"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const MenuItem_1 = require("@components/MenuItem");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
const useIsPolicyConnectedToUberReceiptPartner_1 = require("@hooks/useIsPolicyConnectedToUberReceiptPartner");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Link_1 = require("@userActions/Link");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const utils_1 = require("./utils");
function WorkspaceReceiptPartnersPage({ route }) {
    const policyID = route.params.policyID;
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const receiptPartnerNames = CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME;
    const receiptPartnerIntegrations = Object.values(receiptPartnerNames);
    const { isOffline } = (0, useNetwork_1.default)();
    const threeDotsMenuContainerRef = (0, react_1.useRef)(null);
    const policy = (0, usePolicy_1.default)(policyID);
    const theme = (0, useTheme_1.default)();
    const [selectedPartner, setSelectedPartner] = (0, react_1.useState)(null);
    const isLoading = policy?.isLoading;
    const [isDisconnectModalOpen, setIsDisconnectModalOpen] = (0, react_1.useState)(false);
    const integrations = policy?.receiptPartners;
    const isAutoRemove = !!integrations?.uber?.autoRemove;
    const isAutoInvite = !!integrations?.uber?.autoInvite;
    const isUberConnected = (0, useIsPolicyConnectedToUberReceiptPartner_1.default)({ policyID });
    const startIntegrationFlow = (0, react_1.useCallback)(({ name }) => {
        switch (name) {
            case CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME.UBER: {
                (0, Link_1.openExternalLink)(`${CONST_1.default.UBER_CONNECT_URL}?${integrations?.uber?.connectFormData}`);
                break;
            }
            default: {
                break;
            }
        }
    }, [integrations]);
    const fetchReceiptPartners = (0, react_1.useCallback)(() => {
        (0, Policy_1.openPolicyReceiptPartnersPage)(policyID);
    }, [policyID]);
    (0, react_1.useEffect)(() => {
        fetchReceiptPartners();
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const calculateAndSetThreeDotsMenuPosition = (0, react_1.useCallback)(() => {
        if (shouldUseNarrowLayout) {
            return Promise.resolve({ horizontal: 0, vertical: 0 });
        }
        return new Promise((resolve) => {
            threeDotsMenuContainerRef.current?.measureInWindow((x, y, width, height) => {
                resolve({
                    horizontal: x + width,
                    vertical: y + height,
                });
            });
        });
    }, [shouldUseNarrowLayout]);
    const toggleWorkspaceUberAutoInvite = (0, react_1.useCallback)(() => {
        (0, Policy_1.togglePolicyUberAutoInvite)(policyID, !isAutoInvite);
    }, [isAutoInvite, policyID]);
    const toggleWorkspaceUberAutoRemove = (0, react_1.useCallback)(() => {
        (0, Policy_1.togglePolicyUberAutoRemove)(policyID, !isAutoRemove);
    }, [isAutoRemove, policyID]);
    const getOverflowMenu = (0, react_1.useCallback)((integration) => {
        switch (integration) {
            case CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME.UBER:
                return [
                    {
                        icon: Expensicons.Key,
                        text: translate('workspace.accounting.enterCredentials'),
                        onSelected: () => startIntegrationFlow({ name: CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME.UBER }),
                        shouldCallAfterModalHide: true,
                        disabled: isOffline,
                        iconRight: Expensicons.NewWindow,
                    },
                    {
                        icon: Expensicons.Trashcan,
                        text: translate('workspace.accounting.disconnect'),
                        onSelected: () => {
                            setIsDisconnectModalOpen(true);
                            setSelectedPartner(CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME.UBER);
                        },
                        shouldCallAfterModalHide: true,
                    },
                ];
            default:
                return [];
        }
    }, [translate, isOffline, startIntegrationFlow]);
    const onCloseModal = (0, react_1.useCallback)(() => {
        setIsDisconnectModalOpen(false);
        setSelectedPartner(null);
    }, []);
    const onDisconnectPartner = (0, react_1.useCallback)(() => {
        if (!policyID || !selectedPartner) {
            return;
        }
        (0, Policy_1.removePolicyReceiptPartnersConnection)(policyID, selectedPartner, integrations?.[selectedPartner]);
        onCloseModal();
    }, [policyID, selectedPartner, integrations, onCloseModal]);
    const connectionsMenuItems = (0, react_1.useMemo)(() => {
        if (policyID) {
            return receiptPartnerIntegrations
                .map((integration) => {
                const integrationData = (0, utils_1.getReceiptPartnersIntegrationData)(integration, translate);
                if (!integrationData) {
                    return undefined;
                }
                const overflowMenu = getOverflowMenu(integration);
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
                    numberOfLinesDescription: 5,
                    titleContainerStyle: [styles.pr2],
                    description: integrationData?.description,
                    brickRoadIndicator: policy?.receiptPartners?.uber?.errorFields ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                    rightComponent: isUberConnected ? (<react_native_1.View ref={threeDotsMenuContainerRef}>
                                <ThreeDotsMenu_1.default getAnchorPosition={calculateAndSetThreeDotsMenuPosition} menuItems={overflowMenu} anchorAlignment={{
                            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
                        }}/>
                            </react_native_1.View>) : (<Button_1.default onPress={() => startIntegrationFlow({ name: integration })} text={translate('workspace.accounting.setup')} style={styles.justifyContentCenter} small isDisabled={isOffline}/>),
                };
            })
                .filter(Boolean);
        }
        return [];
    }, [
        policyID,
        receiptPartnerIntegrations,
        translate,
        getOverflowMenu,
        styles.sectionMenuItemTopDescription,
        styles.pr2,
        styles.justifyContentCenter,
        policy?.receiptPartners?.uber?.errorFields,
        isUberConnected,
        calculateAndSetThreeDotsMenuPosition,
        isOffline,
        startIntegrationFlow,
    ]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RECEIPT_PARTNERS_ENABLED}>
            {isLoading ? (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={styles.flex1} color={theme.spinner}/>) : (<ScreenWrapper_1.default testID={WorkspaceReceiptPartnersPage.displayName} shouldShowOfflineIndicatorInWideScreen>
                    <HeaderWithBackButton_1.default title={translate('workspace.common.receiptPartners')} shouldShowBackButton={shouldUseNarrowLayout} icon={Illustrations.ReceiptPartners} shouldUseHeadlineHeader onBackButtonPress={Navigation_1.default.popToSidebar}/>
                    <ScrollView_1.default contentContainerStyle={styles.pt3} addBottomSafeAreaPadding>
                        <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                            <Section_1.default title={translate('workspace.accounting.title')} isCentralPane subtitleMuted titleStyles={styles.accountSettingsSectionTitle} childrenStyles={styles.pt5}>
                                {connectionsMenuItems.map((menuItem) => (<OfflineWithFeedback_1.default pendingAction={menuItem.pendingAction} key={menuItem.title} shouldDisableStrikeThrough>
                                        <MenuItem_1.default brickRoadIndicator={menuItem.brickRoadIndicator} key={menuItem.title} 
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...menuItem}/>
                                    </OfflineWithFeedback_1.default>))}
                                {isUberConnected && (<>
                                        <OfflineWithFeedback_1.default pendingAction={integrations?.uber?.pendingFields?.autoInvite}>
                                            <react_native_1.View style={styles.mt5}>
                                                <ToggleSettingsOptionRow_1.default titleStyle={styles.pr3} title={translate('workspace.receiptPartners.uber.autoInvite')} switchAccessibilityLabel={translate('workspace.receiptPartners.uber.autoInvite')} onToggle={toggleWorkspaceUberAutoInvite} isActive={isAutoInvite}/>
                                            </react_native_1.View>
                                        </OfflineWithFeedback_1.default>
                                        <OfflineWithFeedback_1.default pendingAction={integrations?.uber?.pendingFields?.autoRemove}>
                                            <react_native_1.View style={styles.mt5}>
                                                <ToggleSettingsOptionRow_1.default titleStyle={styles.pr3} title={translate('workspace.receiptPartners.uber.autoRemove')} switchAccessibilityLabel={translate('workspace.receiptPartners.uber.autoRemove')} onToggle={toggleWorkspaceUberAutoRemove} isActive={isAutoRemove}/>
                                            </react_native_1.View>
                                        </OfflineWithFeedback_1.default>
                                        <MenuItem_1.default title={translate('workspace.receiptPartners.uber.manageInvites')} shouldShowRightIcon icon={Expensicons.Mail} style={[styles.sectionMenuItemTopDescription, styles.mt6, styles.mbn3]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_RECEIPT_PARTNERS_INVITE_EDIT.getRoute(policyID, CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME.UBER))}/>
                                    </>)}
                            </Section_1.default>
                        </react_native_1.View>
                    </ScrollView_1.default>
                    <ConfirmModal_1.default title={translate('workspace.moreFeatures.receiptPartnersWarningModal.featureEnabledTitle')} isVisible={isDisconnectModalOpen} onConfirm={onDisconnectPartner} onCancel={onCloseModal} prompt={translate('workspace.moreFeatures.receiptPartnersWarningModal.description')} confirmText={translate('workspace.accounting.disconnect')} cancelText={translate('common.cancel')} danger/>
                </ScreenWrapper_1.default>)}
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceReceiptPartnersPage.displayName = 'WorkspaceReceiptPartnersPage';
exports.default = WorkspaceReceiptPartnersPage;
