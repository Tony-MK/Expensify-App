"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-restricted-imports
const positioning_1 = require("@styles/utils/positioning");
const getNavigationModalCardStyles = () => ({
    // position: fixed is set instead of position absolute to workaround Safari known issues of updating heights in DOM.
    // Safari issues:
    // https://github.com/Expensify/App/issues/12005
    // https://github.com/Expensify/App/issues/17824
    // https://github.com/Expensify/App/issues/20709
    width: '100%',
    height: '100%',
    ...positioning_1.default.pFixed,
});
exports.default = getNavigationModalCardStyles;
