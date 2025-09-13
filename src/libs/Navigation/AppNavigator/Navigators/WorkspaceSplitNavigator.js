"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CENTRAL_PANE_WORKSPACE_SCREENS = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const FocusTrapForScreen_1 = require("@components/FocusTrap/FocusTrapForScreen");
const GetStateForActionHandlers_1 = require("@libs/Navigation/AppNavigator/createRootStackNavigator/GetStateForActionHandlers");
const createSplitNavigator_1 = require("@libs/Navigation/AppNavigator/createSplitNavigator");
const usePreloadFullScreenNavigators_1 = require("@libs/Navigation/AppNavigator/usePreloadFullScreenNavigators");
const useSplitNavigatorScreenOptions_1 = require("@libs/Navigation/AppNavigator/useSplitNavigatorScreenOptions");
const animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
const SCREENS_1 = require("@src/SCREENS");
const loadWorkspaceInitialPage = () => require('../../../../pages/workspace/WorkspaceInitialPage').default;
const CENTRAL_PANE_WORKSPACE_SCREENS = {
    [SCREENS_1.default.WORKSPACE.PROFILE]: () => require('../../../../pages/workspace/WorkspaceOverviewPage').default,
    [SCREENS_1.default.WORKSPACE.WORKFLOWS]: () => require('../../../../pages/workspace/workflows/WorkspaceWorkflowsPage').default,
    [SCREENS_1.default.WORKSPACE.INVOICES]: () => require('../../../../pages/workspace/invoices/WorkspaceInvoicesPage').default,
    [SCREENS_1.default.WORKSPACE.MEMBERS]: () => require('../../../../pages/workspace/WorkspaceMembersPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.ROOT]: () => require('../../../../pages/workspace/accounting/PolicyAccountingPage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORIES]: () => require('../../../../pages/workspace/categories/WorkspaceCategoriesPage').default,
    [SCREENS_1.default.WORKSPACE.MORE_FEATURES]: () => require('../../../../pages/workspace/WorkspaceMoreFeaturesPage').default,
    [SCREENS_1.default.WORKSPACE.TAGS]: () => require('../../../../pages/workspace/tags/WorkspaceTagsPage').default,
    [SCREENS_1.default.WORKSPACE.TAXES]: () => require('../../../../pages/workspace/taxes/WorkspaceTaxesPage').default,
    [SCREENS_1.default.WORKSPACE.REPORTS]: () => require('../../../../pages/workspace/reports/WorkspaceReportsPage').default,
    [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceExpensifyCardPage').default,
    [SCREENS_1.default.WORKSPACE.COMPANY_CARDS]: () => require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardsPage').default,
    [SCREENS_1.default.WORKSPACE.PER_DIEM]: () => require('../../../../pages/workspace/perDiem/WorkspacePerDiemPage').default,
    [SCREENS_1.default.WORKSPACE.RECEIPT_PARTNERS]: () => require('../../../../pages/workspace/receiptPartners/WorkspaceReceiptPartnersPage').default,
    [SCREENS_1.default.WORKSPACE.DISTANCE_RATES]: () => require('../../../../pages/workspace/distanceRates/PolicyDistanceRatesPage').default,
    [SCREENS_1.default.WORKSPACE.RULES]: () => require('../../../../pages/workspace/rules/PolicyRulesPage').default,
};
exports.CENTRAL_PANE_WORKSPACE_SCREENS = CENTRAL_PANE_WORKSPACE_SCREENS;
const Split = (0, createSplitNavigator_1.default)();
function WorkspaceSplitNavigator({ route, navigation }) {
    const splitNavigatorScreenOptions = (0, useSplitNavigatorScreenOptions_1.default)();
    // This hook preloads the screens of adjacent tabs to make changing tabs faster.
    (0, usePreloadFullScreenNavigators_1.default)();
    (0, react_1.useEffect)(() => {
        const unsubscribe = navigation.addListener('transitionEnd', () => {
            // We want to call this function only once.
            unsubscribe();
            // If we open this screen from a different tab, then it won't have animation.
            if (!GetStateForActionHandlers_1.workspaceSplitsWithoutEnteringAnimation.has(route.key)) {
                return;
            }
            // We want to set animation after mounting so it will animate on going UP to the settings split.
            navigation.setOptions({ animation: animation_1.default.SLIDE_FROM_RIGHT });
        });
        return unsubscribe;
    }, [navigation, route.key]);
    return (<FocusTrapForScreen_1.default>
            <react_native_1.View style={{ flex: 1 }}>
                <Split.Navigator persistentScreens={[SCREENS_1.default.WORKSPACE.INITIAL]} sidebarScreen={SCREENS_1.default.WORKSPACE.INITIAL} defaultCentralScreen={SCREENS_1.default.WORKSPACE.PROFILE} parentRoute={route} screenOptions={splitNavigatorScreenOptions.centralScreen}>
                    <Split.Screen name={SCREENS_1.default.WORKSPACE.INITIAL} getComponent={loadWorkspaceInitialPage} options={splitNavigatorScreenOptions.sidebarScreen}/>
                    {Object.entries(CENTRAL_PANE_WORKSPACE_SCREENS).map(([screenName, componentGetter]) => (<Split.Screen key={screenName} name={screenName} getComponent={componentGetter}/>))}
                </Split.Navigator>
            </react_native_1.View>
        </FocusTrapForScreen_1.default>);
}
WorkspaceSplitNavigator.displayName = 'WorkspaceSplitNavigator';
exports.default = WorkspaceSplitNavigator;
