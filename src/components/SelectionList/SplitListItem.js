"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Expensicons = require("@components/Icon/Expensicons");
const MoneyRequestAmountInput_1 = require("@components/MoneyRequestAmountInput");
const Text_1 = require("@components/Text");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const variables_1 = require("@styles/variables");
const BaseListItem_1 = require("./BaseListItem");
function SplitListItem({ item, isFocused, showTooltip, isDisabled, onSelectRow, shouldPreventEnterKeySubmit, rightHandSideComponent, onFocus, index, onInputFocus, onInputBlur, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const splitItem = item;
    const formattedOriginalAmount = (0, CurrencyUtils_1.convertToDisplayStringWithoutCurrency)(splitItem.originalAmount, splitItem.currency);
    const onSplitExpenseAmountChange = (amount) => {
        splitItem.onSplitExpenseAmountChange(splitItem.transactionID, Number(amount));
    };
    const isBottomVisible = !!splitItem.category || !!splitItem.tags?.at(0);
    const focusHandler = (0, react_1.useCallback)(() => {
        if (!onInputFocus) {
            return;
        }
        if (!index && index !== 0) {
            return;
        }
        onInputFocus(index);
    }, [onInputFocus, index]);
    return (<BaseListItem_1.default item={item} wrapperStyle={[styles.flex1, styles.justifyContentBetween, styles.userSelectNone, styles.p2, styles.br2]} isFocused={isFocused} containerStyle={[
            styles.mh4,
            styles.mv1,
            styles.reportPreviewBoxHoverBorder,
            styles.br2,
            splitItem.isTransactionLinked && StyleUtils.getBackgroundColorStyle(theme.messageHighlightBG),
        ]} hoverStyle={[styles.br2]} pressableStyle={[styles.br2, styles.p1]} isDisabled={isDisabled} showTooltip={showTooltip} onSelectRow={onSelectRow} shouldPreventEnterKeySubmit={shouldPreventEnterKeySubmit} rightHandSideComponent={rightHandSideComponent} keyForList={item.keyForList} onFocus={onFocus} pendingAction={item.pendingAction}>
            <react_native_1.View style={[styles.flexRow, styles.containerWithSpaceBetween]}>
                <react_native_1.View style={[styles.flex1]}>
                    <react_native_1.View style={[styles.containerWithSpaceBetween, !isBottomVisible && styles.justifyContentCenter]}>
                        <react_native_1.View style={[styles.minHeight5, styles.justifyContentCenter]}>
                            <Text_1.default numberOfLines={1} style={[styles.textMicroSupporting, styles.pre, styles.flexShrink1]}>
                                {splitItem.headerText}
                            </Text_1.default>
                        </react_native_1.View>
                        <react_native_1.View style={[styles.minHeight5, styles.justifyContentCenter, styles.gap2]}>
                            <react_native_1.View style={[styles.flex1, styles.flexColumn, styles.justifyContentCenter, styles.alignItemsStretch]}>
                                <Text_1.default fontSize={variables_1.default.fontSizeNormal} style={[styles.flexShrink1]} numberOfLines={1}>
                                    {splitItem.merchant}
                                </Text_1.default>
                            </react_native_1.View>
                        </react_native_1.View>
                    </react_native_1.View>
                    {isBottomVisible && (<react_native_1.View style={[styles.splitItemBottomContent]}>
                            {!!splitItem.category && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap1, styles.pr1, styles.flexShrink1, !!splitItem.tags?.at(0) && styles.mw50]}>
                                    <Icon_1.default src={Expensicons_1.Folder} height={variables_1.default.iconSizeExtraSmall} width={variables_1.default.iconSizeExtraSmall} fill={theme.icon}/>
                                    <Text_1.default numberOfLines={1} style={[styles.textMicroSupporting, styles.pre, styles.flexShrink1]}>
                                        {splitItem.category}
                                    </Text_1.default>
                                </react_native_1.View>)}
                            {!!splitItem.tags?.at(0) && (<react_native_1.View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter, styles.gap1, styles.pl1, !!splitItem.category && styles.mw50]}>
                                    <Icon_1.default src={Expensicons_1.Tag} height={variables_1.default.iconSizeExtraSmall} width={variables_1.default.iconSizeExtraSmall} fill={theme.icon}/>
                                    <Text_1.default numberOfLines={1} style={[styles.textMicroSupporting, styles.pre, styles.flexShrink1]}>
                                        {(0, PolicyUtils_1.getCommaSeparatedTagNameWithSanitizedColons)(splitItem.tags?.at(0) ?? '')}
                                    </Text_1.default>
                                </react_native_1.View>)}
                        </react_native_1.View>)}
                </react_native_1.View>
                <react_native_1.View style={[styles.flexRow]}>
                    <react_native_1.View style={[styles.justifyContentCenter]}>
                        <MoneyRequestAmountInput_1.default autoGrow={false} amount={splitItem.amount} currency={splitItem.currency} prefixCharacter={splitItem.currencySymbol} disableKeyboard={false} isCurrencyPressable={false} hideFocusedState={false} hideCurrencySymbol submitBehavior="blurAndSubmit" formatAmountOnBlur onAmountChange={onSplitExpenseAmountChange} prefixContainerStyle={[styles.pv0, styles.h100]} prefixStyle={styles.lineHeightUndefined} inputStyle={[styles.optionRowAmountInput, styles.lineHeightUndefined]} containerStyle={[styles.textInputContainer, styles.pl2, styles.pr1]} touchableInputWrapperStyle={[styles.ml3]} maxLength={formattedOriginalAmount.length + 1} contentWidth={(formattedOriginalAmount.length + 1) * 8} shouldApplyPaddingToContainer shouldUseDefaultLineHeightForPrefix={false} shouldWrapInputInContainer={false} onFocus={focusHandler} onBlur={onInputBlur}/>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.popoverMenuIcon, styles.pointerEventsAuto]}>
                        <Icon_1.default src={Expensicons.ArrowRight} fill={theme.icon}/>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>
        </BaseListItem_1.default>);
}
SplitListItem.displayName = 'SplitListItem';
exports.default = SplitListItem;
