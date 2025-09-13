"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_view_shot_1 = require("react-native-view-shot");
const getQrCodeDownloadFileName_1 = require("@components/QRShare/getQrCodeDownloadFileName");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const fileDownload_1 = require("@libs/fileDownload");
const __1 = require("..");
function QRShareWithDownload(props, ref) {
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const qrCodeScreenshotRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => ({
        download: () => qrCodeScreenshotRef.current?.capture?.().then((uri) => (0, fileDownload_1.default)(uri, (0, getQrCodeDownloadFileName_1.default)(props.title ?? 'QRCode'), translate('fileDownload.success.qrMessage'))),
    }), [props.title, translate]);
    return (<react_native_view_shot_1.default ref={qrCodeScreenshotRef}>
            <__1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} logo={isOffline ? undefined : props.logo}/>
        </react_native_view_shot_1.default>);
}
QRShareWithDownload.displayName = 'QRShareWithDownload';
exports.default = (0, react_1.forwardRef)(QRShareWithDownload);
