"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
// Only has custom web implementation
types_1.default.getBackgroundColor = () => null;
// Overwrite setTranslucent and setBackgroundColor suppress warnings on iOS
types_1.default.setTranslucent = () => { };
types_1.default.setBackgroundColor = () => { };
exports.default = types_1.default;
