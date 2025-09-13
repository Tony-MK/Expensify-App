"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const IntlStore_1 = require("@src/languages/IntlStore");
const CONST_1 = require("../../src/CONST");
const Localize = require("../../src/libs/Localize");
const ONYXKEYS_1 = require("../../src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@src/libs/Log');
function mockEnvironmentConfig(config) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const CONFIG = require('@src/CONFIG');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const originalConfig = { ...CONFIG.default };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    CONFIG.default.IS_IN_PRODUCTION = config.isProduction;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    CONFIG.default.IS_IN_STAGING = config.isStaging;
    // Return cleanup function
    return () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        Object.assign(CONFIG.default, originalConfig);
    };
}
async function setupSession(email) {
    await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, email ? { email } : null);
    await (0, waitForBatchedUpdates_1.default)();
}
async function testMissingTranslationBehavior(environmentConfig, sessionEmail, expectedResult) {
    const cleanup = mockEnvironmentConfig(environmentConfig);
    try {
        await setupSession(sessionEmail);
        const result = Localize.translate(CONST_1.default.LOCALES.EN, 'missing.translation.key');
        expect(result).toBe(expectedResult);
    }
    finally {
        cleanup();
    }
}
describe('localize', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: {
                NVP_PREFERRED_LOCALE: ONYXKEYS_1.default.NVP_PREFERRED_LOCALE,
                ARE_TRANSLATIONS_LOADING: ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING,
                SESSION: ONYXKEYS_1.default.SESSION,
            },
        });
        return (0, waitForBatchedUpdates_1.default)();
    });
    afterEach(() => react_native_onyx_1.default.clear());
    describe('formatList', () => {
        test.each([
            [
                [],
                {
                    [CONST_1.default.LOCALES.DEFAULT]: '',
                    [CONST_1.default.LOCALES.ES]: '',
                },
            ],
            [
                ['rory'],
                {
                    [CONST_1.default.LOCALES.DEFAULT]: 'rory',
                    [CONST_1.default.LOCALES.ES]: 'rory',
                },
            ],
            [
                ['rory', 'vit'],
                {
                    [CONST_1.default.LOCALES.DEFAULT]: 'rory and vit',
                    [CONST_1.default.LOCALES.ES]: 'rory y vit',
                },
            ],
            [
                ['rory', 'vit', 'jules'],
                {
                    [CONST_1.default.LOCALES.DEFAULT]: 'rory, vit, and jules',
                    [CONST_1.default.LOCALES.ES]: 'rory, vit y jules',
                },
            ],
            [
                ['rory', 'vit', 'ionatan'],
                {
                    [CONST_1.default.LOCALES.DEFAULT]: 'rory, vit, and ionatan',
                    [CONST_1.default.LOCALES.ES]: 'rory, vit e ionatan',
                },
            ],
        ])('formatList(%s)', async (input, { [CONST_1.default.LOCALES.DEFAULT]: expectedOutput, [CONST_1.default.LOCALES.ES]: expectedOutputES }) => {
            await IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
            expect(Localize.formatList(input)).toBe(expectedOutput);
            await IntlStore_1.default.load(CONST_1.default.LOCALES.ES);
            expect(Localize.formatList(input)).toBe(expectedOutputES);
        });
    });
    describe('translate method - missing translation behavior', () => {
        beforeEach(async () => {
            await IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
        });
        test.each([
            // [description, environment, sessionEmail, expectedResult]
            [
                'should return MISSING_TRANSLATION for missing key when user has expensify email in production environment',
                { isProduction: true, isStaging: false },
                'user@expensify.com',
                CONST_1.default.MISSING_TRANSLATION,
            ],
            [
                'should return MISSING_TRANSLATION for missing key when user has expensify email in staging environment',
                { isProduction: false, isStaging: true },
                'test@expensify.com',
                CONST_1.default.MISSING_TRANSLATION,
            ],
            [
                'should return key string for missing key when user has external email in production environment',
                { isProduction: true, isStaging: false },
                'user@external.com',
                'missing.translation.key',
            ],
            [
                'should return key string for missing key when user has external email in staging environment',
                { isProduction: false, isStaging: true },
                'user@external.com',
                'missing.translation.key',
            ],
            ['should return key string for missing key when user has no email in production environment', { isProduction: true, isStaging: false }, null, 'missing.translation.key'],
        ])('%s', async (description, environmentConfig, sessionEmail, expectedResult) => {
            await testMissingTranslationBehavior(environmentConfig, sessionEmail, expectedResult);
        });
    });
});
