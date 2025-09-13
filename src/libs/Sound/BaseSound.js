"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsMuted = exports.SOUNDS = void 0;
exports.withMinimalExecutionTime = withMinimalExecutionTime;
const react_native_onyx_1 = require("react-native-onyx");
const getPlatform_1 = require("@libs/getPlatform");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
let isMuted = false;
// We use `connectWithoutView` here because this is purely for sound utility logic and not connected
// to any UI component. This connection tracks the platform-specific mute state in a module-level
// variable that sound functions check when called, avoiding unnecessary re-renders since.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NVP_MUTED_PLATFORMS,
    callback: (val) => {
        const platform = (0, getPlatform_1.default)(true);
        isMuted = !!val?.[platform];
    },
});
const SOUNDS = {
    DONE: 'done',
    SUCCESS: 'success',
    ATTENTION: 'attention',
    RECEIVE: 'receive',
};
exports.SOUNDS = SOUNDS;
const getIsMuted = () => isMuted;
exports.getIsMuted = getIsMuted;
/**
 * Creates a version of the given function that, when called, queues the execution and ensures that
 * calls are spaced out by at least the specified `minExecutionTime`, even if called more frequently. This allows
 * for throttling frequent calls to a function, ensuring each is executed with a minimum `minExecutionTime` between calls.
 * Each call returns a promise that resolves when the function call is executed, allowing for asynchronous handling.
 */
function withMinimalExecutionTime(func, minExecutionTime) {
    const queue = [];
    let timerId = null;
    function processQueue() {
        if (queue.length > 0) {
            const next = queue.shift();
            if (!next) {
                return;
            }
            const [nextFunc, resolve] = next;
            nextFunc();
            resolve();
            timerId = setTimeout(processQueue, minExecutionTime);
        }
        else {
            timerId = null;
        }
    }
    return function (...args) {
        return new Promise((resolve) => {
            queue.push([() => func(...args), resolve]);
            if (!timerId) {
                // If the timer isn't running, start processing the queue
                processQueue();
            }
        });
    };
}
