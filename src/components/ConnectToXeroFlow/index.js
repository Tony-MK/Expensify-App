"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RequireTwoFactorAuthenticationModal_1 = require("@components/RequireTwoFactorAuthenticationModal");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const Xero_1 = require("@libs/actions/connections/Xero");
const Modal_1 = require("@libs/actions/Modal");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Link_1 = require("@userActions/Link");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ConnectToXeroFlow({ policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const is2FAEnabled = account?.requiresTwoFactorAuth;
    const [isRequire2FAModalOpen, setIsRequire2FAModalOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!is2FAEnabled) {
            setIsRequire2FAModalOpen(true);
            return;
        }
        (0, Link_1.openLink)((0, Xero_1.getXeroSetupLink)(policyID), environmentURL);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    if (!is2FAEnabled) {
        return (<RequireTwoFactorAuthenticationModal_1.default onSubmit={() => {
                setIsRequire2FAModalOpen(false);
                (0, Modal_1.close)(() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_2FA_ROOT.getRoute(ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID), (0, Xero_1.getXeroSetupLink)(policyID))));
            }} onCancel={() => {
                setIsRequire2FAModalOpen(false);
            }} isVisible={isRequire2FAModalOpen} description={translate('twoFactorAuth.twoFactorAuthIsRequiredDescription')}/>);
    }
}
exports.default = ConnectToXeroFlow;
