"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_render_html_1 = require("react-native-render-html");
const HTMLEngineUtils = require("@components/HTMLEngineProvider/htmlEngineUtils");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@userActions/Report");
/**
 * Simple wrapper to create a stable reference without passing event args to navigation function.
 */
function navigateToConciergeChat() {
    (0, Report_1.navigateToConciergeChat)();
}
function ConciergeLinkRenderer({ tnode }) {
    const styles = (0, useThemeStyles_1.default)();
    // Define link style based on context
    let linkStyle = styles.link;
    // Special handling for links in RBR to maintain consistent font size
    if (HTMLEngineUtils.isChildOfRBR(tnode)) {
        linkStyle = [
            styles.link,
            {
                fontSize: HTMLEngineUtils.getFontSizeOfRBRChild(tnode),
            },
        ];
    }
    return (<Text_1.default style={linkStyle} onPress={navigateToConciergeChat} suppressHighlighting>
            <react_native_render_html_1.TNodeChildrenRenderer tnode={tnode}/>
        </Text_1.default>);
}
ConciergeLinkRenderer.displayName = 'ConciergeLinkRenderer';
exports.default = ConciergeLinkRenderer;
