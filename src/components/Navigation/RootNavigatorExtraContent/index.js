"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var TopLevelNavigationTabBar_1 = require("@components/Navigation/TopLevelNavigationTabBar");
var SidePanel_1 = require("@components/SidePanel");
function RootNavigatorExtraContent(_a) {
    var state = _a.state;
    return (<>
            <TopLevelNavigationTabBar_1.default state={state}/>
            {/* On web, the SidePanel is rendered outside of the main navigator so it can be positioned alongside the screen */}
            <SidePanel_1.default />
        </>);
}
RootNavigatorExtraContent.displayName = 'RootNavigatorExtraContent';
exports.default = RootNavigatorExtraContent;
