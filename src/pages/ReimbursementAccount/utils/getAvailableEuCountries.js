"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAvailableEuCountries;
var CONST_1 = require("@src/CONST");
var ukEuSupportedCountrySet = new Set(CONST_1.default.EXPENSIFY_UK_EU_SUPPORTED_COUNTRIES);
var europeanCountries = Object.entries(CONST_1.default.EUROPEAN_UNION_COUNTRIES_WITH_GB);
function getAvailableEuCountries() {
    return Object.fromEntries(europeanCountries.filter(function (_a) {
        var code = _a[0];
        return ukEuSupportedCountrySet.has(code);
    }));
}
