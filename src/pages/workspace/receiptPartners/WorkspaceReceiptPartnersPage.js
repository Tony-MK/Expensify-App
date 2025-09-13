"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var ConfirmModal_1 = require("@components/ConfirmModal");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Expensicons = require("@components/Icon/Expensicons");
var Illustrations = require("@components/Icon/Illustrations");
var MenuItem_1 = require("@components/MenuItem");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ScrollView_1 = require("@components/ScrollView");
var Section_1 = require("@components/Section");
var ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
var useIsPolicyConnectedToUberReceiptPartner_1 = require("@hooks/useIsPolicyConnectedToUberReceiptPartner");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var usePolicy_1 = require("@hooks/usePolicy");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Navigation_1 = require("@navigation/Navigation");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
var Link_1 = require("@userActions/Link");
var Policy_1 = require("@userActions/Policy/Policy");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
var utils_1 = require("./utils");
function WorkspaceReceiptPartnersPage(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var route = _a.route;
    var policyID = route.params.policyID;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var receiptPartnerNames = CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME;
    var receiptPartnerIntegrations = Object.values(receiptPartnerNames);
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var threeDotsMenuContainerRef = (0, react_1.useRef)(null);
    var policy = (0, usePolicy_1.default)(policyID);
    var theme = (0, useTheme_1.default)();
    var _k = (0, react_1.useState)(null), selectedPartner = _k[0], setSelectedPartner = _k[1];
    var isLoading = policy === null || policy === void 0 ? void 0 : policy.isLoading;
    var _l = (0, react_1.useState)(false), isDisconnectModalOpen = _l[0], setIsDisconnectModalOpen = _l[1];
    var integrations = policy === null || policy === void 0 ? void 0 : policy.receiptPartners;
    var isAutoRemove = !!((_b = integrations === null || integrations === void 0 ? void 0 : integrations.uber) === null || _b === void 0 ? void 0 : _b.autoRemove);
    var isAutoInvite = !!((_c = integrations === null || integrations === void 0 ? void 0 : integrations.uber) === null || _c === void 0 ? void 0 : _c.autoInvite);
    var isUberConnected = (0, useIsPolicyConnectedToUberReceiptPartner_1.default)({ policyID: policyID });
    var startIntegrationFlow = (0, react_1.useCallback)(function (_a) {
        var _b;
        var name = _a.name;
        switch (name) {
            case CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME.UBER: {
                (0, Link_1.openExternalLink)("".concat(CONST_1.default.UBER_CONNECT_URL, "?").concat((_b = integrations === null || integrations === void 0 ? void 0 : integrations.uber) === null || _b === void 0 ? void 0 : _b.connectFormData));
                break;
            }
            default: {
                break;
            }
        }
    }, [integrations]);
    var fetchReceiptPartners = (0, react_1.useCallback)(function () {
        (0, Policy_1.openPolicyReceiptPartnersPage)(policyID);
    }, [policyID]);
    (0, react_1.useEffect)(function () {
        fetchReceiptPartners();
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var calculateAndSetThreeDotsMenuPosition = (0, react_1.useCallback)(function () {
        if (shouldUseNarrowLayout) {
            return Promise.resolve({ horizontal: 0, vertical: 0 });
        }
        return new Promise(function (resolve) {
            var _a;
            (_a = threeDotsMenuContainerRef.current) === null || _a === void 0 ? void 0 : _a.measureInWindow(function (x, y, width, height) {
                resolve({
                    horizontal: x + width,
                    vertical: y + height,
                });
            });
        });
    }, [shouldUseNarrowLayout]);
    var toggleWorkspaceUberAutoInvite = (0, react_1.useCallback)(function () {
        (0, Policy_1.togglePolicyUberAutoInvite)(policyID, !isAutoInvite);
    }, [isAutoInvite, policyID]);
    var toggleWorkspaceUberAutoRemove = (0, react_1.useCallback)(function () {
        (0, Policy_1.togglePolicyUberAutoRemove)(policyID, !isAutoRemove);
    }, [isAutoRemove, policyID]);
    var getOverflowMenu = (0, react_1.useCallback)(function (integration) {
        switch (integration) {
            case CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME.UBER:
                return [
                    {
                        icon: Expensicons.Key,
                        text: translate('workspace.accounting.enterCredentials'),
                        onSelected: function () { return startIntegrationFlow({ name: CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME.UBER }); },
                        shouldCallAfterModalHide: true,
                        disabled: isOffline,
                        iconRight: Expensicons.NewWindow,
                    },
                    {
                        icon: Expensicons.Trashcan,
                        text: translate('workspace.accounting.disconnect'),
                        onSelected: function () {
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
    var onCloseModal = (0, react_1.useCallback)(function () {
        setIsDisconnectModalOpen(false);
        setSelectedPartner(null);
    }, []);
    var onDisconnectPartner = (0, react_1.useCallback)(function () {
        if (!policyID || !selectedPartner) {
            return;
        }
        (0, Policy_1.removePolicyReceiptPartnersConnection)(policyID, selectedPartner, integrations === null || integrations === void 0 ? void 0 : integrations[selectedPartner]);
        onCloseModal();
    }, [policyID, selectedPartner, integrations, onCloseModal]);
    var connectionsMenuItems = (0, react_1.useMemo)(function () {
        if (policyID) {
            return receiptPartnerIntegrations
                .map(function (integration) {
                var _a, _b;
                var integrationData = (0, utils_1.getReceiptPartnersIntegrationData)(integration, translate);
                if (!integrationData) {
                    return undefined;
                }
                var overflowMenu = getOverflowMenu(integration);
                var iconProps = (integrationData === null || integrationData === void 0 ? void 0 : integrationData.icon)
                    ? {
                        icon: integrationData.icon,
                        iconType: CONST_1.default.ICON_TYPE_AVATAR,
                    }
                    : {};
                return __assign(__assign({}, iconProps), { interactive: false, wrapperStyle: [styles.sectionMenuItemTopDescription], shouldShowRightComponent: true, title: integrationData === null || integrationData === void 0 ? void 0 : integrationData.title, numberOfLinesDescription: 5, titleContainerStyle: [styles.pr2], description: integrationData === null || integrationData === void 0 ? void 0 : integrationData.description, brickRoadIndicator: ((_b = (_a = policy === null || policy === void 0 ? void 0 : policy.receiptPartners) === null || _a === void 0 ? void 0 : _a.uber) === null || _b === void 0 ? void 0 : _b.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined, rightComponent: isUberConnected ? (<react_native_1.View ref={threeDotsMenuContainerRef}>
                                <ThreeDotsMenu_1.default getAnchorPosition={calculateAndSetThreeDotsMenuPosition} menuItems={overflowMenu} anchorAlignment={{
                            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
                        }}/>
                            </react_native_1.View>) : (<Button_1.default onPress={function () { return startIntegrationFlow({ name: integration }); }} text={translate('workspace.accounting.setup')} style={styles.justifyContentCenter} small isDisabled={isOffline}/>) });
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
        (_e = (_d = policy === null || policy === void 0 ? void 0 : policy.receiptPartners) === null || _d === void 0 ? void 0 : _d.uber) === null || _e === void 0 ? void 0 : _e.errorFields,
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
                                {connectionsMenuItems.map(function (menuItem) { return (<OfflineWithFeedback_1.default pendingAction={menuItem.pendingAction} key={menuItem.title} shouldDisableStrikeThrough>
                                        <MenuItem_1.default brickRoadIndicator={menuItem.brickRoadIndicator} key={menuItem.title} 
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...menuItem}/>
                                    </OfflineWithFeedback_1.default>); })}
                                {isUberConnected && (<>
                                        <OfflineWithFeedback_1.default pendingAction={(_g = (_f = integrations === null || integrations === void 0 ? void 0 : integrations.uber) === null || _f === void 0 ? void 0 : _f.pendingFields) === null || _g === void 0 ? void 0 : _g.autoInvite}>
                                            <react_native_1.View style={styles.mt5}>
                                                <ToggleSettingsOptionRow_1.default titleStyle={styles.pr3} title={translate('workspace.receiptPartners.uber.autoInvite')} switchAccessibilityLabel={translate('workspace.receiptPartners.uber.autoInvite')} onToggle={toggleWorkspaceUberAutoInvite} isActive={isAutoInvite}/>
                                            </react_native_1.View>
                                        </OfflineWithFeedback_1.default>
                                        <OfflineWithFeedback_1.default pendingAction={(_j = (_h = integrations === null || integrations === void 0 ? void 0 : integrations.uber) === null || _h === void 0 ? void 0 : _h.pendingFields) === null || _j === void 0 ? void 0 : _j.autoRemove}>
                                            <react_native_1.View style={styles.mt5}>
                                                <ToggleSettingsOptionRow_1.default titleStyle={styles.pr3} title={translate('workspace.receiptPartners.uber.autoRemove')} switchAccessibilityLabel={translate('workspace.receiptPartners.uber.autoRemove')} onToggle={toggleWorkspaceUberAutoRemove} isActive={isAutoRemove}/>
                                            </react_native_1.View>
                                        </OfflineWithFeedback_1.default>
                                        <MenuItem_1.default title={translate('workspace.receiptPartners.uber.manageInvites')} shouldShowRightIcon icon={Expensicons.Mail} style={[styles.sectionMenuItemTopDescription, styles.mt6, styles.mbn3]} onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_RECEIPT_PARTNERS_INVITE_EDIT.getRoute(policyID, CONST_1.default.POLICY.RECEIPT_PARTNERS.NAME.UBER)); }}/>
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
