"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_2 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const WorkspacePageWithSections_1 = require("@pages/workspace/WorkspacePageWithSections");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const policies_1 = require("../utils/collections/policies");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
const POLICY_ID = 1;
// Mock navigation hooks
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useIsFocused: () => true,
        useRoute: () => ({
            key: 'test-route',
            name: 'WORKSPACE_INITIAL',
            params: { policyID: POLICY_ID.toString() },
        }),
        usePreventRemove: jest.fn(),
    };
});
// Mock useResponsiveLayout hook
jest.mock('@src/hooks/useResponsiveLayout');
// Mock FullScreenLoadingIndicator
jest.mock('@components/FullscreenLoadingIndicator', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ReactNative = require('react-native');
    return () => {
        return <ReactNative.View testID="FullScreenLoadingIndicator"/>;
    };
});
const mockPolicy = { ...(0, policies_1.default)(POLICY_ID), type: CONST_1.default.POLICY.TYPE.CORPORATE, pendingAction: null, role: CONST_1.default.POLICY.ROLE.ADMIN };
const renderWorkspacePageWithSections = (props = {}) => {
    const defaultProps = {
        headerText: 'Test Workspace',
        route: {
            key: 'test-route',
            name: SCREENS_1.default.WORKSPACE.INITIAL,
            params: { policyID: POLICY_ID.toString() },
        },
        policy: mockPolicy,
        ...props,
    };
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider]}>
            <WorkspacePageWithSections_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...defaultProps}>
                <react_native_2.View />
            </WorkspacePageWithSections_1.default>
        </ComposeProviders_1.default>);
};
describe('WorkspacePageWithSections', () => {
    describe('FullScreenLoadingIndicator behavior', () => {
        beforeAll(() => {
            react_native_onyx_1.default.init({
                keys: ONYXKEYS_1.default,
            });
            react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`, mockPolicy);
            return (0, waitForBatchedUpdates_1.default)();
        });
        afterEach(() => {
            jest.clearAllMocks();
            return react_native_onyx_1.default.clear();
        });
        it('should not display FullScreenLoadingIndicator when user is offline', async () => {
            // Given the network state is offline
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: true });
            // When render the component with loading enabled
            renderWorkspacePageWithSections({
                shouldShowLoading: true,
                isLoading: true,
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then the FullScreenLoadingIndicator should not be displayed
            expect(react_native_1.screen.queryByTestId('FullScreenLoadingIndicator')).toBeNull();
        });
        it('should display FullScreenLoadingIndicator when user is online and loading', async () => {
            // Given the network state is online
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false });
            // When render the component with loading enabled
            renderWorkspacePageWithSections({
                shouldShowLoading: true,
                isLoading: true,
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then the FullScreenLoadingIndicator should be displayed
            expect(react_native_1.screen.getByTestId('FullScreenLoadingIndicator')).toBeTruthy();
        });
    });
});
