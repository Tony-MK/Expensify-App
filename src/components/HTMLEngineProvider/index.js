"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const DeviceCapabilities = require("@libs/DeviceCapabilities");
const BaseHTMLEngineProvider_1 = require("./BaseHTMLEngineProvider");
function HTMLEngineProvider({ children }) {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return <BaseHTMLEngineProvider_1.default textSelectable={!DeviceCapabilities.canUseTouchScreen() || !shouldUseNarrowLayout}>{children}</BaseHTMLEngineProvider_1.default>;
}
HTMLEngineProvider.displayName = 'HTMLEngineProvider';
exports.default = HTMLEngineProvider;
