"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseHTMLEngineProvider_1 = require("./BaseHTMLEngineProvider");
function HTMLEngineProvider({ children }) {
    return <BaseHTMLEngineProvider_1.default enableExperimentalBRCollapsing>{children}</BaseHTMLEngineProvider_1.default>;
}
HTMLEngineProvider.displayName = 'HTMLEngineProvider';
exports.default = HTMLEngineProvider;
