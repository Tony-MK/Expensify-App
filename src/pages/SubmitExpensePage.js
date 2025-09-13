"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ReportActionsSkeletonView_1 = require("@components/ReportActionsSkeletonView");
const ReportHeaderSkeletonView_1 = require("@components/ReportHeaderSkeletonView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const interceptAnonymousUser_1 = require("@libs/interceptAnonymousUser");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils = require("@libs/ReportUtils");
const App = require("@userActions/App");
const IOU = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
/*
 * This is a "utility page", that does this:
 *     - If the user is authenticated, start Submit Expense
 *     - Else re-route to the login page
 */
function SubmitExpensePage() {
    const styles = (0, useThemeStyles_1.default)();
    const isUnmounted = (0, react_1.useRef)(false);
    (0, native_1.useFocusEffect)(() => {
        (0, interceptAnonymousUser_1.default)(() => {
            App.confirmReadyToOpenApp();
            Navigation_1.default.isNavigationReady().then(() => {
                if (isUnmounted.current) {
                    return;
                }
                Navigation_1.default.goBack();
                IOU.startMoneyRequest(CONST_1.default.IOU.TYPE.SUBMIT, ReportUtils.generateReportID());
            });
        });
    });
    (0, react_1.useEffect)(() => () => {
        isUnmounted.current = true;
    }, []);
    return (<ScreenWrapper_1.default testID={SubmitExpensePage.displayName}>
            <react_native_1.View style={[styles.borderBottom]}>
                <ReportHeaderSkeletonView_1.default onBackButtonPress={Navigation_1.default.goBack}/>
            </react_native_1.View>
            <ReportActionsSkeletonView_1.default />
        </ScreenWrapper_1.default>);
}
SubmitExpensePage.displayName = 'SubmitExpensePage';
exports.default = SubmitExpensePage;
