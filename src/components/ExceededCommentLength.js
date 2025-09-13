"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const Text_1 = require("./Text");
function ExceededCommentLength({ maxCommentLength = CONST_1.default.MAX_COMMENT_LENGTH, isTaskTitle }) {
    const styles = (0, useThemeStyles_1.default)();
    const { numberFormat, translate } = (0, useLocalize_1.default)();
    const translationKey = isTaskTitle ? 'composer.taskTitleExceededMaxLength' : 'composer.commentExceededMaxLength';
    return (<Text_1.default style={[styles.textMicro, styles.textDanger, styles.chatItemComposeSecondaryRow, styles.mlAuto, styles.pl2]} numberOfLines={1}>
            {translate(translationKey, { formattedMaxLength: numberFormat(maxCommentLength) })}
        </Text_1.default>);
}
ExceededCommentLength.displayName = 'ExceededCommentLength';
exports.default = (0, react_1.memo)(ExceededCommentLength);
