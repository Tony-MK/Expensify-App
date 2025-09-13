"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Consumer_1 = require("@components/DragAndDrop/Consumer");
const Expensicons = require("@components/Icon/Expensicons");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DropZoneUI_1 = require("./DropZoneUI");
const DropZoneWrapper_1 = require("./DropZoneWrapper");
function DualDropZone({ isEditing, onAttachmentDrop, onReceiptDrop, shouldAcceptSingleReceipt }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout, isMediumScreenWidth } = (0, useResponsiveLayout_1.default)();
    const theme = (0, useTheme_1.default)();
    const shouldStackVertically = shouldUseNarrowLayout || isMediumScreenWidth;
    const scanReceiptsText = shouldAcceptSingleReceipt ? 'dropzone.addReceipt' : 'dropzone.scanReceipts';
    return (<Consumer_1.default onDrop={() => { }}>
            <react_native_1.View style={[shouldStackVertically ? styles.flexColumn : styles.flexRow, styles.w100, styles.h100]}>
                <DropZoneWrapper_1.default onDrop={onAttachmentDrop}>
                    {({ isDraggingOver }) => (<DropZoneUI_1.default icon={Expensicons.MessageInABottle} dropTitle={translate('dropzone.addAttachments')} dropStyles={styles.attachmentDropOverlay(isDraggingOver)} dropTextStyles={styles.attachmentDropText} dropWrapperStyles={shouldStackVertically ? styles.pb0 : styles.pr0} dashedBorderStyles={styles.activeDropzoneDashedBorder(theme.attachmentDropBorderColorActive, isDraggingOver)}/>)}
                </DropZoneWrapper_1.default>
                <DropZoneWrapper_1.default onDrop={onReceiptDrop}>
                    {({ isDraggingOver }) => (<DropZoneUI_1.default icon={isEditing ? Expensicons.ReplaceReceipt : Expensicons.SmartScan} dropTitle={translate(isEditing ? 'dropzone.replaceReceipt' : scanReceiptsText)} dropStyles={styles.receiptDropOverlay(isDraggingOver)} dropTextStyles={styles.receiptDropText} dashedBorderStyles={styles.activeDropzoneDashedBorder(theme.receiptDropBorderColorActive, isDraggingOver)}/>)}
                </DropZoneWrapper_1.default>
            </react_native_1.View>
        </Consumer_1.default>);
}
exports.default = DualDropZone;
