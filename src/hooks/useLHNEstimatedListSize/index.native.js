"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const variables_1 = require("@styles/variables");
/**
 * This a native specific implementation for FlashList of LHNOptionsList. It calculates estimated visible height and width of the list. It is not the scroll content size. Defining this prop will enable the list to be rendered immediately. Without it, the list first needs to measure its size, leading to a small delay during the first render.
 */
const useLHNEstimatedListSize = () => {
    const { windowHeight, windowWidth } = (0, useWindowDimensions_1.default)();
    const listHeight = windowHeight - variables_1.default.bottomTabHeight;
    return {
        height: listHeight,
        width: windowWidth,
    };
};
exports.default = useLHNEstimatedListSize;
