"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const EmojiWithTooltip_1 = require("@components/EmojiWithTooltip");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
/**
 * This function is used to render elements based on the provided defaultRendererProps and styles.
 * It iterates over the children of the tnode object in defaultRendererProps, and for each child,
 * it checks if the child's tagName is 'emoji'. If it is, it creates an EmojiWithTooltip component
 * with the appropriate styles and adds it to the elements array. If it's not, it adds the child's
 * 'data' property to the elements array. The function then returns the elements array.
 *
 * @param defaultRendererProps - The default renderer props.
 * @param textStyles - The text styles.
 * @param styles - The theme styles.
 * @returns The array of elements to be rendered.
 */
function renderElements(defaultRendererProps, textStyles, styles) {
    const elements = [];
    if ('data' in defaultRendererProps.tnode) {
        elements.push(defaultRendererProps.tnode.data);
        return elements;
    }
    if (!defaultRendererProps.tnode.children) {
        return elements;
    }
    defaultRendererProps.tnode.children.forEach((child) => {
        if (!('data' in child)) {
            return;
        }
        if (child.tagName === 'emoji') {
            elements.push(<EmojiWithTooltip_1.default style={[textStyles, styles.cursorDefault, styles.emojiDefaultStyles]} key={child.data} emojiCode={child.data}/>);
        }
        else {
            elements.push(child.data);
        }
    });
    return elements;
}
function InlineCodeBlock({ TDefaultRenderer, textStyle, defaultRendererProps, boxModelStyle }) {
    const styles = (0, useThemeStyles_1.default)();
    const flattenTextStyle = react_native_1.StyleSheet.flatten(textStyle);
    const { textDecorationLine, ...textStyles } = flattenTextStyle;
    const elements = renderElements(defaultRendererProps, textStyles, styles);
    return (<TDefaultRenderer 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...defaultRendererProps}>
            <Text_1.default style={[boxModelStyle, textStyles]}>{elements}</Text_1.default>
        </TDefaultRenderer>);
}
InlineCodeBlock.displayName = 'InlineCodeBlock';
exports.default = InlineCodeBlock;
