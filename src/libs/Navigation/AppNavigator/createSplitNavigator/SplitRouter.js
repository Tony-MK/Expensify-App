"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const pick_1 = require("lodash/pick");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const getParamsFromRoute_1 = require("@libs/Navigation/helpers/getParamsFromRoute");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const usePreserveNavigatorState_1 = require("./usePreserveNavigatorState");
const isAtLeastOneInState = (state, screenName) => state.routes.some((route) => route.name === screenName);
/**
 * Adapts the navigation state of a SplitNavigator to ensure proper screen layout and navigation flow.
 * This function handles both narrow and wide layouts, ensuring that:
 * 1. On narrow layout, it manages sidebar visibility appropriately
 * 2. On wide layout, it ensures both sidebar and central screens are present
 * 3. Handles policy-specific navigation states
 *
 * For detailed information about SplitNavigator state adaptation and navigation patterns,
 * see the NAVIGATION.md documentation.
 *
 * @param state - The current navigation state to adapt
 * @param options - Configuration options including sidebarScreen, defaultCentralScreen, and parentRoute
 */
function adaptStateIfNecessary({ state, options: { sidebarScreen, defaultCentralScreen, parentRoute } }) {
    const isNarrowLayout = (0, getIsNarrowLayout_1.default)();
    const rootState = navigationRef_1.default.getRootState();
    const lastRoute = state.routes.at(-1);
    const routes = [...state.routes];
    let modified = false;
    // When initializing the app on a small screen with the center screen as the initial screen, the sidebar must also be split to allow users to swipe back.
    const isInitialRoute = !rootState || rootState.routes.length === 1;
    const shouldSplitHaveSidebar = isInitialRoute || !isNarrowLayout;
    // If the screen is wide, there should be at least two screens inside:
    // - sidebarScreen to cover left pane.
    // - defaultCentralScreen to cover central pane.
    if (!isAtLeastOneInState(state, sidebarScreen) && shouldSplitHaveSidebar) {
        const paramsFromRoute = (0, getParamsFromRoute_1.default)(sidebarScreen, !isNarrowLayout);
        const copiedParams = (0, pick_1.default)(lastRoute?.params, paramsFromRoute);
        // We don't want to get an empty object as params because it breaks some navigation logic when comparing if routes are the same.
        const params = (0, EmptyObject_1.isEmptyObject)(copiedParams) ? undefined : copiedParams;
        routes.unshift({
            name: sidebarScreen,
            // This handles the case where the sidebar should have params included in the central screen e.g. policyID for workspace initial.
            params,
        });
        modified = true;
    }
    // If the screen is wide, there should be at least two screens inside:
    // - sidebarScreen to cover left pane.
    // - defaultCentralScreen to cover central pane.
    if (!isNarrowLayout) {
        if (routes.length === 1 && routes.at(0)?.name === sidebarScreen) {
            const previousSameNavigator = rootState?.routes.filter((route) => route.name === parentRoute.name).at(-2);
            // If we have optimization for not rendering all split navigators, then last selected option may not be in the state. In this case state has to be read from the preserved state.
            const previousSameNavigatorState = previousSameNavigator?.state ?? (previousSameNavigator?.key ? (0, usePreserveNavigatorState_1.getPreservedNavigatorState)(previousSameNavigator.key) : undefined);
            const previousSelectedCentralScreen = previousSameNavigatorState?.routes && previousSameNavigatorState.routes.length > 1 ? previousSameNavigatorState.routes.at(-1)?.name : undefined;
            routes.push({
                name: previousSelectedCentralScreen ?? defaultCentralScreen,
                params: state.routes.at(0)?.params,
            });
            modified = true;
        }
    }
    if (!modified) {
        return state;
    }
    return {
        ...state,
        routes,
        stale: true,
        index: routes.length - 1,
    };
}
function isPushingSidebarOnCentralPane(state, action, options) {
    return action.type === CONST_1.default.NAVIGATION.ACTION_TYPE.PUSH && action.payload.name === options.sidebarScreen && state.routes.length > 1;
}
function SplitRouter(options) {
    const stackRouter = (0, native_1.StackRouter)(options);
    return {
        ...stackRouter,
        getStateForAction(state, action, configOptions) {
            if (isPushingSidebarOnCentralPane(state, action, options)) {
                if ((0, getIsNarrowLayout_1.default)()) {
                    const newAction = native_1.StackActions.popToTop();
                    return stackRouter.getStateForAction(state, newAction, configOptions);
                }
                // On wide screen do nothing as we want to keep the central pane screen and the sidebar is visible.
                return state;
            }
            return stackRouter.getStateForAction(state, action, configOptions);
        },
        getInitialState({ routeNames, routeParamList, routeGetIdList }) {
            const initialState = (0, usePreserveNavigatorState_1.getPreservedNavigatorState)(options.parentRoute.key) ?? stackRouter.getInitialState({ routeNames, routeParamList, routeGetIdList });
            const maybeAdaptedState = adaptStateIfNecessary({ state: initialState, options });
            // If we needed to modify the state we need to rehydrate it to get keys for new routes.
            if (maybeAdaptedState.stale) {
                return stackRouter.getRehydratedState(maybeAdaptedState, { routeNames, routeParamList, routeGetIdList });
            }
            return maybeAdaptedState;
        },
        getRehydratedState(partialState, { routeNames, routeParamList, routeGetIdList }) {
            const adaptedState = adaptStateIfNecessary({ state: partialState, options });
            return stackRouter.getRehydratedState(adaptedState, { routeNames, routeParamList, routeGetIdList });
        },
    };
}
exports.default = SplitRouter;
