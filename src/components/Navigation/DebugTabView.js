"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useIndicatorStatus_1 = require("@hooks/useIndicatorStatus");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSidebarOrderedReports_1 = require("@hooks/useSidebarOrderedReports");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReimbursementAccountUtils_1 = require("@libs/ReimbursementAccountUtils");
const WorkspacesSettingsUtils_1 = require("@libs/WorkspacesSettingsUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const NAVIGATION_TABS_1 = require("./NavigationTabBar/NAVIGATION_TABS");
function getSettingsMessage(status) {
    switch (status) {
        case CONST_1.default.INDICATOR_STATUS.HAS_CUSTOM_UNITS_ERROR:
            return 'debug.indicatorStatus.theresAWorkspaceWithCustomUnitsErrors';
        case CONST_1.default.INDICATOR_STATUS.HAS_EMPLOYEE_LIST_ERROR:
            return 'debug.indicatorStatus.theresAProblemWithAWorkspaceMember';
        case CONST_1.default.INDICATOR_STATUS.HAS_QBO_EXPORT_ERROR:
            return 'debug.indicatorStatus.theresAProblemWithAWorkspaceQBOExport';
        case CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_ERROR:
            return 'debug.indicatorStatus.theresAProblemWithAContactMethod';
        case CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_INFO:
            return 'debug.indicatorStatus.aContactMethodRequiresVerification';
        case CONST_1.default.INDICATOR_STATUS.HAS_PAYMENT_METHOD_ERROR:
            return 'debug.indicatorStatus.theresAProblemWithAPaymentMethod';
        case CONST_1.default.INDICATOR_STATUS.HAS_POLICY_ERRORS:
            return 'debug.indicatorStatus.theresAProblemWithAWorkspace';
        case CONST_1.default.INDICATOR_STATUS.HAS_REIMBURSEMENT_ACCOUNT_ERRORS:
            return 'debug.indicatorStatus.theresAProblemWithYourReimbursementAccount';
        case CONST_1.default.INDICATOR_STATUS.HAS_SUBSCRIPTION_ERRORS:
            return 'debug.indicatorStatus.theresABillingProblemWithYourSubscription';
        case CONST_1.default.INDICATOR_STATUS.HAS_SUBSCRIPTION_INFO:
            return 'debug.indicatorStatus.yourSubscriptionHasBeenSuccessfullyRenewed';
        case CONST_1.default.INDICATOR_STATUS.HAS_SYNC_ERRORS:
            return 'debug.indicatorStatus.theresWasAProblemDuringAWorkspaceConnectionSync';
        case CONST_1.default.INDICATOR_STATUS.HAS_USER_WALLET_ERRORS:
            return 'debug.indicatorStatus.theresAProblemWithYourWallet';
        case CONST_1.default.INDICATOR_STATUS.HAS_WALLET_TERMS_ERRORS:
            return 'debug.indicatorStatus.theresAProblemWithYourWalletTerms';
        default:
            return undefined;
    }
}
function getSettingsRoute(status, reimbursementAccount, policyIDWithErrors = '') {
    switch (status) {
        case CONST_1.default.INDICATOR_STATUS.HAS_CUSTOM_UNITS_ERROR:
            return ROUTES_1.default.WORKSPACE_DISTANCE_RATES.getRoute(policyIDWithErrors);
        case CONST_1.default.INDICATOR_STATUS.HAS_EMPLOYEE_LIST_ERROR:
            return ROUTES_1.default.WORKSPACE_MEMBERS.getRoute(policyIDWithErrors);
        case CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_ERROR:
            return ROUTES_1.default.SETTINGS_CONTACT_METHODS.route;
        case CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_INFO:
            return ROUTES_1.default.SETTINGS_CONTACT_METHODS.route;
        case CONST_1.default.INDICATOR_STATUS.HAS_PAYMENT_METHOD_ERROR:
            return ROUTES_1.default.SETTINGS_WALLET;
        case CONST_1.default.INDICATOR_STATUS.HAS_POLICY_ERRORS:
            return ROUTES_1.default.WORKSPACE_INITIAL.getRoute(policyIDWithErrors);
        case CONST_1.default.INDICATOR_STATUS.HAS_REIMBURSEMENT_ACCOUNT_ERRORS:
            return ROUTES_1.default.BANK_ACCOUNT_WITH_STEP_TO_OPEN.getRoute(reimbursementAccount?.achData?.policyID, (0, ReimbursementAccountUtils_1.getRouteForCurrentStep)(reimbursementAccount?.achData?.currentStep ?? CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT));
        case CONST_1.default.INDICATOR_STATUS.HAS_SUBSCRIPTION_ERRORS:
            return ROUTES_1.default.SETTINGS_SUBSCRIPTION.route;
        case CONST_1.default.INDICATOR_STATUS.HAS_SUBSCRIPTION_INFO:
            return ROUTES_1.default.SETTINGS_SUBSCRIPTION.route;
        case CONST_1.default.INDICATOR_STATUS.HAS_SYNC_ERRORS:
            return ROUTES_1.default.WORKSPACE_ACCOUNTING.getRoute(policyIDWithErrors);
        case CONST_1.default.INDICATOR_STATUS.HAS_USER_WALLET_ERRORS:
            return ROUTES_1.default.SETTINGS_WALLET;
        case CONST_1.default.INDICATOR_STATUS.HAS_WALLET_TERMS_ERRORS:
            return ROUTES_1.default.SETTINGS_WALLET;
        default:
            return undefined;
    }
}
function DebugTabView({ selectedTab, chatTabBrickRoad }) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: true });
    const [reportAttributes] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { selector: (value) => value?.reports, canBeMissing: true });
    const { status, indicatorColor, policyIDWithErrors } = (0, useIndicatorStatus_1.default)();
    const { orderedReportIDs } = (0, useSidebarOrderedReports_1.useSidebarOrderedReports)();
    const message = (0, react_1.useMemo)(() => {
        if (selectedTab === NAVIGATION_TABS_1.default.HOME) {
            if (chatTabBrickRoad === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO) {
                return 'debug.indicatorStatus.theresAReportAwaitingAction';
            }
            if (chatTabBrickRoad === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR) {
                return 'debug.indicatorStatus.theresAReportWithErrors';
            }
        }
        if (selectedTab === NAVIGATION_TABS_1.default.SETTINGS || selectedTab === NAVIGATION_TABS_1.default.WORKSPACES) {
            return getSettingsMessage(status);
        }
    }, [selectedTab, chatTabBrickRoad, status]);
    const indicator = (0, react_1.useMemo)(() => {
        if (selectedTab === NAVIGATION_TABS_1.default.HOME) {
            if (chatTabBrickRoad === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO) {
                return theme.success;
            }
            if (chatTabBrickRoad === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR) {
                return theme.danger;
            }
        }
        if (selectedTab === NAVIGATION_TABS_1.default.SETTINGS || selectedTab === NAVIGATION_TABS_1.default.WORKSPACES) {
            if (status) {
                return indicatorColor;
            }
        }
    }, [selectedTab, chatTabBrickRoad, theme.success, theme.danger, status, indicatorColor]);
    const navigateTo = (0, react_1.useCallback)(() => {
        if (selectedTab === NAVIGATION_TABS_1.default.HOME && !!chatTabBrickRoad) {
            const reportID = (0, WorkspacesSettingsUtils_1.getChatTabBrickRoadReportID)(orderedReportIDs, reportAttributes);
            if (reportID) {
                Navigation_1.default.navigate(ROUTES_1.default.DEBUG_REPORT.getRoute(reportID));
            }
        }
        if (selectedTab === NAVIGATION_TABS_1.default.SETTINGS) {
            const route = getSettingsRoute(status, reimbursementAccount, policyIDWithErrors);
            if (route) {
                Navigation_1.default.navigate(route);
            }
        }
    }, [selectedTab, chatTabBrickRoad, orderedReportIDs, reportAttributes, status, reimbursementAccount, policyIDWithErrors]);
    if (![NAVIGATION_TABS_1.default.HOME, NAVIGATION_TABS_1.default.SETTINGS, NAVIGATION_TABS_1.default.WORKSPACES].includes(selectedTab ?? '') || !indicator) {
        return null;
    }
    return (<react_native_1.View testID={DebugTabView.displayName} style={[StyleUtils.getBackgroundColorStyle(theme.cardBG), styles.p3, styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter]}>
            <react_native_1.View style={[styles.flexRow, styles.gap2, styles.flex1, styles.alignItemsCenter]}>
                <Icon_1.default src={Expensicons.DotIndicator} fill={indicator}/>
                {!!message && <Text_1.default style={[StyleUtils.getColorStyle(theme.text), styles.lh20]}>{translate(message)}</Text_1.default>}
            </react_native_1.View>
            <Button_1.default text={translate('common.view')} onPress={navigateTo}/>
        </react_native_1.View>);
}
DebugTabView.displayName = 'DebugTabView';
exports.default = DebugTabView;
