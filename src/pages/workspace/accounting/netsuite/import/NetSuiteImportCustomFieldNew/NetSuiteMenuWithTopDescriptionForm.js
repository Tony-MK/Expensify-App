"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
function NetSuiteMenuWithTopDescriptionForm({ value, valueRenderer, ...props }) {
    return (<MenuItemWithTopDescription_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} title={valueRenderer ? valueRenderer(value) : value}/>);
}
NetSuiteMenuWithTopDescriptionForm.displayName = 'NetSuiteMenuWithTopDescriptionForm';
exports.default = NetSuiteMenuWithTopDescriptionForm;
