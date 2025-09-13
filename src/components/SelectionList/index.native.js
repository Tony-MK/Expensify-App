"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BaseSelectionList_1 = require("./BaseSelectionList");
function SelectionList({ shouldHideKeyboardOnScroll = true, ref, ...props }) {
    return (<BaseSelectionList_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref} onScrollBeginDrag={() => {
            if (!shouldHideKeyboardOnScroll) {
                return;
            }
            react_native_1.Keyboard.dismiss();
        }}/>);
}
SelectionList.displayName = 'SelectionList';
exports.default = SelectionList;
