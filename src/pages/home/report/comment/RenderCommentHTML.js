"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RenderHTML_1 = require("@components/RenderHTML");
function RenderCommentHTML({ html, source, containsOnlyEmojis }) {
    const commentHtml = source === 'email' ? `<email-comment ${containsOnlyEmojis ? 'islarge' : ''}>${html}</email-comment>` : `<comment ${containsOnlyEmojis ? 'islarge' : ''}>${html}</comment>`;
    return <RenderHTML_1.default html={commentHtml}/>;
}
RenderCommentHTML.displayName = 'RenderCommentHTML';
exports.default = RenderCommentHTML;
