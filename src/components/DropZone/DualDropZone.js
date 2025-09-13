"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Consumer_1 = require("@components/DragAndDrop/Consumer");
var Expensicons = require("@components/Icon/Expensicons");
var useLocalize_1 = require("@hooks/useLocalize");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var DropZoneUI_1 = require("./DropZoneUI");
var DropZoneWrapper_1 = require("./DropZoneWrapper");
function DualDropZone(_a) {
    var isEditing = _a.isEditing, onAttachmentDrop = _a.onAttachmentDrop, onReceiptDrop = _a.onReceiptDrop, shouldAcceptSingleReceipt = _a.shouldAcceptSingleReceipt;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var _b = (0, useResponsiveLayout_1.default)(), shouldUseNarrowLayout = _b.shouldUseNarrowLayout, isMediumScreenWidth = _b.isMediumScreenWidth;
    var theme = (0, useTheme_1.default)();
    var shouldStackVertically = shouldUseNarrowLayout || isMediumScreenWidth;
    var scanReceiptsText = shouldAcceptSingleReceipt ? 'dropzone.addReceipt' : 'dropzone.scanReceipts';
    return (<Consumer_1.default onDrop={function () { }}>
            <react_native_1.View style={[shouldStackVertically ? styles.flexColumn : styles.flexRow, styles.w100, styles.h100]}>
                <DropZoneWrapper_1.default onDrop={onAttachmentDrop}>
                    {function (_a) {
            var isDraggingOver = _a.isDraggingOver;
            return (<DropZoneUI_1.default icon={Expensicons.MessageInABottle} dropTitle={translate('dropzone.addAttachments')} dropStyles={styles.attachmentDropOverlay(isDraggingOver)} dropTextStyles={styles.attachmentDropText} dropWrapperStyles={shouldStackVertically ? styles.pb0 : styles.pr0} dashedBorderStyles={styles.activeDropzoneDashedBorder(theme.attachmentDropBorderColorActive, isDraggingOver)}/>);
        }}
                </DropZoneWrapper_1.default>
                <DropZoneWrapper_1.default onDrop={onReceiptDrop}>
                    {function (_a) {
            var isDraggingOver = _a.isDraggingOver;
            return (<DropZoneUI_1.default icon={isEditing ? Expensicons.ReplaceReceipt : Expensicons.SmartScan} dropTitle={translate(isEditing ? 'dropzone.replaceReceipt' : scanReceiptsText)} dropStyles={styles.receiptDropOverlay(isDraggingOver)} dropTextStyles={styles.receiptDropText} dashedBorderStyles={styles.activeDropzoneDashedBorder(theme.receiptDropBorderColorActive, isDraggingOver)}/>);
        }}
                </DropZoneWrapper_1.default>
            </react_native_1.View>
        </Consumer_1.default>);
}
exports.default = DualDropZone;
