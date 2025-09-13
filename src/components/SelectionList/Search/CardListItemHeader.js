"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Checkbox_1 = require("@components/Checkbox");
var ReportActionAvatars_1 = require("@components/ReportActionAvatars");
var TextWithTooltip_1 = require("@components/TextWithTooltip");
var useLocalize_1 = require("@hooks/useLocalize");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var CONST_1 = require("@src/CONST");
var TotalCell_1 = require("./TotalCell");
function CardListItemHeader(_a) {
    var _b, _c;
    var cardItem = _a.card, onCheckboxPress = _a.onCheckboxPress, isDisabled = _a.isDisabled, isFocused = _a.isFocused, canSelectMultiple = _a.canSelectMultiple, isSelectAllChecked = _a.isSelectAllChecked, isIndeterminate = _a.isIndeterminate;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var _d = (0, useLocalize_1.default)(), translate = _d.translate, formatPhoneNumber = _d.formatPhoneNumber;
    var formattedDisplayName = (0, react_1.useMemo)(function () { return formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(cardItem)); }, [cardItem, formatPhoneNumber]);
    var backgroundColor = (_c = (_b = StyleUtils.getItemBackgroundColorStyle(!!cardItem.isSelected, !!isFocused, !!isDisabled, theme.activeComponentBG, theme.hoverComponentBG)) === null || _b === void 0 ? void 0 : _b.backgroundColor) !== null && _c !== void 0 ? _c : theme.highlightBG;
    return (<react_native_1.View>
            <react_native_1.View style={[styles.pv1Half, styles.ph3, styles.flexRow, styles.alignItemsCenter, styles.justifyContentStart]}>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mnh40, styles.flex1, styles.gap3]}>
                    {!!canSelectMultiple && (<Checkbox_1.default onPress={function () { return onCheckboxPress === null || onCheckboxPress === void 0 ? void 0 : onCheckboxPress(cardItem); }} isChecked={isSelectAllChecked} isIndeterminate={isIndeterminate} disabled={!!isDisabled || cardItem.isDisabledCheckbox} accessibilityLabel={translate('common.select')}/>)}
                    <react_native_1.View style={[styles.flexRow, styles.flex1, styles.gap3]}>
                        <ReportActionAvatars_1.default subscriptCardFeed={cardItem.bank} subscriptAvatarBorderColor={backgroundColor} noRightMarginOnSubscriptContainer accountIDs={[cardItem.accountID]}/>
                        <react_native_1.View style={[styles.gapHalf, styles.flexShrink1]}>
                            <TextWithTooltip_1.default text={formattedDisplayName} style={[styles.optionDisplayName, styles.sidebarLinkTextBold, styles.pre]}/>
                            <TextWithTooltip_1.default text={"".concat(cardItem.cardName).concat(cardItem.lastFourPAN ? " ".concat(CONST_1.default.DOT_SEPARATOR, " ") : '').concat(cardItem.lastFourPAN)} style={[styles.textLabelSupporting, styles.lh16, styles.pre]}/>
                        </react_native_1.View>
                    </react_native_1.View>
                </react_native_1.View>
                <react_native_1.View style={[styles.flexShrink0, styles.mr3]}>
                    <TotalCell_1.default total={cardItem.total} currency={cardItem.currency}/>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
CardListItemHeader.displayName = 'CardListItemHeader';
exports.default = CardListItemHeader;
