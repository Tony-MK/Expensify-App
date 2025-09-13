"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const DateUtils_1 = require("@libs/DateUtils");
const DebugUtils_1 = require("@libs/DebugUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const reports_1 = require("../../__mocks__/reportData/reports");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_2 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const MOCK_REPORT = {
    ...(0, reports_2.createRandomReport)(0),
};
const MOCK_REPORT_ACTION = {
    ...(0, reportActions_1.default)(0),
    originalMessage: undefined,
};
const MOCK_TRANSACTION = (0, transaction_1.default)(0);
const MOCK_DRAFT_REPORT_ACTION = DebugUtils_1.default.onyxDataToString(MOCK_REPORT_ACTION);
const MOCK_CONST_ENUM = {
    foo: 'foo',
    bar: 'bar',
};
const TEST_OBJECT = {
    a: 1,
    b: 'a',
    c: [],
    d: {},
    e: true,
    f: false,
};
const TEST_OBJECT_TYPE = {
    a: 'number',
    b: 'string',
    c: 'array',
    d: 'object',
    e: 'boolean',
    f: 'boolean',
};
describe('DebugUtils', () => {
    describe('onyxDataToString', () => {
        it('returns "undefined" when data is undefined', () => {
            expect(DebugUtils_1.default.onyxDataToString(undefined)).toBe('undefined');
        });
        it('returns JSON string when data is an object', () => {
            expect(DebugUtils_1.default.onyxDataToString(MOCK_REPORT_ACTION)).toBe(MOCK_DRAFT_REPORT_ACTION);
        });
        it('returns string when data is string', () => {
            expect(DebugUtils_1.default.onyxDataToString(2)).toBe('2');
        });
    });
    describe('stringToOnyxData', () => {
        it('returns number when type is number', () => {
            expect(DebugUtils_1.default.stringToOnyxData('2', 'number')).toBe(2);
        });
        it('returns object when type is object', () => {
            expect(DebugUtils_1.default.stringToOnyxData('{\n      "a": 2\n}', 'object')).toEqual({ a: 2 });
        });
        it('returns true when type is boolean and data is "true"', () => {
            expect(DebugUtils_1.default.stringToOnyxData('true', 'boolean')).toBe(true);
        });
        it('returns false when type is boolean and data is "false"', () => {
            expect(DebugUtils_1.default.stringToOnyxData('false', 'boolean')).toBe(false);
        });
        it('returns null when type is undefined', () => {
            expect(DebugUtils_1.default.stringToOnyxData('2', 'undefined')).toBe(null);
        });
        it('returns string when type is string', () => {
            expect(DebugUtils_1.default.stringToOnyxData('2', 'string')).toBe('2');
        });
        it('returns string when type is not specified', () => {
            expect(DebugUtils_1.default.stringToOnyxData('2')).toBe('2');
        });
    });
    describe('compareStringWithOnyxData', () => {
        it('returns true when data is undefined and text is "undefined"', () => {
            expect(DebugUtils_1.default.compareStringWithOnyxData('undefined', undefined)).toBe(true);
        });
        it('returns false when data is undefined and text is not "undefined"', () => {
            expect(DebugUtils_1.default.compareStringWithOnyxData('A', undefined)).toBe(false);
        });
        it('returns true when data is object and text is data in JSON format', () => {
            expect(DebugUtils_1.default.compareStringWithOnyxData(MOCK_DRAFT_REPORT_ACTION, MOCK_REPORT_ACTION)).toBe(true);
        });
        it('returns false when data is object and text is not data in JSON format', () => {
            expect(DebugUtils_1.default.compareStringWithOnyxData('{}', MOCK_REPORT_ACTION)).toBe(false);
        });
        it('returns true when data is string and text equals to data', () => {
            expect(DebugUtils_1.default.compareStringWithOnyxData('A', 'A')).toBe(true);
        });
        it('returns false when data is string and text is not equal to data', () => {
            expect(DebugUtils_1.default.compareStringWithOnyxData('2', 'A')).toBe(false);
        });
    });
    describe('getNumberOfLinesFromString', () => {
        it('returns 1 when string is empty', () => {
            expect(DebugUtils_1.default.getNumberOfLinesFromString('')).toBe(1);
        });
        it('returns 1 when no "\\n" are present in the string', () => {
            expect(DebugUtils_1.default.getNumberOfLinesFromString('Something something something')).toBe(1);
        });
        it('returns k when there are k - 1 "\\n" present in the string', () => {
            expect(DebugUtils_1.default.getNumberOfLinesFromString('Line1\n Line2\nLine3')).toBe(3);
        });
    });
    describe('validateNumber', () => {
        it('does not throw SyntaxError when value is "undefined"', () => {
            expect(() => {
                DebugUtils_1.default.validateNumber('undefined');
            }).not.toThrow();
        });
        it('does not throw SyntaxError when value is a valid string representation of a number', () => {
            expect(() => {
                DebugUtils_1.default.validateNumber('1');
            }).not.toThrow();
        });
        it('does not throw SyntaxError when value is an empty string', () => {
            expect(() => {
                DebugUtils_1.default.validateNumber('');
            }).not.toThrow();
        });
        it('throws SyntaxError when value is not a valid number', () => {
            expect(() => {
                DebugUtils_1.default.validateNumber('A');
            }).toThrow();
        });
    });
    describe('validateBoolean', () => {
        it('does not throw SyntaxError when value is "undefined"', () => {
            expect(() => {
                DebugUtils_1.default.validateBoolean('undefined');
            }).not.toThrow();
        });
        it('does not throw SyntaxError when value is a valid string representation of true', () => {
            expect(() => {
                DebugUtils_1.default.validateBoolean('true');
            }).not.toThrow();
        });
        it('does not throw SyntaxError when value is a valid string representation of false', () => {
            expect(() => {
                DebugUtils_1.default.validateBoolean('false');
            }).not.toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a boolean', () => {
            expect(() => {
                DebugUtils_1.default.validateBoolean('1');
            }).toThrow();
        });
    });
    describe('validateDate', () => {
        it('does not throw SyntaxError when value is "undefined"', () => {
            expect(() => {
                DebugUtils_1.default.validateDate('undefined');
            }).not.toThrow();
        });
        it('does not throw SyntaxError when value is a valid string representation of a date', () => {
            expect(() => {
                DebugUtils_1.default.validateDate('2024-08-08 18:20:44.171');
            }).not.toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a date - number', () => {
            expect(() => {
                DebugUtils_1.default.validateDate('1');
            }).toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a date - invalid year', () => {
            expect(() => {
                DebugUtils_1.default.validateDate('20-08-08 18:20:44.171');
            }).toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a date - invalid month', () => {
            expect(() => {
                DebugUtils_1.default.validateDate('2024-14-08 18:20:44.171');
            }).toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a date - invalid day', () => {
            expect(() => {
                DebugUtils_1.default.validateDate('2024-08-40 18:20:44.171');
            }).toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a date - invalid hour', () => {
            expect(() => {
                DebugUtils_1.default.validateDate('2024-08-08 32:20:44.171');
            }).toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a date - invalid minutes', () => {
            expect(() => {
                DebugUtils_1.default.validateDate('2024-08-08 18:70:44.171');
            }).toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a date - invalid seconds', () => {
            expect(() => {
                DebugUtils_1.default.validateDate('2024-08-08 18:20:70.171');
            }).toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a date - invalid milliseconds', () => {
            expect(() => {
                DebugUtils_1.default.validateDate('2024-08-08 18:20:44.1710');
            }).toThrow();
        });
    });
    describe('validateConstantEnum', () => {
        it('does not throw SyntaxError when value is "undefined"', () => {
            expect(() => {
                DebugUtils_1.default.validateConstantEnum('undefined', MOCK_CONST_ENUM);
            }).not.toThrow();
        });
        it('does not throw SyntaxError when value is an empty string', () => {
            expect(() => {
                DebugUtils_1.default.validateConstantEnum('', MOCK_CONST_ENUM);
            }).not.toThrow();
        });
        it('does not throw SyntaxError when value is a valid string representation of a constant enum', () => {
            expect(() => {
                DebugUtils_1.default.validateConstantEnum('foo', MOCK_CONST_ENUM);
            }).not.toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a constant enum', () => {
            expect(() => {
                DebugUtils_1.default.validateConstantEnum('1', MOCK_CONST_ENUM);
            }).toThrow();
        });
    });
    describe('validateArray', () => {
        it('does not throw SyntaxError when value is "undefined"', () => {
            expect(() => {
                DebugUtils_1.default.validateArray('undefined', 'number');
            }).not.toThrow();
        });
        it('does not throw SyntaxError when value is a string representation of an empty array', () => {
            expect(() => {
                DebugUtils_1.default.validateArray('[]', 'number');
            }).not.toThrow();
        });
        it('does not throw SyntaxError when value is a valid string representation of a number array', () => {
            expect(() => {
                DebugUtils_1.default.validateArray('[1]', 'number');
            }).not.toThrow();
        });
        it('does not throw SyntaxError when value is a valid string representation of a string array', () => {
            expect(() => {
                DebugUtils_1.default.validateArray('["a"]', 'string');
            }).not.toThrow();
        });
        it('does not throw SyntaxError when value is a valid string representation of an object array', () => {
            expect(() => {
                DebugUtils_1.default.validateArray(DebugUtils_1.default.onyxDataToString([TEST_OBJECT]), TEST_OBJECT_TYPE);
            }).not.toThrow();
        });
        it('throws SyntaxError when value is just a string', () => {
            expect(() => {
                DebugUtils_1.default.validateArray('a', 'number');
            }).toThrow();
        });
        it('throws SyntaxError when value is a string representation of an object', () => {
            expect(() => {
                DebugUtils_1.default.validateArray('{}', 'number');
            }).toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a number array', () => {
            expect(() => {
                DebugUtils_1.default.validateArray('["a"]', 'number');
            }).toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a string array', () => {
            expect(() => {
                DebugUtils_1.default.validateArray('[1]', 'string');
            }).toThrow();
        });
        it('throws SyntaxError when value is not a valid string representation of a constant enum array', () => {
            expect(() => {
                DebugUtils_1.default.validateArray('["a"]', MOCK_CONST_ENUM);
            }).toThrow();
        });
        it('throws SyntaxError when value is a valid string representation of an object array but it has an invalid property type', () => {
            expect(() => {
                DebugUtils_1.default.validateArray(DebugUtils_1.default.onyxDataToString([
                    {
                        c: 'a',
                    },
                ]), {
                    c: ['number', 'undefined'],
                });
            }).toThrow();
        });
        it('does not throw SyntaxError when value is a valid string representation of an object array and has valid property types', () => {
            expect(() => {
                DebugUtils_1.default.validateArray(DebugUtils_1.default.onyxDataToString([
                    {
                        c: 2,
                    },
                ]), {
                    c: ['number', 'undefined'],
                });
            }).not.toThrow();
        });
        it("throws SyntaxError when value is a valid string representation of an object array but there's a property type which is not an array as expected", () => {
            expect(() => {
                DebugUtils_1.default.validateArray(DebugUtils_1.default.onyxDataToString([
                    {
                        c: 2,
                    },
                ]), {
                    c: 'array',
                });
            }).toThrow();
        });
    });
    describe('validateObject', () => {
        describe('value is undefined', () => {
            it('does not throw SyntaxError', () => {
                expect(() => {
                    DebugUtils_1.default.validateObject('undefined', {});
                }).not.toThrow();
            });
        });
        describe('value is null', () => {
            it('does not throw SyntaxError', () => {
                expect(() => {
                    DebugUtils_1.default.validateObject('null', {});
                }).not.toThrow();
            });
        });
        describe('value is a JSON representation of an object', () => {
            describe('object is valid', () => {
                it('does not throw SyntaxError', () => {
                    expect(() => {
                        DebugUtils_1.default.validateObject(DebugUtils_1.default.onyxDataToString(TEST_OBJECT), TEST_OBJECT_TYPE);
                    }).not.toThrow();
                });
            });
            describe('object has an invalid property', () => {
                it('throws SyntaxError', () => {
                    expect(() => {
                        DebugUtils_1.default.validateObject(DebugUtils_1.default.onyxDataToString({
                            a: 'a',
                            b: 'a',
                            c: [],
                            d: {},
                            e: true,
                            f: false,
                        }), TEST_OBJECT_TYPE);
                    }).toThrow();
                });
            });
            describe('object is a collection', () => {
                describe('collection index type is invalid', () => {
                    it('throws SyntaxError', () => {
                        expect(() => {
                            DebugUtils_1.default.validateObject(DebugUtils_1.default.onyxDataToString({
                                a: {
                                    foo: 'bar',
                                },
                            }), {
                                foo: 'string',
                            }, 'number');
                        }).toThrow();
                    });
                });
                describe('collection index type is valid', () => {
                    describe('collection value type is not valid', () => {
                        it('throws SyntaxError', () => {
                            expect(() => {
                                DebugUtils_1.default.validateObject(DebugUtils_1.default.onyxDataToString({
                                    a: [1, 2, 3],
                                }), {
                                    foo: 'string',
                                }, 'string');
                            }).toThrow();
                        });
                    });
                });
            });
        });
        describe('value is a JSON representation of an array', () => {
            it('throws SyntaxError', () => {
                expect(() => {
                    DebugUtils_1.default.validateObject(DebugUtils_1.default.onyxDataToString([TEST_OBJECT]), TEST_OBJECT_TYPE);
                }).toThrow();
            });
        });
        describe('JSON contains an invalid property', () => {
            it('throws SyntaxError', () => {
                expect(() => {
                    DebugUtils_1.default.validateObject(DebugUtils_1.default.onyxDataToString({
                        a: 'a',
                        b: 'a',
                        c: [],
                        d: {},
                        e: true,
                        f: false,
                    }), TEST_OBJECT_TYPE);
                }).toThrow();
            });
        });
    });
    describe('validateString', () => {
        describe('value is undefined', () => {
            it('does not throw SyntaxError"', () => {
                expect(() => {
                    DebugUtils_1.default.validateString('undefined');
                }).not.toThrow();
            });
        });
    });
    describe('validateReportDraftProperty', () => {
        describe.each(Object.keys(MOCK_REPORT))('%s', (key) => {
            describe('is undefined', () => {
                it(`${DebugUtils_1.default.REPORT_REQUIRED_PROPERTIES.includes(key) ? 'throws SyntaxError' : 'does not throw SyntaxError'}`, () => {
                    if (DebugUtils_1.default.REPORT_REQUIRED_PROPERTIES.includes(key)) {
                        expect(() => {
                            DebugUtils_1.default.validateReportDraftProperty(key, 'undefined');
                        }).toThrow();
                    }
                    else {
                        expect(() => {
                            DebugUtils_1.default.validateReportDraftProperty(key, 'undefined');
                        }).not.toThrow();
                    }
                });
            });
            describe('is invalid', () => {
                it('throws SyntaxError', () => {
                    const value = MOCK_REPORT[key];
                    let invalidValue;
                    switch (typeof value) {
                        case 'number':
                            invalidValue = 'a';
                            break;
                        case 'boolean':
                        case 'object':
                            invalidValue = 2;
                            break;
                        default:
                            invalidValue = [];
                    }
                    expect(() => {
                        DebugUtils_1.default.validateReportDraftProperty(key, DebugUtils_1.default.onyxDataToString(invalidValue));
                    }).toThrow();
                });
            });
            describe('is valid', () => {
                it('does not throw SyntaxError', () => {
                    expect(() => {
                        DebugUtils_1.default.validateReportDraftProperty(key, DebugUtils_1.default.onyxDataToString(MOCK_REPORT[key]));
                    }).not.toThrow();
                });
            });
        });
    });
    describe('validateReportActionDraftProperty', () => {
        describe.each(Object.keys(MOCK_REPORT_ACTION))('%s', (key) => {
            it(`${DebugUtils_1.default.REPORT_ACTION_REQUIRED_PROPERTIES.includes(key) ? "throws SyntaxError when 'undefined'" : 'does not throw SyntaxError when "undefined"'}`, () => {
                if (DebugUtils_1.default.REPORT_ACTION_REQUIRED_PROPERTIES.includes(key)) {
                    expect(() => {
                        DebugUtils_1.default.validateReportActionDraftProperty(key, 'undefined');
                    }).toThrow();
                }
                else {
                    expect(() => {
                        DebugUtils_1.default.validateReportActionDraftProperty(key, 'undefined');
                    }).not.toThrow();
                }
            });
            it('throws SyntaxError when invalid', () => {
                const value = MOCK_REPORT_ACTION[key];
                let invalidValue;
                switch (typeof value) {
                    case 'number':
                        invalidValue = 'a';
                        break;
                    case 'boolean':
                    case 'object':
                        invalidValue = 2;
                        break;
                    default:
                        invalidValue = [];
                }
                expect(() => {
                    DebugUtils_1.default.validateReportActionDraftProperty(key, DebugUtils_1.default.onyxDataToString(invalidValue));
                }).toThrow();
            });
            it('does not throw SyntaxError when valid', () => {
                expect(() => {
                    DebugUtils_1.default.validateReportActionDraftProperty(key, DebugUtils_1.default.onyxDataToString(MOCK_REPORT_ACTION[key]));
                }).not.toThrow();
            });
        });
    });
    describe('validateTransactionDraftProperty', () => {
        describe.each(Object.keys(MOCK_TRANSACTION))('%s', (key) => {
            it(`${DebugUtils_1.default.TRANSACTION_REQUIRED_PROPERTIES.includes(key) ? "throws SyntaxError when 'undefined'" : 'does not throw SyntaxError when "undefined"'}`, () => {
                if (DebugUtils_1.default.TRANSACTION_REQUIRED_PROPERTIES.includes(key)) {
                    expect(() => {
                        DebugUtils_1.default.validateTransactionDraftProperty(key, 'undefined');
                    }).toThrow();
                }
                else {
                    expect(() => {
                        DebugUtils_1.default.validateTransactionDraftProperty(key, 'undefined');
                    }).not.toThrow();
                }
            });
            it('throws SyntaxError when invalid', () => {
                const value = MOCK_TRANSACTION[key];
                let invalidValue;
                switch (typeof value) {
                    case 'number':
                        invalidValue = 'a';
                        break;
                    case 'boolean':
                    case 'object':
                        invalidValue = 2;
                        break;
                    default:
                        invalidValue = [];
                }
                expect(() => {
                    DebugUtils_1.default.validateTransactionDraftProperty(key, DebugUtils_1.default.onyxDataToString(invalidValue));
                }).toThrow();
            });
            it('does not throw SyntaxError when valid', () => {
                expect(() => {
                    DebugUtils_1.default.validateTransactionDraftProperty(key, DebugUtils_1.default.onyxDataToString(MOCK_TRANSACTION[key]));
                }).not.toThrow();
            });
        });
    });
    describe('validateReportActionJSON', () => {
        it('does not throw SyntaxError when valid', () => {
            expect(() => {
                DebugUtils_1.default.validateReportActionJSON(MOCK_DRAFT_REPORT_ACTION);
            }).not.toThrow();
        });
        it('throws SyntaxError when property is not a valid number', () => {
            const reportAction = {
                ...MOCK_REPORT_ACTION,
                accountID: '2',
            };
            const draftReportAction = DebugUtils_1.default.onyxDataToString(reportAction);
            expect(() => {
                DebugUtils_1.default.validateReportActionJSON(draftReportAction);
            }).toThrow(new SyntaxError('debug.invalidProperty', {
                cause: {
                    propertyName: 'accountID',
                    expectedType: 'number | undefined',
                },
            }));
        });
        it('throws SyntaxError when property is not a valid date', () => {
            const reportAction = {
                ...MOCK_REPORT_ACTION,
                created: 2,
            };
            const draftReportAction = DebugUtils_1.default.onyxDataToString(reportAction);
            expect(() => {
                DebugUtils_1.default.validateReportActionJSON(draftReportAction);
            }).toThrow(new SyntaxError('debug.invalidProperty', {
                cause: {
                    propertyName: 'created',
                    expectedType: CONST_1.default.DATE.FNS_DB_FORMAT_STRING,
                },
            }));
        });
        it('throws SyntaxError when property is not a valid boolean', () => {
            const reportAction = {
                ...MOCK_REPORT_ACTION,
                isLoading: 2,
            };
            const draftReportAction = DebugUtils_1.default.onyxDataToString(reportAction);
            expect(() => {
                DebugUtils_1.default.validateReportActionJSON(draftReportAction);
            }).toThrow(new SyntaxError('debug.invalidProperty', {
                cause: {
                    propertyName: 'isLoading',
                    expectedType: 'true | false | undefined',
                },
            }));
        });
        it('throws SyntaxError when property is missing', () => {
            const reportAction = {
                ...MOCK_REPORT_ACTION,
                actionName: undefined,
            };
            const draftReportAction = DebugUtils_1.default.onyxDataToString(reportAction);
            expect(() => {
                DebugUtils_1.default.validateReportActionJSON(draftReportAction);
            }).toThrow(new SyntaxError('debug.missingProperty', {
                cause: {
                    propertyName: 'actionName',
                },
            }));
        });
    });
    describe('getReasonForShowingRowInLHN', () => {
        const baseReport = {
            reportID: '1',
            type: CONST_1.default.REPORT.TYPE.CHAT,
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
            reportName: 'My first chat',
            lastMessageText: 'Hello World!',
        };
        beforeAll(() => {
            react_native_onyx_1.default.init({
                keys: ONYXKEYS_1.default,
            });
        });
        beforeEach(() => {
            react_native_onyx_1.default.clear();
        });
        it('returns null when report is not defined', () => {
            const reason = DebugUtils_1.default.getReasonForShowingRowInLHN({ report: undefined, chatReport: reports_1.chatReportR14932, doesReportHaveViolations: false });
            expect(reason).toBeNull();
        });
        it('returns correct reason when report has a valid draft comment', async () => {
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}1`, 'Hello world!');
            const reason = DebugUtils_1.default.getReasonForShowingRowInLHN({ report: baseReport, chatReport: reports_1.chatReportR14932, doesReportHaveViolations: false });
            expect(reason).toBe('debug.reasonVisibleInLHN.hasDraftComment');
        });
        it('returns correct reason when report has GBR', () => {
            const reason = DebugUtils_1.default.getReasonForShowingRowInLHN({
                report: {
                    ...baseReport,
                    lastMentionedTime: '2024-08-10 18:70:44.171',
                    lastReadTime: '2024-08-08 18:70:44.171',
                },
                chatReport: reports_1.chatReportR14932,
                doesReportHaveViolations: false,
            });
            expect(reason).toBe('debug.reasonVisibleInLHN.hasGBR');
        });
        it('returns correct reason when report is pinned', () => {
            const reason = DebugUtils_1.default.getReasonForShowingRowInLHN({
                report: {
                    ...baseReport,
                    isPinned: true,
                },
                chatReport: reports_1.chatReportR14932,
                doesReportHaveViolations: false,
            });
            expect(reason).toBe('debug.reasonVisibleInLHN.pinnedByUser');
        });
        it('returns correct reason when report has add workspace room errors', () => {
            const reason = DebugUtils_1.default.getReasonForShowingRowInLHN({
                report: {
                    ...baseReport,
                    errorFields: {
                        addWorkspaceRoom: {
                            error: 'Something happened',
                        },
                    },
                },
                chatReport: reports_1.chatReportR14932,
                doesReportHaveViolations: false,
            });
            expect(reason).toBe('debug.reasonVisibleInLHN.hasAddWorkspaceRoomErrors');
        });
        it('returns correct reason when report is unread', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                accountID: 1234,
            });
            const reason = DebugUtils_1.default.getReasonForShowingRowInLHN({
                report: {
                    ...baseReport,
                    participants: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        1234: {
                            notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                        },
                    },
                    lastVisibleActionCreated: '2024-08-10 18:70:44.171',
                    lastReadTime: '2024-08-08 18:70:44.171',
                    lastMessageText: 'Hello world!',
                },
                chatReport: reports_1.chatReportR14932,
                isInFocusMode: true,
                doesReportHaveViolations: false,
            });
            expect(reason).toBe('debug.reasonVisibleInLHN.isUnread');
        });
        it('returns correct reason when report is archived', async () => {
            const reportNameValuePairs = {
                private_isArchived: DateUtils_1.default.getDBTime(),
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${baseReport.reportID}`, reportNameValuePairs);
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(baseReport?.reportID));
            const reason = DebugUtils_1.default.getReasonForShowingRowInLHN({
                report: {
                    ...baseReport,
                },
                chatReport: reports_1.chatReportR14932,
                hasRBR: false,
                isReportArchived: isReportArchived.current,
                doesReportHaveViolations: false,
            });
            expect(reason).toBe('debug.reasonVisibleInLHN.isArchived');
        });
        it('returns correct reason when report is self DM', () => {
            const reason = DebugUtils_1.default.getReasonForShowingRowInLHN({
                report: {
                    ...baseReport,
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
                },
                chatReport: reports_1.chatReportR14932,
                doesReportHaveViolations: false,
            });
            expect(reason).toBe('debug.reasonVisibleInLHN.isSelfDM');
        });
        it('returns correct reason when report is temporarily focused', () => {
            const reason = DebugUtils_1.default.getReasonForShowingRowInLHN({
                report: baseReport,
                chatReport: reports_1.chatReportR14932,
                doesReportHaveViolations: false,
            });
            expect(reason).toBe('debug.reasonVisibleInLHN.isFocused');
        });
        it('returns correct reason when report has one transaction thread with violations', async () => {
            const MOCK_TRANSACTION_REPORT = {
                reportID: '1',
                ownerAccountID: 12345,
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
            };
            const MOCK_REPORTS = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]: MOCK_TRANSACTION_REPORT,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}2`]: {
                    reportID: '2',
                    type: CONST_1.default.REPORT.TYPE.CHAT,
                    parentReportID: '1',
                    parentReportActionID: '1',
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                },
            };
            const MOCK_REPORT_ACTIONS = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}1`]: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '1': {
                        reportActionID: '1',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                        actorAccountID: 12345,
                        created: '2024-08-08 18:20:44.171',
                        childReportID: '2',
                        message: {
                            type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                            amount: 10,
                            currency: CONST_1.default.CURRENCY.USD,
                            IOUReportID: '1',
                            text: 'Vacation expense',
                            IOUTransactionID: '1',
                        },
                    },
                },
            };
            await react_native_onyx_1.default.multiSet({
                ...MOCK_REPORTS,
                ...MOCK_REPORT_ACTIONS,
                [ONYXKEYS_1.default.SESSION]: {
                    accountID: 12345,
                },
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}1`]: {
                    transactionID: '1',
                    amount: 10,
                    modifiedAmount: 10,
                    reportID: '1',
                },
            });
            const reason = DebugUtils_1.default.getReasonForShowingRowInLHN({ report: MOCK_TRANSACTION_REPORT, chatReport: reports_1.chatReportR14932, hasRBR: true, doesReportHaveViolations: true });
            expect(reason).toBe('debug.reasonVisibleInLHN.hasRBR');
        });
        it('returns correct reason when report has violations', async () => {
            const MOCK_EXPENSE_REPORT = {
                reportID: '1',
                chatReportID: '2',
                parentReportID: '2',
                parentReportActionID: '1',
                ownerAccountID: 12345,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
            };
            const MOCK_REPORTS = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]: MOCK_EXPENSE_REPORT,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}2`]: {
                    reportID: '2',
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                },
            };
            const MOCK_REPORT_ACTIONS = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}2`]: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '1': {
                        reportActionID: '1',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                        actorAccountID: 12345,
                        created: '2024-08-08 18:20:44.171',
                        message: {
                            type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                            amount: 10,
                            currency: CONST_1.default.CURRENCY.USD,
                            IOUReportID: '1',
                            text: 'Vacation expense',
                            IOUTransactionID: '1',
                        },
                    },
                },
            };
            await react_native_onyx_1.default.multiSet({
                ...MOCK_REPORTS,
                ...MOCK_REPORT_ACTIONS,
                [ONYXKEYS_1.default.SESSION]: {
                    accountID: 12345,
                },
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}1`]: {
                    transactionID: '1',
                    amount: 10,
                    modifiedAmount: 10,
                    reportID: '1',
                },
            });
            const reason = DebugUtils_1.default.getReasonForShowingRowInLHN({ report: MOCK_EXPENSE_REPORT, chatReport: reports_1.chatReportR14932, hasRBR: true, doesReportHaveViolations: true });
            expect(reason).toBe('debug.reasonVisibleInLHN.hasRBR');
        });
        it('returns correct reason when report has errors', () => {
            const reason = DebugUtils_1.default.getReasonForShowingRowInLHN({ report: baseReport, chatReport: reports_1.chatReportR14932, hasRBR: true, doesReportHaveViolations: false });
            expect(reason).toBe('debug.reasonVisibleInLHN.hasRBR');
        });
    });
    describe('getReasonAndReportActionForGBRInLHNRow', () => {
        beforeAll(() => {
            react_native_onyx_1.default.init({
                keys: ONYXKEYS_1.default,
            });
        });
        beforeEach(() => {
            react_native_onyx_1.default.clear();
        });
        it('returns undefined reason when report is not defined', () => {
            const { reason } = DebugUtils_1.default.getReasonAndReportActionForGBRInLHNRow(undefined) ?? {};
            expect(reason).toBeUndefined();
        });
        it('returns correct reason when report has a join request', async () => {
            const MOCK_REPORT_ACTIONS = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '0': {
                    reportActionID: '0',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_JOIN_REQUEST,
                    created: '2024-08-08 19:70:44.171',
                    message: {
                        choice: '',
                        policyID: '0',
                    },
                },
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}1`, MOCK_REPORT_ACTIONS);
            const { reason } = DebugUtils_1.default.getReasonAndReportActionForGBRInLHNRow({
                reportID: '1',
            }) ?? {};
            expect(reason).toBe('debug.reasonGBR.hasJoinRequest');
        });
        it('returns correct reason when report is unread with mention', () => {
            const { reason } = DebugUtils_1.default.getReasonAndReportActionForGBRInLHNRow({
                reportID: '1',
                lastMentionedTime: '2024-08-10 18:70:44.171',
                lastReadTime: '2024-08-08 18:70:44.171',
            }) ?? {};
            expect(reason).toBe('debug.reasonGBR.isUnreadWithMention');
        });
        it('returns correct reason when report has a task which is waiting for assignee to complete it', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { accountID: 12345 });
            const { reason } = DebugUtils_1.default.getReasonAndReportActionForGBRInLHNRow({
                reportID: '1',
                type: CONST_1.default.REPORT.TYPE.TASK,
                hasParentAccess: false,
                managerID: 12345,
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            }) ?? {};
            expect(reason).toBe('debug.reasonGBR.isWaitingForAssigneeToCompleteAction');
        });
        it('returns correct reason when report has a child report awaiting action from the user', () => {
            const { reason } = DebugUtils_1.default.getReasonAndReportActionForGBRInLHNRow({
                reportID: '1',
                hasOutstandingChildRequest: true,
            }) ?? {};
            expect(reason).toBe('debug.reasonGBR.hasChildReportAwaitingAction');
        });
        it('returns undefined reason when report has no GBR', () => {
            const { reason } = DebugUtils_1.default.getReasonAndReportActionForGBRInLHNRow({
                reportID: '1',
            }) ?? {};
            expect(reason).toBeUndefined();
        });
        it('returns undefined reportAction when report is not defined', () => {
            const { reportAction } = DebugUtils_1.default.getReasonAndReportActionForGBRInLHNRow(undefined) ?? {};
            expect(reportAction).toBeUndefined();
        });
        it('returns the report action which is a join request', async () => {
            const MOCK_REPORT_ACTIONS = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '0': {
                    reportActionID: '0',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                    created: '2024-08-08 18:70:44.171',
                },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '1': {
                    reportActionID: '1',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_JOIN_REQUEST,
                    created: '2024-08-08 19:70:44.171',
                    message: {
                        choice: '',
                        policyID: '0',
                    },
                },
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}1`, MOCK_REPORT_ACTIONS);
            const { reportAction } = DebugUtils_1.default.getReasonAndReportActionForGBRInLHNRow({
                reportID: '1',
            }) ?? {};
            expect(reportAction).toMatchObject(MOCK_REPORT_ACTIONS['1']);
        });
        it('returns the report action which is awaiting action', async () => {
            const MOCK_REPORTS = {
                // Chat report
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]: {
                    reportID: '1',
                    policyID: '1',
                    hasOutstandingChildRequest: true,
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                },
                // IOU report
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}2`]: {
                    reportID: '2',
                    policyID: '1',
                    managerID: 12345,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                },
            };
            const MOCK_REPORT_ACTIONS = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '0': {
                    reportActionID: '0',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                    created: '2024-08-08 18:70:44.171',
                    message: [
                        {
                            type: 'TEXT',
                            text: 'Hello world!',
                        },
                    ],
                },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '1': {
                    reportActionID: '1',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
                    created: '2024-08-08 19:70:44.171',
                    childReportID: '2',
                    message: [
                        {
                            type: 'TEXT',
                            text: 'Hello world!',
                        },
                    ],
                },
            };
            await react_native_onyx_1.default.multiSet({
                ...MOCK_REPORTS,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}1`]: MOCK_REPORT_ACTIONS,
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}1`]: {
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
                    type: CONST_1.default.POLICY.TYPE.CORPORATE,
                },
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}1`]: {
                    amount: -100,
                    currency: CONST_1.default.CURRENCY.USD,
                    reportID: '2',
                    merchant: 'test merchant',
                },
                [ONYXKEYS_1.default.SESSION]: {
                    accountID: 12345,
                },
            });
            // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            const { reportAction } = DebugUtils_1.default.getReasonAndReportActionForGBRInLHNRow(MOCK_REPORTS[`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]) ?? {};
            expect(reportAction).toMatchObject(MOCK_REPORT_ACTIONS['1']);
        });
        it('returns undefined report action when report has no GBR', () => {
            const { reportAction } = DebugUtils_1.default.getReasonAndReportActionForGBRInLHNRow({
                reportID: '1',
            }) ?? {};
            expect(reportAction).toBeUndefined();
        });
    });
    describe('getReasonAndReportActionForRBRInLHNRow', () => {
        beforeAll(() => {
            react_native_onyx_1.default.init({
                keys: ONYXKEYS_1.default,
            });
        });
        describe('reportAction', () => {
            beforeEach(() => {
                react_native_onyx_1.default.clear();
            });
            it('returns undefined when report has no RBR', () => {
                const { reportAction } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow({
                    reportID: '1',
                }, reports_1.chatReportR14932, undefined, {}, undefined, false, {}) ?? {};
                expect(reportAction).toBeUndefined();
            });
            it('returns undefined if it is a transaction thread, the transaction is missing smart scan fields and the report is not settled', async () => {
                const MOCK_REPORTS = {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]: {
                        reportID: '1',
                        parentReportID: '2',
                        parentReportActionID: '1',
                        statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                    },
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT}2`]: {
                        reportID: '2',
                    },
                };
                const MOCK_REPORT_ACTIONS = {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}2`]: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        '1': {
                            reportActionID: '1',
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                            actorAccountID: 12345,
                            created: '2024-08-08 18:20:44.171',
                            message: {
                                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                                amount: 10,
                                currency: CONST_1.default.CURRENCY.USD,
                                expenseReportID: '1',
                                text: 'Vacation expense',
                                IOUTransactionID: '1',
                            },
                        },
                    },
                };
                await react_native_onyx_1.default.multiSet({
                    ...MOCK_REPORTS,
                    ...MOCK_REPORT_ACTIONS,
                    [ONYXKEYS_1.default.SESSION]: {
                        accountID: 12345,
                    },
                    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}1`]: {
                        amount: 0,
                        modifiedAmount: 0,
                    },
                });
                const { reportAction } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow(
                // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
                MOCK_REPORTS[`${ONYXKEYS_1.default.COLLECTION.REPORT}1`], reports_1.chatReportR14932, undefined, {}, undefined, false, {}) ?? {};
                expect(reportAction).toBe(undefined);
            });
            describe("Report has missing fields, isn't settled and it's owner is the current user", () => {
                describe('Report is IOU', () => {
                    it('returns correct report action which has missing fields', async () => {
                        const MOCK_IOU_REPORT = {
                            reportID: '1',
                            type: CONST_1.default.REPORT.TYPE.IOU,
                            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                            ownerAccountID: 12345,
                        };
                        const MOCK_REPORT_ACTIONS = {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '0': {
                                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                                reportActionID: '0',
                                created: '2024-08-08 18:20:44.171',
                            },
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '1': {
                                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                                reportActionID: '1',
                                message: {
                                    IOUTransactionID: '2',
                                },
                                actorAccountID: 1,
                            },
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '2': {
                                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                                reportActionID: '2',
                                message: {
                                    IOUTransactionID: '1',
                                },
                                actorAccountID: 1,
                            },
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '3': {
                                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                                reportActionID: '3',
                                message: {
                                    IOUTransactionID: '1',
                                },
                                actorAccountID: 12345,
                            },
                        };
                        await react_native_onyx_1.default.multiSet({
                            [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}1`]: {
                                amount: 0,
                                modifiedAmount: 0,
                            },
                            [`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]: MOCK_IOU_REPORT,
                            [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}1`]: MOCK_REPORT_ACTIONS,
                            [ONYXKEYS_1.default.SESSION]: {
                                accountID: 12345,
                            },
                        });
                        const reportErrors = (0, ReportUtils_1.getAllReportErrors)(MOCK_IOU_REPORT, MOCK_REPORT_ACTIONS);
                        const { reportAction } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow(MOCK_IOU_REPORT, reports_1.chatReportR14932, MOCK_REPORT_ACTIONS, {}, undefined, false, reportErrors) ?? {};
                        expect(reportAction).toMatchObject(MOCK_REPORT_ACTIONS['3']);
                    });
                });
                describe('Report is expense', () => {
                    it('returns correct report action which has missing fields', async () => {
                        const MOCK_IOU_REPORT = {
                            reportID: '1',
                            type: CONST_1.default.REPORT.TYPE.EXPENSE,
                            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                            ownerAccountID: 12345,
                        };
                        const MOCK_REPORT_ACTIONS = {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '0': {
                                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                                reportActionID: '0',
                                created: '2024-08-08 18:20:44.171',
                            },
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '1': {
                                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                                reportActionID: '1',
                                message: {
                                    IOUTransactionID: '2',
                                },
                                actorAccountID: 1,
                            },
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '2': {
                                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                                reportActionID: '2',
                                message: {
                                    IOUTransactionID: '1',
                                },
                                actorAccountID: 1,
                            },
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '3': {
                                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                                reportActionID: '3',
                                message: {
                                    IOUTransactionID: '1',
                                },
                                actorAccountID: 12345,
                            },
                        };
                        await react_native_onyx_1.default.multiSet({
                            [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}1`]: {
                                amount: 0,
                                modifiedAmount: 0,
                            },
                            [`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]: MOCK_IOU_REPORT,
                            [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}1`]: MOCK_REPORT_ACTIONS,
                            [ONYXKEYS_1.default.SESSION]: {
                                accountID: 12345,
                            },
                        });
                        const reportErrors = (0, ReportUtils_1.getAllReportErrors)(MOCK_IOU_REPORT, MOCK_REPORT_ACTIONS);
                        const { reportAction } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow(MOCK_IOU_REPORT, reports_1.chatReportR14932, MOCK_REPORT_ACTIONS, {}, undefined, false, reportErrors) ?? {};
                        expect(reportAction).toMatchObject(MOCK_REPORT_ACTIONS['3']);
                    });
                });
            });
            describe('There is a report action with smart scan errors', () => {
                it('returns correct report action which is a report preview and has an error', async () => {
                    const MOCK_CHAT_REPORT = {
                        reportID: '1',
                        type: CONST_1.default.REPORT.TYPE.CHAT,
                        ownerAccountID: 12345,
                    };
                    const MOCK_IOU_REPORT = {
                        reportID: '2',
                        type: CONST_1.default.REPORT.TYPE.IOU,
                        statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                        ownerAccountID: 12345,
                    };
                    const MOCK_CHAT_REPORT_ACTIONS = {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        '0': {
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                            reportActionID: '0',
                            created: '2024-08-08 18:20:44.171',
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        '1': {
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
                            reportActionID: '3',
                            message: {
                                linkedReportID: '2',
                            },
                            actorAccountID: 1,
                        },
                    };
                    const MOCK_IOU_REPORT_ACTIONS = {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        '1': {
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                            reportActionID: '1',
                            message: {
                                IOUTransactionID: '1',
                            },
                            actorAccountID: 12345,
                        },
                    };
                    await react_native_onyx_1.default.multiSet({
                        [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}1`]: {
                            amount: 0,
                            modifiedAmount: 0,
                        },
                        [`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]: MOCK_CHAT_REPORT,
                        [`${ONYXKEYS_1.default.COLLECTION.REPORT}2`]: MOCK_IOU_REPORT,
                        [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}1`]: MOCK_CHAT_REPORT_ACTIONS,
                        [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}2`]: MOCK_IOU_REPORT_ACTIONS,
                        [ONYXKEYS_1.default.SESSION]: {
                            accountID: 12345,
                        },
                    });
                    const reportErrors = (0, ReportUtils_1.getAllReportErrors)(MOCK_CHAT_REPORT, MOCK_CHAT_REPORT_ACTIONS);
                    const { reportAction } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow(MOCK_CHAT_REPORT, reports_1.chatReportR14932, MOCK_CHAT_REPORT_ACTIONS, {}, undefined, false, reportErrors) ?? {};
                    expect(reportAction).toMatchObject(MOCK_CHAT_REPORT_ACTIONS['1']);
                });
                it('returns correct report action which is a split bill and has an error', async () => {
                    const MOCK_CHAT_REPORT = {
                        reportID: '1',
                        type: CONST_1.default.REPORT.TYPE.CHAT,
                        ownerAccountID: 1,
                    };
                    const MOCK_IOU_REPORT = {
                        reportID: '2',
                        type: CONST_1.default.REPORT.TYPE.IOU,
                        ownerAccountID: 1,
                    };
                    const MOCK_REPORT_ACTIONS = {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        '0': {
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                            reportActionID: '0',
                            created: '2024-08-08 18:20:44.171',
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        '1': {
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                            reportActionID: '1',
                            message: {
                                IOUTransactionID: '2',
                            },
                            actorAccountID: 1,
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        '2': {
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                            reportActionID: '2',
                            message: {
                                IOUTransactionID: '1',
                            },
                            actorAccountID: 1,
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        '3': {
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                            reportActionID: '3',
                            message: {
                                IOUTransactionID: '1',
                                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT,
                            },
                            actorAccountID: 1,
                        },
                    };
                    await react_native_onyx_1.default.multiSet({
                        [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}1`]: {
                            amount: 0,
                            modifiedAmount: 0,
                        },
                        [`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]: MOCK_CHAT_REPORT,
                        [`${ONYXKEYS_1.default.COLLECTION.REPORT}2`]: MOCK_IOU_REPORT,
                        [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}1`]: MOCK_REPORT_ACTIONS,
                        [ONYXKEYS_1.default.SESSION]: {
                            accountID: 12345,
                        },
                    });
                    const reportErrors = (0, ReportUtils_1.getAllReportErrors)(MOCK_CHAT_REPORT, MOCK_REPORT_ACTIONS);
                    const { reportAction } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow(MOCK_CHAT_REPORT, reports_1.chatReportR14932, MOCK_REPORT_ACTIONS, {}, undefined, false, reportErrors) ?? {};
                    expect(reportAction).toMatchObject(MOCK_REPORT_ACTIONS['3']);
                });
                it("returns undefined if there's no report action is a report preview or a split bill", async () => {
                    const MOCK_IOU_REPORT = {
                        reportID: '1',
                        type: CONST_1.default.REPORT.TYPE.EXPENSE,
                        statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                        ownerAccountID: 12345,
                    };
                    const MOCK_REPORT_ACTIONS = {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        '0': {
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                            reportActionID: '0',
                            created: '2024-08-08 18:20:44.171',
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        '1': {
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                            reportActionID: '1',
                            message: {
                                IOUTransactionID: '2',
                            },
                            actorAccountID: 1,
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        '2': {
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                            reportActionID: '2',
                            message: {
                                IOUTransactionID: '1',
                            },
                            actorAccountID: 1,
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        '3': {
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                            reportActionID: '3',
                            message: {
                                IOUTransactionID: '1',
                            },
                            actorAccountID: 12345,
                        },
                    };
                    await react_native_onyx_1.default.multiSet({
                        [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}1`]: {
                            amount: 0,
                            modifiedAmount: 0,
                        },
                        [`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]: MOCK_IOU_REPORT,
                        [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}1`]: MOCK_REPORT_ACTIONS,
                        [ONYXKEYS_1.default.SESSION]: {
                            accountID: 12345,
                        },
                    });
                    const reportErrors = (0, ReportUtils_1.getAllReportErrors)(MOCK_IOU_REPORT, MOCK_REPORT_ACTIONS);
                    const { reportAction } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow(MOCK_IOU_REPORT, reports_1.chatReportR14932, MOCK_REPORT_ACTIONS, {}, undefined, false, reportErrors) ?? {};
                    expect(reportAction).toMatchObject(MOCK_REPORT_ACTIONS['3']);
                });
            });
            it('returns report action that contains errors', () => {
                const MOCK_REPORT_ACTIONS = {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '0': {
                        reportActionID: '0',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                        created: '2024-08-08 18:40:44.171',
                        message: [
                            {
                                type: 'TEXT',
                                text: 'Hello world!',
                            },
                        ],
                    },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '1': {
                        reportActionID: '1',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        created: '2024-08-08 18:42:44.171',
                        message: [
                            {
                                type: 'TEXT',
                                text: 'Hello world!',
                            },
                        ],
                        errors: {
                            randomError: 'Random error',
                        },
                    },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '2': {
                        reportActionID: '2',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        created: '2024-08-08 18:44:44.171',
                        message: [
                            {
                                type: 'TEXT',
                                text: 'Hello world!',
                            },
                        ],
                    },
                };
                const reportErrors = (0, ReportUtils_1.getAllReportErrors)(MOCK_REPORT, MOCK_REPORT_ACTIONS);
                const { reportAction } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow({
                    reportID: '1',
                }, reports_1.chatReportR14932, MOCK_REPORT_ACTIONS, {}, undefined, false, reportErrors) ?? {};
                expect(reportAction).toMatchObject(MOCK_REPORT_ACTIONS['1']);
            });
        });
        describe('reason', () => {
            it('returns correct reason when there are errors', () => {
                const mockedReport = {
                    reportID: '1',
                };
                const mockedReportActions = {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}1`]: {
                        reportActionID: '1',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                        created: '2024-09-20 13:11:11.122',
                        message: [
                            {
                                type: 'TEXT',
                                text: 'Hello world!',
                            },
                        ],
                        errors: {
                            randomError: 'Something went wrong',
                        },
                    },
                };
                const reportErrors = (0, ReportUtils_1.getAllReportErrors)(mockedReport, mockedReportActions);
                const { reason } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow(mockedReport, reports_1.chatReportR14932, mockedReportActions, {}, undefined, false, reportErrors) ?? {};
                expect(reason).toBe('debug.reasonRBR.hasErrors');
            });
            it('returns correct reason when there are violations', () => {
                const { reason } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow({
                    reportID: '1',
                }, reports_1.chatReportR14932, undefined, {}, undefined, true, {}) ?? {};
                expect(reason).toBe('debug.reasonRBR.hasViolations');
            });
            it('returns an undefined reason when the report is archived', () => {
                const { reason } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow({
                    reportID: '1',
                }, reports_1.chatReportR14932, undefined, {}, undefined, true, {}, true) ?? {};
                expect(reason).toBe(undefined);
            });
            it('returns correct reason when there are reports on the expense chat with violations', async () => {
                const report = {
                    reportID: '0',
                    type: CONST_1.default.REPORT.TYPE.CHAT,
                    ownerAccountID: 1234,
                    policyID: '1',
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                };
                const transactionViolations = {
                    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}1`]: [
                        {
                            type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                            name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                            showInReview: true,
                        },
                    ],
                };
                await react_native_onyx_1.default.multiSet({
                    [ONYXKEYS_1.default.SESSION]: {
                        accountID: 1234,
                    },
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT}0`]: report,
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]: {
                        reportID: '1',
                        parentReportActionID: '0',
                        stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                        ownerAccountID: 1234,
                        policyID: '1',
                    },
                    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}1`]: {
                        transactionID: '1',
                        amount: 10,
                        modifiedAmount: 10,
                        reportID: '0',
                    },
                    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}1`]: [
                        {
                            type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                            name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                            showInReview: true,
                        },
                    ],
                });
                const { reason } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow(report, reports_1.chatReportR14932, {}, {}, transactionViolations, false, {}) ?? {};
                expect(reason).toBe('debug.reasonRBR.hasTransactionThreadViolations');
            });
        });
    });
});
