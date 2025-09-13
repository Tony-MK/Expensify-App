"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_render_html_1 = require("react-native-render-html");
const Text_1 = require("@components/Text");
const useShortMentionsList_1 = require("@hooks/useShortMentionsList");
const CONST_1 = require("@src/CONST");
const MentionHereRenderer_1 = require("./MentionHereRenderer");
const MentionUserRenderer_1 = require("./MentionUserRenderer");
function ShortMentionRenderer(props) {
    const { availableLoginsList, currentUserMentions } = (0, useShortMentionsList_1.default)();
    const mentionValue = 'data' in props.tnode ? props.tnode.data.replace(CONST_1.default.UNICODE.LTR, '') : '';
    const mentionLogin = mentionValue.substring(1);
    if (currentUserMentions?.includes(mentionLogin)) {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <MentionHereRenderer_1.default {...props}/>;
    }
    if (availableLoginsList.includes(mentionLogin)) {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <MentionUserRenderer_1.default {...props}/>;
    }
    return (<Text_1.default style={props.style}>
            <react_native_render_html_1.TNodeChildrenRenderer tnode={props.tnode}/>
        </Text_1.default>);
}
ShortMentionRenderer.displayName = 'ShortMentionRenderer';
exports.default = ShortMentionRenderer;
