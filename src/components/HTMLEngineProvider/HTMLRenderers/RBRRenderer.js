"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_render_html_1 = require("react-native-render-html");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function RBRRenderer({ tnode, style }) {
    const styles = (0, useThemeStyles_1.default)();
    const htmlAttribs = tnode.attributes;
    const isSmall = htmlAttribs?.issmall !== undefined;
    const shouldShowEllipsis = htmlAttribs?.shouldshowellipsis !== undefined;
    const flattenStyle = react_native_1.StyleSheet.flatten(style);
    return (<react_native_render_html_1.TNodeChildrenRenderer tnode={tnode} renderChild={(props) => {
            return (<Text_1.default numberOfLines={shouldShowEllipsis ? 1 : 0} ellipsizeMode="tail" key={props.key} style={[styles.textLabelError, flattenStyle, isSmall ? styles.textMicro : {}]}>
                        {props.childElement}
                    </Text_1.default>);
        }}/>);
}
RBRRenderer.displayName = 'RBRRenderer';
exports.default = RBRRenderer;
