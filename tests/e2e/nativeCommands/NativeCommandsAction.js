"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeClearCommand = exports.makeBackspaceCommand = exports.makeTypeTextCommand = exports.NativeCommandsAction = void 0;
const NativeCommandsAction = {
    scroll: 'scroll',
    type: 'type',
    backspace: 'backspace',
    clear: 'clear',
};
exports.NativeCommandsAction = NativeCommandsAction;
const makeTypeTextCommand = (text) => ({
    actionName: NativeCommandsAction.type,
    payload: {
        text,
    },
});
exports.makeTypeTextCommand = makeTypeTextCommand;
const makeBackspaceCommand = () => ({
    actionName: NativeCommandsAction.backspace,
});
exports.makeBackspaceCommand = makeBackspaceCommand;
const makeClearCommand = () => ({
    actionName: NativeCommandsAction.clear,
});
exports.makeClearCommand = makeClearCommand;
