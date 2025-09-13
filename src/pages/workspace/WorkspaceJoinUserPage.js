"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Member_1 = require("@libs/actions/Policy/Member");
const navigateAfterJoinRequest_1 = require("@libs/navigateAfterJoinRequest");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function WorkspaceJoinUserPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const policyID = route?.params?.policyID;
    const [policy, policyResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const isPolicyLoading = (0, isLoadingOnyxValue_1.default)(policyResult);
    const inviterEmail = route?.params?.email;
    const isUnmounted = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (isUnmounted.current || isPolicyLoading) {
            return;
        }
        if (!(0, EmptyObject_1.isEmptyObject)(policy) && !policy?.isJoinRequestPending && !(0, PolicyUtils_1.isPendingDeletePolicy)(policy)) {
            Navigation_1.default.isNavigationReady().then(() => {
                if (Navigation_1.default.getShouldPopToSidebar()) {
                    Navigation_1.default.popToSidebar();
                }
                else {
                    Navigation_1.default.goBack();
                }
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_INITIAL.getRoute(policyID));
            });
            return;
        }
        (0, Member_1.inviteMemberToWorkspace)(policyID, inviterEmail);
        Navigation_1.default.isNavigationReady().then(() => {
            if (isUnmounted.current) {
                return;
            }
            (0, navigateAfterJoinRequest_1.default)();
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we only want to run this once after the policy loads
    }, [isPolicyLoading]);
    (0, react_1.useEffect)(() => () => {
        isUnmounted.current = true;
    }, []);
    return (<ScreenWrapper_1.default testID={WorkspaceJoinUserPage.displayName}>
            <FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>
        </ScreenWrapper_1.default>);
}
WorkspaceJoinUserPage.displayName = 'WorkspaceJoinUserPage';
exports.default = WorkspaceJoinUserPage;
