"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const COLLATOR_OPTIONS = { usage: 'sort', sensitivity: 'variant', numeric: true, caseFirst: 'upper' };
let collator = new Intl.Collator(CONST_1.default.LOCALES.DEFAULT, COLLATOR_OPTIONS);
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING,
    initWithStoredValues: false,
    callback: (areTranslationsLoading) => {
        if (areTranslationsLoading ?? true) {
            return;
        }
        const locale = IntlStore_1.default.getCurrentLocale();
        if (!locale) {
            return;
        }
        collator = new Intl.Collator(locale, COLLATOR_OPTIONS);
    },
});
/**
 * This is a wrapper around the localeCompare function that uses the preferred locale from the user's settings.
 *
 * It re-uses Intl.Collator with static options for performance reasons. See https://github.com/facebook/hermes/issues/867 for more details.
 * @param a
 * @param b
 * @returns -1 if a < b, 1 if a > b, 0 if a === b
 */
function localeCompare(a, b) {
    return collator.compare(a, b);
}
exports.default = localeCompare;
