"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const replaceCompanyCardsRoute_1 = require("./replaceCompanyCardsRoute");
/**
 * If export company card value is changed to unsupported - we should redirect user directly to card details view
 * If not, just regular go back
 */
function goBackFromExportConnection(shouldGoBackToSpecificRoute, backTo) {
    const feature = CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.companyCards;
    if (!(shouldGoBackToSpecificRoute && backTo?.includes(feature.alias))) {
        return Navigation_1.default.goBack();
    }
    const companyCardDetailsPage = (0, replaceCompanyCardsRoute_1.default)(backTo);
    return Navigation_1.default.goBack(companyCardDetailsPage, { compareParams: false });
}
exports.default = goBackFromExportConnection;
