"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SidePanelContextProvider_1 = require("@components/SidePanel/SidePanelContextProvider");
/**
 * Hook to get the animated position of the Side Panel and the margin of the navigator
 */
var useSidePanel = function () { return (0, react_1.useContext)(SidePanelContextProvider_1.SidePanelContext); };
exports.default = useSidePanel;
