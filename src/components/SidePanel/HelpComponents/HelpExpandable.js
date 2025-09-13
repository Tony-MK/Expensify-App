"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
function HelpExpandable({ children, styles, containerStyle, isExpanded, setIsExpanded }) {
    return (<react_native_1.View style={containerStyle}>
            {isExpanded ? (children) : (<Text_1.default style={styles.link} onPress={setIsExpanded}>
                    Show more
                </Text_1.default>)}
        </react_native_1.View>);
}
HelpExpandable.displayName = 'ExpandableHelp';
exports.default = HelpExpandable;
