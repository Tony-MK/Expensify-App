"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var react_native_1 = require("react-native");
var Expensicons_1 = require("@components/Icon/Expensicons");
var ReceiptImage_1 = require("@components/ReceiptImage");
var ReceiptPreview_1 = require("@components/TransactionItemRow/ReceiptPreview");
var useHover_1 = require("@hooks/useHover");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var FileUtils_1 = require("@libs/fileDownload/FileUtils");
var ReceiptUtils_1 = require("@libs/ReceiptUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
var variables_1 = require("@styles/variables");
function ReceiptCell(_a) {
    var _b, _c, _d, _e, _f, _g;
    var transactionItem = _a.transactionItem, isSelected = _a.isSelected, style = _a.style;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var backgroundStyles = isSelected ? StyleUtils.getBackgroundColorStyle(theme.buttonHoveredBG) : StyleUtils.getBackgroundColorStyle(theme.border);
    var _h = (0, useHover_1.default)(), hovered = _h.hovered, bind = _h.bind;
    var isEReceipt = transactionItem.hasEReceipt && !(0, TransactionUtils_1.hasReceiptSource)(transactionItem);
    var source = (_c = (_b = transactionItem === null || transactionItem === void 0 ? void 0 : transactionItem.receipt) === null || _b === void 0 ? void 0 : _b.source) !== null && _c !== void 0 ? _c : '';
    var previewSource = (_e = (_d = transactionItem === null || transactionItem === void 0 ? void 0 : transactionItem.receipt) === null || _d === void 0 ? void 0 : _d.source) !== null && _e !== void 0 ? _e : '';
    if (source && typeof source === 'string') {
        var filename = (0, FileUtils_1.getFileName)(source);
        var receiptURIs = (0, ReceiptUtils_1.getThumbnailAndImageURIs)(transactionItem, null, filename);
        source = (0, tryResolveUrlFromApiRoot_1.default)((_g = (_f = receiptURIs.thumbnail) !== null && _f !== void 0 ? _f : receiptURIs.image) !== null && _g !== void 0 ? _g : '');
        var previewImageURI = expensify_common_1.Str.isImage(filename) ? receiptURIs.image : receiptURIs.thumbnail;
        previewSource = (0, tryResolveUrlFromApiRoot_1.default)(previewImageURI !== null && previewImageURI !== void 0 ? previewImageURI : '');
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
