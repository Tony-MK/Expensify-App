"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interceptAnonymousUser_1 = require("@libs/interceptAnonymousUser");
// eslint-disable-next-line no-restricted-syntax
const lastVisitedTabPathUtils = require("@libs/Navigation/helpers/lastVisitedTabPathUtils");
const navigateToWorkspacesPage_1 = require("@libs/Navigation/helpers/navigateToWorkspacesPage");
const Navigation_1 = require("@libs/Navigation/Navigation");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
// eslint-disable-next-line no-restricted-syntax
const PolicyUtils = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const policies_1 = require("../utils/collections/policies");
jest.mock('@libs/Navigation/navigationRef');
jest.mock('@libs/Navigation/Navigation');
jest.mock('@libs/Navigation/helpers/lastVisitedTabPathUtils');
jest.mock('@libs/Navigation/AppNavigator/createSplitNavigator/usePreserveNavigatorState');
jest.mock('@libs/PolicyUtils');
jest.mock('@libs/interceptAnonymousUser');
const fakePolicyID = '344559B2CCF2B6C1';
const mockPolicy = { ...(0, policies_1.default)(0), id: fakePolicyID };
const mockParams = { currentUserLogin: 'test@example.com', shouldUseNarrowLayout: false, policy: mockPolicy };
describe('navigateToWorkspacesPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    function mockIntercept() {
        interceptAnonymousUser_1.default.mockImplementation((callback) => {
            callback();
        });
    }
    it('does nothing if no full screen route', () => {
        navigationRef_1.default.getRootState.mockReturnValue({ routes: [] });
        (0, navigateToWorkspacesPage_1.default)(mockParams);
        expect(Navigation_1.default.navigate).not.toHaveBeenCalled();
        expect(Navigation_1.default.goBack).not.toHaveBeenCalled();
    });
    it('calls goBack if top route is WORKSPACE_SPLIT_NAVIGATOR', () => {
        navigationRef_1.default.getRootState.mockReturnValue({
            routes: [{ name: NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR }],
        });
        (0, navigateToWorkspacesPage_1.default)(mockParams);
        expect(Navigation_1.default.goBack).toHaveBeenCalledWith(ROUTES_1.default.WORKSPACES_LIST.route);
    });
    it('navigates to WORKSPACES_LIST if no valid workspace route exists', () => {
        navigationRef_1.default.getRootState.mockReturnValue({
            routes: [{ name: NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR }],
        });
        lastVisitedTabPathUtils.getWorkspacesTabStateFromSessionStorage.mockReturnValue({
            routes: [{ name: NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR }],
        });
        mockIntercept();
        (0, navigateToWorkspacesPage_1.default)(mockParams);
        expect(Navigation_1.default.navigate).toHaveBeenCalledWith(ROUTES_1.default.WORKSPACES_LIST.route);
    });
    it('dispatches OPEN_WORKSPACE_SPLIT if valid policy and screen exist', () => {
        navigationRef_1.default.getRootState.mockReturnValue({
            routes: [{ name: NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR }],
        });
        lastVisitedTabPathUtils.getWorkspacesTabStateFromSessionStorage.mockReturnValue({
            routes: [
                {
                    name: NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR,
                    state: {
                        routes: [
                            {
                                name: SCREENS_1.default.WORKSPACE.INITIAL,
                                params: { policyID: fakePolicyID },
                            },
                        ],
                    },
                    key: 'someKey',
                },
            ],
        });
        PolicyUtils.shouldShowPolicy.mockReturnValue(true);
        PolicyUtils.isPendingDeletePolicy.mockReturnValue(false);
        lastVisitedTabPathUtils.getLastVisitedWorkspaceTabScreen.mockReturnValue('Workspace_Overview');
        mockIntercept();
        (0, navigateToWorkspacesPage_1.default)(mockParams);
        const dispatch = jest.spyOn(navigationRef_1.default, 'dispatch');
        expect(dispatch).toHaveBeenCalledWith({
            type: CONST_1.default.NAVIGATION.ACTION_TYPE.OPEN_WORKSPACE_SPLIT,
            payload: { policyID: fakePolicyID, screenName: 'Workspace_Overview' },
        });
    });
    it('navigates to WORKSPACES_LIST if policy is pending delete', () => {
        navigationRef_1.default.getRootState.mockReturnValue({
            routes: [{ name: NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR }],
        });
        lastVisitedTabPathUtils.getWorkspacesTabStateFromSessionStorage.mockReturnValue({
            routes: [
                {
                    name: NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR,
                    state: {
                        routes: [
                            {
                                name: SCREENS_1.default.WORKSPACE.INITIAL,
                                params: { policyID: fakePolicyID },
                            },
                        ],
                    },
                },
            ],
        });
        PolicyUtils.shouldShowPolicy.mockReturnValue(true);
        PolicyUtils.isPendingDeletePolicy.mockReturnValue(true);
        mockIntercept();
        (0, navigateToWorkspacesPage_1.default)(mockParams);
        expect(Navigation_1.default.navigate).toHaveBeenCalledWith(ROUTES_1.default.WORKSPACES_LIST.route);
    });
    it('navigates to WORKSPACES_LIST if shouldShowPolicy is false for the user', () => {
        navigationRef_1.default.getRootState.mockReturnValue({
            routes: [{ name: NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR }],
        });
        lastVisitedTabPathUtils.getWorkspacesTabStateFromSessionStorage.mockReturnValue({
            routes: [
                {
                    name: NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR,
                    state: {
                        routes: [
                            {
                                name: SCREENS_1.default.WORKSPACE.INITIAL,
                                params: { policyID: fakePolicyID },
                            },
                        ],
                    },
                },
            ],
        });
        PolicyUtils.shouldShowPolicy.mockReturnValue(false);
        PolicyUtils.isPendingDeletePolicy.mockReturnValue(false);
        mockIntercept();
        (0, navigateToWorkspacesPage_1.default)(mockParams);
        expect(Navigation_1.default.navigate).toHaveBeenCalledWith(ROUTES_1.default.WORKSPACES_LIST.route);
    });
    it('navigates to WORKSPACES_LIST if policyID is missing', () => {
        navigationRef_1.default.getRootState.mockReturnValue({
            routes: [{ name: NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR }],
        });
        lastVisitedTabPathUtils.getWorkspacesTabStateFromSessionStorage.mockReturnValue({
            routes: [
                {
                    name: NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR,
                    state: {
                        routes: [
                            {
                                name: SCREENS_1.default.WORKSPACE.INITIAL,
                                params: {},
                            },
                        ],
                    },
                },
            ],
        });
        mockIntercept();
        (0, navigateToWorkspacesPage_1.default)(mockParams);
        expect(Navigation_1.default.navigate).toHaveBeenCalledWith(ROUTES_1.default.WORKSPACES_LIST.route);
    });
});
