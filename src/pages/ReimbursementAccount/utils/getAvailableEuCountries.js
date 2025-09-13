"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAvailableEuCountries;
const CONST_1 = require("@src/CONST");
const ukEuSupportedCountrySet = new Set(CONST_1.default.EXPENSIFY_UK_EU_SUPPORTED_COUNTRIES);
const europeanCountries = Object.entries(CONST_1.default.EUROPEAN_UNION_COUNTRIES_WITH_GB);
function getAvailableEuCountries() {
    return Object.fromEntries(europeanCountries.filter(([code]) => ukEuSupportedCountrySet.has(code)));
}
