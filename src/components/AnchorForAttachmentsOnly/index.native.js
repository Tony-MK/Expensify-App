"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BaseAnchorForAttachmentsOnly_1 = require("./BaseAnchorForAttachmentsOnly");
function AnchorForAttachmentsOnly(props) {
    const styles = (0, useThemeStyles_1.default)();
    return (<BaseAnchorForAttachmentsOnly_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} style={styles.mw100}/>);
}
AnchorForAttachmentsOnly.displayName = 'AnchorForAttachmentsOnly';
exports.default = AnchorForAttachmentsOnly;
