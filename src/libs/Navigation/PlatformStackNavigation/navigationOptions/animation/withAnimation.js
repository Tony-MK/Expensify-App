"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fade_1 = require("./fade");
const index_1 = require("./index");
const none_1 = require("./none");
const slideFromBottom_1 = require("./slideFromBottom");
const slideFromLeft_1 = require("./slideFromLeft");
const slideFromRight_1 = require("./slideFromRight");
function withAnimation(screenOptions) {
    switch (screenOptions?.animation) {
        case index_1.default.SLIDE_FROM_LEFT:
            return slideFromLeft_1.default;
        case index_1.default.SLIDE_FROM_RIGHT:
            return slideFromRight_1.default;
        case index_1.default.SLIDE_FROM_BOTTOM:
            return slideFromBottom_1.default;
        case index_1.default.NONE:
            return none_1.default;
        case index_1.default.FADE:
            return fade_1.default;
        default:
            return {};
    }
}
exports.default = withAnimation;
