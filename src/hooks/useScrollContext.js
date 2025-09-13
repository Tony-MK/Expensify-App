"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useScrollContext;
const react_1 = require("react");
const ScrollViewWithContext_1 = require("@components/ScrollViewWithContext");
function useScrollContext() {
    return (0, react_1.useContext)(ScrollViewWithContext_1.ScrollContext);
}
