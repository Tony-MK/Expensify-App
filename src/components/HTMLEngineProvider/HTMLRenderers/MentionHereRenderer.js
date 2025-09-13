"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_render_html_1 = require("react-native-render-html");
const Text_1 = require("@components/Text");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
function MentionHereRenderer({ style, tnode }) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const flattenStyle = react_native_1.StyleSheet.flatten(style);
    const { color, ...styleWithoutColor } = flattenStyle;
    return (<Text_1.default>
            <Text_1.default 
    // Passing the true value to the function as here mention is always for the current user
    color={StyleUtils.getMentionTextColor(true)} style={[styleWithoutColor, StyleUtils.getMentionStyle(true)]}>
                <react_native_render_html_1.TNodeChildrenRenderer tnode={tnode}/>
            </Text_1.default>
        </Text_1.default>);
}
MentionHereRenderer.displayName = 'HereMentionRenderer';
exports.default = MentionHereRenderer;
