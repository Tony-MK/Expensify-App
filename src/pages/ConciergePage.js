"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ReportActionsSkeletonView_1 = require("@components/ReportActionsSkeletonView");
const ReportHeaderSkeletonView_1 = require("@components/ReportHeaderSkeletonView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const App_1 = require("@libs/actions/App");
const Report_1 = require("@libs/actions/Report");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
/*
 * This is a "utility page", that does this:
 *     - If the user is authenticated, find their concierge chat and re-route to it
 *     - Else re-route to the login page
 */
function ConciergePage() {
    const styles = (0, useThemeStyles_1.default)();
    const isUnmounted = (0, react_1.useRef)(false);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [isLoadingReportData = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_REPORT_DATA, { canBeMissing: true });
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (session && 'authToken' in session) {
            (0, App_1.confirmReadyToOpenApp)();
            Navigation_1.default.isNavigationReady().then(() => {
                if (isUnmounted.current || isLoadingReportData === undefined || !!isLoadingReportData) {
                    return;
                }
                (0, Report_1.navigateToConciergeChat)(true, () => !isUnmounted.current);
            });
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.HOME);
        }
    }, [session, isLoadingReportData]));
    (0, react_1.useEffect)(() => {
        isUnmounted.current = false;
        return () => {
            isUnmounted.current = true;
        };
    }, []);
    return (<ScreenWrapper_1.default testID={ConciergePage.displayName}>
            <react_native_1.View style={[styles.borderBottom, styles.appContentHeader]}>
                <ReportHeaderSkeletonView_1.default onBackButtonPress={Navigation_1.default.goBack}/>
            </react_native_1.View>
            <ReportActionsSkeletonView_1.default />
        </ScreenWrapper_1.default>);
}
ConciergePage.displayName = 'ConciergePage';
exports.default = ConciergePage;
