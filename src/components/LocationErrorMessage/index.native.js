"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BaseLocationErrorMessage_1 = require("./BaseLocationErrorMessage");
/** Opens app level settings from the native system settings  */
const openAppSettings = () => {
    react_native_1.Linking.openSettings();
};
function LocationErrorMessage(props) {
    return (<BaseLocationErrorMessage_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} onAllowLocationLinkPress={openAppSettings}/>);
}
LocationErrorMessage.displayName = 'LocationErrorMessage';
exports.default = LocationErrorMessage;
