"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const getQrCodeDownloadFileName_1 = require("@components/QRShare/getQrCodeDownloadFileName");
const useNetwork_1 = require("@hooks/useNetwork");
const fileDownload_1 = require("@libs/fileDownload");
const __1 = require("..");
function QRShareWithDownload(props, ref) {
    const { isOffline } = (0, useNetwork_1.default)();
    const qrShareRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => ({
        download: () => new Promise((resolve, reject) => {
            // eslint-disable-next-line es/no-optional-chaining
            const svg = qrShareRef.current?.getSvg();
            if (!svg) {
                reject();
                return;
            }
            svg.toDataURL((dataURL) => resolve((0, fileDownload_1.default)(dataURL, (0, getQrCodeDownloadFileName_1.default)(props.title ?? 'QRCode'))));
        }),
    }), [props.title]);
    return (<__1.default ref={qrShareRef} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} logo={isOffline ? undefined : props.logo}/>);
}
QRShareWithDownload.displayName = 'QRShareWithDownload';
exports.default = (0, react_1.forwardRef)(QRShareWithDownload);
