"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const Button_1 = require("./Button");
const DisplayNames_1 = require("./DisplayNames");
const Hoverable_1 = require("./Hoverable");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const MoneyRequestAmountInput_1 = require("./MoneyRequestAmountInput");
const OfflineWithFeedback_1 = require("./OfflineWithFeedback");
const PressableWithFeedback_1 = require("./Pressable/PressableWithFeedback");
const ReportActionAvatars_1 = require("./ReportActionAvatars");
const SelectCircle_1 = require("./SelectCircle");
const Text_1 = require("./Text");
function OptionRow({ option, onSelectRow, style, hoverStyle, selectedStateButtonText, keyForList, isDisabled: isOptionDisabled = false, isMultilineSupported = false, shouldShowSelectedStateAsButton = false, highlightSelected = false, shouldHaveOptionSeparator = false, showTitleTooltip = false, optionIsFocused = false, boldStyle = false, onSelectedStatePressed = () => { }, backgroundColor, isSelected = false, showSelectedState = false, shouldDisableRowInnerPadding = false, shouldPreventDefaultFocusOnSelectRow = false, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const pressableRef = (0, react_1.useRef)(null);
    const [isDisabled, setIsDisabled] = (0, react_1.useState)(isOptionDisabled);
    (0, react_1.useEffect)(() => {
        setIsDisabled(isOptionDisabled);
    }, [isOptionDisabled]);
    const text = option.text ?? '';
    const fullTitle = isMultilineSupported ? text.trimStart() : text;
    const indentsLength = text.length - fullTitle.length;
    const paddingLeft = Math.floor(indentsLength / CONST_1.default.INDENTS.length) * styles.ml3.marginLeft;
    const textStyle = optionIsFocused ? styles.sidebarLinkActiveText : styles.sidebarLinkText;
    const textUnreadStyle = boldStyle || option.boldStyle ? [textStyle, styles.sidebarLinkTextBold] : [textStyle];
    const displayNameStyle = [
        styles.optionDisplayName,
        textUnreadStyle,
        style,
        styles.pre,
        isDisabled ? styles.optionRowDisabled : {},
        isMultilineSupported ? { paddingLeft } : {},
    ];
    const alternateTextStyle = [
        textStyle,
        styles.optionAlternateText,
        styles.textLabelSupporting,
        style,
        (option.alternateTextMaxLines ?? 1) === 1 ? styles.pre : styles.preWrap,
    ];
    const contentContainerStyles = [styles.flex1, styles.mr3];
    const sidebarInnerRowStyle = react_native_1.StyleSheet.flatten([styles.chatLinkRowPressable, styles.flexGrow1, styles.optionItemAvatarNameWrapper, styles.optionRow, styles.justifyContentCenter]);
    const flattenHoverStyle = react_native_1.StyleSheet.flatten(hoverStyle);
    const hoveredStyle = hoverStyle ? flattenHoverStyle : styles.sidebarLinkHover;
    const hoveredBackgroundColor = hoveredStyle?.backgroundColor ? hoveredStyle.backgroundColor : backgroundColor;
    const focusedBackgroundColor = styles.sidebarLinkActive.backgroundColor;
    const shouldUseShortFormInTooltip = (option.participantsList?.length ?? 0) > 1;
    const firstIcon = option?.icons?.at(0);
    // We only create tooltips for the first 10 users or so since some reports have hundreds of users, causing performance to degrade.
    const displayNamesWithTooltips = (0, ReportUtils_1.getDisplayNamesWithTooltips)((option.participantsList ?? (option.accountID ? [option] : [])).slice(0, 10), shouldUseShortFormInTooltip, localeCompare);
    let subscriptColor = theme.appBG;
    if (optionIsFocused) {
        subscriptColor = focusedBackgroundColor;
    }
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const reportID = (option.iouReportID ?? option.reportID) || undefined;
    return (<Hoverable_1.default>
            {(hovered) => (<OfflineWithFeedback_1.default pendingAction={option.pendingAction} errors={option.allReportErrors} shouldShowErrorMessages={false} needsOffscreenAlphaCompositing>
                    <PressableWithFeedback_1.default id={keyForList} ref={pressableRef} onPress={(e) => {
                if (!onSelectRow) {
                    return;
                }
                setIsDisabled(true);
                if (e) {
                    e.preventDefault();
                }
                let result = onSelectRow(option, pressableRef.current);
                if (!(result instanceof Promise)) {
                    result = Promise.resolve();
                }
                react_native_1.InteractionManager.runAfterInteractions(() => {
                    result?.finally(() => setIsDisabled(isOptionDisabled));
                });
            }} disabled={isDisabled} style={[
                styles.flexRow,
                styles.alignItemsCenter,
                styles.justifyContentBetween,
                styles.sidebarLink,
                !isOptionDisabled && styles.cursorPointer,
                shouldDisableRowInnerPadding ? null : styles.sidebarLinkInner,
                optionIsFocused ? styles.sidebarLinkActive : null,
                shouldHaveOptionSeparator && styles.borderTop,
                !onSelectRow && !isOptionDisabled ? styles.cursorDefault : null,
            ]} accessibilityLabel={option.text ?? ''} role={CONST_1.default.ROLE.BUTTON} hoverDimmingValue={1} hoverStyle={!optionIsFocused ? (hoverStyle ?? styles.sidebarLinkHover) : undefined} needsOffscreenAlphaCompositing={(option.icons?.length ?? 0) >= 2} onMouseDown={shouldPreventDefaultFocusOnSelectRow ? (event) => event.preventDefault() : undefined} tabIndex={option.tabIndex ?? 0}>
                        <react_native_1.View style={sidebarInnerRowStyle}>
                            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                                {!!option.icons?.length && !!firstIcon && (<ReportActionAvatars_1.default subscriptAvatarBorderColor={hovered && !optionIsFocused ? hoveredBackgroundColor : subscriptColor} reportID={reportID} accountIDs={!reportID && option.accountID ? [option.accountID] : []} size={CONST_1.default.AVATAR_SIZE.DEFAULT} secondaryAvatarContainerStyle={[StyleUtils.getBackgroundAndBorderStyle(hovered && !optionIsFocused ? hoveredBackgroundColor : subscriptColor)]} shouldShowTooltip={showTitleTooltip && (0, OptionsListUtils_1.shouldOptionShowTooltip)(option)}/>)}
                                <react_native_1.View style={contentContainerStyles}>
                                    <DisplayNames_1.default accessibilityLabel={translate('accessibilityHints.chatUserDisplayNames')} fullTitle={fullTitle} displayNamesWithTooltips={displayNamesWithTooltips} tooltipEnabled={showTitleTooltip} numberOfLines={isMultilineSupported ? 2 : 1} textStyles={displayNameStyle} shouldUseFullTitle={!!option.isChatRoom ||
                !!option.isPolicyExpenseChat ||
                !!option.isMoneyRequestReport ||
                !!option.isThread ||
                !!option.isTaskReport ||
                !!option.isSelfDM}/>
                                    {option.alternateText ? (<Text_1.default style={alternateTextStyle} numberOfLines={option.alternateTextMaxLines ?? 1}>
                                            {option.alternateText}
                                        </Text_1.default>) : null}
                                </react_native_1.View>
                                {option.descriptiveText ? (<react_native_1.View style={[styles.flexWrap, styles.pl2]}>
                                        <Text_1.default style={[styles.textLabel]}>{option.descriptiveText}</Text_1.default>
                                    </react_native_1.View>) : null}
                                {option.shouldShowAmountInput && option.amountInputProps ? (<MoneyRequestAmountInput_1.default amount={option.amountInputProps.amount} currency={option.amountInputProps.currency} prefixCharacter={option.amountInputProps.prefixCharacter} disableKeyboard={false} isCurrencyPressable={false} hideFocusedState={false} hideCurrencySymbol formatAmountOnBlur prefixContainerStyle={[styles.pv0]} containerStyle={[styles.textInputContainer]} inputStyle={[
                    styles.optionRowAmountInput,
                    StyleUtils.getPaddingLeft(StyleUtils.getCharacterPadding(option.amountInputProps.prefixCharacter ?? '') + styles.pl1.paddingLeft),
                    option.amountInputProps.inputStyle,
                ]} onAmountChange={option.amountInputProps.onAmountChange} maxLength={option.amountInputProps.maxLength} shouldWrapInputInContainer={false}/>) : null}
                                {!isSelected && option.brickRoadIndicator === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR && (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentCenter]}>
                                        <Icon_1.default src={Expensicons.DotIndicator} fill={theme.danger}/>
                                    </react_native_1.View>)}
                                {!isSelected && option.brickRoadIndicator === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO && (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentCenter]}>
                                        <Icon_1.default src={Expensicons.DotIndicator} fill={theme.iconSuccessFill}/>
                                    </react_native_1.View>)}
                                {showSelectedState &&
                (shouldShowSelectedStateAsButton && !isSelected ? (<Button_1.default style={[styles.pl2]} text={selectedStateButtonText ?? translate('common.select')} onPress={() => onSelectedStatePressed(option)} small shouldUseDefaultHover={false}/>) : (<PressableWithFeedback_1.default onPress={() => onSelectedStatePressed(option)} disabled={isDisabled} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={CONST_1.default.ROLE.BUTTON} style={[styles.ml2, styles.optionSelectCircle]}>
                                            <SelectCircle_1.default isChecked={isSelected} selectCircleStyles={styles.ml0}/>
                                        </PressableWithFeedback_1.default>))}
                                {isSelected && highlightSelected && (<react_native_1.View style={styles.defaultCheckmarkWrapper}>
                                        <Icon_1.default src={Expensicons.Checkmark} fill={theme.iconSuccessFill}/>
                                    </react_native_1.View>)}
                            </react_native_1.View>
                        </react_native_1.View>
                        {!!option.customIcon && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]} accessible={false}>
                                <react_native_1.View>
                                    <Icon_1.default src={option.customIcon.src} fill={option.customIcon.color}/>
                                </react_native_1.View>
                            </react_native_1.View>)}
                    </PressableWithFeedback_1.default>
                </OfflineWithFeedback_1.default>)}
        </Hoverable_1.default>);
}
OptionRow.displayName = 'OptionRow';
exports.default = react_1.default.memo(OptionRow, (prevProps, nextProps) => prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.isMultilineSupported === nextProps.isMultilineSupported &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.shouldHaveOptionSeparator === nextProps.shouldHaveOptionSeparator &&
    prevProps.selectedStateButtonText === nextProps.selectedStateButtonText &&
    prevProps.showSelectedState === nextProps.showSelectedState &&
    prevProps.highlightSelected === nextProps.highlightSelected &&
    prevProps.showTitleTooltip === nextProps.showTitleTooltip &&
    (0, fast_equals_1.deepEqual)(prevProps.option.icons, nextProps.option.icons) &&
    prevProps.optionIsFocused === nextProps.optionIsFocused &&
    prevProps.option.text === nextProps.option.text &&
    prevProps.option.alternateText === nextProps.option.alternateText &&
    prevProps.option.descriptiveText === nextProps.option.descriptiveText &&
    prevProps.option.brickRoadIndicator === nextProps.option.brickRoadIndicator &&
    prevProps.option.shouldShowSubscript === nextProps.option.shouldShowSubscript &&
    prevProps.option.ownerAccountID === nextProps.option.ownerAccountID &&
    prevProps.option.subtitle === nextProps.option.subtitle &&
    prevProps.option.pendingAction === nextProps.option.pendingAction &&
    prevProps.option.customIcon === nextProps.option.customIcon &&
    prevProps.option.tabIndex === nextProps.option.tabIndex &&
    (0, fast_equals_1.deepEqual)(prevProps.option.amountInputProps, nextProps.option.amountInputProps));
