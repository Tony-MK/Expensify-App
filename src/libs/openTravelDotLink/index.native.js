"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldOpenTravelDotLinkWeb = exports.openTravelDotLink = void 0;
const Link_1 = require("@libs/actions/Link");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
const openTravelDotLink = (activePolicyID) => {
    (0, Link_1.getTravelDotLink)(activePolicyID)
        ?.then((response) => {
        if (response.spotnanaToken) {
            Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_DOT_LINK_WEB_VIEW.getRoute(response.spotnanaToken, response.isTestAccount));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_MY_TRIPS);
    })
        ?.catch((error) => {
        console.error('Failed to get travel dot link:', error);
        Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_MY_TRIPS);
    });
};
exports.openTravelDotLink = openTravelDotLink;
const shouldOpenTravelDotLinkWeb = () => false;
exports.shouldOpenTravelDotLinkWeb = shouldOpenTravelDotLinkWeb;
