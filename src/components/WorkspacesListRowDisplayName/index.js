"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function WorkspacesListRowDisplayName({ isDeleted, ownerName }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<Text_1.default numberOfLines={1} style={[styles.labelStrong, isDeleted ? styles.offlineFeedback.deleted : {}]}>
            {ownerName}
        </Text_1.default>);
}
WorkspacesListRowDisplayName.displayName = 'WorkspacesListRowDisplayName';
exports.default = WorkspacesListRowDisplayName;
