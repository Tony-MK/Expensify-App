"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useSyncFocus_1 = require("@hooks/useSyncFocus");
const MenuItem_1 = require("./MenuItem");
function FocusableMenuItem(props) {
    const ref = (0, react_1.useRef)(null);
    // Sync focus on an item
    (0, useSyncFocus_1.default)(ref, !!props.focused);
    return (<MenuItem_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref}/>);
}
FocusableMenuItem.displayName = 'FocusableMenuItem';
exports.default = FocusableMenuItem;
