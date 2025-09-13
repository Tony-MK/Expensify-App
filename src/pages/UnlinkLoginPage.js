"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
var useOnyx_1 = require("@hooks/useOnyx");
var usePrevious_1 = require("@hooks/usePrevious");
var Navigation_1 = require("@libs/Navigation/Navigation");
var Session_1 = require("@userActions/Session");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function UnlinkLoginPage(_a) {
    var _b, _c;
    var route = _a.route;
    var accountID = (_b = route.params.accountID) !== null && _b !== void 0 ? _b : CONST_1.default.DEFAULT_NUMBER_ID;
    var validateCode = (_c = route.params.validateCode) !== null && _c !== void 0 ? _c : '';
    var account = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true })[0];
    var prevIsLoading = (0, usePrevious_1.default)(!!(account === null || account === void 0 ? void 0 : account.isLoading));
    (0, react_1.useEffect)(function () {
        (0, Session_1.unlinkLogin)(Number(accountID), validateCode);
        // We only want this to run on mount
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(function () {
        // Only navigate when the unlink login request is completed
        if (!prevIsLoading || (account === null || account === void 0 ? void 0 : account.isLoading)) {
            return;
        }
        Navigation_1.default.goBack();
    }, [prevIsLoading, account === null || account === void 0 ? void 0 : account.isLoading]);
    return <FullscreenLoadingIndicator_1.default />;
}
UnlinkLoginPage.displayName = 'UnlinkLoginPage';
exports.default = UnlinkLoginPage;
