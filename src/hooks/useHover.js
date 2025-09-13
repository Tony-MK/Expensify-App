"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const useHover = () => {
    const [hovered, setHovered] = (0, react_1.useState)(false);
    const canUseTouchScreen = (0, DeviceCapabilities_1.canUseTouchScreen)();
    return {
        hovered,
        bind: {
            onMouseEnter: () => !canUseTouchScreen && setHovered(true),
            onMouseLeave: () => !canUseTouchScreen && setHovered(false),
        },
    };
};
exports.default = useHover;
