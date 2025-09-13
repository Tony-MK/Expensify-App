"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SidePanelContextProvider_1 = require("@components/SidePanel/SidePanelContextProvider");
/**
 * Hook to get the animated position of the Side Panel and the margin of the navigator
 */
const useSidePanel = () => (0, react_1.useContext)(SidePanelContextProvider_1.SidePanelContext);
exports.default = useSidePanel;
