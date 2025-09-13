"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getComponentDisplayName;
/** Returns the display name of a component */
function getComponentDisplayName(component) {
    return component.displayName ?? component.name ?? 'Component';
}
