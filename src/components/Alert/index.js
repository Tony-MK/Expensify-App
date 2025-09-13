"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Shows an alert modal with ok and cancel options. */
const alert = (title, description, options) => {
    const result = window.confirm([title, description].filter(Boolean).join('\n'));
    if (result) {
        const confirmOption = options?.find(({ style }) => style !== 'cancel');
        confirmOption?.onPress?.();
    }
    else {
        const cancelOption = options?.find(({ style }) => style === 'cancel');
        cancelOption?.onPress?.();
    }
};
exports.default = alert;
