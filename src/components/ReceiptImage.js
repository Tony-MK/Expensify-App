"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const EReceiptThumbnail_1 = require("./EReceiptThumbnail");
const EReceiptWithSizeCalculation_1 = require("./EReceiptWithSizeCalculation");
const ImageWithLoading_1 = require("./ImageWithLoading");
const PDFThumbnail_1 = require("./PDFThumbnail");
const ReceiptEmptyState_1 = require("./ReceiptEmptyState");
const ThumbnailImage_1 = require("./ThumbnailImage");
function ReceiptImage({ transactionID, isPDFThumbnail = false, isThumbnail = false, shouldUseThumbnailImage = false, isEReceipt = false, source, isAuthTokenRequired, style, fileExtension, iconSize, loadingIconSize, fallbackIcon, fallbackIconSize, shouldUseInitialObjectPosition = false, fallbackIconColor, fallbackIconBackground, isEmptyReceipt = false, onPress, transactionItem, isPerDiemRequest, shouldUseFullHeight, loadingIndicatorStyles, thumbnailContainerStyles, }) {
    const styles = (0, useThemeStyles_1.default)();
    if (isEmptyReceipt) {
        return (<ReceiptEmptyState_1.default isThumbnail onPress={onPress} disabled={!onPress} shouldUseFullHeight={shouldUseFullHeight}/>);
    }
    if (isPDFThumbnail) {
        return (<PDFThumbnail_1.default previewSourceURL={source ?? ''} style={[styles.w100, styles.h100]}/>);
    }
    if (isEReceipt && !isPerDiemRequest) {
        return (<EReceiptWithSizeCalculation_1.default transactionID={transactionID} transactionItem={transactionItem}/>);
    }
    if (isThumbnail || (isEReceipt && isPerDiemRequest)) {
        const props = isThumbnail && { borderRadius: style?.borderRadius, fileExtension, isReceiptThumbnail: true };
        return (<react_native_1.View style={style ?? [styles.w100, styles.h100]}>
                <EReceiptThumbnail_1.default transactionID={transactionID} iconSize={iconSize} 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}/>
            </react_native_1.View>);
    }
    if (shouldUseThumbnailImage) {
        return (<ThumbnailImage_1.default previewSourceURL={source ?? ''} style={[styles.w100, styles.h100, thumbnailContainerStyles]} isAuthTokenRequired={isAuthTokenRequired ?? false} shouldDynamicallyResize={false} fallbackIcon={fallbackIcon} fallbackIconSize={fallbackIconSize} fallbackIconColor={fallbackIconColor} fallbackIconBackground={fallbackIconBackground} objectPosition={shouldUseInitialObjectPosition ? CONST_1.default.IMAGE_OBJECT_POSITION.INITIAL : CONST_1.default.IMAGE_OBJECT_POSITION.TOP}/>);
    }
    return (<ImageWithLoading_1.default source={{ uri: source }} style={[style ?? [styles.w100, styles.h100], styles.overflowHidden]} isAuthTokenRequired={!!isAuthTokenRequired} loadingIconSize={loadingIconSize} loadingIndicatorStyles={loadingIndicatorStyles} shouldShowOfflineIndicator={false}/>);
}
exports.default = ReceiptImage;
