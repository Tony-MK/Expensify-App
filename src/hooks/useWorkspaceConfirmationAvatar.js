"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Avatar_1 = require("@components/Avatar");
var Expensicons = require("@components/Icon/Expensicons");
var CONST_1 = require("@src/CONST");
var useThemeStyles_1 = require("./useThemeStyles");
function useWorkspaceConfirmationAvatar(_a) {
    var policyID = _a.policyID, source = _a.source, name = _a.name;
    var styles = (0, useThemeStyles_1.default)();
    return (0, react_1.useCallback)(function () { return (<Avatar_1.default containerStyles={styles.avatarXLarge} imageStyles={[styles.avatarXLarge, styles.alignSelfCenter]} source={source} fallbackIcon={Expensicons.FallbackWorkspaceAvatar} size={CONST_1.default.AVATAR_SIZE.X_LARGE} name={name} avatarID={policyID} type={CONST_1.default.ICON_TYPE_WORKSPACE}/>); }, [name, policyID, source, styles.alignSelfCenter, styles.avatarXLarge]);
}
exports.default = useWorkspaceConfirmationAvatar;
