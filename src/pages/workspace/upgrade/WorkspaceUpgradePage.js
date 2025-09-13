"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const Xero_1 = require("@libs/actions/connections/Xero");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const PerDiem_1 = require("@userActions/Policy/PerDiem");
const CONST_1 = require("@src/CONST");
const Policy_1 = require("@src/libs/actions/Policy/Policy");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const UpgradeConfirmation_1 = require("./UpgradeConfirmation");
const UpgradeIntro_1 = require("./UpgradeIntro");
function getFeatureNameAlias(featureName) {
    switch (featureName) {
        case CONST_1.default.REPORT_FIELDS_FEATURE.qbo.classes:
        case CONST_1.default.REPORT_FIELDS_FEATURE.qbo.customers:
        case CONST_1.default.REPORT_FIELDS_FEATURE.qbo.locations:
        case CONST_1.default.REPORT_FIELDS_FEATURE.xero.mapping:
            return CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.reportFields.alias;
        default: {
            return featureName;
        }
    }
}
function WorkspaceUpgradePage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const policyID = route.params?.policyID;
    const featureNameAlias = route.params?.featureName && getFeatureNameAlias(route.params.featureName);
    const feature = (0, react_1.useMemo)(() => Object.values(CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING)
        .filter((value) => value.id !== CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.policyPreventMemberChangingTitle.id)
        .find((f) => f.alias === featureNameAlias), [featureNameAlias]);
    const { translate } = (0, useLocalize_1.default)();
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const { isOffline } = (0, useNetwork_1.default)();
    const canPerformUpgrade = (0, react_1.useMemo)(() => (0, PolicyUtils_1.canModifyPlan)(policyID), [policyID]);
    const isUpgraded = (0, react_1.useMemo)(() => (0, PolicyUtils_1.isControlPolicy)(policy), [policy]);
    const perDiemCustomUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const categoryId = route.params?.categoryId;
    const goBack = (0, react_1.useCallback)(() => {
        if ((!feature && featureNameAlias !== CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.policyPreventMemberChangingTitle.alias) || !policyID) {
            Navigation_1.default.dismissModal();
            return;
        }
        switch (feature?.id) {
            case CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.approvals.id:
                Navigation_1.default.goBack();
                if (route.params.backTo) {
                    Navigation_1.default.navigate(route.params.backTo);
                }
                return;
            case CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.reportFields.id:
                switch (route.params.featureName) {
                    case CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.reportFields.alias:
                        return Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_REPORTS.getRoute(policyID));
                    default: {
                        Navigation_1.default.goBack();
                        if (route.params.backTo) {
                            Navigation_1.default.navigate(route.params.backTo);
                        }
                        return;
                    }
                }
            case CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.companyCards.id:
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_ADD_NEW.getRoute(policyID, ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SELECT_FEED.getRoute(policyID)));
                return;
            case CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.rules.id:
            case CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.perDiem.id:
                return Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID));
            default:
                return route.params.backTo ? Navigation_1.default.goBack(route.params.backTo) : Navigation_1.default.goBack();
        }
    }, [feature, policyID, route.params?.backTo, route.params?.featureName, featureNameAlias]);
    const onUpgradeToCorporate = () => {
        if (!canPerformUpgrade || !policy) {
            return;
        }
        (0, Policy_1.upgradeToCorporate)(policy.id, feature?.name);
    };
    const confirmUpgrade = (0, react_1.useCallback)(() => {
        if (!policyID) {
            return;
        }
        if (!feature) {
            if (featureNameAlias === CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.policyPreventMemberChangingTitle.alias) {
                (0, Policy_1.setPolicyPreventMemberCreatedTitle)(policyID, true);
            }
            return;
        }
        switch (feature.id) {
            case CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.reportFields.id:
                switch (route.params.featureName) {
                    case CONST_1.default.REPORT_FIELDS_FEATURE.qbo.classes:
                        (0, QuickbooksOnline_1.updateQuickbooksOnlineSyncClasses)(policyID, CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD, qboConfig?.syncClasses);
                        break;
                    case CONST_1.default.REPORT_FIELDS_FEATURE.qbo.customers:
                        (0, QuickbooksOnline_1.updateQuickbooksOnlineSyncCustomers)(policyID, CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD, qboConfig?.syncCustomers);
                        break;
                    case CONST_1.default.REPORT_FIELDS_FEATURE.qbo.locations:
                        (0, QuickbooksOnline_1.updateQuickbooksOnlineSyncLocations)(policyID, CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD, qboConfig?.syncLocations);
                        break;
                    case CONST_1.default.REPORT_FIELDS_FEATURE.xero.mapping: {
                        const { trackingCategories } = policy?.connections?.xero?.data ?? {};
                        const currentTrackingCategory = trackingCategories?.find((category) => category.id === categoryId);
                        const { mappings } = policy?.connections?.xero?.config ?? {};
                        const currentTrackingCategoryValue = currentTrackingCategory ? (mappings?.[`${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${currentTrackingCategory.id}`] ?? '') : '';
                        (0, Xero_1.updateXeroMappings)(policyID, categoryId ? { [`${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${categoryId}`]: CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_OPTIONS.REPORT_FIELD } : {}, categoryId ? { [`${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${categoryId}`]: currentTrackingCategoryValue } : {});
                        break;
                    }
                    default: {
                        (0, Policy_1.enablePolicyReportFields)(policyID, true);
                    }
                }
                break;
            case CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.rules.id:
                (0, Policy_1.enablePolicyRules)(policyID, true, false);
                break;
            case CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.companyCards.id:
                (0, Policy_1.enableCompanyCards)(policyID, true, false);
                break;
            case CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.perDiem.id:
                (0, PerDiem_1.enablePerDiem)(policyID, true, perDiemCustomUnit?.customUnitID, false);
                break;
            default:
        }
    }, [
        categoryId,
        feature,
        perDiemCustomUnit?.customUnitID,
        policy?.connections?.xero?.config,
        policy?.connections?.xero?.data,
        policyID,
        qboConfig?.syncClasses,
        qboConfig?.syncCustomers,
        qboConfig?.syncLocations,
        route.params?.featureName,
        featureNameAlias,
    ]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        return () => {
            if (!isUpgraded || !canPerformUpgrade) {
                return;
            }
            confirmUpgrade();
        };
    }, [isUpgraded, canPerformUpgrade, confirmUpgrade]));
    if (!canPerformUpgrade) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default shouldShowOfflineIndicator testID="workspaceUpgradePage" offlineIndicatorStyle={styles.mtAuto}>
            <HeaderWithBackButton_1.default title={translate('common.upgrade')} onBackButtonPress={() => {
            if (isUpgraded) {
                goBack();
            }
            else {
                Navigation_1.default.goBack();
            }
        }}/>
            <ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
                {!!policy && isUpgraded && (<UpgradeConfirmation_1.default onConfirmUpgrade={goBack} policyName={policy.name}/>)}
                {!isUpgraded && (<UpgradeIntro_1.default policyID={policyID} feature={feature} onUpgrade={onUpgradeToCorporate} buttonDisabled={isOffline} loading={policy?.isPendingUpgrade} backTo={route.params.backTo}/>)}
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
exports.default = WorkspaceUpgradePage;
