"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useEReceipt;
const react_1 = require("react");
const eReceiptBGs = require("@components/Icon/EReceiptBGs");
const MCCIcons = require("@components/Icon/MCCIcons");
const ReportUtils_1 = require("@libs/ReportUtils");
const TripReservationUtils_1 = require("@libs/TripReservationUtils");
const CONST_1 = require("@src/CONST");
const useStyleUtils_1 = require("./useStyleUtils");
const backgroundImages = {
    [CONST_1.default.ERECEIPT_COLORS.YELLOW]: eReceiptBGs.EReceiptBG_Yellow,
    [CONST_1.default.ERECEIPT_COLORS.ICE]: eReceiptBGs.EReceiptBG_Ice,
    [CONST_1.default.ERECEIPT_COLORS.BLUE]: eReceiptBGs.EReceiptBG_Blue,
    [CONST_1.default.ERECEIPT_COLORS.GREEN]: eReceiptBGs.EReceiptBG_Green,
    [CONST_1.default.ERECEIPT_COLORS.TANGERINE]: eReceiptBGs.EReceiptBG_Tangerine,
    [CONST_1.default.ERECEIPT_COLORS.PINK]: eReceiptBGs.EReceiptBG_Pink,
};
function useEReceipt(transactionData, fileExtension, isReceiptThumbnail) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const colorCode = isReceiptThumbnail ? StyleUtils.getFileExtensionColorCode(fileExtension) : StyleUtils.getEReceiptColorCode(transactionData);
    const colorStyles = StyleUtils.getEReceiptColorStyles(colorCode);
    const primaryColor = colorStyles?.backgroundColor;
    const secondaryColor = colorStyles?.color;
    const titleColor = colorStyles?.titleColor;
    const transactionDetails = (0, ReportUtils_1.getTransactionDetails)(transactionData);
    const transactionMCCGroup = transactionDetails?.mccGroup;
    const MCCIcon = transactionMCCGroup ? MCCIcons[`${transactionMCCGroup}`] : undefined;
    const tripIcon = (0, TripReservationUtils_1.getTripEReceiptIcon)(transactionData);
    const backgroundImage = (0, react_1.useMemo)(() => backgroundImages[colorCode], [colorCode]);
    return {
        primaryColor,
        secondaryColor,
        titleColor,
        MCCIcon,
        tripIcon,
        backgroundImage,
    };
}
