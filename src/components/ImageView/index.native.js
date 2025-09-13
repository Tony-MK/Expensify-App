"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Lightbox_1 = require("@components/Lightbox");
const MultiGestureCanvas_1 = require("@components/MultiGestureCanvas");
function ImageView({ isAuthTokenRequired = false, url, style, zoomRange = MultiGestureCanvas_1.DEFAULT_ZOOM_RANGE, onError, onLoad }) {
    return (<Lightbox_1.default uri={url} zoomRange={zoomRange} isAuthTokenRequired={isAuthTokenRequired} onError={onError} onLoad={onLoad} style={style}/>);
}
ImageView.displayName = 'ImageView';
exports.default = ImageView;
