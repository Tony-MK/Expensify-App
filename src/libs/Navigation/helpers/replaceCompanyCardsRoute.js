"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replaceCompanyCardsRoute = (route) => {
    return route?.replace(/\/edit\/export$/, '');
};
exports.default = replaceCompanyCardsRoute;
