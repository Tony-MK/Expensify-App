"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ReportActionsSkeletonView_1 = require("@components/ReportActionsSkeletonView");
const ReportHeaderSkeletonView_1 = require("@components/ReportHeaderSkeletonView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const interceptAnonymousUser_1 = require("@libs/interceptAnonymousUser");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils = require("@libs/ReportUtils");
const App = require("@userActions/App");
const IOU = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
/*
 * This is a "utility page", that does this:
 *     - If the user is authenticated, find their self DM and and start a Track Expense
 *     - Else re-route to the login page
 */
function TrackExpensePage() {
    const styles = (0, useThemeStyles_1.default)();
    const isUnmounted = (0, react_1.useRef)(false);
    const { isOffline } = (0, useNetwork_1.default)();
    const [hasSeenTrackTraining, hasSeenTrackTrainingResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_HAS_SEEN_TRACK_TRAINING);
    const isLoadingHasSeenTrackTraining = (0, isLoadingOnyxValue_1.default)(hasSeenTrackTrainingResult);
    (0, native_1.useFocusEffect)(() => {
        (0, interceptAnonymousUser_1.default)(() => {
            App.confirmReadyToOpenApp();
            Navigation_1.default.isNavigationReady().then(() => {
                if (isUnmounted.current || isLoadingHasSeenTrackTraining) {
                    return;
                }
                Navigation_1.default.goBack();
                IOU.startMoneyRequest(CONST_1.default.IOU.TYPE.TRACK, 
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                ReportUtils.findSelfDMReportID() || ReportUtils.generateReportID());
                if (!hasSeenTrackTraining && !isOffline) {
                    setTimeout(() => {
                        Navigation_1.default.navigate(ROUTES_1.default.TRACK_TRAINING_MODAL);
                    }, CONST_1.default.ANIMATED_TRANSITION);
                }
            });
        });
    });
    (0, react_1.useEffect)(() => () => {
        isUnmounted.current = true;
    }, []);
    return (<ScreenWrapper_1.default testID={TrackExpensePage.displayName}>
            <react_native_1.View style={[styles.borderBottom]}>
                <ReportHeaderSkeletonView_1.default onBackButtonPress={Navigation_1.default.goBack}/>
            </react_native_1.View>
            <ReportActionsSkeletonView_1.default />
        </ScreenWrapper_1.default>);
}
TrackExpensePage.displayName = 'TrackExpensePage';
exports.default = TrackExpensePage;
