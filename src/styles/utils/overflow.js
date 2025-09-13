"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const overflowAuto_1 = require("./overflowAuto");
const overscrollBehaviorContain_1 = require("./overscrollBehaviorContain");
/**
 * Overflow utility styles with Bootstrap inspired naming.
 *
 * https://getbootstrap.com/docs/5.0/utilities/overflow/
 */
exports.default = {
    overflowHidden: {
        overflow: 'hidden',
    },
    overflowVisible: {
        overflow: 'visible',
    },
    overflowScroll: {
        overflow: 'scroll',
    },
    overscrollBehaviorXNone: {
        overscrollBehaviorX: 'none',
    },
    overscrollBehaviorContain: overscrollBehaviorContain_1.default,
    overflowAuto: overflowAuto_1.default,
};
