"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldOpenTravelDotLinkWeb = exports.openTravelDotLink = void 0;
const Link_1 = require("@libs/actions/Link");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
const openTravelDotLink = (activePolicyID) => {
    (0, Link_1.openTravelDotLink)(activePolicyID)
        ?.then(() => { })
        ?.catch(() => {
        Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_MY_TRIPS);
    });
};
exports.openTravelDotLink = openTravelDotLink;
const shouldOpenTravelDotLinkWeb = () => true;
exports.shouldOpenTravelDotLinkWeb = shouldOpenTravelDotLinkWeb;
