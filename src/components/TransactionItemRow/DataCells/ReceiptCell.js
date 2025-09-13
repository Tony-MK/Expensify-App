"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Expensicons_1 = require("@components/Icon/Expensicons");
const ReceiptImage_1 = require("@components/ReceiptImage");
const ReceiptPreview_1 = require("@components/TransactionItemRow/ReceiptPreview");
const useHover_1 = require("@hooks/useHover");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const ReceiptUtils_1 = require("@libs/ReceiptUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
const variables_1 = require("@styles/variables");
function ReceiptCell({ transactionItem, isSelected, style }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const backgroundStyles = isSelected ? StyleUtils.getBackgroundColorStyle(theme.buttonHoveredBG) : StyleUtils.getBackgroundColorStyle(theme.border);
    const { hovered, bind } = (0, useHover_1.default)();
    const isEReceipt = transactionItem.hasEReceipt && !(0, TransactionUtils_1.hasReceiptSource)(transactionItem);
    let source = transactionItem?.receipt?.source ?? '';
    let previewSource = transactionItem?.receipt?.source ?? '';
    if (source && typeof source === 'string') {
        const filename = (0, FileUtils_1.getFileName)(source);
        const receiptURIs = (0, ReceiptUtils_1.getThumbnailAndImageURIs)(transactionItem, null, filename);
        source = (0, tryResolveUrlFromApiRoot_1.default)(receiptURIs.thumbnail ?? receiptURIs.image ?? '');
        const previewImageURI = expensify_common_1.Str.isImage(filename) ? receiptURIs.image : receiptURIs.thumbnail;
        previewSource = (0, tryResolveUrlFromApiRoot_1.default)(previewImageURI ?? '');
    }
    return (<react_native_1.View style={[
            StyleUtils.getWidthAndHeightStyle(variables_1.default.h36, variables_1.default.w40),
            StyleUtils.getBorderRadiusStyle(variables_1.default.componentBorderRadiusSmall),
            styles.overflowHidden,
            backgroundStyles,
            style,
        ]} onMouseEnter={bind.onMouseEnter} onMouseLeave={bind.onMouseLeave}>
            <ReceiptImage_1.default source={source} isEReceipt={isEReceipt} transactionID={transactionItem.transactionID} shouldUseThumbnailImage isAuthTokenRequired fallbackIcon={Expensicons_1.Receipt} fallbackIconSize={20} fallbackIconColor={theme.icon} fallbackIconBackground={isSelected ? theme.buttonHoveredBG : undefined} iconSize="x-small" loadingIconSize="small" loadingIndicatorStyles={styles.bgTransparent} transactionItem={transactionItem} shouldUseInitialObjectPosition/>
            <ReceiptPreview_1.default source={previewSource} hovered={hovered} isEReceipt={!!isEReceipt} transactionItem={transactionItem}/>
        </react_native_1.View>);
}
ReceiptCell.displayName = 'ReceiptCell';
exports.default = ReceiptCell;
