"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useEReceipt_1 = require("@hooks/useEReceipt");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const colors_1 = require("@styles/theme/colors");
const variables_1 = require("@styles/variables");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const ImageSVG_1 = require("./ImageSVG");
const Text_1 = require("./Text");
function EReceiptThumbnail({ transactionID, borderRadius, fileExtension, isReceiptThumbnail = false, centerIconV = true, iconSize = 'large' }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, {
        canBeMissing: true,
    });
    const { primaryColor, secondaryColor, MCCIcon, tripIcon, backgroundImage } = (0, useEReceipt_1.default)(transaction, fileExtension, isReceiptThumbnail);
    const isPerDiemRequest = (0, TransactionUtils_1.isPerDiemRequest)(transaction);
    let receiptIconWidth = variables_1.default.eReceiptIconWidth;
    let receiptIconHeight = variables_1.default.eReceiptIconHeight;
    let receiptMCCSize = variables_1.default.eReceiptMCCHeightWidth;
    let labelFontSize = variables_1.default.fontSizeNormal;
    let labelLineHeight = variables_1.default.lineHeightLarge;
    let backgroundImageMinWidth = variables_1.default.eReceiptBackgroundImageMinWidth;
    if (iconSize === 'x-small') {
        receiptIconWidth = variables_1.default.eReceiptIconWidthXSmall;
        receiptIconHeight = variables_1.default.eReceiptIconHeightXSmall;
        receiptMCCSize = variables_1.default.iconSizeXSmall;
        labelFontSize = variables_1.default.fontSizeExtraSmall;
        labelLineHeight = variables_1.default.lineHeightXSmall;
        backgroundImageMinWidth = variables_1.default.w80;
    }
    else if (iconSize === 'small') {
        receiptIconWidth = variables_1.default.eReceiptIconWidthSmall;
        receiptIconHeight = variables_1.default.eReceiptIconHeightSmall;
        receiptMCCSize = variables_1.default.eReceiptMCCHeightWidthSmall;
        labelFontSize = variables_1.default.fontSizeExtraSmall;
        labelLineHeight = variables_1.default.lineHeightXSmall;
    }
    else if (iconSize === 'medium') {
        receiptIconWidth = variables_1.default.eReceiptIconWidthMedium;
        receiptIconHeight = variables_1.default.eReceiptIconHeightMedium;
        receiptMCCSize = variables_1.default.eReceiptMCCHeightWidthMedium;
        labelFontSize = variables_1.default.fontSizeLabel;
        labelLineHeight = variables_1.default.lineHeightNormal;
    }
    return (<react_native_1.View style={[
            styles.flex1,
            primaryColor ? StyleUtils.getBackgroundColorStyle(primaryColor) : {},
            styles.overflowHidden,
            styles.alignItemsCenter,
            centerIconV ? styles.justifyContentCenter : {},
            borderRadius ? { borderRadius } : {},
        ]}>
            <react_native_1.View style={[styles.eReceiptBackgroundThumbnail, StyleUtils.getMinimumWidth(backgroundImageMinWidth)]}>
                <ImageSVG_1.default src={backgroundImage}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.alignItemsCenter, styles.ph8, styles.pt8, styles.pb8]}>
                <react_native_1.View style={[StyleUtils.getWidthAndHeightStyle(receiptIconWidth, receiptIconHeight), styles.alignItemsCenter, styles.justifyContentCenter]}>
                    <Icon_1.default src={Expensicons.EReceiptIcon} height={receiptIconHeight} width={receiptIconWidth} fill={secondaryColor} additionalStyles={[styles.fullScreen]}/>
                    {isReceiptThumbnail && !!fileExtension && (<Text_1.default selectable={false} style={[
                styles.labelStrong,
                StyleUtils.getFontSizeStyle(labelFontSize),
                StyleUtils.getLineHeightStyle(labelLineHeight),
                StyleUtils.getTextColorStyle(primaryColor ?? colors_1.default.black),
            ]}>
                            {fileExtension.toUpperCase()}
                        </Text_1.default>)}
                    {isPerDiemRequest ? (<Icon_1.default src={Expensicons.CalendarSolid} height={receiptMCCSize} width={receiptMCCSize} fill={primaryColor}/>) : null}
                    {!isPerDiemRequest && MCCIcon && !isReceiptThumbnail ? (<Icon_1.default src={MCCIcon} height={receiptMCCSize} width={receiptMCCSize} fill={primaryColor}/>) : null}
                    {!isPerDiemRequest && !MCCIcon && tripIcon ? (<Icon_1.default src={tripIcon} height={receiptMCCSize} width={receiptMCCSize} fill={primaryColor}/>) : null}
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
EReceiptThumbnail.displayName = 'EReceiptThumbnail';
exports.default = EReceiptThumbnail;
