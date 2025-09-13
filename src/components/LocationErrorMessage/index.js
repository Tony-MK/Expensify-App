"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CONST_1 = require("@src/CONST");
const BaseLocationErrorMessage_1 = require("./BaseLocationErrorMessage");
/** Opens expensify help site in a new browser tab */
const navigateToExpensifyHelpSite = () => {
    react_native_1.Linking.openURL(CONST_1.default.NEWHELP_URL);
};
function LocationErrorMessage(props) {
    return (<BaseLocationErrorMessage_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} onAllowLocationLinkPress={navigateToExpensifyHelpSite}/>);
}
LocationErrorMessage.displayName = 'LocationErrorMessage';
exports.default = LocationErrorMessage;
