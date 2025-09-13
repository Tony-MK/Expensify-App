"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const usePreloadFullScreenNavigators_1 = require("@libs/Navigation/AppNavigator/usePreloadFullScreenNavigators");
const useSplitNavigatorScreenOptions_1 = require("@libs/Navigation/AppNavigator/useSplitNavigatorScreenOptions");
const animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
const SearchQueryUtils = require("@libs/SearchQueryUtils");
const createSearchFullscreenNavigator_1 = require("@navigation/AppNavigator/createSearchFullscreenNavigator");
const FreezeWrapper_1 = require("@navigation/AppNavigator/FreezeWrapper");
const SCREENS_1 = require("@src/SCREENS");
const loadSearchPage = () => require('@pages/Search/SearchPage').default;
const loadSearchMoneyReportPage = () => require('@pages/Search/SearchMoneyRequestReportPage').default;
const Stack = (0, createSearchFullscreenNavigator_1.default)();
function SearchFullscreenNavigator({ route }) {
    // These options can be used here because the full screen navigator has the same structure as the split navigator in terms of the central screens, but it does not have a sidebar.
    const { centralScreen: centralScreenOptions } = (0, useSplitNavigatorScreenOptions_1.default)();
    // This hook preloads the screens of adjacent tabs to make changing tabs faster.
    (0, usePreloadFullScreenNavigators_1.default)();
    return (<FreezeWrapper_1.default>
            <Stack.Navigator screenOptions={centralScreenOptions} defaultCentralScreen={SCREENS_1.default.SEARCH.ROOT} parentRoute={route}>
                <Stack.Screen name={SCREENS_1.default.SEARCH.ROOT} getComponent={loadSearchPage} initialParams={{ q: SearchQueryUtils.buildSearchQueryString() }} options={{ animation: animation_1.default.NONE }}/>
                <Stack.Screen name={SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT} getComponent={loadSearchMoneyReportPage}/>
            </Stack.Navigator>
        </FreezeWrapper_1.default>);
}
SearchFullscreenNavigator.displayName = 'SearchFullscreenNavigator';
exports.default = SearchFullscreenNavigator;
