"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const RenderCommentHTML_1 = require("./RenderCommentHTML");
function AttachmentCommentFragment({ addExtraMargin, html, source, styleAsDeleted, reportActionID }) {
    const styles = (0, useThemeStyles_1.default)();
    const htmlContent = (0, ReportActionsUtils_1.getHtmlWithAttachmentID)(styleAsDeleted ? `<del>${html}</del>` : html, reportActionID);
    return (<react_native_1.View style={addExtraMargin ? styles.mt2 : {}}>
            <RenderCommentHTML_1.default containsOnlyEmojis={false} source={source} html={htmlContent}/>
        </react_native_1.View>);
}
AttachmentCommentFragment.displayName = 'AttachmentCommentFragment';
exports.default = AttachmentCommentFragment;
