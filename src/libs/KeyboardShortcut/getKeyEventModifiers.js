"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KeyCommand = require("react-native-key-command");
const keyModifierControl = KeyCommand?.constants.keyModifierControl ?? 'keyModifierControl';
const keyModifierCommand = KeyCommand?.constants.keyModifierCommand ?? 'keyModifierCommand';
const keyModifierShift = KeyCommand?.constants.keyModifierShift ?? 'keyModifierShift';
const keyModifierShiftControl = KeyCommand?.constants.keyModifierShiftControl ?? 'keyModifierShiftControl';
const keyModifierShiftCommand = KeyCommand?.constants.keyModifierShiftCommand ?? 'keyModifierShiftCommand';
/**
 * Gets modifiers from a keyboard event.
 */
function getKeyEventModifiers(event) {
    if (event.modifierFlags === keyModifierControl) {
        return ['CONTROL'];
    }
    if (event.modifierFlags === keyModifierCommand) {
        return ['META'];
    }
    if (event.modifierFlags === keyModifierShiftControl) {
        return ['CONTROL', 'Shift'];
    }
    if (event.modifierFlags === keyModifierShiftCommand) {
        return ['META', 'Shift'];
    }
    if (event.modifierFlags === keyModifierShift) {
        return ['Shift'];
    }
    return [];
}
exports.default = getKeyEventModifiers;
