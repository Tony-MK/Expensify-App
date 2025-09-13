"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.States = exports.Actions = exports.ActionSheetAwareScrollViewContext = void 0;
exports.ActionSheetAwareScrollViewProvider = ActionSheetAwareScrollViewProvider;
const noop_1 = require("lodash/noop");
const prop_types_1 = require("prop-types");
const react_1 = require("react");
const useWorkletStateMachine_1 = require("@hooks/useWorkletStateMachine");
/** Holds all information that is needed to coordinate the state value for the action sheet state machine. */
const currentActionSheetStateValue = {
    previous: {
        state: 'idle',
        payload: null,
    },
    current: {
        state: 'idle',
        payload: null,
    },
};
const defaultValue = {
    currentActionSheetState: {
        value: currentActionSheetStateValue,
        addListener: noop_1.default,
        removeListener: noop_1.default,
        modify: noop_1.default,
        get: () => currentActionSheetStateValue,
        set: noop_1.default,
    },
    transitionActionSheetState: noop_1.default,
    transitionActionSheetStateWorklet: noop_1.default,
    resetStateMachine: noop_1.default,
};
const ActionSheetAwareScrollViewContext = (0, react_1.createContext)(defaultValue);
exports.ActionSheetAwareScrollViewContext = ActionSheetAwareScrollViewContext;
const Actions = {
    OPEN_KEYBOARD: 'KEYBOARD_OPEN',
    CLOSE_KEYBOARD: 'CLOSE_KEYBOARD',
    OPEN_POPOVER: 'OPEN_POPOVER',
    CLOSE_POPOVER: 'CLOSE_POPOVER',
    MEASURE_POPOVER: 'MEASURE_POPOVER',
    MEASURE_COMPOSER: 'MEASURE_COMPOSER',
    POPOVER_ANY_ACTION: 'POPOVER_ANY_ACTION',
    HIDE_WITHOUT_ANIMATION: 'HIDE_WITHOUT_ANIMATION',
    END_TRANSITION: 'END_TRANSITION',
};
exports.Actions = Actions;
const States = {
    IDLE: 'idle',
    KEYBOARD_OPEN: 'keyboardOpen',
    POPOVER_OPEN: 'popoverOpen',
    POPOVER_CLOSED: 'popoverClosed',
    KEYBOARD_POPOVER_CLOSED: 'keyboardPopoverClosed',
    KEYBOARD_POPOVER_OPEN: 'keyboardPopoverOpen',
    KEYBOARD_CLOSED_POPOVER: 'keyboardClosingPopover',
    POPOVER_MEASURED: 'popoverMeasured',
    MODAL_WITH_KEYBOARD_OPEN_DELETED: 'modalWithKeyboardOpenDeleted',
};
exports.States = States;
const STATE_MACHINE = {
    [States.IDLE]: {
        [Actions.OPEN_POPOVER]: States.POPOVER_OPEN,
        [Actions.OPEN_KEYBOARD]: States.KEYBOARD_OPEN,
        [Actions.MEASURE_POPOVER]: States.IDLE,
        [Actions.MEASURE_COMPOSER]: States.IDLE,
    },
    [States.POPOVER_OPEN]: {
        [Actions.CLOSE_POPOVER]: States.POPOVER_CLOSED,
        [Actions.MEASURE_POPOVER]: States.POPOVER_OPEN,
        [Actions.MEASURE_COMPOSER]: States.POPOVER_OPEN,
        [Actions.POPOVER_ANY_ACTION]: States.POPOVER_CLOSED,
        [Actions.HIDE_WITHOUT_ANIMATION]: States.IDLE,
    },
    [States.POPOVER_CLOSED]: {
        [Actions.END_TRANSITION]: States.IDLE,
    },
    [States.KEYBOARD_OPEN]: {
        [Actions.OPEN_KEYBOARD]: States.KEYBOARD_OPEN,
        [Actions.OPEN_POPOVER]: States.KEYBOARD_POPOVER_OPEN,
        [Actions.CLOSE_KEYBOARD]: States.IDLE,
        [Actions.MEASURE_COMPOSER]: States.KEYBOARD_OPEN,
    },
    [States.KEYBOARD_POPOVER_OPEN]: {
        [Actions.MEASURE_POPOVER]: States.KEYBOARD_POPOVER_OPEN,
        [Actions.CLOSE_POPOVER]: States.KEYBOARD_CLOSED_POPOVER,
        [Actions.OPEN_KEYBOARD]: States.KEYBOARD_OPEN,
    },
    [States.KEYBOARD_POPOVER_CLOSED]: {
        [Actions.OPEN_KEYBOARD]: States.KEYBOARD_OPEN,
    },
    [States.KEYBOARD_CLOSED_POPOVER]: {
        [Actions.OPEN_KEYBOARD]: States.KEYBOARD_OPEN,
        [Actions.END_TRANSITION]: States.KEYBOARD_OPEN,
    },
};
function ActionSheetAwareScrollViewProvider(props) {
    const { currentState, transition, transitionWorklet, reset } = (0, useWorkletStateMachine_1.default)(STATE_MACHINE, {
        previous: {
            state: 'idle',
            payload: null,
        },
        current: {
            state: 'idle',
            payload: null,
        },
    });
    const value = (0, react_1.useMemo)(() => ({
        currentActionSheetState: currentState,
        transitionActionSheetState: transition,
        transitionActionSheetStateWorklet: transitionWorklet,
        resetStateMachine: reset,
    }), [currentState, reset, transition, transitionWorklet]);
    return <ActionSheetAwareScrollViewContext.Provider value={value}>{props.children}</ActionSheetAwareScrollViewContext.Provider>;
}
ActionSheetAwareScrollViewProvider.propTypes = {
    children: prop_types_1.default.node.isRequired,
};
