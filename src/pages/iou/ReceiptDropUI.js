"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const receipt_upload_svg_1 = require("@assets/images/receipt-upload.svg");
const Consumer_1 = require("@components/DragAndDrop/Consumer");
const ImageSVG_1 = require("@components/ImageSVG");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function ReceiptDropUI({ onDrop, receiptImageTopPosition }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<Consumer_1.default onDrop={onDrop}>
            <react_native_1.View style={[styles.fileDropOverlay, styles.w100, styles.h100, styles.justifyContentCenter, styles.alignItemsCenter]}>
                <react_native_1.View style={receiptImageTopPosition ? styles.fileUploadImageWrapper(receiptImageTopPosition) : undefined}>
                    <ImageSVG_1.default src={receipt_upload_svg_1.default} contentFit="contain" width={CONST_1.default.RECEIPT.ICON_SIZE} height={CONST_1.default.RECEIPT.ICON_SIZE}/>
                    <Text_1.default style={[styles.textFileUpload]}>{translate('common.dropTitle')}</Text_1.default>
                    <Text_1.default style={[styles.subTextFileUpload]}>{translate('common.dropMessage')}</Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
        </Consumer_1.default>);
}
ReceiptDropUI.displayName = 'ReceiptDropUI';
exports.default = ReceiptDropUI;
