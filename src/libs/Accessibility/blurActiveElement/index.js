"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blurActiveElement = () => {
    if (!(document.activeElement instanceof HTMLElement)) {
        return;
    }
    document.activeElement.blur();
};
exports.default = blurActiveElement;
