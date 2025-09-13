"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SAMLLoadingIndicator_1 = require("@components/SAMLLoadingIndicator");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const LoginUtils_1 = require("@libs/LoginUtils");
const CONFIG_1 = require("@src/CONFIG");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function SAMLSignInPage() {
    const { translate } = (0, useLocalize_1.default)();
    const [credentials] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS);
    (0, react_1.useEffect)(() => {
        // If we don't have a valid login to pass here, direct the user back to a clean sign in state to try again
        if (!credentials?.login) {
            (0, LoginUtils_1.handleSAMLLoginError)(translate('common.error.email'), true);
            return;
        }
        const body = new FormData();
        body.append('email', credentials.login);
        body.append('referer', CONFIG_1.default.EXPENSIFY.EXPENSIFY_CASH_REFERER);
        (0, LoginUtils_1.postSAMLLogin)(body)
            .then((response) => {
            if (!response || !response.url) {
                (0, LoginUtils_1.handleSAMLLoginError)(translate('common.error.login'), false);
                return;
            }
            window.location.replace(response.url);
        })
            .catch((error) => {
            (0, LoginUtils_1.handleSAMLLoginError)(error.message ?? translate('common.error.login'), false);
        });
    }, [credentials?.login, translate]);
    return <SAMLLoadingIndicator_1.default />;
}
SAMLSignInPage.displayName = 'SAMLSignInPage';
exports.default = SAMLSignInPage;
