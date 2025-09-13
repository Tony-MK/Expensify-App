"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseTextInputWithSymbol_1 = require("./BaseTextInputWithSymbol");
function TextInputWithSymbol({ onSelectionChange = () => { }, ref, ...props }) {
    return (<BaseTextInputWithSymbol_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref} onSelectionChange={(event) => {
            onSelectionChange(event.nativeEvent.selection.start, event.nativeEvent.selection.end);
        }}/>);
}
TextInputWithSymbol.displayName = 'TextInputWithSymbol';
exports.default = TextInputWithSymbol;
