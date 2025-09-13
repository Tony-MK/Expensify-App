"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ControlSelection_1 = require("@libs/ControlSelection");
const DeviceCapabilities = require("@libs/DeviceCapabilities");
const BaseAnchorForAttachmentsOnly_1 = require("./BaseAnchorForAttachmentsOnly");
function AnchorForAttachmentsOnly(props) {
    return (<BaseAnchorForAttachmentsOnly_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} onPressIn={() => DeviceCapabilities.canUseTouchScreen() && ControlSelection_1.default.block()} onPressOut={() => ControlSelection_1.default.unblock()}/>);
}
AnchorForAttachmentsOnly.displayName = 'AnchorForAttachmentsOnly';
exports.default = AnchorForAttachmentsOnly;
