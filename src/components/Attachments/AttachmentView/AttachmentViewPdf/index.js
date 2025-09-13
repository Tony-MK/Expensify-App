"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PDFView_1 = require("@components/PDFView");
function AttachmentViewPdf({ file, encryptedSourceUrl, isFocused, onPress, onToggleKeyboard, onLoadComplete, style, isUsedAsChatAttachment, onLoadError }) {
    return (<PDFView_1.default onPress={onPress} isFocused={isFocused} sourceURL={encryptedSourceUrl} fileName={file?.name} style={style} onToggleKeyboard={onToggleKeyboard} onLoadComplete={onLoadComplete} isUsedAsChatAttachment={isUsedAsChatAttachment} onLoadError={onLoadError}/>);
}
exports.default = (0, react_1.memo)(AttachmentViewPdf);
