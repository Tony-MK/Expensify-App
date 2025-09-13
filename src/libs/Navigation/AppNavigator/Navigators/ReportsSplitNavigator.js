"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const usePermissions_1 = require("@hooks/usePermissions");
const createSplitNavigator_1 = require("@libs/Navigation/AppNavigator/createSplitNavigator");
const FreezeWrapper_1 = require("@libs/Navigation/AppNavigator/FreezeWrapper");
const usePreloadFullScreenNavigators_1 = require("@libs/Navigation/AppNavigator/usePreloadFullScreenNavigators");
const useSplitNavigatorScreenOptions_1 = require("@libs/Navigation/AppNavigator/useSplitNavigatorScreenOptions");
const currentUrl_1 = require("@libs/Navigation/currentUrl");
const shouldOpenOnAdminRoom_1 = require("@libs/Navigation/helpers/shouldOpenOnAdminRoom");
const ReportUtils = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const SCREENS_1 = require("@src/SCREENS");
const loadReportScreen = () => require('@pages/home/ReportScreen').default;
const loadSidebarScreen = () => require('@pages/home/sidebar/BaseSidebarScreen').default;
const Split = (0, createSplitNavigator_1.default)();
/**
 * This SplitNavigator includes the HOME screen (<BaseSidebarScreen /> component) with a list of reports as a sidebar screen and the REPORT screen displayed as a central one.
 * There can be multiple report screens in the stack with different report IDs.
 */
function ReportsSplitNavigator({ route }) {
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const splitNavigatorScreenOptions = (0, useSplitNavigatorScreenOptions_1.default)();
    const [initialReportID] = (0, react_1.useState)(() => {
        const currentURL = (0, currentUrl_1.default)();
        const reportIdFromPath = currentURL && new URL(currentURL).pathname.match(CONST_1.default.REGEX.REPORT_ID_FROM_PATH)?.at(1);
        if (reportIdFromPath) {
            return reportIdFromPath;
        }
        const initialReport = ReportUtils.findLastAccessedReport(!isBetaEnabled(CONST_1.default.BETAS.DEFAULT_ROOMS), (0, shouldOpenOnAdminRoom_1.default)());
        // eslint-disable-next-line rulesdir/no-default-id-values
        return initialReport?.reportID ?? '';
    });
    // This hook preloads the screens of adjacent tabs to make changing tabs faster.
    (0, usePreloadFullScreenNavigators_1.default)();
    return (<FreezeWrapper_1.default>
            <Split.Navigator persistentScreens={[SCREENS_1.default.HOME]} sidebarScreen={SCREENS_1.default.HOME} defaultCentralScreen={SCREENS_1.default.REPORT} parentRoute={route} screenOptions={splitNavigatorScreenOptions.centralScreen}>
                <Split.Screen name={SCREENS_1.default.HOME} getComponent={loadSidebarScreen} options={splitNavigatorScreenOptions.sidebarScreen}/>
                <Split.Screen name={SCREENS_1.default.REPORT} initialParams={{ reportID: initialReportID, openOnAdminRoom: (0, shouldOpenOnAdminRoom_1.default)() ? true : undefined }} getComponent={loadReportScreen}/>
            </Split.Navigator>
        </FreezeWrapper_1.default>);
}
ReportsSplitNavigator.displayName = 'ReportsSplitNavigator';
exports.default = ReportsSplitNavigator;
