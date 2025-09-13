"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-restricted-imports
const positioning_1 = require("@styles/utils/positioning");
/**
 * Get card style for cardStyleInterpolator
 */
const getCardStyles = (screenWidth) => ({
    ...positioning_1.default.pFixed,
    width: screenWidth,
    height: '100%',
});
exports.default = getCardStyles;
