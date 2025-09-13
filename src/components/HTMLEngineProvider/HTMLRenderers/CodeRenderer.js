"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_render_html_1 = require("react-native-render-html");
const HTMLEngineUtils = require("@components/HTMLEngineProvider/htmlEngineUtils");
const InlineCodeBlock_1 = require("@components/InlineCodeBlock");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const FontUtils_1 = require("@styles/utils/FontUtils");
function CodeRenderer({ TDefaultRenderer, key, style, ...defaultRendererProps }) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    // We split wrapper and inner styles
    // "boxModelStyle" corresponds to border, margin, padding and backgroundColor
    const { boxModelStyle, otherStyle: textStyle } = (0, react_native_render_html_1.splitBoxModelStyle)(style ?? {});
    /** Get the default fontFamily variant */
    const font = FontUtils_1.default.fontFamily.platform.MONOSPACE.fontFamily;
    // Determine the font size for the code based on whether it's inside an H1 element.
    const isInsideH1 = HTMLEngineUtils.isChildOfH1(defaultRendererProps.tnode);
    const isInsideTaskTitle = HTMLEngineUtils.isChildOfTaskTitle(defaultRendererProps.tnode);
    const fontSize = StyleUtils.getCodeFontSize(isInsideH1, isInsideTaskTitle);
    const textStyleOverride = {
        fontSize,
        fontFamily: font,
    };
    return (<InlineCodeBlock_1.default defaultRendererProps={{ ...defaultRendererProps, style: {} }} TDefaultRenderer={TDefaultRenderer} boxModelStyle={boxModelStyle} textStyle={{ ...textStyle, ...textStyleOverride }} key={key}/>);
}
CodeRenderer.displayName = 'CodeRenderer';
exports.default = CodeRenderer;
