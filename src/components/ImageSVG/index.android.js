"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_image_1 = require("expo-image");
const react_1 = require("react");
function ImageSVG({ src, width = '100%', height = '100%', fill, contentFit = 'cover', style, onLoadEnd }) {
    const tintColorProp = fill ? { tintColor: fill } : {};
    // Clear memory cache when unmounting images to avoid memory overload
    (0, react_1.useEffect)(() => {
        const clearMemoryCache = () => expo_image_1.Image.clearMemoryCache();
        return () => {
            clearMemoryCache();
        };
    }, []);
    return (<expo_image_1.Image onLoadEnd={onLoadEnd} 
    // Caching images to memory since some SVGs are being displayed with delay
    // See issue: https://github.com/Expensify/App/issues/34881
    cachePolicy="memory" contentFit={contentFit} source={src} style={[{ width, height }, style]} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...tintColorProp}/>);
}
ImageSVG.displayName = 'ImageSVG';
exports.default = ImageSVG;
