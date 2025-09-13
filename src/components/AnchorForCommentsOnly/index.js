"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ControlSelection_1 = require("@libs/ControlSelection");
const DeviceCapabilities = require("@libs/DeviceCapabilities");
const BaseAnchorForCommentsOnly_1 = require("./BaseAnchorForCommentsOnly");
function AnchorForCommentsOnly(props) {
    return (<BaseAnchorForCommentsOnly_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} onPressIn={() => DeviceCapabilities.canUseTouchScreen() && ControlSelection_1.default.block()} onPressOut={() => ControlSelection_1.default.unblock()}/>);
}
AnchorForCommentsOnly.displayName = 'AnchorForCommentsOnly';
exports.default = AnchorForCommentsOnly;
