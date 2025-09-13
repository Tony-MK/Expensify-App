"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
// eslint-disable-next-line rulesdir/no-beta-handler
function canUseAllBetas(betas) {
    return !!betas?.includes(CONST_1.default.BETAS.ALL);
}
/**
 * Link previews are temporarily disabled.
 */
function canUseLinkPreviews() {
    return false;
}
function isBetaEnabled(beta, betas, betaConfiguration) {
    const hasAllBetasEnabled = canUseAllBetas(betas);
    const isFeatureEnabled = !!betas?.includes(beta);
    // Explicit only betas and exclusion betas are not enabled only by the 'all' beta. Explicit only betas must be set explicitly to enable the feature.
    // Exclusion betas are designed to disable features, so being on the 'all' beta should not disable these features as that contradicts its purpose.
    if (((betaConfiguration?.explicitOnly?.includes(beta) ?? false) || (betaConfiguration?.exclusion?.includes(beta) ?? false)) && hasAllBetasEnabled && !isFeatureEnabled) {
        return false;
    }
    return isFeatureEnabled || hasAllBetasEnabled;
}
exports.default = {
    canUseLinkPreviews,
    isBetaEnabled,
};
