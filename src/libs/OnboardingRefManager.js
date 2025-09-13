"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const onboardingRef = react_1.default.createRef();
const OnboardingRefManager = {
    ref: onboardingRef,
    handleOuterClick: () => {
        onboardingRef.current?.handleOuterClick();
    },
};
exports.default = OnboardingRefManager;
