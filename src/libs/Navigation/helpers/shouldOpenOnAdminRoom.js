"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = shouldOpenOnAdminRoom;
const currentUrl_1 = require("@libs/Navigation/currentUrl");
function shouldOpenOnAdminRoom() {
    const url = (0, currentUrl_1.default)();
    return url ? new URL(url).searchParams.get('openOnAdminRoom') === 'true' : false;
}
