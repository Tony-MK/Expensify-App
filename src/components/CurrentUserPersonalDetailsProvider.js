"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUserPersonalDetailsContext = void 0;
exports.CurrentUserPersonalDetailsProvider = CurrentUserPersonalDetailsProvider;
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const OnyxListItemProvider_1 = require("./OnyxListItemProvider");
const defaultCurrentUserPersonalDetails = {
    accountID: CONST_1.default.DEFAULT_NUMBER_ID,
};
const CurrentUserPersonalDetailsContext = (0, react_1.createContext)(defaultCurrentUserPersonalDetails);
exports.CurrentUserPersonalDetailsContext = CurrentUserPersonalDetailsContext;
function CurrentUserPersonalDetailsProvider({ children }) {
    const session = (0, OnyxListItemProvider_1.useSession)();
    const userAccountID = session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const userAccountSelector = (0, react_1.useCallback)((allPersonalDetails) => {
        const personalDetailsForUser = allPersonalDetails?.[userAccountID] ?? {};
        personalDetailsForUser.accountID = userAccountID;
        return personalDetailsForUser;
    }, [userAccountID]);
    const [currentUserPersonalDetails = defaultCurrentUserPersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { selector: userAccountSelector, canBeMissing: true });
    return <CurrentUserPersonalDetailsContext.Provider value={currentUserPersonalDetails}>{children}</CurrentUserPersonalDetailsContext.Provider>;
}
