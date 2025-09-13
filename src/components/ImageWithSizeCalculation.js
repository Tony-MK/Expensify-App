"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Log_1 = require("@libs/Log");
const CONST_1 = require("@src/CONST");
const resizeModes_1 = require("./Image/resizeModes");
const ImageWithLoading_1 = require("./ImageWithLoading");
/**
 * Preloads an image by getting the size and passing dimensions via callback.
 * Image size must be provided by parent via width and height props. Useful for
 * performing some calculation on a network image after fetching dimensions so
 * it can be appropriately resized.
 */
function ImageWithSizeCalculation({ url, altText, style, onMeasure, onLoadFailure, isAuthTokenRequired, objectPosition = CONST_1.default.IMAGE_OBJECT_POSITION.INITIAL }) {
    const styles = (0, useThemeStyles_1.default)();
    const source = (0, react_1.useMemo)(() => (typeof url === 'string' ? { uri: url } : url), [url]);
    const onError = () => {
        Log_1.default.hmmm('Unable to fetch image to calculate size', { url });
        onLoadFailure?.();
    };
    return (<ImageWithLoading_1.default containerStyles={[styles.w100, styles.h100, style]} style={[styles.w100, styles.h100]} source={source} aria-label={altText} isAuthTokenRequired={isAuthTokenRequired} resizeMode={resizeModes_1.default.cover} onError={onError} onLoad={(event) => {
            onMeasure({
                width: event.nativeEvent.width,
                height: event.nativeEvent.height,
            });
        }} objectPosition={objectPosition}/>);
}
ImageWithSizeCalculation.displayName = 'ImageWithSizeCalculation';
exports.default = react_1.default.memo(ImageWithSizeCalculation);
