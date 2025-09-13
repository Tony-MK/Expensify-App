"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-restricted-syntax */
var react_native_onyx_1 = require("react-native-onyx");
var API = require("@libs/API");
var types_1 = require("@libs/API/types");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
var UserUtils = require("@libs/UserUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var PersonalDetailsActions = require("../../src/libs/actions/PersonalDetails");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@libs/API');
var mockAPI = API;
jest.mock('@libs/Navigation/Navigation');
var mockNavigation = Navigation_1.default;
jest.mock('@libs/PersonalDetailsUtils');
var mockPersonalDetailsUtils = PersonalDetailsUtils;
jest.mock('@libs/UserUtils');
var mockUserUtils = UserUtils;
describe('actions/PersonalDetails', function () {
    beforeAll(function () {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(function () {
        jest.clearAllMocks();
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    afterEach(function () {
        jest.restoreAllMocks();
    });
    describe('updateAddress', function () {
        it('should call API.write with correct parameters and optimistic data for US addresses and navigate back', function () { return __awaiter(void 0, void 0, void 0, function () {
            var addresses, street, street2, city, state, zip, country, formattedStreet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addresses = [
                            {
                                street: 'Old Street',
                                city: 'Old City',
                                state: 'NY',
                                zip: '10001',
                                country: CONST_1.default.COUNTRY.US,
                                current: false,
                            },
                        ];
                        street = '123 Main St';
                        street2 = 'Apt 4';
                        city = 'San Francisco';
                        state = 'CA';
                        zip = '94105';
                        country = CONST_1.default.COUNTRY.US;
                        formattedStreet = '123 Main St Apt 4';
                        mockPersonalDetailsUtils.getFormattedStreet.mockReturnValue(formattedStreet);
                        PersonalDetailsActions.updateAddress(addresses, street, street2, city, state, zip, country);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
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
                                        addresses: __spreadArray(__spreadArray([], addresses, true), [
                                            {
                                                street: formattedStreet,
                                                city: city,
                                                state: state,
                                                zip: zip,
                                                country: country,
                                                current: true,
                                            },
                                        ], false),
                                    },
                                },
                            ],
                        });
                        expect(mockPersonalDetailsUtils.getFormattedStreet).toHaveBeenCalledWith(street, street2);
                        expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should include addressStateLong for non-US addresses', function () { return __awaiter(void 0, void 0, void 0, function () {
            var addresses, street, street2, city, state, zip, country, formattedStreet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addresses = [];
                        street = '10 Downing St';
                        street2 = '';
                        city = 'London';
                        state = 'Greater London';
                        zip = 'SW1A 2AA';
                        country = CONST_1.default.COUNTRY.GB;
                        formattedStreet = '10 Downing St';
                        mockPersonalDetailsUtils.getFormattedStreet.mockReturnValue(formattedStreet);
                        PersonalDetailsActions.updateAddress(addresses, street, street2, city, state, zip, country);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
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
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateLegalName', function () {
        var mockFormatPhoneNumber = jest.fn(function (phoneNumber) { return phoneNumber; });
        beforeEach(function () {
            return react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                email: 'test@example.com',
                accountID: 123,
            }).then(waitForBatchedUpdates_1.default);
        });
        it('should call API.write with correct parameters and optimistic data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var legalFirstName, legalLastName, currentUserPersonalDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        legalFirstName = 'John';
                        legalLastName = 'Doe';
                        currentUserPersonalDetail = {
                            firstName: 'John',
                            lastName: 'Doe',
                        };
                        PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName: legalFirstName, legalLastName: legalLastName }, {
                            optimisticData: [
                                {
                                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                                    key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                                    value: {
                                        legalFirstName: legalFirstName,
                                        legalLastName: legalLastName,
                                    },
                                },
                            ],
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call Navigation.goBack after API.write', function () { return __awaiter(void 0, void 0, void 0, function () {
            var legalFirstName, legalLastName, currentUserPersonalDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        legalFirstName = 'Jane';
                        legalLastName = 'Smith';
                        currentUserPersonalDetail = {
                            firstName: 'Jane',
                            lastName: 'Smith',
                        };
                        PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should include display name update in optimistic data when user has no firstName and lastName', function () { return __awaiter(void 0, void 0, void 0, function () {
            var legalFirstName, legalLastName, currentUserPersonalDetail, expectedDisplayName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        legalFirstName = 'Alice';
                        legalLastName = 'Johnson';
                        currentUserPersonalDetail = {
                            firstName: '',
                            lastName: '',
                        };
                        expectedDisplayName = 'Alice Johnson';
                        mockPersonalDetailsUtils.createDisplayName.mockReturnValue(expectedDisplayName);
                        PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName: legalFirstName, legalLastName: legalLastName }, {
                            optimisticData: [
                                {
                                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                                    key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                                    value: {
                                        legalFirstName: legalFirstName,
                                        legalLastName: legalLastName,
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
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call PersonalDetailsUtils.createDisplayName with correct parameters when user has no firstName and lastName', function () { return __awaiter(void 0, void 0, void 0, function () {
            var legalFirstName, legalLastName, currentUserPersonalDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        legalFirstName = 'Bob';
                        legalLastName = 'Wilson';
                        currentUserPersonalDetail = {
                            firstName: '',
                            lastName: '',
                        };
                        PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        expect(mockPersonalDetailsUtils.createDisplayName).toHaveBeenCalledWith('test@example.com', {
                            firstName: legalFirstName,
                            lastName: legalLastName,
                        }, mockFormatPhoneNumber);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not include display name update in optimistic data when user has firstName', function () { return __awaiter(void 0, void 0, void 0, function () {
            var legalFirstName, legalLastName, currentUserPersonalDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        legalFirstName = 'Charlie';
                        legalLastName = 'Brown';
                        currentUserPersonalDetail = {
                            firstName: 'Charlie',
                            lastName: '',
                        };
                        PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName: legalFirstName, legalLastName: legalLastName }, {
                            optimisticData: [
                                {
                                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                                    key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                                    value: {
                                        legalFirstName: legalFirstName,
                                        legalLastName: legalLastName,
                                    },
                                },
                            ],
                        });
                        expect(mockPersonalDetailsUtils.createDisplayName).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not include display name update in optimistic data when user has lastName', function () { return __awaiter(void 0, void 0, void 0, function () {
            var legalFirstName, legalLastName, currentUserPersonalDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        legalFirstName = 'David';
                        legalLastName = 'Miller';
                        currentUserPersonalDetail = {
                            firstName: '',
                            lastName: 'Miller',
                        };
                        PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName: legalFirstName, legalLastName: legalLastName }, {
                            optimisticData: [
                                {
                                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                                    key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                                    value: {
                                        legalFirstName: legalFirstName,
                                        legalLastName: legalLastName,
                                    },
                                },
                            ],
                        });
                        expect(mockPersonalDetailsUtils.createDisplayName).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle empty strings for legal names', function () { return __awaiter(void 0, void 0, void 0, function () {
            var legalFirstName, legalLastName, currentUserPersonalDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        legalFirstName = '';
                        legalLastName = '';
                        currentUserPersonalDetail = {
                            firstName: '',
                            lastName: '',
                        };
                        PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName: legalFirstName, legalLastName: legalLastName }, {
                            optimisticData: [
                                {
                                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                                    key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                                    value: {
                                        legalFirstName: legalFirstName,
                                        legalLastName: legalLastName,
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
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle null/undefined currentUserPersonalDetail', function () { return __awaiter(void 0, void 0, void 0, function () {
            var legalFirstName, legalLastName, currentUserPersonalDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        legalFirstName = 'Eve';
                        legalLastName = 'Davis';
                        currentUserPersonalDetail = null;
                        PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName: legalFirstName, legalLastName: legalLastName }, {
                            optimisticData: [
                                {
                                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                                    key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                                    value: {
                                        legalFirstName: legalFirstName,
                                        legalLastName: legalLastName,
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
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use currentUserAccountID from session for personal details update', function () { return __awaiter(void 0, void 0, void 0, function () {
            var legalFirstName, legalLastName, currentUserPersonalDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        legalFirstName = 'Frank';
                        legalLastName = 'Garcia';
                        currentUserPersonalDetail = {
                            firstName: '',
                            lastName: '',
                        };
                        return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                                email: 'test@example.com',
                                accountID: 456,
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _a.sent();
                        PersonalDetailsActions.updateLegalName(legalFirstName, legalLastName, mockFormatPhoneNumber, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _a.sent();
                        expect(mockAPI.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.UPDATE_LEGAL_NAME, { legalFirstName: legalFirstName, legalLastName: legalLastName }, {
                            optimisticData: [
                                {
                                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                                    key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
                                    value: {
                                        legalFirstName: legalFirstName,
                                        legalLastName: legalLastName,
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
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateAvatar', function () {
        beforeEach(function () {
            return react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                email: 'test@example.com',
                accountID: 123,
            }).then(waitForBatchedUpdates_1.default);
        });
        it('should call API.write with correct parameters and optimistic data for File', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockFile, currentUserPersonalDetail;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mockFile = {
                            uri: 'file://test-avatar.jpg',
                            name: 'test-avatar.jpg',
                        };
                        currentUserPersonalDetail = {
                            avatar: 'old-avatar.jpg',
                            avatarThumbnail: 'old-avatar-thumb.jpg',
                        };
                        PersonalDetailsActions.updateAvatar(mockFile, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _b.sent();
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
                                            avatarThumbnail: (_a = currentUserPersonalDetail.avatarThumbnail) !== null && _a !== void 0 ? _a : currentUserPersonalDetail.avatar,
                                            pendingFields: {
                                                avatar: null,
                                            },
                                        },
                                    },
                                },
                            ],
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call API.write with correct parameters and optimistic data for CustomRNImageManipulatorResult', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockFile, currentUserPersonalDetail;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mockFile = {
                            uri: 'file://test-avatar.jpg',
                            name: 'test-avatar.jpg',
                            size: 1024,
                            type: 'image/jpeg',
                        };
                        currentUserPersonalDetail = {
                            avatar: 'old-avatar.jpg',
                            avatarThumbnail: 'old-avatar-thumb.jpg',
                        };
                        PersonalDetailsActions.updateAvatar(mockFile, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _b.sent();
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
                                            avatarThumbnail: (_a = currentUserPersonalDetail.avatarThumbnail) !== null && _a !== void 0 ? _a : currentUserPersonalDetail.avatar,
                                            pendingFields: {
                                                avatar: null,
                                            },
                                        },
                                    },
                                },
                            ],
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle null avatarThumbnail in failure data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockFile, currentUserPersonalDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFile = {
                            uri: 'file://test-avatar.jpg',
                            name: 'test-avatar.jpg',
                        };
                        currentUserPersonalDetail = {
                            avatar: 'old-avatar.jpg',
                            avatarThumbnail: undefined,
                        };
                        PersonalDetailsActions.updateAvatar(mockFile, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
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
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return early when currentUserAccountID is not set', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockFile, currentUserPersonalDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                            email: 'test@example.com',
                            accountID: undefined,
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _a.sent();
                        mockFile = {
                            uri: 'file://test-avatar.jpg',
                            name: 'test-avatar.jpg',
                        };
                        currentUserPersonalDetail = {
                            avatar: 'old-avatar.jpg',
                            avatarThumbnail: 'old-avatar-thumb.jpg',
                        };
                        PersonalDetailsActions.updateAvatar(mockFile, currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _a.sent();
                        expect(mockAPI.write).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('deleteAvatar', function () {
        beforeEach(function () {
            return react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                email: 'test@example.com',
                accountID: 123,
            }).then(waitForBatchedUpdates_1.default);
        });
        it('should call API.write with correct parameters and optimistic data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var currentUserPersonalDetail, expectedDefaultAvatar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentUserPersonalDetail = {
                            avatar: 'current-avatar.jpg',
                            fallbackIcon: 'fallback-icon.jpg',
                        };
                        expectedDefaultAvatar = 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_7.png';
                        mockUserUtils.getDefaultAvatarURL.mockReturnValue(expectedDefaultAvatar);
                        PersonalDetailsActions.deleteAvatar(currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
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
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle null fallbackIcon in failure data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var currentUserPersonalDetail, expectedDefaultAvatar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentUserPersonalDetail = {
                            avatar: 'current-avatar.jpg',
                            fallbackIcon: undefined,
                        };
                        expectedDefaultAvatar = 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_7.png';
                        mockUserUtils.getDefaultAvatarURL.mockReturnValue(expectedDefaultAvatar);
                        PersonalDetailsActions.deleteAvatar(currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
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
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return early when currentUserAccountID is not set', function () { return __awaiter(void 0, void 0, void 0, function () {
            var currentUserPersonalDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                            email: 'test@example.com',
                            accountID: undefined,
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _a.sent();
                        currentUserPersonalDetail = {
                            avatar: 'current-avatar.jpg',
                            fallbackIcon: 'fallback-icon.jpg',
                        };
                        PersonalDetailsActions.deleteAvatar(currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _a.sent();
                        expect(mockUserUtils.getDefaultAvatarURL).not.toHaveBeenCalled();
                        expect(mockAPI.write).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use different accountID from session', function () { return __awaiter(void 0, void 0, void 0, function () {
            var currentUserPersonalDetail, expectedDefaultAvatar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                            email: 'test@example.com',
                            accountID: 456,
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _a.sent();
                        currentUserPersonalDetail = {
                            avatar: 'current-avatar.jpg',
                            fallbackIcon: 'fallback-icon.jpg',
                        };
                        expectedDefaultAvatar = 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_7.png';
                        mockUserUtils.getDefaultAvatarURL.mockReturnValue(expectedDefaultAvatar);
                        PersonalDetailsActions.deleteAvatar(currentUserPersonalDetail);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _a.sent();
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
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
