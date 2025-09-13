"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUserPersonalDetailsContext = void 0;
exports.CurrentUserPersonalDetailsProvider = CurrentUserPersonalDetailsProvider;
var react_1 = require("react");
var useOnyx_1 = require("@hooks/useOnyx");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var OnyxListItemProvider_1 = require("./OnyxListItemProvider");
var defaultCurrentUserPersonalDetails = {
    accountID: CONST_1.default.DEFAULT_NUMBER_ID,
};
var CurrentUserPersonalDetailsContext = (0, react_1.createContext)(defaultCurrentUserPersonalDetails);
exports.CurrentUserPersonalDetailsContext = CurrentUserPersonalDetailsContext;
function CurrentUserPersonalDetailsProvider(_a) {
    var _b;
    var children = _a.children;
    var session = (0, OnyxListItemProvider_1.useSession)();
    var userAccountID = (_b = session === null || session === void 0 ? void 0 : session.accountID) !== null && _b !== void 0 ? _b : CONST_1.default.DEFAULT_NUMBER_ID;
    var userAccountSelector = (0, react_1.useCallback)(function (allPersonalDetails) {
        var _a;
        var personalDetailsForUser = (_a = allPersonalDetails === null || allPersonalDetails === void 0 ? void 0 : allPersonalDetails[userAccountID]) !== null && _a !== void 0 ? _a : {};
        personalDetailsForUser.accountID = userAccountID;
        return personalDetailsForUser;
    }, [userAccountID]);
    var _c = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { selector: userAccountSelector, canBeMissing: true })[0], currentUserPersonalDetails = _c === void 0 ? defaultCurrentUserPersonalDetails : _c;
    return <CurrentUserPersonalDetailsContext.Provider value={currentUserPersonalDetails}>{children}</CurrentUserPersonalDetailsContext.Provider>;
}
