"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function UnlinkLoginPage({ route }) {
    const accountID = route.params.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const validateCode = route.params.validateCode ?? '';
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const prevIsLoading = (0, usePrevious_1.default)(!!account?.isLoading);
    (0, react_1.useEffect)(() => {
        (0, Session_1.unlinkLogin)(Number(accountID), validateCode);
        // We only want this to run on mount
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        // Only navigate when the unlink login request is completed
        if (!prevIsLoading || account?.isLoading) {
            return;
        }
        Navigation_1.default.goBack();
    }, [prevIsLoading, account?.isLoading]);
    return <FullscreenLoadingIndicator_1.default />;
}
UnlinkLoginPage.displayName = 'UnlinkLoginPage';
exports.default = UnlinkLoginPage;
