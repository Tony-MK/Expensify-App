"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ELECTRON_EVENTS_1 = require("@desktop/ELECTRON_EVENTS");
const BaseUpdateAppModal_1 = require("./BaseUpdateAppModal");
function UpdateAppModal({ onSubmit }) {
    const updateApp = () => {
        onSubmit?.();
        window.electron.send(ELECTRON_EVENTS_1.default.START_UPDATE);
    };
    return <BaseUpdateAppModal_1.default onSubmit={updateApp}/>;
}
UpdateAppModal.displayName = 'UpdateAppModal';
exports.default = UpdateAppModal;
