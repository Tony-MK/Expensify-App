"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldOpenTravelDotLinkWeb = exports.openTravelDotLink = void 0;
var Link_1 = require("@libs/actions/Link");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ROUTES_1 = require("@src/ROUTES");
var openTravelDotLink = function (activePolicyID) {
    var _a, _b;
    (_b = (_a = (0, Link_1.getTravelDotLink)(activePolicyID)) === null || _a === void 0 ? void 0 : _a.then(function (response) {
        if (response.spotnanaToken) {
            Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_DOT_LINK_WEB_VIEW.getRoute(response.spotnanaToken, response.isTestAccount));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_MY_TRIPS);
    })) === null || _b === void 0 ? void 0 : _b.catch(function (error) {
        console.error('Failed to get travel dot link:', error);
        Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_MY_TRIPS);
    });
};
exports.openTravelDotLink = openTravelDotLink;
var shouldOpenTravelDotLinkWeb = function () { return false; };
exports.shouldOpenTravelDotLinkWeb = shouldOpenTravelDotLinkWeb;
