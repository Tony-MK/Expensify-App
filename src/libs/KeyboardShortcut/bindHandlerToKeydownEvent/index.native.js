"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getKeyEventModifiers_1 = require("@libs/KeyboardShortcut/getKeyEventModifiers");
/**
 * Checks if an event for that key is configured and if so, runs it.
 */
const bindHandlerToKeydownEvent = (getDisplayName, eventHandlers, keyCommandEvent, event) => {
    const eventModifiers = (0, getKeyEventModifiers_1.default)(keyCommandEvent);
    const displayName = getDisplayName(keyCommandEvent.input, eventModifiers);
    // If we didn't register any event handlers for a key we ignore it
    if (!eventHandlers[displayName]) {
        return;
    }
    // Loop over all the callbacks
    Object.values(eventHandlers[displayName]).every((callback) => {
        // Determine if the event should bubble before executing the callback (which may have side-effects)
        let shouldBubble = callback.shouldBubble || false;
        if (typeof callback.shouldBubble === 'function') {
            shouldBubble = callback.shouldBubble();
        }
        if (typeof callback.callback === 'function') {
            callback.callback(event);
        }
        // If the event should not bubble, short-circuit the loop
        return shouldBubble;
    });
};
exports.default = bindHandlerToKeydownEvent;
