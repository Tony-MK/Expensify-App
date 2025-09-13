"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
/**
 * Retrieves the text content from a Text or Phrasing node.
 *
 * @param defaultRendererProps - The default renderer props containing the node information.
 * @returns The text content of the node.
 *
 * @template TTextOrTPhrasing
 */
function getCurrentData(defaultRendererProps) {
    if ('data' in defaultRendererProps.tnode) {
        return defaultRendererProps.tnode.data;
    }
    return defaultRendererProps.tnode.children.map((child) => ('data' in child ? child.data : '')).join('');
}
function InlineCodeBlock({ TDefaultRenderer, defaultRendererProps, textStyle, boxModelStyle }) {
    const data = getCurrentData(defaultRendererProps);
    return (<TDefaultRenderer 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...defaultRendererProps}>
            <Text_1.default style={[boxModelStyle, textStyle]}>{data}</Text_1.default>
        </TDefaultRenderer>);
}
InlineCodeBlock.displayName = 'InlineCodeBlock';
exports.default = InlineCodeBlock;
