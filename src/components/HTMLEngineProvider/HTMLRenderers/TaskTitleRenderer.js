"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_render_html_1 = require("react-native-render-html");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function TaskTitleRenderer({ tnode }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_render_html_1.TNodeChildrenRenderer tnode={tnode} renderChild={(props) => {
            return (<Text_1.default style={[styles.taskTitleMenuItem]} key={props.key}>
                        {props.childElement}
                    </Text_1.default>);
        }}/>);
}
TaskTitleRenderer.displayName = 'TaskTitleRenderer';
exports.default = TaskTitleRenderer;
