"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const index_1 = require("@components/SidePanel/index");
const HelpButtonBase_1 = require("./HelpButtonBase");
function HelpButton({ style }) {
    return (<>
            {/* Render SidePanel here on native platforms, since it's not included in RootNavigatorExtraContent like on web */}
            <index_1.default />
            <HelpButtonBase_1.default style={style}/>
        </>);
}
HelpButton.displayName = 'HelpButton';
exports.default = HelpButton;
