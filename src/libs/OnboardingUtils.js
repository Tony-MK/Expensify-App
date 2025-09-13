"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldOnboardingRedirectToOldDot = shouldOnboardingRedirectToOldDot;
const CONST_1 = require("@src/CONST");
const getPlatform_1 = require("./getPlatform");
const supportedIntegrationsInNewDot = ['quickbooksOnline', 'quickbooksDesktop', 'xero', 'netsuite', 'intacct', 'other'];
/**
 * Determines if the user should be redirected to old dot based on company size and platform
 * @param companySize - The company size from onboarding
 * @param userReportedIntegration - The user reported integration
 * @returns boolean - True if user should be redirected to old dot
 */
function shouldOnboardingRedirectToOldDot(companySize, userReportedIntegration) {
    // Desktop users should never be redirected to old dot
    if ((0, getPlatform_1.default)() === CONST_1.default.PLATFORM.DESKTOP) {
        return false;
    }
    // Check if the integration is supported in NewDot
    const isSupportedIntegration = (!!userReportedIntegration && supportedIntegrationsInNewDot.includes(userReportedIntegration)) || userReportedIntegration === undefined;
    // Don't redirect if integration is supported and company size is MICRO or SMALL
    const isMicroOrSmallCompany = companySize === CONST_1.default.ONBOARDING_COMPANY_SIZE.MICRO || companySize === CONST_1.default.ONBOARDING_COMPANY_SIZE.SMALL;
    if (isSupportedIntegration && isMicroOrSmallCompany) {
        return false;
    }
    // Redirect to old dot in all other cases (unsupported integration or larger company size)
    return true;
}
