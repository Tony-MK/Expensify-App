"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-restricted-syntax */
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
const UserUtils = require("@libs/UserUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PersonalDetailsActions = require("../../src/libs/actions/PersonalDetails");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@libs/API');
const mockAPI = API;
jest.mock('@libs/Navigation/Navigation');
const mockNavigation = Navigation_1.default;
jest.mock('@libs/PersonalDetailsUtils');
const mockPersonalDetailsUtils = PersonalDetailsUtils;
jest.mock('@libs/UserUtils');
const mockUserUtils = UserUtils;
describe('actions/PersonalDetails', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(() => {
        jest.clearAllMocks();
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('updateAddress', () => {
        it('should call API.write with correct parameters and optimistic data for US addresses and navigate back', async () => {
            const addresses = [
                {
                    street: 'Old Street',
                    city: 'Old City',
                    state: 'NY',
                    zip: '10001',
                    country: CONST_1.default.COUNTRY.US,
                    current: false,
                },
            ];
            const street = '123 Main St';
            const street2 = 'Apt 4';
            const city = 'San Francisco';
            const state = 'CA';
            const zip = '94105';
            const country = CONST_1.default.COUNTRY.US;
            const formattedStreet = '123 Main St Apt 4';
            mockPersonalDetailsUtils.getFormattedStreet.mockReturnValue(formattedStreet);
            PersonalDetailsActions.updateAddress(addresses, street, street2, city, state, zip, country);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_HOME_ADDRESS, {
                homeAddressStreet: street,
                addressStreet2: street2,
                homeAddressCity: city,
                addressState: state,
                addressZipCode: zip,
                addressCountry: country,
            }, {
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                        value: {
                            addresses: [
                                ...addresses,
                                {
                                    street: formattedStreet,
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
            expect(mockPersonalDetailsUtils.getFormattedStreet).toHaveBeenCalledWith(street, street2);
            expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
        });
        it('should include addressStateLong for non-US addresses', async () => {
            const addresses = [];
            const street = '10 Downing St';
            const street2 = '';
            const city = 'London';
            const state = 'Greater London';
            const zip = 'SW1A 2AA';
            const country = CONST_1.default.COUNTRY.GB;
            const formattedStreet = '10 Downing St';
            mockPersonalDetailsUtils.getFormattedStreet.mockReturnValue(formattedStreet);
            PersonalDetailsActions.updateAddress(addresses, street, street2, city, state, zip, country);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_HOME_ADDRESS, {
                homeAddressStreet: street,
                addressStreet2: street2,
                homeAddressCity: city,
                addressState: state,
                addressZipCode: zip,
                addressCountry: country,
                addressStateLong: state,
            }, expect.objectContaining({
                optimisticData: [
                    expect.objectContaining({
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                    }),
                ],
            }));
            expect(mockPersonalDetailsUtils.getFormattedStreet).toHaveBeenCalledWith(street, street2);
            expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
        });
    });
    describe('updateLegalName', () => {
        const mockFormatPhoneNumber = jest.fn((phoneNumber) => phoneNumber);
        beforeEach(() => {
            return react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                email: 'test@example.com',
                accountID: 123,
            }).then(waitForBatchedUpdates_1.default);
        });
        it('should call API.write with correct parameters and optimistic data', async () => {
            const legalFirstName = 'John';
            const legalLastName = 'Doe';
            const currentUserPersonalDetail = {
                firstName: 'John',
                lastName: 'Doe',
            };
            PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName, legalLastName }, {
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                        value: {
                            legalFirstName,
                            legalLastName,
                        },
                    },
                ],
            });
        });
        it('should call Navigation.goBack after API.write', async () => {
            const legalFirstName = 'Jane';
            const legalLastName = 'Smith';
            const currentUserPersonalDetail = {
                firstName: 'Jane',
                lastName: 'Smith',
            };
            PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
        });
        it('should include display name update in optimistic data when user has no firstName and lastName', async () => {
            const legalFirstName = 'Alice';
            const legalLastName = 'Johnson';
            const currentUserPersonalDetail = {
                firstName: '',
                lastName: '',
            };
            const expectedDisplayName = 'Alice Johnson';
            mockPersonalDetailsUtils.createDisplayName.mockReturnValue(expectedDisplayName);
            PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName, legalLastName }, {
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                        value: {
                            legalFirstName,
                            legalLastName,
                        },
                    },
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                displayName: expectedDisplayName,
                                firstName: legalFirstName,
                                lastName: legalLastName,
                            },
                        },
                    },
                ],
            });
        });
        it('should call PersonalDetailsUtils.createDisplayName with correct parameters when user has no firstName and lastName', async () => {
            const legalFirstName = 'Bob';
            const legalLastName = 'Wilson';
            const currentUserPersonalDetail = {
                firstName: '',
                lastName: '',
            };
            PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockPersonalDetailsUtils.createDisplayName).toHaveBeenCalledWith('test@example.com', {
                firstName: legalFirstName,
                lastName: legalLastName,
            }, mockFormatPhoneNumber);
        });
        it('should not include display name update in optimistic data when user has firstName', async () => {
            const legalFirstName = 'Charlie';
            const legalLastName = 'Brown';
            const currentUserPersonalDetail = {
                firstName: 'Charlie',
                lastName: '',
            };
            PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName, legalLastName }, {
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                        value: {
                            legalFirstName,
                            legalLastName,
                        },
                    },
                ],
            });
            expect(mockPersonalDetailsUtils.createDisplayName).not.toHaveBeenCalled();
        });
        it('should not include display name update in optimistic data when user has lastName', async () => {
            const legalFirstName = 'David';
            const legalLastName = 'Miller';
            const currentUserPersonalDetail = {
                firstName: '',
                lastName: 'Miller',
            };
            PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName, legalLastName }, {
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                        value: {
                            legalFirstName,
                            legalLastName,
                        },
                    },
                ],
            });
            expect(mockPersonalDetailsUtils.createDisplayName).not.toHaveBeenCalled();
        });
        it('should handle empty strings for legal names', async () => {
            const legalFirstName = '';
            const legalLastName = '';
            const currentUserPersonalDetail = {
                firstName: '',
                lastName: '',
            };
            PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName, legalLastName }, {
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                        value: {
                            legalFirstName,
                            legalLastName,
                        },
                    },
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                displayName: expect.any(String),
                                firstName: legalFirstName,
                                lastName: legalLastName,
                            },
                        },
                    },
                ],
            });
        });
        it('should handle null/undefined currentUserPersonalDetail', async () => {
            const legalFirstName = 'Eve';
            const legalLastName = 'Davis';
            const currentUserPersonalDetail = null;
            PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName, legalLastName }, {
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                        value: {
                            legalFirstName,
                            legalLastName,
                        },
                    },
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                displayName: expect.any(String),
                                firstName: legalFirstName,
                                lastName: legalLastName,
                            },
                        },
                    },
                ],
            });
        });
        it('should use currentUserAccountID from session for personal details update', async () => {
            const legalFirstName = 'Frank';
            const legalLastName = 'Garcia';
            const currentUserPersonalDetail = {
                firstName: '',
                lastName: '',
            };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                email: 'test@example.com',
                accountID: 456,
            });
            await (0, waitForBatchedUpdates_1.default)();
            PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName, legalLastName }, {
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                        value: {
                            legalFirstName,
                            legalLastName,
                        },
                    },
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            456: {
                                displayName: expect.any(String),
                                firstName: legalFirstName,
                                lastName: legalLastName,
                            },
                        },
                    },
                ],
            });
        });
    });
    describe('updateAvatar', () => {
        beforeEach(() => {
            return react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                email: 'test@example.com',
                accountID: 123,
            }).then(waitForBatchedUpdates_1.default);
        });
        it('should call API.write with correct parameters and optimistic data for File', async () => {
            const mockFile = {
                uri: 'file://test-avatar.jpg',
                name: 'test-avatar.jpg',
            };
            const currentUserPersonalDetail = {
                avatar: 'old-avatar.jpg',
                avatarThumbnail: 'old-avatar-thumb.jpg',
            };
            PersonalDetailsActions.updateAvatar(mockFile, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_USER_AVATAR, { file: mockFile }, {
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                avatar: mockFile.uri,
                                avatarThumbnail: mockFile.uri,
                                originalFileName: mockFile.name,
                                errorFields: {
                                    avatar: null,
                                },
                                pendingFields: {
                                    avatar: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                    originalFileName: null,
                                },
                                fallbackIcon: mockFile.uri,
                            },
                        },
                    },
                ],
                successData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                pendingFields: {
                                    avatar: null,
                                },
                            },
                        },
                    },
                ],
                failureData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                avatar: currentUserPersonalDetail.avatar,
                                avatarThumbnail: currentUserPersonalDetail.avatarThumbnail ?? currentUserPersonalDetail.avatar,
                                pendingFields: {
                                    avatar: null,
                                },
                            },
                        },
                    },
                ],
            });
        });
        it('should call API.write with correct parameters and optimistic data for CustomRNImageManipulatorResult', async () => {
            const mockFile = {
                uri: 'file://test-avatar.jpg',
                name: 'test-avatar.jpg',
                size: 1024,
                type: 'image/jpeg',
            };
            const currentUserPersonalDetail = {
                avatar: 'old-avatar.jpg',
                avatarThumbnail: 'old-avatar-thumb.jpg',
            };
            PersonalDetailsActions.updateAvatar(mockFile, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_USER_AVATAR, { file: mockFile }, {
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                avatar: mockFile.uri,
                                avatarThumbnail: mockFile.uri,
                                originalFileName: mockFile.name,
                                errorFields: {
                                    avatar: null,
                                },
                                pendingFields: {
                                    avatar: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                    originalFileName: null,
                                },
                                fallbackIcon: mockFile.uri,
                            },
                        },
                    },
                ],
                successData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                pendingFields: {
                                    avatar: null,
                                },
                            },
                        },
                    },
                ],
                failureData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                avatar: currentUserPersonalDetail.avatar,
                                avatarThumbnail: currentUserPersonalDetail.avatarThumbnail ?? currentUserPersonalDetail.avatar,
                                pendingFields: {
                                    avatar: null,
                                },
                            },
                        },
                    },
                ],
            });
        });
        it('should handle null avatarThumbnail in failure data', async () => {
            const mockFile = {
                uri: 'file://test-avatar.jpg',
                name: 'test-avatar.jpg',
            };
            const currentUserPersonalDetail = {
                avatar: 'old-avatar.jpg',
                avatarThumbnail: undefined,
            };
            PersonalDetailsActions.updateAvatar(mockFile, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_USER_AVATAR, { file: mockFile }, expect.objectContaining({
                failureData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                avatar: currentUserPersonalDetail.avatar,
                                avatarThumbnail: currentUserPersonalDetail.avatar,
                                pendingFields: {
                                    avatar: null,
                                },
                            },
                        },
                    },
                ],
            }));
        });
        it('should return early when currentUserAccountID is not set', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                email: 'test@example.com',
                accountID: undefined,
            });
            await (0, waitForBatchedUpdates_1.default)();
            const mockFile = {
                uri: 'file://test-avatar.jpg',
                name: 'test-avatar.jpg',
            };
            const currentUserPersonalDetail = {
                avatar: 'old-avatar.jpg',
                avatarThumbnail: 'old-avatar-thumb.jpg',
            };
            PersonalDetailsActions.updateAvatar(mockFile, currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).not.toHaveBeenCalled();
        });
    });
    describe('deleteAvatar', () => {
        beforeEach(() => {
            return react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                email: 'test@example.com',
                accountID: 123,
            }).then(waitForBatchedUpdates_1.default);
        });
        it('should call API.write with correct parameters and optimistic data', async () => {
            const currentUserPersonalDetail = {
                avatar: 'current-avatar.jpg',
                fallbackIcon: 'fallback-icon.jpg',
            };
            const expectedDefaultAvatar = 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_7.png';
            mockUserUtils.getDefaultAvatarURL.mockReturnValue(expectedDefaultAvatar);
            PersonalDetailsActions.deleteAvatar(currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockUserUtils.getDefaultAvatarURL).toHaveBeenCalledWith(123);
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.DELETE_USER_AVATAR, null, {
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                avatar: expectedDefaultAvatar,
                                fallbackIcon: null,
                            },
                        },
                    },
                ],
                failureData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                avatar: currentUserPersonalDetail.avatar,
                                fallbackIcon: currentUserPersonalDetail.fallbackIcon,
                            },
                        },
                    },
                ],
            });
        });
        it('should handle null fallbackIcon in failure data', async () => {
            const currentUserPersonalDetail = {
                avatar: 'current-avatar.jpg',
                fallbackIcon: undefined,
            };
            const expectedDefaultAvatar = 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_7.png';
            mockUserUtils.getDefaultAvatarURL.mockReturnValue(expectedDefaultAvatar);
            PersonalDetailsActions.deleteAvatar(currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.DELETE_USER_AVATAR, null, expect.objectContaining({
                failureData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            123: {
                                avatar: currentUserPersonalDetail.avatar,
                                fallbackIcon: undefined,
                            },
                        },
                    },
                ],
            }));
        });
        it('should return early when currentUserAccountID is not set', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                email: 'test@example.com',
                accountID: undefined,
            });
            await (0, waitForBatchedUpdates_1.default)();
            const currentUserPersonalDetail = {
                avatar: 'current-avatar.jpg',
                fallbackIcon: 'fallback-icon.jpg',
            };
            PersonalDetailsActions.deleteAvatar(currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockUserUtils.getDefaultAvatarURL).not.toHaveBeenCalled();
            expect(mockAPI.write).not.toHaveBeenCalled();
        });
        it('should use different accountID from session', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                email: 'test@example.com',
                accountID: 456,
            });
            await (0, waitForBatchedUpdates_1.default)();
            const currentUserPersonalDetail = {
                avatar: 'current-avatar.jpg',
                fallbackIcon: 'fallback-icon.jpg',
            };
            const expectedDefaultAvatar = 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_7.png';
            mockUserUtils.getDefaultAvatarURL.mockReturnValue(expectedDefaultAvatar);
            PersonalDetailsActions.deleteAvatar(currentUserPersonalDetail);
            await (0, waitForBatchedUpdates_1.default)();
            expect(mockUserUtils.getDefaultAvatarURL).toHaveBeenCalledWith(456);
            expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.DELETE_USER_AVATAR, null, expect.objectContaining({
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            456: {
                                avatar: expectedDefaultAvatar,
                                fallbackIcon: null,
                            },
                        },
                    },
                ],
            }));
        });
    });
});
