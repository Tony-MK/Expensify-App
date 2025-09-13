"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EmojiUtils_1 = require("@libs/EmojiUtils");
// Mock the Emojis module
jest.mock('@assets/emojis', function () { return ({
    emojiCodeTableWithSkinTones: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '😀': {
            code: '😀',
            name: 'grinning_face',
            keywords: ['face', 'grin', 'grinning'],
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '😃': {
            code: '😃',
            name: 'grinning_face_with_big_eyes',
            keywords: ['face', 'grin', 'grinning'],
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '😄': {
            code: '😄',
            name: 'grinning_face_with_smiling_eyes',
            keywords: ['face', 'grin', 'grinning'],
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '👋': {
            code: '👋',
            name: 'waving_hand',
            keywords: ['hand', 'wave', 'waving'],
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '👍': {
            code: '👍',
            name: 'thumbs_up',
            keywords: ['hand', 'thumb', 'up'],
        },
    },
    emojiNameTable: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        grinning_face: {
            code: '😀',
            name: 'grinning_face',
            keywords: ['face', 'grin', 'grinning'],
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        waving_hand: {
            code: '👋',
            name: 'waving_hand',
            keywords: ['hand', 'wave', 'waving'],
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        thumbs_up: {
            code: '👍',
            name: 'thumbs_up',
            keywords: ['hand', 'thumb', 'up'],
        },
    },
}); });
describe('processFrequentlyUsedEmojis', function () {
    it('should return empty array when input is undefined', function () {
        var result = (0, EmojiUtils_1.processFrequentlyUsedEmojis)(undefined);
        expect(result).toEqual([]);
    });
    it('should return empty array when input is empty array', function () {
        var result = (0, EmojiUtils_1.processFrequentlyUsedEmojis)([]);
        expect(result).toEqual([]);
    });
    it('should process valid emoji list correctly', function () {
        var input = [
            {
                code: '😀',
                name: 'grinning_face',
                count: 5,
                lastUpdatedAt: 1000,
            },
            {
                code: '👋',
                name: 'waving_hand',
                count: 3,
                lastUpdatedAt: 2000,
            },
        ];
        var result = (0, EmojiUtils_1.processFrequentlyUsedEmojis)(input);
        expect(result).toHaveLength(2);
        expect(result.at(0)).toEqual({
            code: '😀',
            name: 'grinning_face',
            keywords: ['face', 'grin', 'grinning'],
            count: 5,
            lastUpdatedAt: 1000,
        });
        expect(result.at(1)).toEqual({
            code: '👋',
            name: 'waving_hand',
            keywords: ['hand', 'wave', 'waving'],
            count: 3,
            lastUpdatedAt: 2000,
        });
    });
    it('should fill in missing code using name lookup', function () {
        var input = [
            {
                code: '',
                name: 'grinning_face',
                count: 5,
                lastUpdatedAt: 1000,
            },
        ];
        var result = (0, EmojiUtils_1.processFrequentlyUsedEmojis)(input);
        expect(result).toHaveLength(1);
        expect(result.at(0)).toEqual({
            code: '😀',
            name: 'grinning_face',
            keywords: ['face', 'grin', 'grinning'],
            count: 5,
            lastUpdatedAt: 1000,
        });
    });
    it('should fill in missing name using code lookup', function () {
        var input = [
            {
                code: '👋',
                name: '',
                count: 3,
                lastUpdatedAt: 2000,
            },
        ];
        var result = (0, EmojiUtils_1.processFrequentlyUsedEmojis)(input);
        expect(result).toHaveLength(1);
        expect(result.at(0)).toEqual({
            code: '👋',
            name: 'waving_hand',
            keywords: ['hand', 'wave', 'waving'],
            count: 3,
            lastUpdatedAt: 2000,
        });
    });
    it('should filter out emojis that do not exist in emojiCodeTableWithSkinTones', function () {
        var _a;
        var input = [
            {
                code: '😀',
                name: 'grinning_face',
                count: 5,
                lastUpdatedAt: 1000,
            },
            {
                code: 'invalid_emoji',
                name: 'invalid_emoji',
                count: 3,
                lastUpdatedAt: 2000,
            },
        ];
        var result = (0, EmojiUtils_1.processFrequentlyUsedEmojis)(input);
        expect(result).toHaveLength(1);
        expect((_a = result.at(0)) === null || _a === void 0 ? void 0 : _a.code).toBe('😀');
    });
    it('should merge duplicate emojis and sum their counts', function () {
        var input = [
            {
                code: '😀',
                name: 'grinning_face',
                count: 5,
                lastUpdatedAt: 1000,
            },
            {
                code: '😀',
                name: 'grinning_face',
                count: 3,
                lastUpdatedAt: 2000,
            },
        ];
        var result = (0, EmojiUtils_1.processFrequentlyUsedEmojis)(input);
        expect(result).toHaveLength(1);
        expect(result.at(0)).toEqual({
            code: '😀',
            name: 'grinning_face',
            keywords: ['face', 'grin', 'grinning'],
            count: 8,
            lastUpdatedAt: 2000,
        });
    });
    it('should sort by count in descending order', function () {
        var _a, _b, _c;
        var input = [
            {
                code: '😀',
                name: 'grinning_face',
                count: 3,
                lastUpdatedAt: 1000,
            },
            {
                code: '👋',
                name: 'waving_hand',
                count: 5,
                lastUpdatedAt: 2000,
            },
            {
                code: '👍',
                name: 'thumbs_up',
                count: 1,
                lastUpdatedAt: 3000,
            },
        ];
        var result = (0, EmojiUtils_1.processFrequentlyUsedEmojis)(input);
        expect(result).toHaveLength(3);
        expect((_a = result.at(0)) === null || _a === void 0 ? void 0 : _a.code).toBe('👋');
        expect((_b = result.at(1)) === null || _b === void 0 ? void 0 : _b.code).toBe('😀');
        expect((_c = result.at(2)) === null || _c === void 0 ? void 0 : _c.code).toBe('👍');
    });
    it('should sort by lastUpdatedAt in descending order when counts are equal', function () {
        var _a, _b, _c;
        var input = [
            {
                code: '😀',
                name: 'grinning_face',
                count: 5,
                lastUpdatedAt: 1000,
            },
            {
                code: '👋',
                name: 'waving_hand',
                count: 5,
                lastUpdatedAt: 3000,
            },
            {
                code: '👍',
                name: 'thumbs_up',
                count: 5,
                lastUpdatedAt: 2000,
            },
        ];
        var result = (0, EmojiUtils_1.processFrequentlyUsedEmojis)(input);
        expect(result).toHaveLength(3);
        expect((_a = result.at(0)) === null || _a === void 0 ? void 0 : _a.code).toBe('👋');
        expect((_b = result.at(1)) === null || _b === void 0 ? void 0 : _b.code).toBe('👍');
        expect((_c = result.at(2)) === null || _c === void 0 ? void 0 : _c.code).toBe('😀');
    });
    it('should handle complex scenario with mixed data quality', function () {
        var _a, _b, _c, _d, _e;
        var input = [
            {
                code: '😀',
                name: 'grinning_face',
                count: 5,
                lastUpdatedAt: 1000,
            },
            {
                code: '',
                name: 'waving_hand',
                count: 3,
                lastUpdatedAt: 2000,
            },
            {
                code: '👍',
                name: '',
                count: 7,
                lastUpdatedAt: 3000,
            },
            {
                code: '😀',
                name: 'grinning_face',
                count: 2,
                lastUpdatedAt: 1500,
            },
            {
                code: 'invalid_emoji',
                name: 'invalid_emoji',
                count: 1,
                lastUpdatedAt: 4000,
            },
        ];
        var result = (0, EmojiUtils_1.processFrequentlyUsedEmojis)(input);
        expect(result).toHaveLength(3);
        expect((_a = result.at(0)) === null || _a === void 0 ? void 0 : _a.code).toBe('👍');
        expect((_b = result.at(1)) === null || _b === void 0 ? void 0 : _b.code).toBe('😀');
        expect((_c = result.at(2)) === null || _c === void 0 ? void 0 : _c.code).toBe('👋');
        expect((_d = result.at(1)) === null || _d === void 0 ? void 0 : _d.count).toBe(7);
        expect((_e = result.at(1)) === null || _e === void 0 ? void 0 : _e.lastUpdatedAt).toBe(1500);
    });
});
