"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAvatarErrors = clearAvatarErrors;
exports.deleteAvatar = deleteAvatar;
exports.openPublicProfilePage = openPublicProfilePage;
exports.updateAddress = updateAddress;
exports.updateAutomaticTimezone = updateAutomaticTimezone;
exports.updateAvatar = updateAvatar;
exports.updateDateOfBirth = updateDateOfBirth;
exports.setDisplayName = setDisplayName;
exports.updateDisplayName = updateDisplayName;
exports.updateLegalName = updateLegalName;
exports.updatePhoneNumber = updatePhoneNumber;
exports.clearPhoneNumberError = clearPhoneNumberError;
exports.updatePronouns = updatePronouns;
exports.updateSelectedTimezone = updateSelectedTimezone;
exports.updatePersonalDetailsAndShipExpensifyCards = updatePersonalDetailsAndShipExpensifyCards;
exports.clearPersonalDetailsErrors = clearPersonalDetailsErrors;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const DateUtils_1 = require("@libs/DateUtils");
const ErrorUtils = require("@libs/ErrorUtils");
const LoginUtils = require("@libs/LoginUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
const UserUtils = require("@libs/UserUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
let currentUserEmail = '';
let currentUserAccountID = -1;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (val) => {
        currentUserEmail = val?.email ?? '';
        currentUserAccountID = val?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    },
});
function updatePronouns(pronouns) {
    if (!currentUserAccountID) {
        return;
    }
    const parameters = { pronouns };
    API.write(types_1.WRITE_COMMANDS.UPDATE_PRONOUNS, parameters, {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                value: {
                    [currentUserAccountID]: {
                        pronouns,
                    },
                },
            },
        ],
    });
}
function setDisplayName(firstName, lastName, formatPhoneNumber) {
    if (!currentUserAccountID) {
        return;
    }
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
        [currentUserAccountID]: {
            firstName,
            lastName,
            displayName: PersonalDetailsUtils.createDisplayName(currentUserEmail ?? '', {
                firstName,
                lastName,
            }, formatPhoneNumber),
        },
    });
}
function updateDisplayName(firstName, lastName, formatPhoneNumber) {
    if (!currentUserAccountID) {
        return;
    }
    const parameters = { firstName, lastName };
    API.write(types_1.WRITE_COMMANDS.UPDATE_DISPLAY_NAME, parameters, {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                value: {
                    [currentUserAccountID]: {
                        firstName,
                        lastName,
                        displayName: PersonalDetailsUtils.createDisplayName(currentUserEmail ?? '', {
                            firstName,
                            lastName,
                        }, formatPhoneNumber),
                    },
                },
            },
        ],
    });
}
function updateLegalName(legalFirstName, legalLastName, formatPhoneNumber, currentUserPersonalDetail) {
    const parameters = { legalFirstName, legalLastName };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
            value: {
                legalFirstName,
                legalLastName,
            },
        },
    ];
    // In case the user does not have a display name, we will update the display name based on the legal name
    if (!currentUserPersonalDetail?.firstName && !currentUserPersonalDetail?.lastName) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: {
                [currentUserAccountID]: {
                    displayName: PersonalDetailsUtils.createDisplayName(currentUserEmail ?? '', {
                        firstName: legalFirstName,
                        lastName: legalLastName,
                    }, formatPhoneNumber),
                    firstName: legalFirstName,
                    lastName: legalLastName,
                },
            },
        });
    }
    API.write(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, parameters, {
        optimisticData,
    });
    Navigation_1.default.goBack();
}
/**
 * @param dob - date of birth
 */
function updateDateOfBirth({ dob }) {
    const parameters = { dob };
    API.write(types_1.WRITE_COMMANDS.UPDATE_DATE_OF_BIRTH, parameters, {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                value: {
                    dob,
                },
            },
        ],
    });
    Navigation_1.default.goBack();
}
function updatePhoneNumber(phoneNumber, currentPhoneNumber) {
    const parameters = { phoneNumber };
    API.write(types_1.WRITE_COMMANDS.UPDATE_PHONE_NUMBER, parameters, {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                value: {
                    phoneNumber,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                value: {
                    phoneNumber: currentPhoneNumber,
                    errorFields: {
                        phoneNumber: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('privatePersonalDetails.error.invalidPhoneNumber'),
                    },
                },
            },
        ],
    });
}
function clearPhoneNumberError() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, {
        errorFields: {
            phoneNumber: null,
        },
    });
}
function updateAddress(addresses, street, street2, city, state, zip, country) {
    const parameters = {
        homeAddressStreet: street,
        addressStreet2: street2,
        homeAddressCity: city,
        addressState: state,
        addressZipCode: zip,
        addressCountry: country,
    };
    // State names for the United States are in the form of two-letter ISO codes
    // State names for other countries except US have full names, so we provide two different params to be handled by server
    if (country !== CONST_1.default.COUNTRY.US) {
        parameters.addressStateLong = state;
    }
    API.write(types_1.WRITE_COMMANDS.UPDATE_HOME_ADDRESS, parameters, {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                value: {
                    addresses: [
                        ...addresses,
                        {
                            street: PersonalDetailsUtils.getFormattedStreet(street, street2),
                            city,
                            state,
                            zip,
                            country,
                            current: true,
                        },
                    ],
                },
            },
        ],
    });
    Navigation_1.default.goBack();
}
/**
 * Updates timezone's 'automatic' setting, and updates
 * selected timezone if set to automatically update.
 */
