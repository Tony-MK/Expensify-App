"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const CONST_1 = require("@src/CONST");
const isWindowReadyToFocus_1 = require("./isWindowReadyToFocus");
let focusedInput = null;
let uniqueModalId = 1;
const focusMap = new Map();
const activeModals = [];
const promiseMap = new Map();
/**
 * Returns the ref of the currently focused text field, if one exists.
 * react-native-web doesn't support `currentlyFocusedInput`, so we need to make it compatible by using `currentlyFocusedField` instead.
 */
function getActiveInput() {
    // eslint-disable-next-line deprecation/deprecation
    return (react_native_1.TextInput.State.currentlyFocusedInput ? react_native_1.TextInput.State.currentlyFocusedInput() : react_native_1.TextInput.State.currentlyFocusedField());
}
/**
 * On web platform, if the modal is displayed by a click, the blur event is fired before the modal appears,
 * so we need to cache the focused input in the pointerdown handler, which is fired before the blur event.
 */
function saveFocusedInput() {
    focusedInput = getActiveInput();
}
/**
 * If a click does not display the modal, we also should clear the cached value to avoid potential issues.
 */
function clearFocusedInput() {
    if (!focusedInput) {
        return;
    }
    // For the PopoverWithMeasuredContent component, Modal is only mounted after onLayout event is triggered,
    // this event is placed within a setTimeout in react-native-web,
    // so we can safely clear the cached value only after this event.
    setTimeout(() => (focusedInput = null), CONST_1.default.ANIMATION_IN_TIMING);
}
/**
 * When a TextInput is unmounted, we also should release the reference here to avoid potential issues.
 *
 */
function releaseInput(input) {
    if (!input) {
        return;
    }
    if (input === focusedInput) {
        focusedInput = null;
    }
    focusMap.forEach((value, key) => {
        if (value.input !== input) {
            return;
        }
        focusMap.delete(key);
    });
}
function getId() {
    return uniqueModalId++;
}
/**
 * Save the focus state when opening the modal.
 */
function saveFocusState(id, isInUploadingContext = false, shouldClearFocusWithType = false) {
    const activeInput = getActiveInput();
    // For popoverWithoutOverlay, react calls autofocus before useEffect.
    const input = focusedInput ?? activeInput;
    focusedInput = null;
    if (activeModals.indexOf(id) >= 0) {
        return;
    }
    activeModals.push(id);
    if (shouldClearFocusWithType) {
        focusMap.forEach((value, key) => {
            if (value.isInUploadingContext !== isInUploadingContext) {
                return;
            }
            focusMap.delete(key);
        });
    }
    focusMap.set(id, { input, isInUploadingContext });
    input?.blur();
}
/**
 * On web platform, if we intentionally click on another input box, there is no need to restore focus.
 * Additionally, if we are closing the RHP, we can ignore the focused input.
 */
function focus(input, shouldIgnoreFocused = false) {
    const activeInput = getActiveInput();
    if (!input || (activeInput && !shouldIgnoreFocused)) {
        return;
    }
    (0, isWindowReadyToFocus_1.default)().then(() => input.focus());
}
function tryRestoreTopmostFocus(shouldIgnoreFocused, isInUploadingContext = false) {
    const topmost = [...focusMap].filter(([, v]) => v.input && v.isInUploadingContext === isInUploadingContext).at(-1);
    if (topmost === undefined) {
        return;
    }
    const [modalId, { input }] = topmost;
    // This modal is still active
    if (activeModals.indexOf(modalId) >= 0) {
        return;
    }
    focus(input, shouldIgnoreFocused);
    focusMap.delete(modalId);
}
/**
 * Restore the focus state after the modal is dismissed.
 */
function restoreFocusState(id, shouldIgnoreFocused = false, restoreFocusType = CONST_1.default.MODAL.RESTORE_FOCUS_TYPE.DEFAULT, isInUploadingContext = false) {
    if (!id || !activeModals.length) {
        return;
    }
    const activeModalIndex = activeModals.indexOf(id);
    // This id has been removed from the stack.
    if (activeModalIndex < 0) {
        return;
    }
    activeModals.splice(activeModalIndex, 1);
    if (restoreFocusType === CONST_1.default.MODAL.RESTORE_FOCUS_TYPE.PRESERVE) {
        return;
    }
    const { input } = focusMap.get(id) ?? {};
    focusMap.delete(id);
    if (restoreFocusType === CONST_1.default.MODAL.RESTORE_FOCUS_TYPE.DELETE) {
        return;
    }
    // This modal is not the topmost one, do not restore it.
    if (activeModals.length > activeModalIndex) {
        if (input) {
            const lastId = activeModals.at(-1);
            focusMap.set(lastId, { ...focusMap.get(lastId), input });
        }
        return;
    }
    if (input) {
        focus(input, shouldIgnoreFocused);
        return;
    }
    // Try to find the topmost one and restore it
    tryRestoreTopmostFocus(shouldIgnoreFocused, isInUploadingContext);
}
function resetReadyToFocus(id) {
    const promise = {
        ready: Promise.resolve(),
        resolve: () => { },
    };
    promise.ready = new Promise((resolve) => {
        promise.resolve = resolve;
    });
    promiseMap.set(id, promise);
}
/**
 * Backward compatibility, for cases without an ModalId param, it's fine to just take the topmost one.
 */
function getTopmostModalId() {
    if (promiseMap.size < 1) {
        return 0;
    }
    return [...promiseMap.keys()].at(-1);
}
function setReadyToFocus(id) {
    const key = id ?? getTopmostModalId();
    const promise = promiseMap.get(key);
    if (!promise) {
        return;
    }
    promise.resolve?.();
    promiseMap.delete(key);
}
function isReadyToFocus(id) {
    const key = id ?? getTopmostModalId();
    const promise = promiseMap.get(key);
    if (!promise) {
        return Promise.resolve();
    }
    return promise.ready;
}
function refocusAfterModalFullyClosed(id, restoreType, isInUploadingContext) {
    isReadyToFocus(id)?.then(() => restoreFocusState(id, false, restoreType, isInUploadingContext));
}
exports.default = {
    getId,
    saveFocusedInput,
    clearFocusedInput,
    releaseInput,
    saveFocusState,
    restoreFocusState,
    resetReadyToFocus,
    setReadyToFocus,
    isReadyToFocus,
    refocusAfterModalFullyClosed,
    tryRestoreTopmostFocus,
};
