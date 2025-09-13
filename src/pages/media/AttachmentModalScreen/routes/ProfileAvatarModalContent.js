"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const PersonalDetails_1 = require("@libs/actions/PersonalDetails");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const UserUtils_1 = require("@libs/UserUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const AttachmentModalContainer_1 = require("@pages/media/AttachmentModalScreen/AttachmentModalContainer");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ProfileAvatarModalContent({ navigation, route }) {
    const { accountID = CONST_1.default.DEFAULT_NUMBER_ID } = route.params;
    const { formatPhoneNumber } = (0, useLocalize_1.default)();
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const personalDetail = personalDetails?.[accountID];
    const [personalDetailsMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_METADATA, { canBeMissing: false });
    const avatarURL = personalDetail?.avatar ?? '';
    const displayName = (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(personalDetail);
    const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    (0, react_1.useEffect)(() => {
        if (!(0, ValidationUtils_1.isValidAccountRoute)(accountID)) {
            return;
        }
        (0, PersonalDetails_1.openPublicProfilePage)(accountID);
    }, [accountID]);
    const contentProps = (0, react_1.useMemo)(() => ({
        source: (0, UserUtils_1.getFullSizeAvatar)(avatarURL, accountID),
        isLoading: !!(personalDetailsMetadata?.[accountID]?.isLoading ?? (isLoadingApp && !Object.keys(personalDetail ?? {}).length)),
        headerTitle: formatPhoneNumber(displayName),
        originalFileName: personalDetail?.originalFileName ?? '',
        shouldShowNotFoundPage: !avatarURL,
        maybeIcon: true,
    }), [accountID, avatarURL, displayName, isLoadingApp, personalDetail, personalDetailsMetadata, formatPhoneNumber]);
    return (<AttachmentModalContainer_1.default navigation={navigation} contentProps={contentProps}/>);
}
ProfileAvatarModalContent.displayName = 'ProfileAvatarModalContent';
exports.default = ProfileAvatarModalContent;
