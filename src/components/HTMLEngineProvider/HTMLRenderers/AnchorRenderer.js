"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_render_html_1 = require("react-native-render-html");
const AnchorForAttachmentsOnly_1 = require("@components/AnchorForAttachmentsOnly");
const AnchorForCommentsOnly_1 = require("@components/AnchorForCommentsOnly");
const HTMLEngineUtils = require("@components/HTMLEngineProvider/htmlEngineUtils");
const Text_1 = require("@components/Text");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useHover_1 = require("@hooks/useHover");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
const tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
const CONST_1 = require("@src/CONST");
function AnchorRenderer({ tnode, style, key }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const htmlAttribs = tnode.attributes;
    const { environmentURL } = (0, useEnvironment_1.default)();
    const { hovered, bind } = (0, useHover_1.default)();
    // An auth token is needed to download Expensify chat attachments
    const isAttachment = !!htmlAttribs[CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE];
    const tNodeChild = tnode?.domNode?.children?.at(0);
    const displayName = tNodeChild && 'data' in tNodeChild && typeof tNodeChild.data === 'string' ? tNodeChild.data : '';
    const attrHref = htmlAttribs.href || htmlAttribs[CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE] || '';
    const parentStyle = tnode.parent?.styles?.nativeTextRet ?? {};
    const internalNewExpensifyPath = (0, Link_1.getInternalNewExpensifyPath)(attrHref);
    const internalExpensifyPath = (0, Link_1.getInternalExpensifyPath)(attrHref);
    const isVideo = attrHref && expensify_common_1.Str.isVideo(attrHref);
    const linkHasImage = tnode.tagName === 'a' && tnode.children.some((child) => child.tagName === 'img');
    const isDeleted = HTMLEngineUtils.isDeletedNode(tnode);
    const isChildOfTaskTitle = HTMLEngineUtils.isChildOfTaskTitle(tnode);
    const textDecorationLineStyle = isDeleted ? styles.lineThrough : {};
    const onLinkPress = (0, react_1.useMemo)(() => {
        if (internalNewExpensifyPath || internalExpensifyPath) {
            return () => (0, Link_1.openLink)(attrHref, environmentURL, isAttachment);
        }
        return undefined;
    }, [internalNewExpensifyPath, internalExpensifyPath, attrHref, environmentURL, isAttachment]);
    if (!HTMLEngineUtils.isChildOfComment(tnode) && !isChildOfTaskTitle) {
        // This is not a comment from a chat, the AnchorForCommentsOnly uses a Pressable to create a context menu on right click.
        // We don't have this behaviour in other links in NewDot
        // TODO: We should use TextLink, but I'm leaving it as Text for now because TextLink breaks the alignment in Android.
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
        // Special handling for links in label font to maintain consistent font size
        if (HTMLEngineUtils.isChildOfMutedTextLabel(tnode)) {
            linkStyle = [styles.mutedNormalTextLabel, styles.link];
        }
        // Special handling for links in extra small font to maintain consistent font size
        if (HTMLEngineUtils.isChildOfMutedTextXS(tnode)) {
            linkStyle = [styles.textExtraSmallSupporting, styles.link];
        }
        // Special handling for links in micro font to maintain consistent font size
        if (HTMLEngineUtils.isChildOfMutedTextMicro(tnode)) {
            linkStyle = [styles.textMicroSupporting, styles.link];
        }
        if (tnode.classes.includes('no-style-link')) {
            // If the link has a class of a no-style-link, we don't apply any styles
            linkStyle = { ...style };
            delete linkStyle.color;
            delete linkStyle.textDecorationLine;
            delete linkStyle.textDecorationColor;
        }
        return (<Text_1.default style={linkStyle} onPress={() => (0, Link_1.openLink)(attrHref, environmentURL, isAttachment)} suppressHighlighting>
                <react_native_render_html_1.TNodeChildrenRenderer tnode={tnode}/>
            </Text_1.default>);
    }
    if (isAttachment && !isVideo) {
        return (<AnchorForAttachmentsOnly_1.default source={(0, tryResolveUrlFromApiRoot_1.default)(attrHref)} displayName={displayName} isDeleted={isDeleted}/>);
    }
    const hoverStyle = hovered ? StyleUtils.getColorStyle(theme.linkHover) : {};
    return (<AnchorForCommentsOnly_1.default href={attrHref} 
    // Unless otherwise specified open all links in
    // a new window. On Desktop this means that we will
    // skip the default Save As... download prompt
    // and defer to whatever browser the user has.
    // eslint-disable-next-line react/jsx-props-no-multi-spaces
    target={htmlAttribs.target || '_blank'} rel={htmlAttribs.rel || 'noopener noreferrer'} style={[
            style,
            parentStyle,
            styles.textDecorationLineNone,
            textDecorationLineStyle,
            styles.textUnderlinePositionUnder,
            styles.textDecorationSkipInkNone,
            isChildOfTaskTitle && styles.taskTitleMenuItem,
            styles.dInlineFlex,
            hoverStyle,
        ]} key={key} 
    // Only pass the press handler for internal links. For public links or whitelisted internal links fallback to default link handling
    onPress={onLinkPress} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...bind} linkHasImage={linkHasImage}>
            <react_native_render_html_1.TNodeChildrenRenderer tnode={tnode} renderChild={(props) => {
            if (props.childTnode.tagName === 'br') {
                return <Text_1.default key={props.key}>{'\n'}</Text_1.default>;
            }
            if (props.childTnode.type === 'text' && props.childTnode.tagName !== 'code') {
                return (<Text_1.default key={props.key} style={[
                        props.childTnode.getNativeStyles(),
                        parentStyle,
                        styles.textDecorationLineNone,
                        textDecorationLineStyle,
                        styles.textUnderlinePositionUnder,
                        styles.textDecorationSkipInkNone,
                        styles.dInlineFlex,
                        hoverStyle,
                    ]}>
                                {props.childTnode.data}
                            </Text_1.default>);
            }
            return props.childElement;
        }}/>
        </AnchorForCommentsOnly_1.default>);
}
AnchorRenderer.displayName = 'AnchorRenderer';
exports.default = AnchorRenderer;
