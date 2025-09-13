"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MemberRightIcon;
const react_1 = require("react");
const Badge_1 = require("@components/Badge");
const useLocalize_1 = require("@hooks/useLocalize");
const CONST_1 = require("@src/CONST");
function MemberRightIcon({ role, owner, login }) {
    const { translate } = (0, useLocalize_1.default)();
    let badgeText;
    if (owner && owner === login) {
        badgeText = 'common.owner';
    }
    else if (role === CONST_1.default.POLICY.ROLE.ADMIN) {
        badgeText = 'common.admin';
    }
    else if (role === CONST_1.default.POLICY.ROLE.AUDITOR) {
        badgeText = 'common.auditor';
    }
    if (badgeText) {
        return <Badge_1.default text={translate(badgeText)}/>;
    }
    return null;
}
