"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useNetwork_1 = require("@hooks/useNetwork");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useThumbnailDimensions_1 = require("@hooks/useThumbnailDimensions");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const AttachmentDeletedIndicator_1 = require("./AttachmentDeletedIndicator");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const ImageWithSizeCalculation_1 = require("./ImageWithSizeCalculation");
// Cache for the dimensions of the thumbnails to avoid flickering incorrect size when the
// image has already been loaded once. This caches the dimensions based on the URL of
// the image.
const thumbnailDimensionsCache = new Map();
function ThumbnailImage({ previewSourceURL, altText, style, isAuthTokenRequired, imageWidth = 200, imageHeight = 200, shouldDynamicallyResize = true, fallbackIcon = Expensicons.Gallery, fallbackIconSize = variables_1.default.iconSizeSuperLarge, fallbackIconColor, fallbackIconBackground, objectPosition = CONST_1.default.IMAGE_OBJECT_POSITION.INITIAL, isDeleted, onLoadFailure, onMeasure, }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [failedToLoad, setFailedToLoad] = (0, react_1.useState)(false);
    const cachedDimensions = shouldDynamicallyResize && typeof previewSourceURL === 'string' ? thumbnailDimensionsCache.get(previewSourceURL) : null;
    const [imageDimensions, setImageDimensions] = (0, react_1.useState)({ width: cachedDimensions?.width ?? imageWidth, height: cachedDimensions?.height ?? imageHeight });
    const { thumbnailDimensionsStyles } = (0, useThumbnailDimensions_1.default)(imageDimensions.width, imageDimensions.height);
    const StyleUtils = (0, useStyleUtils_1.default)();
    (0, react_1.useEffect)(() => {
        setFailedToLoad(false);
    }, [isOffline, previewSourceURL]);
    /**
     * Update the state with the computed thumbnail sizes.
     * @param Params - width and height of the original image.
     */
    const updateImageSize = (0, react_1.useCallback)(({ width, height }) => {
        if (!shouldDynamicallyResize ||
            // If the provided dimensions are good avoid caching them and updating state.
            (imageDimensions.width === width && imageDimensions.height === height)) {
            return;
        }
        if (typeof previewSourceURL === 'string') {
            thumbnailDimensionsCache.set(previewSourceURL, { width, height });
        }
        setImageDimensions({ width, height });
    }, [previewSourceURL, imageDimensions, shouldDynamicallyResize]);
    const sizeStyles = shouldDynamicallyResize ? [thumbnailDimensionsStyles] : [styles.w100, styles.h100];
    if (failedToLoad || previewSourceURL === '') {
        const fallbackColor = StyleUtils.getBackgroundColorStyle(fallbackIconBackground ?? theme.border);
        return (<react_native_1.View style={[style, styles.overflowHidden, fallbackColor]}>
                <react_native_1.View style={[...sizeStyles, styles.alignItemsCenter, styles.justifyContentCenter]}>
                    <Icon_1.default src={isOffline ? Expensicons.OfflineCloud : fallbackIcon} height={fallbackIconSize} width={fallbackIconSize} fill={fallbackIconColor ?? theme.border}/>
                </react_native_1.View>
            </react_native_1.View>);
    }
    return (<react_native_1.View style={[styles.thumbnailImageContainerHighlight, style, styles.overflowHidden]}>
            {!!isDeleted && <AttachmentDeletedIndicator_1.default containerStyles={[...sizeStyles]}/>}
            <react_native_1.View style={[...sizeStyles, styles.alignItemsCenter, styles.justifyContentCenter]}>
                <ImageWithSizeCalculation_1.default url={previewSourceURL} altText={altText} onMeasure={(args) => {
            updateImageSize(args);
            onMeasure?.();
        }} onLoadFailure={() => {
            setFailedToLoad(true);
            onLoadFailure?.();
        }} isAuthTokenRequired={isAuthTokenRequired} objectPosition={objectPosition}/>
            </react_native_1.View>
        </react_native_1.View>);
}
ThumbnailImage.displayName = 'ThumbnailImage';
exports.default = react_1.default.memo(ThumbnailImage);
