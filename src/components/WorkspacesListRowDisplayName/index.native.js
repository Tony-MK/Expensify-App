"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiUtils = require("@libs/EmojiUtils");
function WorkspacesListRowDisplayName({ isDeleted, ownerName }) {
    const styles = (0, useThemeStyles_1.default)();
    const processedOwnerName = EmojiUtils.splitTextWithEmojis(ownerName);
    return (<Text_1.default numberOfLines={1} style={[styles.labelStrong, isDeleted ? styles.offlineFeedback.deleted : {}]}>
            {processedOwnerName.length !== 0
            ? EmojiUtils.getProcessedText(processedOwnerName, [styles.labelStrong, isDeleted ? styles.offlineFeedback.deleted : {}, styles.emojisWithTextFontFamily])
            : ownerName}
        </Text_1.default>);
}
WorkspacesListRowDisplayName.displayName = 'WorkspacesListRowDisplayName';
exports.default = WorkspacesListRowDisplayName;
