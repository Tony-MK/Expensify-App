"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Checkbox_1 = require("@components/Checkbox");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const CONST_1 = require("@src/CONST");
const TotalCell_1 = require("./TotalCell");
function CardListItemHeader({ card: cardItem, onCheckboxPress, isDisabled, isFocused, canSelectMultiple, isSelectAllChecked, isIndeterminate, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const formattedDisplayName = (0, react_1.useMemo)(() => formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(cardItem)), [cardItem, formatPhoneNumber]);
    const backgroundColor = StyleUtils.getItemBackgroundColorStyle(!!cardItem.isSelected, !!isFocused, !!isDisabled, theme.activeComponentBG, theme.hoverComponentBG)?.backgroundColor ?? theme.highlightBG;
    return (<react_native_1.View>
            <react_native_1.View style={[styles.pv1Half, styles.ph3, styles.flexRow, styles.alignItemsCenter, styles.justifyContentStart]}>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mnh40, styles.flex1, styles.gap3]}>
                    {!!canSelectMultiple && (<Checkbox_1.default onPress={() => onCheckboxPress?.(cardItem)} isChecked={isSelectAllChecked} isIndeterminate={isIndeterminate} disabled={!!isDisabled || cardItem.isDisabledCheckbox} accessibilityLabel={translate('common.select')}/>)}
                    <react_native_1.View style={[styles.flexRow, styles.flex1, styles.gap3]}>
                        <ReportActionAvatars_1.default subscriptCardFeed={cardItem.bank} subscriptAvatarBorderColor={backgroundColor} noRightMarginOnSubscriptContainer accountIDs={[cardItem.accountID]}/>
                        <react_native_1.View style={[styles.gapHalf, styles.flexShrink1]}>
                            <TextWithTooltip_1.default text={formattedDisplayName} style={[styles.optionDisplayName, styles.sidebarLinkTextBold, styles.pre]}/>
                            <TextWithTooltip_1.default text={`${cardItem.cardName}${cardItem.lastFourPAN ? ` ${CONST_1.default.DOT_SEPARATOR} ` : ''}${cardItem.lastFourPAN}`} style={[styles.textLabelSupporting, styles.lh16, styles.pre]}/>
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
