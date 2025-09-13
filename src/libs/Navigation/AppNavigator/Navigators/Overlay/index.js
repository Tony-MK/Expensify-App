"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseOverlay_1 = require("./BaseOverlay");
function Overlay({ ...rest }) {
    return (<BaseOverlay_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>);
}
Overlay.displayName = 'Overlay';
exports.default = Overlay;
