"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const LocaleCompare_1 = require("@libs/LocaleCompare");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
describe('localeCompare', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: { NVP_PREFERRED_LOCALE: ONYXKEYS_1.default.NVP_PREFERRED_LOCALE },
            initialKeyStates: { [ONYXKEYS_1.default.NVP_PREFERRED_LOCALE]: CONST_1.default.LOCALES.DEFAULT },
        });
        return (0, waitForBatchedUpdates_1.default)();
    });
    afterEach(() => react_native_onyx_1.default.clear());
    it('should return -1 for descending comparison', () => {
        const result = (0, LocaleCompare_1.default)('Da Vinci', 'Tesla');
        expect(result).toBe(-1);
    });
    it('should return -1 for ascending comparison', () => {
        const result = (0, LocaleCompare_1.default)('Zidane', 'Messi');
        expect(result).toBe(1);
    });
    it('should return 0 for equal strings', () => {
        const result = (0, LocaleCompare_1.default)('Cat', 'Cat');
        expect(result).toBe(0);
    });
    it('should put uppercase letters first', () => {
        const result = (0, LocaleCompare_1.default)('apple', 'Apple');
        expect(result).toBe(1);
    });
    it('distinguishes spanish diacritic characters', async () => {
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, CONST_1.default.LOCALES.ES);
        const input = ['zorro', 'árbol', 'jalapeño', 'jalapeno', 'nino', 'niño'];
        input.sort(LocaleCompare_1.default);
        expect(input).toEqual(['árbol', 'jalapeno', 'jalapeño', 'nino', 'niño', 'zorro']);
    });
});
