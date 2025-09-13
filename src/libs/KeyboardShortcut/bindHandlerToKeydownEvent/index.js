"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getKeyEventModifiers_1 = require("@libs/KeyboardShortcut/getKeyEventModifiers");
const isEnterWhileComposition_1 = require("@libs/KeyboardShortcut/isEnterWhileComposition");
const CONST_1 = require("@src/CONST");
/**
 * Checks if an event for that key is configured and if so, runs it.
 */
const bindHandlerToKeydownEvent = (getDisplayName, eventHandlers, keyCommandEvent, event) => {
    if (!(event instanceof KeyboardEvent) || (0, isEnterWhileComposition_1.default)(event)) {
        return;
    }
    const eventModifiers = (0, getKeyEventModifiers_1.default)(keyCommandEvent);
    const displayName = getDisplayName(keyCommandEvent.input, eventModifiers);
    // If we didn't register any event handlers for a key we ignore it
    if (!eventHandlers[displayName]) {
        return;
    }
    // Loop over all the callbacks
    Object.values(eventHandlers[displayName]).every((callback) => {
        const textArea = event.target;
        const contentEditable = textArea?.contentEditable;
        const nodeName = textArea?.nodeName;
        // Early return for excludedNodes
        if (callback.excludedNodes.includes(nodeName)) {
            return true;
        }
        // If configured to do so, prevent input text control to trigger this event
        if (!callback.captureOnInputs && (nodeName === CONST_1.default.ELEMENT_NAME.INPUT || nodeName === CONST_1.default.ELEMENT_NAME.TEXTAREA || contentEditable === 'true')) {
            return true;
        }
        // Determine if the event should bubble before executing the callback (which may have side-effects)
        let shouldBubble = callback.shouldBubble || false;
        if (typeof callback.shouldBubble === 'function') {
            shouldBubble = callback.shouldBubble();
        }
        if (typeof callback.callback === 'function') {
            callback.callback(event);
        }
        if (callback.shouldPreventDefault) {
            event.preventDefault();
        }
        if (callback.shouldStopPropagation) {
            event.stopPropagation();
        }
        // If the event should not bubble, short-circuit the loop
        return shouldBubble;
    });
};
exports.default = bindHandlerToKeydownEvent;
