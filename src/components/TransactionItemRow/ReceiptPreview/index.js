"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var DistanceEReceipt_1 = require("@components/DistanceEReceipt");
var EReceiptWithSizeCalculation_1 = require("@components/EReceiptWithSizeCalculation");
var useDebouncedState_1 = require("@hooks/useDebouncedState");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useWindowDimensions_1 = require("@hooks/useWindowDimensions");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var variables_1 = require("@styles/variables");
var Image_1 = require("@src/components/Image");
var CONST_1 = require("@src/CONST");
function ReceiptPreview(_a) {
    var source = _a.source, hovered = _a.hovered, _b = _a.isEReceipt, isEReceipt = _b === void 0 ? false : _b, transactionItem = _a.transactionItem;
    var isDistanceEReceipt = (0, TransactionUtils_1.isDistanceRequest)(transactionItem) && !(0, TransactionUtils_1.isManualDistanceRequest)(transactionItem);
    var styles = (0, useThemeStyles_1.default)();
    var theme = (0, useTheme_1.default)();
    var _c = (0, react_1.useState)(0), eReceiptScaleFactor = _c[0], setEReceiptScaleFactor = _c[1];
    var _d = (0, react_1.useState)(undefined), imageAspectRatio = _d[0], setImageAspectRatio = _d[1];
    var _e = (0, react_1.useState)(undefined), distanceEReceiptAspectRatio = _e[0], setDistanceEReceiptAspectRatio = _e[1];
    var _f = (0, useDebouncedState_1.default)(false, CONST_1.default.TIMING.SHOW_HOVER_PREVIEW_DELAY), shouldShow = _f[0], debounceShouldShow = _f[1], setShouldShow = _f[2];
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var hasMeasured = (0, react_1.useRef)(false);
    var windowHeight = (0, useWindowDimensions_1.default)().windowHeight;
    var _g = (0, react_1.useState)(true), isLoading = _g[0], setIsLoading = _g[1];
    var handleDistanceEReceiptLayout = function (e) {
        if (hasMeasured.current) {
            return;
        }
        hasMeasured.current = true;
        var _a = e.nativeEvent.layout, height = _a.height, width = _a.width;
        if (height === 0) {
            // on the initial layout, measured height is 0, so we want to set everything on the second one
            hasMeasured.current = false;
            return;
        }
        if (height * eReceiptScaleFactor > windowHeight - CONST_1.default.RECEIPT_PREVIEW_TOP_BOTTOM_MARGIN) {
            setDistanceEReceiptAspectRatio(variables_1.default.eReceiptBGHWidth / (windowHeight - CONST_1.default.RECEIPT_PREVIEW_TOP_BOTTOM_MARGIN));
            return;
        }
        setDistanceEReceiptAspectRatio(variables_1.default.eReceiptBGHWidth / height);
        setEReceiptScaleFactor(width / variables_1.default.eReceiptBGHWidth);
    };
    var updateImageAspectRatio = (0, react_1.useCallback)(function (width, height) {
        if (!source) {
            return;
        }
        setImageAspectRatio(height ? width / height : 'auto');
    }, [source]);
    var handleLoad = (0, react_1.useCallback)(function (e) {
        var _a = e.nativeEvent, width = _a.width, height = _a.height;
        updateImageAspectRatio(width, height);
        setIsLoading(false);
    }, [updateImageAspectRatio]);
    var handleError = function () {
        setIsLoading(false);
    };
    (0, react_1.useEffect)(function () {
        setShouldShow(hovered);
    }, [hovered, setShouldShow]);
    if (shouldUseNarrowLayout || !debounceShouldShow || !shouldShow || (!source && !isEReceipt && !isDistanceEReceipt)) {
        return null;
    }
    var shouldShowImage = source && !(isEReceipt || isDistanceEReceipt);
    var shouldShowDistanceEReceipt = isDistanceEReceipt && !isEReceipt;
    return react_dom_1.default.createPortal(<react_native_reanimated_1.default.View entering={react_native_reanimated_1.FadeIn.duration(CONST_1.default.TIMING.SHOW_HOVER_PREVIEW_ANIMATION_DURATION)} exiting={react_native_reanimated_1.FadeOut.duration(CONST_1.default.TIMING.SHOW_HOVER_PREVIEW_ANIMATION_DURATION)} style={[styles.receiptPreview, styles.flexColumn, styles.alignItemsCenter, styles.justifyContentStart]}>
            {shouldShowImage ? (<react_native_1.View style={[styles.w100]}>
                    {isLoading && (<react_native_1.View style={[react_native_1.StyleSheet.absoluteFillObject, styles.justifyContentCenter, styles.alignItemsCenter]}>
                            <react_native_1.ActivityIndicator color={theme.spinner} size="large"/>
                        </react_native_1.View>)}

                    <Image_1.default source={{ uri: source }} style={[
                styles.w100,
                { aspectRatio: imageAspectRatio !== null && imageAspectRatio !== void 0 ? imageAspectRatio : 1 },
                isLoading && { opacity: 0 }, // hide until loaded
            ]} onLoadStart={function () {
                if (isLoading) {
                    return;
                }
                setIsLoading(true);
            }} onError={handleError} onLoad={handleLoad} isAuthTokenRequired/>
                </react_native_1.View>) : (<react_native_1.View style={styles.receiptPreviewEReceiptsContainer}>
                    {shouldShowDistanceEReceipt ? (<react_native_1.View onLayout={handleDistanceEReceiptLayout} style={[
                    {
                        transformOrigin: 'center',
                        scale: eReceiptScaleFactor,
                        aspectRatio: distanceEReceiptAspectRatio,
                    },
                ]}>
                            <DistanceEReceipt_1.default transaction={transactionItem} hoverPreview/>
                        </react_native_1.View>) : (<EReceiptWithSizeCalculation_1.default transactionID={transactionItem.transactionID} transactionItem={transactionItem} shouldUseAspectRatio/>)}
                </react_native_1.View>)}
        </react_native_reanimated_1.default.View>, document.body);
}
ReceiptPreview.displayName = 'HoverReceiptPreview';
exports.default = ReceiptPreview;
