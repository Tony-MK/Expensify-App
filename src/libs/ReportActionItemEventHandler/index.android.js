"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const reportActionItemEventHandler = {
    handleComposerLayoutChange: (reportScrollManager, index) => () => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            requestAnimationFrame(() => {
                reportScrollManager.scrollToIndex(index, true);
            });
        });
    },
};
exports.default = reportActionItemEventHandler;
