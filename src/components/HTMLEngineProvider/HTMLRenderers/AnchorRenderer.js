"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var react_native_render_html_1 = require("react-native-render-html");
var AnchorForAttachmentsOnly_1 = require("@components/AnchorForAttachmentsOnly");
var AnchorForCommentsOnly_1 = require("@components/AnchorForCommentsOnly");
var HTMLEngineUtils = require("@components/HTMLEngineProvider/htmlEngineUtils");
var Text_1 = require("@components/Text");
var useEnvironment_1 = require("@hooks/useEnvironment");
var useHover_1 = require("@hooks/useHover");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Link_1 = require("@libs/actions/Link");
var tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
var CONST_1 = require("@src/CONST");
function AnchorRenderer(_a) {
    var _b, _c, _d, _e, _f;
    var tnode = _a.tnode, style = _a.style, key = _a.key;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var htmlAttribs = tnode.attributes;
    var environmentURL = (0, useEnvironment_1.default)().environmentURL;
    var _g = (0, useHover_1.default)(), hovered = _g.hovered, bind = _g.bind;
    // An auth token is needed to download Expensify chat attachments
    var isAttachment = !!htmlAttribs[CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE];
    var tNodeChild = (_c = (_b = tnode === null || tnode === void 0 ? void 0 : tnode.domNode) === null || _b === void 0 ? void 0 : _b.children) === null || _c === void 0 ? void 0 : _c.at(0);
    var displayName = tNodeChild && 'data' in tNodeChild && typeof tNodeChild.data === 'string' ? tNodeChild.data : '';
    var attrHref = htmlAttribs.href || htmlAttribs[CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE] || '';
    var parentStyle = (_f = (_e = (_d = tnode.parent) === null || _d === void 0 ? void 0 : _d.styles) === null || _e === void 0 ? void 0 : _e.nativeTextRet) !== null && _f !== void 0 ? _f : {};
    var internalNewExpensifyPath = (0, Link_1.getInternalNewExpensifyPath)(attrHref);
    var internalExpensifyPath = (0, Link_1.getInternalExpensifyPath)(attrHref);
    var isVideo = attrHref && expensify_common_1.Str.isVideo(attrHref);
    var linkHasImage = tnode.tagName === 'a' && tnode.children.some(function (child) { return child.tagName === 'img'; });
    var isDeleted = HTMLEngineUtils.isDeletedNode(tnode);
    var isChildOfTaskTitle = HTMLEngineUtils.isChildOfTaskTitle(tnode);
    var textDecorationLineStyle = isDeleted ? styles.lineThrough : {};
    var onLinkPress = (0, react_1.useMemo)(function () {
        if (internalNewExpensifyPath || internalExpensifyPath) {
            return function () { return (0, Link_1.openLink)(attrHref, environmentURL, isAttachment); };
        }
        return undefined;
    }, [internalNewExpensifyPath, internalExpensifyPath, attrHref, environmentURL, isAttachment]);
    if (!HTMLEngineUtils.isChildOfComment(tnode) && !isChildOfTaskTitle) {
        // This is not a comment from a chat, the AnchorForCommentsOnly uses a Pressable to create a context menu on right click.
        // We don't have this behaviour in other links in NewDot
        // TODO: We should use TextLink, but I'm leaving it as Text for now because TextLink breaks the alignment in Android.
        // Define link style based on context
        var linkStyle = styles.link;
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
            linkStyle = __assign({}, style);
            delete linkStyle.color;
            delete linkStyle.textDecorationLine;
            delete linkStyle.textDecorationColor;
        }
        return (<Text_1.default style={linkStyle} onPress={function () { return (0, Link_1.openLink)(attrHref, environmentURL, isAttachment); }} suppressHighlighting>
                <react_native_render_html_1.TNodeChildrenRenderer tnode={tnode}/>
            </Text_1.default>);
    }
    if (isAttachment && !isVideo) {
        return (<AnchorForAttachmentsOnly_1.default source={(0, tryResolveUrlFromApiRoot_1.default)(attrHref)} displayName={displayName} isDeleted={isDeleted}/>);
    }
    var hoverStyle = hovered ? StyleUtils.getColorStyle(theme.linkHover) : {};
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
            <react_native_render_html_1.TNodeChildrenRenderer tnode={tnode} renderChild={function (props) {
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
