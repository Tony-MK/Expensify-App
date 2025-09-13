"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useNetwork_1 = require("@hooks/useNetwork");
const _1 = require(".");
function ButtonDisabledWhenOffline({ disabledWhenOffline = true, ...props }) {
    const { isOffline } = (0, useNetwork_1.default)();
    return (<_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} isDisabled={disabledWhenOffline && isOffline}/>);
}
exports.default = ButtonDisabledWhenOffline;
