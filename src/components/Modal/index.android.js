"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseModal_1 = require("./BaseModal");
// Only want to use useNativeDriver on Android. It has strange flashes issue on IOS
// https://github.com/react-native-modal/react-native-modal#the-modal-flashes-in-a-weird-way-when-animating
function Modal({ useNativeDriver = true, ...rest }) {
    return (<BaseModal_1.default useNativeDriver={useNativeDriver} useNativeDriverForBackdrop={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}>
            {rest.children}
        </BaseModal_1.default>);
}
Modal.displayName = 'Modal';
exports.default = Modal;