function updateAutomaticTimezone(timezone) {
    if (!currentUserAccountID) {
        return;
    }
    const formattedTimezone = DateUtils_1.default.formatToSupportedTimezone(timezone);
    const parameters = {
        timezone: JSON.stringify(formattedTimezone),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_AUTOMATIC_TIMEZONE, parameters, {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                value: {
                    [currentUserAccountID]: {
                        timezone: formattedTimezone,
                    },
                },
            },
        ],
    });
}
/**
 * Updates user's 'selected' timezone, then navigates to the
 * initial Timezone page.
 */
function updateSelectedTimezone(selectedTimezone) {
    const timezone = {
        selected: selectedTimezone,
    };
    const parameters = {
        timezone: JSON.stringify(timezone),
    };
    if (currentUserAccountID) {
        API.write(types_1.WRITE_COMMANDS.UPDATE_SELECTED_TIMEZONE, parameters, {
            optimisticData: [
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                    value: {
                        [currentUserAccountID]: {
                            timezone,
                        },
                    },
                },
            ],
        });
    }
    Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_TIMEZONE);
}
/**
 * Fetches public profile info about a given user.
 * The API will only return the accountID, displayName, and avatar for the user
 * but the profile page will use other info (e.g. contact methods and pronouns) if they are already available in Onyx
 */
function openPublicProfilePage(accountID) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_METADATA,
            value: {
                [accountID]: {
                    isLoading: true,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_METADATA,
            value: {
                [accountID]: {
                    isLoading: false,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_METADATA,
            value: {
                [accountID]: {
                    isLoading: false,
                },
            },
        },
    ];
    const parameters = { accountID };
    API.read(types_1.READ_COMMANDS.OPEN_PUBLIC_PROFILE_PAGE, parameters, { optimisticData, successData, failureData });
}
/**
 * Updates the user's avatar image
 */
function updateAvatar(file, currentUserPersonalDetails) {
    if (!currentUserAccountID) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: {
                [currentUserAccountID]: {
                    avatar: file.uri,
                    avatarThumbnail: file.uri,
                    originalFileName: file.name,
                    errorFields: {
                        avatar: null,
                    },
                    pendingFields: {
                        avatar: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        originalFileName: null,
                    },
                    fallbackIcon: file.uri,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: {
                [currentUserAccountID]: {
                    pendingFields: {
                        avatar: null,
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: {
                [currentUserAccountID]: {
                    avatar: currentUserPersonalDetails?.avatar,
                    avatarThumbnail: currentUserPersonalDetails?.avatarThumbnail ?? currentUserPersonalDetails?.avatar,
                    pendingFields: {
                        avatar: null,
                    },
                },
            },
        },
    ];
    const parameters = { file };
    API.write(types_1.WRITE_COMMANDS.UPDATE_USER_AVATAR, parameters, { optimisticData, successData, failureData });
}
/**
 * Replaces the user's avatar image with a default avatar
 */
function deleteAvatar(currentUserPersonalDetails) {
    if (!currentUserAccountID) {
        return;
    }
    // We want to use the old dot avatar here as this affects both platforms.
    const defaultAvatar = UserUtils.getDefaultAvatarURL(currentUserAccountID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: {
                [currentUserAccountID]: {
                    avatar: defaultAvatar,
                    fallbackIcon: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: {
                [currentUserAccountID]: {
                    avatar: currentUserPersonalDetails?.avatar,
                    fallbackIcon: currentUserPersonalDetails?.fallbackIcon,
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.DELETE_USER_AVATAR, null, { optimisticData, failureData });
}
/**
 * Clear error and pending fields for the current user's avatar
 */
function clearAvatarErrors() {
    if (!currentUserAccountID) {
        return;
    }
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
        [currentUserAccountID]: {
            errorFields: {
                avatar: null,
            },
            pendingFields: {
                avatar: null,
            },
        },
    });
}
/**
 * Clear errors for the current user's personal details
 */
function clearPersonalDetailsErrors() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, {
        errors: null,
    });
}
function updatePersonalDetailsAndShipExpensifyCards(values, validateCode, countryCode) {
    const parameters = {
        legalFirstName: values.legalFirstName?.trim() ?? '',
        legalLastName: values.legalLastName?.trim() ?? '',
        phoneNumber: LoginUtils.appendCountryCodeWithCountryCode(values.phoneNumber?.trim() ?? '', countryCode),
        addressCity: values.city.trim(),
        addressStreet: values.addressLine1?.trim() ?? '',
        addressStreet2: values.addressLine2?.trim() ?? '',
        addressZip: values.zipPostCode?.trim().toUpperCase() ?? '',
        addressCountry: values.country,
        addressState: values.state.trim(),
        dob: values.dob,
        validateCode,
    };
    API.write(types_1.WRITE_COMMANDS.SET_PERSONAL_DETAILS_AND_SHIP_EXPENSIFY_CARDS, parameters, {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                value: {
                    isLoading: true,
                },
            },
        ],
        finallyData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                value: {
                    isLoading: false,
                },
            },
        ],
    });
}
