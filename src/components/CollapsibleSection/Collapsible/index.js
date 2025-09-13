"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_collapse_1 = require("react-collapse");
function Collapsible({ isOpened = false, children }) {
    return <react_collapse_1.Collapse isOpened={isOpened}>{children}</react_collapse_1.Collapse>;
}
exports.default = Collapsible;
