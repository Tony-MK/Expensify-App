"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeEmbeddedMaxWidth = computeEmbeddedMaxWidth;
exports.isChildOfComment = isChildOfComment;
exports.isChildOfH1 = isChildOfH1;
exports.isDeletedNode = isDeletedNode;
exports.isChildOfTaskTitle = isChildOfTaskTitle;
exports.isChildOfRBR = isChildOfRBR;
exports.isCommentTag = isCommentTag;
exports.getFontSizeOfRBRChild = getFontSizeOfRBRChild;
exports.isChildOfMutedTextLabel = isChildOfMutedTextLabel;
exports.isChildOfMutedTextXS = isChildOfMutedTextXS;
exports.isChildOfMutedTextMicro = isChildOfMutedTextMicro;
const variables_1 = require("@styles/variables");
const MAX_IMG_DIMENSIONS = 512;
/**
 * Compute embedded maximum width from the available screen width. This function
 * is used by the HTML component in the default renderer for img tags to scale
 * down images that would otherwise overflow horizontally.
 *
 * @param contentWidth - The content width provided to the HTML
 * component.
 * @param tagName - The name of the tag for which max width should be constrained.
 * @returns The minimum between contentWidth and MAX_IMG_DIMENSIONS
 */
function computeEmbeddedMaxWidth(contentWidth, tagName) {
    if (tagName === 'img') {
        return Math.min(MAX_IMG_DIMENSIONS, contentWidth);
    }
    return contentWidth;
}
/**
 * Check if tagName is equal to any of our custom tags wrapping chat comments.
 *
 */
function isCommentTag(tagName) {
    return tagName === 'email-comment' || tagName === 'comment';
}
/**
 * Check if there is an ancestor node for which the predicate returns true.
 */
function isChildOfNode(tnode, predicate) {
    let currentNode = tnode.parent;
    while (currentNode) {
        if (predicate(currentNode)) {
            return true;
        }
        currentNode = currentNode.parent;
    }
    return false;
}
/**
 * Check if there is an ancestor node with name 'comment'.
 * Finding node with name 'comment' flags that we are rendering a comment.
 */
function isChildOfComment(tnode) {
    return isChildOfNode(tnode, (node) => node.domNode?.name !== undefined && isCommentTag(node.domNode.name));
}
/**
 * Check if there is an ancestor node with the name 'h1'.
 * Finding a node with the name 'h1' flags that we are rendering inside an h1 element.
 */
function isChildOfH1(tnode) {
    return isChildOfNode(tnode, (node) => node.domNode?.name !== undefined && node.domNode.name.toLowerCase() === 'h1');
}
function isChildOfTaskTitle(tnode) {
    return isChildOfNode(tnode, (node) => node.domNode?.name !== undefined && node.domNode.name.toLowerCase() === 'task-title');
}
/**
 * Check if the parent node has deleted style.
 */
function isDeletedNode(tnode) {
    const parentStyle = tnode.parent?.styles?.nativeTextRet ?? {};
    return 'textDecorationLine' in parentStyle && parentStyle.textDecorationLine === 'line-through';
}
/**
 * @returns Whether the node is a child of RBR
 */
function isChildOfRBR(tnode) {
    if (!tnode.parent) {
        return false;
    }
    if (tnode.parent.tagName === 'rbr') {
        return true;
    }
    return isChildOfRBR(tnode.parent);
}
function getFontSizeOfRBRChild(tnode) {
    if (!tnode.parent) {
        return 0;
    }
    if (tnode.parent.tagName === 'rbr' && tnode.parent.attributes?.issmall !== undefined) {
        return variables_1.default.fontSizeSmall;
    }
    if (tnode.parent.tagName === 'rbr' && tnode.parent.attributes?.issmall === undefined) {
        return variables_1.default.fontSizeLabel;
    }
    return 0;
}
/**
 * @returns Whether the node is a child of muted-text-label
 */
function isChildOfMutedTextLabel(tnode) {
    if (!tnode.parent) {
        return false;
    }
    if (tnode.parent.tagName === 'muted-text-label') {
        return true;
    }
    return isChildOfMutedTextLabel(tnode.parent);
}
/**
 * @returns Whether the node is a child of muted-text-xs
 */
function isChildOfMutedTextXS(tnode) {
    if (!tnode.parent) {
        return false;
    }
    if (tnode.parent.tagName === 'muted-text-xs') {
        return true;
    }
    return isChildOfMutedTextXS(tnode.parent);
}
/**
 * @returns Whether the node is a child of muted-text-label
 */
function isChildOfMutedTextMicro(tnode) {
    if (!tnode.parent) {
        return false;
    }
    if (tnode.parent.tagName === 'muted-text-micro') {
        return true;
    }
    return isChildOfMutedTextMicro(tnode.parent);
}
