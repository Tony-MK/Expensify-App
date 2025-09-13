"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_render_html_1 = require("react-native-render-html");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Parser_1 = require("@libs/Parser");
// We are using the explicit composite architecture for performance gains.
// Configuration for RenderHTML is handled in a top-level component providing
// context to RenderHTMLSource components. See https://git.io/JRcZb
// The provider is available at src/components/HTMLEngineProvider/
function RenderHTML({ html: htmlParam }) {
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const html = (0, react_1.useMemo)(() => {
        return (Parser_1.default.replace(htmlParam, { shouldEscapeText: false, filterRules: ['emoji'] })
            // Remove double <emoji> tag if exists and keep the outermost tag (always the original tag).
            .replace(/(<emoji[^>]*>)(?:<emoji[^>]*>)+/g, '$1')
            .replace(/(<\/emoji[^>]*>)(?:<\/emoji[^>]*>)+/g, '$1'));
    }, [htmlParam]);
    return (<react_native_render_html_1.RenderHTMLSource contentWidth={windowWidth * 0.8} source={{ html }}/>);
}
RenderHTML.displayName = 'RenderHTML';
exports.default = RenderHTML;
