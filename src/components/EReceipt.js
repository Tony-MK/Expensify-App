"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useEReceipt_1 = require("@hooks/useEReceipt");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const ReportUtils_1 = require("@libs/ReportUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const ImageSVG_1 = require("./ImageSVG");
const Text_1 = require("./Text");
const receiptMCCSize = variables_1.default.eReceiptMCCHeightWidthMedium;
const backgroundImageMinWidth = variables_1.default.eReceiptBackgroundImageMinWidth;
function EReceipt({ transactionID, transactionItem, isThumbnail = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const [cardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
    const { primaryColor, secondaryColor, titleColor, MCCIcon, tripIcon, backgroundImage } = (0, useEReceipt_1.default)(transactionItem ?? transaction);
    const { amount: transactionAmount, currency: transactionCurrency, merchant: transactionMerchant, created: transactionDate, cardID: transactionCardID, cardName: transactionCardName, } = (0, ReportUtils_1.getTransactionDetails)(transactionItem ?? transaction, CONST_1.default.DATE.MONTH_DAY_YEAR_FORMAT) ?? {};
    const formattedAmount = (0, CurrencyUtils_1.convertToDisplayString)(transactionAmount, transactionCurrency);
    const currency = (0, CurrencyUtils_1.getCurrencySymbol)(transactionCurrency ?? '');
    const amount = currency ? formattedAmount.replace(currency, '') : formattedAmount;
    const cardDescription = (0, CardUtils_1.getCompanyCardDescription)(transactionCardName, transactionCardID, cardList) ?? (transactionCardID ? (0, CardUtils_1.getCardDescription)(cardList?.[transactionCardID]) : '');
    const secondaryBgcolorStyle = secondaryColor ? StyleUtils.getBackgroundColorStyle(secondaryColor) : undefined;
    const primaryTextColorStyle = primaryColor ? StyleUtils.getColorStyle(primaryColor) : undefined;
    const titleTextColorStyle = titleColor ? StyleUtils.getColorStyle(titleColor) : undefined;
    return (<react_native_1.View style={[
            styles.eReceiptContainer,
            primaryColor ? StyleUtils.getBackgroundColorStyle(primaryColor) : undefined,
            isThumbnail && StyleUtils.getMinimumWidth(variables_1.default.eReceiptBGHWidth),
        ]}>
            <react_native_1.View style={[styles.flex1, primaryColor ? StyleUtils.getBackgroundColorStyle(primaryColor) : {}, styles.overflowHidden, styles.alignItemsCenter, styles.justifyContentCenter]}>
                <react_native_1.View style={[styles.eReceiptBackgroundThumbnail, StyleUtils.getMinimumWidth(backgroundImageMinWidth)]}>
                    <ImageSVG_1.default src={backgroundImage}/>
                </react_native_1.View>
                <react_native_1.View style={styles.eReceiptContentContainer}>
                    <react_native_1.View>
                        <ImageSVG_1.default src={Expensicons.ReceiptBody} fill={theme.textColorfulBackground} contentFit="fill"/>
                        <react_native_1.View style={styles.eReceiptContentWrapper}>
                            <react_native_1.View style={[StyleUtils.getBackgroundColorStyle(theme.textColorfulBackground), styles.alignItemsCenter, styles.justifyContentCenter, styles.h100]}>
                                <react_native_1.View style={[
            StyleUtils.getWidthAndHeightStyle(variables_1.default.eReceiptEmptyIconWidth, variables_1.default.eReceiptEmptyIconWidth),
            styles.alignItemsCenter,
            styles.justifyContentCenter,
            styles.borderRadiusComponentNormal,
            secondaryBgcolorStyle,
            styles.mb3,
        ]}>
                                    <react_native_1.View>
                                        {MCCIcon ? (<Icon_1.default src={MCCIcon} height={receiptMCCSize} width={receiptMCCSize} fill={primaryColor}/>) : null}
                                        {!MCCIcon && tripIcon ? (<Icon_1.default src={tripIcon} height={receiptMCCSize} width={receiptMCCSize} fill={primaryColor}/>) : null}
                                    </react_native_1.View>
                                </react_native_1.View>
                                <Text_1.default style={[styles.eReceiptGuaranteed, primaryTextColorStyle]}>{translate('eReceipt.guaranteed')}</Text_1.default>
                                <react_native_1.View style={[styles.alignItemsCenter]}>
                                    <react_native_1.View style={[StyleUtils.getWidthAndHeightStyle(variables_1.default.eReceiptIconWidth, variables_1.default.h40)]}/>
                                </react_native_1.View>
                                <react_native_1.View style={[styles.flexColumn, styles.justifyContentBetween, styles.alignItemsCenter, styles.ph9, styles.flex1]}>
                                    <react_native_1.View style={[styles.alignItemsCenter, styles.alignSelfCenter, styles.flexColumn, styles.gap2]}>
                                        <react_native_1.View style={[styles.flexRow, styles.justifyContentCenter, StyleUtils.getWidthStyle(variables_1.default.eReceiptTextContainerWidth)]}>
                                            <react_native_1.View style={[styles.flexColumn, styles.pt1]}>
                                                <Text_1.default style={[styles.eReceiptCurrency, primaryTextColorStyle]}>{currency}</Text_1.default>
                                            </react_native_1.View>
                                            <Text_1.default adjustsFontSizeToFit style={[styles.eReceiptAmountLarge, primaryTextColorStyle, styles.pr4]}>
                                                {amount}
                                            </Text_1.default>
                                        </react_native_1.View>
                                        <Text_1.default style={[styles.eReceiptMerchant, styles.breakWord, styles.textAlignCenter, primaryTextColorStyle]}>{transactionMerchant}</Text_1.default>
                                    </react_native_1.View>
                                    <react_native_1.View style={[styles.alignSelfStretch, styles.flexColumn, styles.gap4, styles.ph3]}>
                                        <react_native_1.View style={[styles.flexColumn, styles.gap1]}>
                                            <Text_1.default style={[styles.eReceiptWaypointTitle, titleTextColorStyle]}>{translate('eReceipt.transactionDate')}</Text_1.default>
                                            <Text_1.default style={[styles.eReceiptWaypointAddress, primaryTextColorStyle]}>{transactionDate}</Text_1.default>
                                        </react_native_1.View>
                                        <react_native_1.View style={[styles.flexColumn, styles.gap1]}>
                                            <Text_1.default style={[styles.eReceiptWaypointTitle, titleTextColorStyle]}>{translate('common.card')}</Text_1.default>
                                            <Text_1.default style={[styles.eReceiptWaypointAddress, primaryTextColorStyle]}>{cardDescription}</Text_1.default>
                                        </react_native_1.View>
                                    </react_native_1.View>
                                    <react_native_1.View>
                                        <react_native_1.View style={[styles.alignItemsCenter, styles.alignSelfStretch, styles.flexRow, styles.w100, styles.mb8]}>
                                            <Icon_1.default width={variables_1.default.eReceiptWordmarkWidth} height={variables_1.default.eReceiptWordmarkHeight} fill={secondaryColor} src={Expensicons.ExpensifyWordmark}/>
                                        </react_native_1.View>
                                    </react_native_1.View>
                                </react_native_1.View>
                            </react_native_1.View>
                        </react_native_1.View>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
EReceipt.displayName = 'EReceipt';
exports.default = EReceipt;
