"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ImportOnyxStateUtils_1 = require("../../src/libs/ImportOnyxStateUtils");
describe('transformNumericKeysToArray', () => {
    it('converts object with numeric keys to array', () => {
        const input = { '0': 'a', '1': 'b', '2': 'c' };
        expect((0, ImportOnyxStateUtils_1.transformNumericKeysToArray)(input)).toEqual(['a', 'b', 'c']);
    });
    it('handles nested numeric objects', () => {
        const input = {
            '0': { '0': 'a', '1': 'b' },
            '1': { '0': 'c', '1': 'd' },
        };
        expect((0, ImportOnyxStateUtils_1.transformNumericKeysToArray)(input)).toEqual([
            ['a', 'b'],
            ['c', 'd'],
        ]);
    });
    it('preserves non-numeric keys', () => {
        const input = { foo: 'bar', baz: { '0': 'qux' } };
        expect((0, ImportOnyxStateUtils_1.transformNumericKeysToArray)(input)).toEqual({ foo: 'bar', baz: ['qux'] });
    });
    it('handles empty objects', () => {
        expect((0, ImportOnyxStateUtils_1.transformNumericKeysToArray)({})).toEqual({});
    });
    it('handles non-sequential numeric keys', () => {
        const input = { '0': 'a', '2': 'b', '5': 'c' };
        expect((0, ImportOnyxStateUtils_1.transformNumericKeysToArray)(input)).toEqual({ '0': 'a', '2': 'b', '5': 'c' });
    });
});
describe('cleanAndTransformState', () => {
    it('removes omitted keys and transforms numeric objects', () => {
        const input = JSON.stringify({
            [ONYXKEYS_1.default.NETWORK]: 'should be removed',
            someKey: { '0': 'a', '1': 'b' },
            otherKey: 'value',
        });
        expect((0, ImportOnyxStateUtils_1.cleanAndTransformState)(input)).toEqual({
            someKey: ['a', 'b'],
            otherKey: 'value',
        });
    });
    it('handles empty state', () => {
        expect((0, ImportOnyxStateUtils_1.cleanAndTransformState)('{}')).toEqual({});
    });
    it('removes keys that start with omitted keys', () => {
        const input = JSON.stringify({
            [`${ONYXKEYS_1.default.NETWORK}_something`]: 'should be removed',
            validKey: 'keep this',
        });
        expect((0, ImportOnyxStateUtils_1.cleanAndTransformState)(input)).toEqual({
            validKey: 'keep this',
        });
    });
    it('throws on invalid JSON', () => {
        expect(() => (0, ImportOnyxStateUtils_1.cleanAndTransformState)('invalid json')).toThrow();
    });
    it('removes all specified ONYXKEYS', () => {
        const input = JSON.stringify({
            [ONYXKEYS_1.default.ACTIVE_CLIENTS]: 'remove1',
            [ONYXKEYS_1.default.FREQUENTLY_USED_EMOJIS]: 'remove2',
            [ONYXKEYS_1.default.NETWORK]: 'remove3',
            [ONYXKEYS_1.default.CREDENTIALS]: 'remove4',
            [ONYXKEYS_1.default.PREFERRED_THEME]: 'remove5',
            keepThis: 'value',
        });
        const result = (0, ImportOnyxStateUtils_1.cleanAndTransformState)(input);
        expect(result).toEqual({
            keepThis: 'value',
        });
        // Verify each key is removed
        expect(result).not.toHaveProperty(ONYXKEYS_1.default.ACTIVE_CLIENTS);
        expect(result).not.toHaveProperty(ONYXKEYS_1.default.FREQUENTLY_USED_EMOJIS);
        expect(result).not.toHaveProperty(ONYXKEYS_1.default.NETWORK);
        expect(result).not.toHaveProperty(ONYXKEYS_1.default.CREDENTIALS);
        expect(result).not.toHaveProperty(ONYXKEYS_1.default.PREFERRED_THEME);
    });
});
