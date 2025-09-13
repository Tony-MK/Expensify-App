"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseTextInputWithSymbol_1 = require("./BaseTextInputWithSymbol");
function TextInputWithSymbol({ onSelectionChange = () => { }, ref, ...props }) {
    const textInputRef = (0, react_1.useRef)(null);
    return (<BaseTextInputWithSymbol_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={(element) => {
            textInputRef.current = element;
            if (!ref) {
                return;
            }
            if (typeof ref === 'function') {
                ref(element);
                return;
            }
            // eslint-disable-next-line no-param-reassign
            ref.current = element;
        }} onSelectionChange={(event) => {
            onSelectionChange(event.nativeEvent.selection.start, event.nativeEvent.selection.end);
        }} onPress={() => {
            const selectionStart = textInputRef.current?.selectionStart ?? 0;
            const selectionEnd = textInputRef.current?.selectionEnd ?? 0;
            onSelectionChange(selectionStart, selectionEnd);
        }}/>);
}
TextInputWithSymbol.displayName = 'TextInputWithSymbol';
exports.default = TextInputWithSymbol;
