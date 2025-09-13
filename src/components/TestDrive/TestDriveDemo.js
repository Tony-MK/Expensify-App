"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const EmbeddedDemo_1 = require("@components/EmbeddedDemo");
const Modal_1 = require("@components/Modal");
const SafeAreaConsumer_1 = require("@components/SafeAreaConsumer");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useOnboardingMessages_1 = require("@hooks/useOnboardingMessages");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Task_1 = require("@libs/actions/Task");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TourUtils_1 = require("@libs/TourUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const TestDriveBanner_1 = require("./TestDriveBanner");
function TestDriveDemo() {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const styles = (0, useThemeStyles_1.default)();
    const [onboarding] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: false });
    const [onboardingReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${onboarding?.chatReportID}`, { canBeMissing: true });
    const [introSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_INTRO_SELECTED, { canBeMissing: true });
    const { testDrive } = (0, useOnboardingMessages_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [isCurrentUserPolicyAdmin = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, {
        canBeMissing: true,
        selector: (policies) => Object.values(policies ?? {}).some((policy) => (0, PolicyUtils_1.isPaidGroupPolicy)(policy) && (0, PolicyUtils_1.isPolicyAdmin)(policy, currentUserPersonalDetails.login)),
    });
    (0, react_1.useEffect)(() => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setIsVisible(true);
            (0, Task_1.completeTestDriveTask)();
        });
        // This should fire only during mount.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const closeModal = (0, react_1.useCallback)(() => {
        setIsVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            Navigation_1.default.goBack();
            if ((0, ReportUtils_1.isAdminRoom)(onboardingReport)) {
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(onboardingReport?.reportID));
            }
        });
    }, [onboardingReport]);
    return (<SafeAreaConsumer_1.default>
            {({ paddingTop, paddingBottom }) => (<Modal_1.default isVisible={isVisible} onClose={closeModal} type={CONST_1.default.MODAL.MODAL_TYPE.FULLSCREEN} style={styles.backgroundWhite} innerContainerStyle={{ ...styles.flex1, marginTop: paddingTop, marginBottom: paddingBottom }} useNativeDriver={false} // We need to disable native driver in order to prevent https://github.com/Expensify/App/issues/61032
        >
                    <TestDriveBanner_1.default onPress={closeModal}/>
                    <FullPageOfflineBlockingView_1.default>
                        <EmbeddedDemo_1.default url={(0, TourUtils_1.getTestDriveURL)(shouldUseNarrowLayout, introSelected, isCurrentUserPolicyAdmin)} iframeTitle={testDrive.EMBEDDED_DEMO_IFRAME_TITLE}/>
                    </FullPageOfflineBlockingView_1.default>
                </Modal_1.default>)}
        </SafeAreaConsumer_1.default>);
}
TestDriveDemo.displayName = 'TestDriveDemo';
exports.default = TestDriveDemo;
