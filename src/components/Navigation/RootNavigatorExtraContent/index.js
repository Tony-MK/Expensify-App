"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const TopLevelNavigationTabBar_1 = require("@components/Navigation/TopLevelNavigationTabBar");
const SidePanel_1 = require("@components/SidePanel");
function RootNavigatorExtraContent({ state }) {
    return (<>
            <TopLevelNavigationTabBar_1.default state={state}/>
            {/* On web, the SidePanel is rendered outside of the main navigator so it can be positioned alongside the screen */}
            <SidePanel_1.default />
        </>);
}
RootNavigatorExtraContent.displayName = 'RootNavigatorExtraContent';
exports.default = RootNavigatorExtraContent;
