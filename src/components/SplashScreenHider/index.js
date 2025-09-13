"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BootSplash_1 = require("@libs/BootSplash");
function SplashScreenHider({ onHide = () => { } }) {
    (0, react_1.useEffect)(() => {
        BootSplash_1.default.hide().then(() => onHide());
    }, [onHide]);
    return null;
}
SplashScreenHider.displayName = 'SplashScreenHider';
exports.default = SplashScreenHider;
