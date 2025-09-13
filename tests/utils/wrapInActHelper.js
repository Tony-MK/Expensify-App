"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_test_renderer_1 = require("react-test-renderer");
/**
 * A utility function to wrap custom state updates in act().
 *
 * While React Native Testing Library's render and event methods already
 * wrap their calls in act() under the hood, this function is useful for
 * explicitly wrapping custom callbacks that might trigger state updates
 * outside of the RNTL's built-in mechanisms. This helps avoid warnings about
 * updates not being wrapped in act() and ensures that all updates are handled
 * consistently during the test lifecycle.
 */
const wrapInAct = async (callback) => {
    await (0, react_test_renderer_1.act)(async () => {
        await callback();
    });
};
exports.default = wrapInAct;
