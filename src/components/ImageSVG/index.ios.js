"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_image_1 = require("expo-image");
const react_1 = require("react");
function ImageSVG({ src, width = '100%', height = '100%', fill, contentFit = 'cover', style, onLoadEnd }) {
    const tintColorProp = fill ? { tintColor: fill } : {};
    return (<expo_image_1.Image onLoadEnd={onLoadEnd} cachePolicy="memory-disk" contentFit={contentFit} source={src} style={[{ width, height }, style]} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...tintColorProp}/>);
}
ImageSVG.displayName = 'ImageSVG';
exports.default = ImageSVG;
