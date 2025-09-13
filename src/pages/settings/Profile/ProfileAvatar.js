"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AttachmentModal_1 = require("@components/AttachmentModal");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const UserUtils_1 = require("@libs/UserUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const PersonalDetails_1 = require("@userActions/PersonalDetails");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ProfileAvatar({ route }) {
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: true });
    const [personalDetailsMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_METADATA, { canBeMissing: true });
    const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const personalDetail = personalDetails?.[route.params.accountID];
    const avatarURL = personalDetail?.avatar ?? '';
    const accountID = Number(route.params.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID);
    const isLoading = personalDetailsMetadata?.[accountID]?.isLoading ?? (isLoadingApp && !Object.keys(personalDetail ?? {}).length);
    const displayName = (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(personalDetail);
    const { formatPhoneNumber } = (0, useLocalize_1.default)();
    (0, react_1.useEffect)(() => {
        if (!(0, ValidationUtils_1.isValidAccountRoute)(Number(accountID))) {
            return;
        }
        (0, PersonalDetails_1.openPublicProfilePage)(accountID);
    }, [accountID, avatarURL]);
    return (<AttachmentModal_1.default headerTitle={formatPhoneNumber(displayName)} defaultOpen source={(0, UserUtils_1.getFullSizeAvatar)(avatarURL, accountID)} onModalClose={() => Navigation_1.default.goBack(route.params?.backTo)} originalFileName={personalDetail?.originalFileName ?? ''} isLoading={!!isLoading} shouldShowNotFoundPage={!avatarURL} maybeIcon/>);
}
ProfileAvatar.displayName = 'ProfileAvatar';
exports.default = ProfileAvatar;
