"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONST_1 = require("@src/CONST");
// eslint-disable-next-line rulesdir/no-beta-handler
function canUseAllBetas(betas) {
    return !!(betas === null || betas === void 0 ? void 0 : betas.includes(CONST_1.default.BETAS.ALL));
}
/**
 * Link previews are temporarily disabled.
 */
function canUseLinkPreviews() {
    return false;
}
function isBetaEnabled(beta, betas, betaConfiguration) {
    var _a, _b, _c, _d;
    var hasAllBetasEnabled = canUseAllBetas(betas);
    var isFeatureEnabled = !!(betas === null || betas === void 0 ? void 0 : betas.includes(beta));
    // Explicit only betas and exclusion betas are not enabled only by the 'all' beta. Explicit only betas must be set explicitly to enable the feature.
    // Exclusion betas are designed to disable features, so being on the 'all' beta should not disable these features as that contradicts its purpose.
    if ((((_b = (_a = betaConfiguration === null || betaConfiguration === void 0 ? void 0 : betaConfiguration.explicitOnly) === null || _a === void 0 ? void 0 : _a.includes(beta)) !== null && _b !== void 0 ? _b : false) || ((_d = (_c = betaConfiguration === null || betaConfiguration === void 0 ? void 0 : betaConfiguration.exclusion) === null || _c === void 0 ? void 0 : _c.includes(beta)) !== null && _d !== void 0 ? _d : false)) && hasAllBetasEnabled && !isFeatureEnabled) {
        return false;
    }
    return isFeatureEnabled || hasAllBetasEnabled;
}
exports.default = {
    canUseLinkPreviews: canUseLinkPreviews,
    isBetaEnabled: isBetaEnabled,
};
