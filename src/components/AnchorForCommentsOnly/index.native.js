"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BaseAnchorForCommentsOnly_1 = require("./BaseAnchorForCommentsOnly");
function AnchorForCommentsOnly({ onPress, href = '', ...props }) {
    const onLinkPress = () => {
        if (onPress) {
            onPress();
        }
        else {
            react_native_1.Linking.openURL(href);
        }
    };
    return (<BaseAnchorForCommentsOnly_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} href={href} onPress={onLinkPress}/>);
}
AnchorForCommentsOnly.displayName = 'AnchorForCommentsOnly';
exports.default = AnchorForCommentsOnly;
