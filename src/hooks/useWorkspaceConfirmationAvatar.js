"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Avatar_1 = require("@components/Avatar");
const Expensicons = require("@components/Icon/Expensicons");
const CONST_1 = require("@src/CONST");
const useThemeStyles_1 = require("./useThemeStyles");
function useWorkspaceConfirmationAvatar({ policyID, source, name }) {
    const styles = (0, useThemeStyles_1.default)();
    return (0, react_1.useCallback)(() => (<Avatar_1.default containerStyles={styles.avatarXLarge} imageStyles={[styles.avatarXLarge, styles.alignSelfCenter]} source={source} fallbackIcon={Expensicons.FallbackWorkspaceAvatar} size={CONST_1.default.AVATAR_SIZE.X_LARGE} name={name} avatarID={policyID} type={CONST_1.default.ICON_TYPE_WORKSPACE}/>), [name, policyID, source, styles.alignSelfCenter, styles.avatarXLarge]);
}
exports.default = useWorkspaceConfirmationAvatar;
