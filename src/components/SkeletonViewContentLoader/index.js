"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_content_loader_1 = require("react-content-loader");
const react_native_1 = require("react-native");
function ContentLoader({ style, ...props }) {
    return (<react_content_loader_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} 
    // Using StyleSheet.flatten() because SkeletonViewContentLoader is not able to handle array style notation(eg. style={[style1, style2]}) of style prop
    style={react_native_1.StyleSheet.flatten(style)}/>);
}
exports.default = ContentLoader;
