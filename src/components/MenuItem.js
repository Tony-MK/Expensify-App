"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ControlSelection_1 = require("@libs/ControlSelection");
const convertToLTR_1 = require("@libs/convertToLTR");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const getButtonState_1 = require("@libs/getButtonState");
const mergeRefs_1 = require("@libs/mergeRefs");
const Parser_1 = require("@libs/Parser");
const TextWithEmojiFragment_1 = require("@pages/home/report/comment/TextWithEmojiFragment");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const variables_1 = require("@styles/variables");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const Avatar_1 = require("./Avatar");
const Badge_1 = require("./Badge");
const CopyTextToClipboard_1 = require("./CopyTextToClipboard");
const DisplayNames_1 = require("./DisplayNames");
const FormHelpMessage_1 = require("./FormHelpMessage");
const Hoverable_1 = require("./Hoverable");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const MenuItemGroup_1 = require("./MenuItemGroup");
const PlaidCardFeedIcon_1 = require("./PlaidCardFeedIcon");
const PressableWithSecondaryInteraction_1 = require("./PressableWithSecondaryInteraction");
const RenderHTML_1 = require("./RenderHTML");
const ReportActionAvatars_1 = require("./ReportActionAvatars");
const SelectCircle_1 = require("./SelectCircle");
const Text_1 = require("./Text");
const EducationalTooltip_1 = require("./Tooltip/EducationalTooltip");
const getSubscriptAvatarBackgroundColor = (isHovered, isPressed, hoveredBackgroundColor, pressedBackgroundColor) => {
    if (isPressed) {
        return pressedBackgroundColor;
    }
    if (isHovered) {
        return hoveredBackgroundColor;
    }
};
function MenuItem({ interactive = true, onPress, badgeText, style, wrapperStyle, titleWrapperStyle, outerWrapperStyle, containerStyle, titleStyle, labelStyle, descriptionTextStyle, badgeStyle, viewMode = CONST_1.default.OPTION_MODE.DEFAULT, numberOfLinesTitle = 1, numberOfLinesDescription = 2, icon, iconFill, secondaryIcon, secondaryIconFill, iconType = CONST_1.default.ICON_TYPE_ICON, isSecondaryIconHoverable = false, iconWidth, iconHeight, iconStyles, fallbackIcon = Expensicons.FallbackAvatar, shouldShowTitleIcon = false, titleIcon, rightIconAccountID, iconAccountID, shouldShowRightIcon = false, iconRight = Expensicons.ArrowRight, furtherDetailsIcon, furtherDetails, furtherDetailsNumberOfLines = 2, furtherDetailsStyle, furtherDetailsComponent, description, helperText, helperTextStyle, errorText, errorTextStyle, shouldShowRedDotIndicator, hintText, success = false, iconReportID, focused = false, disabled = false, title, titleComponent, titleContainerStyle, subtitle, shouldShowBasicTitle, label, shouldTruncateTitle = false, characterLimit = 200, isLabelHoverable = true, rightLabel, shouldShowSelectedState = false, isSelected = false, shouldStackHorizontally = false, shouldShowDescriptionOnTop = false, shouldShowRightComponent = false, rightComponent, rightIconReportID, avatarSize = CONST_1.default.AVATAR_SIZE.DEFAULT, isSmallAvatarSubscriptMenu = false, brickRoadIndicator, shouldRenderAsHTML = false, shouldEscapeText = undefined, shouldGreyOutWhenDisabled = true, shouldRemoveBackground = false, shouldRemoveHoverBackground = false, shouldUseDefaultCursorWhenDisabled = false, shouldShowLoadingSpinnerIcon = false, isAnonymousAction = false, shouldBlockSelection = false, shouldParseTitle = false, shouldParseHelperText = false, shouldRenderHintAsHTML = false, shouldRenderErrorAsHTML = false, excludedMarkdownRules = [], shouldCheckActionAllowedOnPress = true, onSecondaryInteraction, titleWithTooltips, displayInDefaultIconColor = false, contentFit = 'cover', isPaneMenu = true, shouldPutLeftPaddingWhenNoIcon = false, onFocus, onBlur, avatarID, shouldRenderTooltip = false, shouldHideOnScroll = false, tooltipAnchorAlignment, tooltipWrapperStyle = {}, tooltipShiftHorizontal = 0, tooltipShiftVertical = 0, renderTooltipContent, onEducationTooltipPress, additionalIconStyles, shouldShowSelectedItemCheck = false, shouldIconUseAutoWidthStyle = false, shouldBreakWord = false, pressableTestID, shouldTeleportPortalToModalLayer, plaidUrl, copyValue = title, copyable = false, hasSubMenuItems = false, ref, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const combinedStyle = [styles.popoverMenuItem, style];
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { isExecuting, singleExecution, waitForNavigate } = (0, react_1.useContext)(MenuItemGroup_1.MenuItemGroupContext) ?? {};
    const popoverAnchor = (0, react_1.useRef)(null);
    const deviceHasHoverSupport = (0, DeviceCapabilities_1.hasHoverSupport)();
    const isCompact = viewMode === CONST_1.default.OPTION_MODE.COMPACT;
    const isDeleted = style && Array.isArray(style) ? style.includes(styles.offlineFeedback.deleted) : false;
    const descriptionVerticalMargin = shouldShowDescriptionOnTop ? styles.mb1 : styles.mt1;
    const combinedTitleTextStyle = StyleUtils.combineStyles([
        styles.flexShrink1,
        styles.popoverMenuText,
        // eslint-disable-next-line no-nested-ternary
        shouldPutLeftPaddingWhenNoIcon || (icon && !Array.isArray(icon)) ? (avatarSize === CONST_1.default.AVATAR_SIZE.SMALL ? styles.ml2 : styles.ml3) : {},
        shouldShowBasicTitle ? {} : styles.textStrong,
        numberOfLinesTitle !== 1 ? styles.preWrap : styles.pre,
        interactive && disabled ? { ...styles.userSelectNone } : {},
        styles.ltr,
        isDeleted ? styles.offlineFeedback.deleted : {},
        shouldBreakWord ? styles.breakWord : {},
        styles.mw100,
    ], titleStyle ?? {});
    const descriptionTextStyles = StyleUtils.combineStyles([
        styles.textLabelSupporting,
        icon && !Array.isArray(icon) ? styles.ml3 : {},
        title ? descriptionVerticalMargin : StyleUtils.getFontSizeStyle(variables_1.default.fontSizeNormal),
        title ? styles.textLineHeightNormal : StyleUtils.getLineHeightStyle(variables_1.default.fontSizeNormalHeight),
        descriptionTextStyle || styles.breakWord,
        isDeleted ? styles.offlineFeedback.deleted : {},
    ]);
    const html = (0, react_1.useMemo)(() => {
        if (!title || !shouldParseTitle) {
            return '';
        }
        return Parser_1.default.replace(title, { shouldEscapeText, disabledRules: excludedMarkdownRules });
    }, [title, shouldParseTitle, shouldEscapeText, excludedMarkdownRules]);
    const helperHtml = (0, react_1.useMemo)(() => {
        if (!helperText || !shouldParseHelperText) {
            return '';
        }
        return Parser_1.default.replace(helperText, { shouldEscapeText });
    }, [helperText, shouldParseHelperText, shouldEscapeText]);
    const processedTitle = (0, react_1.useMemo)(() => {
        let titleToWrap = '';
        if (shouldRenderAsHTML) {
            titleToWrap = title ?? '';
        }
        if (shouldParseTitle) {
            titleToWrap = html;
        }
        if (shouldTruncateTitle) {
            titleToWrap = Parser_1.default.truncateHTML(`<comment>${titleToWrap}</comment>`, characterLimit, { ellipsis: '...' });
            return titleToWrap;
        }
        return titleToWrap ? `<comment>${titleToWrap}</comment>` : '';
    }, [title, shouldRenderAsHTML, shouldParseTitle, characterLimit, shouldTruncateTitle, html]);
    const processedHelperText = (0, react_1.useMemo)(() => {
        let textToWrap = '';
        if (shouldParseHelperText) {
            textToWrap = helperHtml;
        }
        return textToWrap ? `<comment><muted-text-label>${textToWrap}</muted-text-label></comment>` : '';
    }, [shouldParseHelperText, helperHtml]);
    const hasPressableRightComponent = iconRight || (shouldShowRightComponent && rightComponent);
    const renderTitleContent = () => {
        if (title && titleWithTooltips && Array.isArray(titleWithTooltips) && titleWithTooltips.length > 0) {
            return (<DisplayNames_1.default fullTitle={title} displayNamesWithTooltips={titleWithTooltips} tooltipEnabled numberOfLines={1}/>);
        }
        const titleContainsTextAndCustomEmoji = (0, EmojiUtils_1.containsCustomEmoji)(title ?? '') && !(0, EmojiUtils_1.containsOnlyCustomEmoji)(title ?? '');
        if (title && titleContainsTextAndCustomEmoji) {
            return (<TextWithEmojiFragment_1.default message={(0, convertToLTR_1.default)(title) || ''} style={combinedTitleTextStyle} alignCustomEmoji/>);
        }
        return title ? (0, convertToLTR_1.default)(title) : '';
    };
    const onPressAction = (event) => {
        if (disabled || !interactive) {
            return;
        }
        if (event?.type === 'click') {
            event.currentTarget.blur();
        }
        if (onPress && event) {
            if (!singleExecution || !waitForNavigate) {
                onPress(event);
                return;
            }
            singleExecution(waitForNavigate(() => {
                onPress(event);
            }))();
        }
    };
    const secondaryInteraction = (event) => {
        if (!copyValue) {
            return;
        }
        (0, ReportActionContextMenu_1.showContextMenu)({
            type: CONST_1.default.CONTEXT_MENU_TYPES.TEXT,
            event,
            selection: copyValue,
            contextMenuAnchor: popoverAnchor.current,
        });
        onSecondaryInteraction?.(event);
    };
    const isIDPassed = !!iconReportID || !!iconAccountID || iconAccountID === CONST_1.default.DEFAULT_NUMBER_ID;
    return (<react_native_1.View onBlur={onBlur}>
            {!!label && !isLabelHoverable && (<react_native_1.View style={[styles.ph5, labelStyle]}>
                    <Text_1.default style={StyleUtils.combineStyles([styles.sidebarLinkText, styles.optionAlternateText, styles.textLabelSupporting, styles.pre])}>{label}</Text_1.default>
                </react_native_1.View>)}
            <EducationalTooltip_1.default shouldRender={shouldRenderTooltip} anchorAlignment={tooltipAnchorAlignment} renderTooltipContent={renderTooltipContent} wrapperStyle={tooltipWrapperStyle} shiftHorizontal={tooltipShiftHorizontal} shiftVertical={tooltipShiftVertical} shouldTeleportPortalToModalLayer={shouldTeleportPortalToModalLayer} onTooltipPress={onEducationTooltipPress} shouldHideOnScroll={shouldHideOnScroll}>
                <react_native_1.View>
                    <Hoverable_1.default>
                        {(isHovered) => (<PressableWithSecondaryInteraction_1.default onPress={shouldCheckActionAllowedOnPress ? (0, Session_1.callFunctionIfActionIsAllowed)(onPressAction, isAnonymousAction) : onPressAction} onPressIn={() => shouldBlockSelection && shouldUseNarrowLayout && (0, DeviceCapabilities_1.canUseTouchScreen)() && ControlSelection_1.default.block()} onPressOut={ControlSelection_1.default.unblock} onSecondaryInteraction={copyable && !deviceHasHoverSupport ? secondaryInteraction : onSecondaryInteraction} wrapperStyle={outerWrapperStyle} activeOpacity={!interactive ? 1 : variables_1.default.pressDimValue} opacityAnimationDuration={0} testID={pressableTestID} style={({ pressed }) => [
                containerStyle,
                combinedStyle,
                !interactive && styles.cursorDefault,
                isCompact && styles.alignItemsCenter,
                isCompact && styles.optionRowCompact,
                !shouldRemoveBackground &&
                    StyleUtils.getButtonBackgroundColorStyle((0, getButtonState_1.default)(focused || isHovered, pressed, success, disabled, interactive), true),
                ...(Array.isArray(wrapperStyle) ? wrapperStyle : [wrapperStyle]),
                shouldGreyOutWhenDisabled && disabled && styles.buttonOpacityDisabled,
                isHovered && interactive && !focused && !pressed && !shouldRemoveBackground && !shouldRemoveHoverBackground && styles.hoveredComponentBG,
            ]} disabledStyle={shouldUseDefaultCursorWhenDisabled && [styles.cursorDefault]} disabled={disabled || isExecuting} ref={(0, mergeRefs_1.default)(ref, popoverAnchor)} role={CONST_1.default.ROLE.MENUITEM} accessibilityLabel={title ? title.toString() : ''} accessible onFocus={onFocus}>
                                {({ pressed }) => (<react_native_1.View style={[styles.flex1]}>
                                        <react_native_1.View style={[styles.flexRow]}>
                                            <react_native_1.View style={[styles.flexColumn, styles.flex1]}>
                                                {!!label && isLabelHoverable && (
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                <react_native_1.View style={[isIDPassed ? styles.mb2 : null, labelStyle]}>
                                                        <Text_1.default style={StyleUtils.combineStyles([styles.sidebarLinkText, styles.optionAlternateText, styles.textLabelSupporting, styles.pre])}>
                                                            {label}
                                                        </Text_1.default>
                                                    </react_native_1.View>)}
                                                <react_native_1.View style={[styles.flexRow, styles.pointerEventsAuto, disabled && !shouldUseDefaultCursorWhenDisabled && styles.cursorDisabled]}>
                                                    {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
                                                    {isIDPassed && (<ReportActionAvatars_1.default subscriptAvatarBorderColor={getSubscriptAvatarBackgroundColor(isHovered, pressed, theme.hoverComponentBG, theme.buttonHoveredBG)} singleAvatarContainerStyle={[styles.actionAvatar, styles.mr3]} size={avatarSize} secondaryAvatarContainerStyle={[
                        StyleUtils.getBackgroundAndBorderStyle(theme.sidebar),
                        pressed && interactive ? StyleUtils.getBackgroundAndBorderStyle(theme.buttonPressedBG) : undefined,
                        isHovered && !pressed && interactive ? StyleUtils.getBackgroundAndBorderStyle(theme.border) : undefined,
                    ]} reportID={iconReportID} accountIDs={iconAccountID ? [iconAccountID] : undefined}/>)}
                                                    {!icon && shouldPutLeftPaddingWhenNoIcon && (<react_native_1.View style={[
                        styles.popoverMenuIcon,
                        iconStyles,
                        shouldIconUseAutoWidthStyle ? styles.wAuto : StyleUtils.getAvatarWidthStyle(avatarSize),
                    ]}/>)}
                                                    {!!icon && !Array.isArray(icon) && (<react_native_1.View style={[
                        styles.popoverMenuIcon,
                        iconStyles,
                        shouldIconUseAutoWidthStyle ? styles.wAuto : StyleUtils.getAvatarWidthStyle(avatarSize),
                    ]}>
                                                            {typeof icon !== 'string' &&
                        iconType === CONST_1.default.ICON_TYPE_ICON &&
                        (!shouldShowLoadingSpinnerIcon ? (<Icon_1.default contentFit={contentFit} hovered={isHovered} pressed={pressed} src={icon} width={iconWidth} height={iconHeight} fill={
                            // eslint-disable-next-line no-nested-ternary
                            displayInDefaultIconColor
                                ? undefined
                                : typeof iconFill === 'function'
                                    ? iconFill(isHovered)
                                    : (iconFill ??
                                        StyleUtils.getIconFillColor((0, getButtonState_1.default)(focused || isHovered, pressed, success, disabled, interactive), true, isPaneMenu))} additionalStyles={additionalIconStyles}/>) : (<react_native_1.ActivityIndicator size="small" color={theme.textSupporting}/>))}
                                                            {!!icon && iconType === CONST_1.default.ICON_TYPE_WORKSPACE && (<Avatar_1.default imageStyles={[styles.alignSelfCenter]} size={CONST_1.default.AVATAR_SIZE.DEFAULT} source={icon} fallbackIcon={fallbackIcon} name={title} avatarID={avatarID} type={CONST_1.default.ICON_TYPE_WORKSPACE}/>)}
                                                            {iconType === CONST_1.default.ICON_TYPE_AVATAR && (<Avatar_1.default imageStyles={[styles.alignSelfCenter]} source={icon} avatarID={avatarID} fallbackIcon={fallbackIcon} size={avatarSize} type={CONST_1.default.ICON_TYPE_AVATAR}/>)}
                                                            {iconType === CONST_1.default.ICON_TYPE_PLAID && !!plaidUrl && <PlaidCardFeedIcon_1.default plaidUrl={plaidUrl}/>}
                                                        </react_native_1.View>)}
                                                    {!!secondaryIcon && (<react_native_1.View style={[styles.popoverMenuIcon, iconStyles, isSecondaryIconHoverable && StyleUtils.getBackgroundAndBorderStyle(theme.border)]}>
                                                            <Icon_1.default contentFit={contentFit} src={secondaryIcon} width={iconWidth} height={iconHeight} fill={secondaryIconFill ??
                        StyleUtils.getIconFillColor((0, getButtonState_1.default)(focused || isHovered, pressed, success, disabled, interactive), true)}/>
                                                        </react_native_1.View>)}
                                                    <react_native_1.View style={[
                    styles.justifyContentCenter,
                    styles.flex1,
                    StyleUtils.getMenuItemTextContainerStyle(isSmallAvatarSubscriptMenu || isCompact),
                    titleContainerStyle,
                ]}>
                                                        {!!description && shouldShowDescriptionOnTop && (<Text_1.default style={descriptionTextStyles} numberOfLines={numberOfLinesDescription}>
                                                                {description}
                                                            </Text_1.default>)}
                                                        {(!!title || !!shouldShowTitleIcon) && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mw100, titleWrapperStyle]}>
                                                                {!!title && (shouldRenderAsHTML || (shouldParseTitle && !!html.length)) && (<react_native_1.View style={styles.renderHTMLTitle}>
                                                                        <RenderHTML_1.default html={processedTitle}/>
                                                                    </react_native_1.View>)}
                                                                {!shouldRenderAsHTML && !shouldParseTitle && !!title && (<Text_1.default style={combinedTitleTextStyle} numberOfLines={numberOfLinesTitle || undefined} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: interactive && disabled }}>
                                                                        {renderTitleContent()}
                                                                    </Text_1.default>)}
                                                                {!!shouldShowTitleIcon && !!titleIcon && (<react_native_1.View style={[styles.ml2]}>
                                                                        <Icon_1.default src={titleIcon} fill={theme.iconSuccessFill}/>
                                                                    </react_native_1.View>)}
                                                            </react_native_1.View>)}
                                                        {!!description && !shouldShowDescriptionOnTop && (<Text_1.default style={descriptionTextStyles} numberOfLines={numberOfLinesDescription}>
                                                                {description}
                                                            </Text_1.default>)}
                                                        {!!furtherDetails && (<react_native_1.View style={[styles.flexRow, styles.mt1, styles.alignItemsCenter]}>
                                                                {!!furtherDetailsIcon && (<Icon_1.default src={furtherDetailsIcon} height={variables_1.default.iconSizeNormal} width={variables_1.default.iconSizeNormal} inline/>)}
                                                                <Text_1.default style={[
                        furtherDetailsIcon ? [styles.furtherDetailsText, styles.ph2, styles.pt1] : styles.textLabelSupporting,
                        furtherDetailsStyle,
                    ]} numberOfLines={furtherDetailsNumberOfLines}>
                                                                    {furtherDetails}
                                                                </Text_1.default>
                                                            </react_native_1.View>)}
                                                        {!!furtherDetailsComponent && <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>{furtherDetailsComponent}</react_native_1.View>}
                                                        {titleComponent}
                                                    </react_native_1.View>
                                                </react_native_1.View>
                                            </react_native_1.View>
                                            <react_native_1.View style={[styles.flexRow, StyleUtils.getMenuItemTextContainerStyle(isCompact), !hasPressableRightComponent && styles.pointerEventsNone]}>
                                                {!!badgeText && (<Badge_1.default text={badgeText} badgeStyles={badgeStyle}/>)}
                                                {/* Since subtitle can be of type number, we should allow 0 to be shown */}
                                                {(subtitle === 0 || !!subtitle) && (<react_native_1.View style={[styles.justifyContentCenter, styles.mr1]}>
                                                        <Text_1.default style={[styles.textLabelSupporting, ...combinedStyle]}>{subtitle}</Text_1.default>
                                                    </react_native_1.View>)}
                                                {(!!rightIconAccountID || !!rightIconReportID) && (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentCenter, brickRoadIndicator ? styles.mr2 : styles.mrn2]}>
                                                        <ReportActionAvatars_1.default subscriptAvatarBorderColor={isHovered ? theme.activeComponentBG : theme.componentBG} singleAvatarContainerStyle={[styles.actionAvatar, styles.mr2]} reportID={rightIconReportID} size={CONST_1.default.AVATAR_SIZE.SMALL} horizontalStacking={shouldStackHorizontally && {
                        isHovered,
                        isPressed: pressed,
                    }} accountIDs={!!rightIconAccountID && Number(rightIconAccountID) > 0 ? [Number(rightIconAccountID)] : undefined} useMidSubscriptSizeForMultipleAvatars/>
                                                    </react_native_1.View>)}
                                                {!!brickRoadIndicator && (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentCenter, styles.ml1]}>
                                                        <Icon_1.default src={Expensicons.DotIndicator} fill={brickRoadIndicator === 'error' ? theme.danger : theme.success}/>
                                                    </react_native_1.View>)}
                                                {!title && !!rightLabel && !errorText && (<react_native_1.View style={styles.justifyContentCenter}>
                                                        <Text_1.default style={styles.rightLabelMenuItem}>{rightLabel}</Text_1.default>
                                                    </react_native_1.View>)}
                                                {shouldShowRightIcon && (<react_native_1.View style={[
                        styles.pointerEventsAuto,
                        StyleUtils.getMenuItemIconStyle(isCompact),
                        disabled && !shouldUseDefaultCursorWhenDisabled && styles.cursorDisabled,
                        hasSubMenuItems && styles.opacitySemiTransparent,
                        hasSubMenuItems && styles.pl6,
                    ]}>
                                                        <Icon_1.default src={iconRight} fill={StyleUtils.getIconFillColor((0, getButtonState_1.default)(focused || isHovered, pressed, success, disabled, interactive))} width={hasSubMenuItems ? variables_1.default.iconSizeSmall : variables_1.default.iconSizeNormal} height={hasSubMenuItems ? variables_1.default.iconSizeSmall : variables_1.default.iconSizeNormal}/>
                                                    </react_native_1.View>)}
                                                {shouldShowRightComponent && rightComponent}
                                                {shouldShowSelectedState && <SelectCircle_1.default isChecked={isSelected}/>}
                                                {shouldShowSelectedItemCheck && isSelected && (<Icon_1.default src={Expensicons.Checkmark} fill={theme.iconSuccessFill} additionalStyles={styles.alignSelfCenter}/>)}
                                                {copyable && deviceHasHoverSupport && !interactive && isHovered && !!copyValue && (<react_native_1.View style={styles.justifyContentCenter}>
                                                        <CopyTextToClipboard_1.default urlToCopy={copyValue} shouldHaveActiveBackground iconHeight={variables_1.default.iconSizeExtraSmall} iconWidth={variables_1.default.iconSizeExtraSmall} iconStyles={styles.t0} styles={styles.reportActionContextMenuMiniButton} shouldUseButtonBackground/>
                                                    </react_native_1.View>)}
                                            </react_native_1.View>
                                        </react_native_1.View>
                                        {!!errorText && (<FormHelpMessage_1.default isError shouldShowRedDotIndicator={!!shouldShowRedDotIndicator} message={errorText} style={[styles.menuItemError, errorTextStyle]} shouldRenderMessageAsHTML={shouldRenderErrorAsHTML}/>)}
                                        {!!hintText && (<FormHelpMessage_1.default isError={false} shouldShowRedDotIndicator={false} message={hintText} style={styles.menuItemError} shouldRenderMessageAsHTML={shouldRenderHintAsHTML}/>)}
                                    </react_native_1.View>)}
                            </PressableWithSecondaryInteraction_1.default>)}
                    </Hoverable_1.default>
                    {!!helperText &&
            (shouldParseHelperText ? (<react_native_1.View style={[styles.flexRow, styles.renderHTML, styles.ph5, styles.pb5]}>
                                <RenderHTML_1.default html={processedHelperText}/>
                            </react_native_1.View>) : (<Text_1.default style={[styles.mutedNormalTextLabel, styles.ph5, styles.pb5, helperTextStyle]}>{helperText}</Text_1.default>))}
                </react_native_1.View>
            </EducationalTooltip_1.default>
        </react_native_1.View>);
}
MenuItem.displayName = 'MenuItem';
exports.default = MenuItem;
