"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseTextInputWithSymbol_1 = require("./BaseTextInputWithSymbol");
function TextInputWithSymbol({ onSelectionChange = () => { }, ref, ...props }) {
    const [skipNextSelectionChange, setSkipNextSelectionChange] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setSkipNextSelectionChange(true);
    }, [props.formattedAmount]);
    return (<BaseTextInputWithSymbol_1.default 
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...props} ref={ref} onSelectionChange={(event) => {
            if (skipNextSelectionChange) {
                setSkipNextSelectionChange(false);
                return;
            }
            onSelectionChange(event.nativeEvent.selection.start, event.nativeEvent.selection.end);
        }}/>);
}
TextInputWithSymbol.displayName = 'TextInputWithSymbol';
exports.default = TextInputWithSymbol;
