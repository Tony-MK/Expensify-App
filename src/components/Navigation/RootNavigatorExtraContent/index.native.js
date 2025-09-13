"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const TopLevelNavigationTabBar_1 = require("@components/Navigation/TopLevelNavigationTabBar");
function RootNavigatorExtraContent({ state }) {
    return <TopLevelNavigationTabBar_1.default state={state}/>;
}
RootNavigatorExtraContent.displayName = 'RootNavigatorExtraContent';
exports.default = RootNavigatorExtraContent;
