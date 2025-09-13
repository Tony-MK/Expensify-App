"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function ModalContent({ children, onDismiss = () => { }, onModalWillShow = () => { } }) {
    react_1.default.useEffect(() => {
        onModalWillShow();
        return onDismiss;
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return children;
}
ModalContent.displayName = 'ModalContent';
exports.default = ModalContent;
