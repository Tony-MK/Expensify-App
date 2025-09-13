"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var AttachmentModal_1 = require("@components/AttachmentModal");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var UserUtils_1 = require("@libs/UserUtils");
var ValidationUtils_1 = require("@libs/ValidationUtils");
var PersonalDetails_1 = require("@userActions/PersonalDetails");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function ProfileAvatar(_a) {
    var _b, _c, _d, _e, _f;
    var route = _a.route;
    var personalDetails = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: true })[0];
    var personalDetailsMetadata = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_METADATA, { canBeMissing: true })[0];
    var _g = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true })[0], isLoadingApp = _g === void 0 ? true : _g;
    var personalDetail = personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[route.params.accountID];
    var avatarURL = (_b = personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.avatar) !== null && _b !== void 0 ? _b : '';
    var accountID = Number((_c = route.params.accountID) !== null && _c !== void 0 ? _c : CONST_1.default.DEFAULT_NUMBER_ID);
    var isLoading = (_e = (_d = personalDetailsMetadata === null || personalDetailsMetadata === void 0 ? void 0 : personalDetailsMetadata[accountID]) === null || _d === void 0 ? void 0 : _d.isLoading) !== null && _e !== void 0 ? _e : (isLoadingApp && !Object.keys(personalDetail !== null && personalDetail !== void 0 ? personalDetail : {}).length);
    var displayName = (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(personalDetail);
    var formatPhoneNumber = (0, useLocalize_1.default)().formatPhoneNumber;
    (0, react_1.useEffect)(function () {
        if (!(0, ValidationUtils_1.isValidAccountRoute)(Number(accountID))) {
            return;
        }
        (0, PersonalDetails_1.openPublicProfilePage)(accountID);
    }, [accountID, avatarURL]);
    return (<AttachmentModal_1.default headerTitle={formatPhoneNumber(displayName)} defaultOpen source={(0, UserUtils_1.getFullSizeAvatar)(avatarURL, accountID)} onModalClose={function () { var _a; return Navigation_1.default.goBack((_a = route.params) === null || _a === void 0 ? void 0 : _a.backTo); }} originalFileName={(_f = personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.originalFileName) !== null && _f !== void 0 ? _f : ''} isLoading={!!isLoading} shouldShowNotFoundPage={!avatarURL} maybeIcon/>);
}
ProfileAvatar.displayName = 'ProfileAvatar';
exports.default = ProfileAvatar;
