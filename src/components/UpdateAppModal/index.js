"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseUpdateAppModal_1 = require("./BaseUpdateAppModal");
function UpdateAppModal(props) {
    return (<BaseUpdateAppModal_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
UpdateAppModal.displayName = 'UpdateAppModal';
exports.default = UpdateAppModal;
