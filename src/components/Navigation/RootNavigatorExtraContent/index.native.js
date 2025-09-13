"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var TopLevelNavigationTabBar_1 = require("@components/Navigation/TopLevelNavigationTabBar");
function RootNavigatorExtraContent(_a) {
    var state = _a.state;
    return <TopLevelNavigationTabBar_1.default state={state}/>;
}
RootNavigatorExtraContent.displayName = 'RootNavigatorExtraContent';
exports.default = RootNavigatorExtraContent;
