"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CopyCodesPage_1 = require("./CopyCodesPage");
const EnabledPage_1 = require("./EnabledPage");
function TwoFactorAuthPage(props) {
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT);
    if (account?.requiresTwoFactorAuth) {
        return <EnabledPage_1.default />;
    }
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <CopyCodesPage_1.default {...props}/>;
}
exports.default = TwoFactorAuthPage;
