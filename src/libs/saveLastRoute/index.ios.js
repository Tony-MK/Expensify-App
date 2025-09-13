"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = saveLastRoute;
const App_1 = require("@libs/actions/App");
const Navigation_1 = require("@libs/Navigation/Navigation");
function saveLastRoute() {
    (0, App_1.updateLastRoute)(Navigation_1.default.getActiveRoute());
}
