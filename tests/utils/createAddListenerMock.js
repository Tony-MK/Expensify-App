"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is a helper function to create a mock for the addListener function of the react-navigation library.
 * The reason we need this is because we need to trigger the transitionEnd event in our tests to simulate
 * the transitionEnd event that is triggered when the screen transition animation is completed.
 *
 * @returns An object with two functions: triggerTransitionEnd and addListener
 */
const createAddListenerMock = () => {
    const transitionEndListeners = [];
    const triggerTransitionEnd = () => {
        transitionEndListeners.forEach((transitionEndListener) => transitionEndListener());
    };
    const addListener = jest.fn().mockImplementation((listener, callback) => {
        if (listener === 'transitionEnd') {
            transitionEndListeners.push(callback);
        }
        return () => {
            transitionEndListeners.filter((cb) => cb !== callback);
        };
    });
    return { triggerTransitionEnd, addListener };
};
exports.default = createAddListenerMock;
