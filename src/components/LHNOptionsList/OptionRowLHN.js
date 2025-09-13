"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const DisplayNames_1 = require("@components/DisplayNames");
const Hoverable_1 = require("@components/Hoverable");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const PressableWithSecondaryInteraction_1 = require("@components/PressableWithSecondaryInteraction");
const ProductTrainingContext_1 = require("@components/ProductTrainingContext");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
const EducationalTooltip_1 = require("@components/Tooltip/EducationalTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const DomUtils_1 = require("@libs/DomUtils");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Parser_1 = require("@libs/Parser");
const Performance_1 = require("@libs/Performance");
const ReportActionComposeFocusManager_1 = require("@libs/ReportActionComposeFocusManager");
const ReportUtils_1 = require("@libs/ReportUtils");
const TextWithEmojiFragment_1 = require("@pages/home/report/comment/TextWithEmojiFragment");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const FreeTrial_1 = require("@pages/settings/Subscription/FreeTrial");
const variables_1 = require("@styles/variables");
const Timing_1 = require("@userActions/Timing");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function OptionRowLHN({ reportID, report, isOptionFocused = false, onSelectRow = () => { }, optionItem, viewMode = 'default', activePolicyID, onboardingPurpose, isFullscreenVisible, isReportsSplitNavigatorLast, style, onLayout = () => { }, hasDraftComment, shouldShowRBRorGBRTooltip, isScreenFocused = false, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const popoverAnchor = (0, react_1.useRef)(null);
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const session = (0, OnyxListItemProvider_1.useSession)();
    const shouldShowWorkspaceChatTooltip = (0, ReportUtils_1.isPolicyExpenseChat)(report) && !(0, ReportUtils_1.isThread)(report) && activePolicyID === report?.policyID && session?.accountID === report?.ownerAccountID;
    const isOnboardingGuideAssigned = onboardingPurpose === CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM && !session?.email?.includes('+');
    const isChatUsedForOnboarding = (0, ReportUtils_1.isChatUsedForOnboarding)(report, onboardingPurpose);
    const shouldShowGetStartedTooltip = isOnboardingGuideAssigned ? (0, ReportUtils_1.isAdminRoom)(report) && isChatUsedForOnboarding : (0, ReportUtils_1.isConciergeChatReport)(report);
    const { tooltipToRender, shouldShowTooltip, shouldTooltipBeLeftAligned } = (0, react_1.useMemo)(() => {
        let tooltip;
        if (shouldShowRBRorGBRTooltip) {
            tooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.GBR_RBR_CHAT;
        }
        else if (shouldShowWorkspaceChatTooltip) {
            tooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.LHN_WORKSPACE_CHAT_TOOLTIP;
        }
        else {
            // TODO: CONCIERGE_LHN_GBR tooltip will be replaced by a tooltip in the #admins room
            // https://github.com/Expensify/App/issues/57045#issuecomment-2701455668
            tooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.CONCIERGE_LHN_GBR;
        }
        const shouldShowTooltips = shouldShowRBRorGBRTooltip || shouldShowWorkspaceChatTooltip || shouldShowGetStartedTooltip;
        const shouldTooltipBeVisible = shouldUseNarrowLayout ? isScreenFocused && isReportsSplitNavigatorLast : isReportsSplitNavigatorLast && !isFullscreenVisible;
        return {
            tooltipToRender: tooltip,
            shouldShowTooltip: shouldShowTooltips && shouldTooltipBeVisible,
            shouldTooltipBeLeftAligned: shouldShowWorkspaceChatTooltip && !shouldShowRBRorGBRTooltip && !shouldShowGetStartedTooltip,
        };
    }, [shouldShowRBRorGBRTooltip, shouldShowGetStartedTooltip, shouldShowWorkspaceChatTooltip, isScreenFocused, shouldUseNarrowLayout, isReportsSplitNavigatorLast, isFullscreenVisible]);
    const { shouldShowProductTrainingTooltip, renderProductTrainingTooltip, hideProductTrainingTooltip } = (0, ProductTrainingContext_1.useProductTrainingContext)(tooltipToRender, shouldShowTooltip);
    const { translate } = (0, useLocalize_1.default)();
    const [isContextMenuActive, setIsContextMenuActive] = (0, react_1.useState)(false);
    const isInFocusMode = viewMode === CONST_1.default.OPTION_MODE.COMPACT;
    const sidebarInnerRowStyle = react_native_1.StyleSheet.flatten(isInFocusMode
        ? [styles.chatLinkRowPressable, styles.flexGrow1, styles.optionItemAvatarNameWrapper, styles.optionRowCompact, styles.justifyContentCenter]
        : [styles.chatLinkRowPressable, styles.flexGrow1, styles.optionItemAvatarNameWrapper, styles.optionRow, styles.justifyContentCenter]);
    const alternateTextContainsCustomEmojiWithText = (0, react_1.useMemo)(() => (0, EmojiUtils_1.containsCustomEmoji)(optionItem?.alternateText) && !(0, EmojiUtils_1.containsOnlyCustomEmoji)(optionItem?.alternateText), [optionItem?.alternateText]);
    if (!optionItem && !isOptionFocused) {
        // rendering null as a render item causes the FlashList to render all
        // its children and consume significant memory on the first render. We can avoid this by
        // rendering a placeholder view instead. This behaviour is only observed when we
        // first sign in to the App.
        // We can fix this by checking if the optionItem is null and the component is not focused.
        // Which means that the currentReportID is not the same as the reportID. The currentReportID
        // in this case is empty and hence the component is not focused.
        return <react_native_1.View style={sidebarInnerRowStyle}/>;
    }
    if (!optionItem) {
        // This is the case when the component is focused and the optionItem is null.
        // For example, when you submit an expense in offline mode and click on the
        // generated expense report, we would only see the Report Details but no item in LHN.
        return null;
    }
    const brickRoadIndicator = optionItem.brickRoadIndicator;
    const textStyle = isOptionFocused ? styles.sidebarLinkActiveText : styles.sidebarLinkText;
    const textUnreadStyle = (0, OptionsListUtils_1.shouldUseBoldText)(optionItem) ? [textStyle, styles.sidebarLinkTextBold] : [textStyle];
    const displayNameStyle = [styles.optionDisplayName, styles.optionDisplayNameCompact, styles.pre, textUnreadStyle, styles.flexShrink0, style];
    const alternateTextStyle = isInFocusMode
        ? [textStyle, styles.textLabelSupporting, styles.optionAlternateTextCompact, styles.ml2, style]
        : [textStyle, styles.optionAlternateText, styles.textLabelSupporting, style];
    const contentContainerStyles = isInFocusMode ? [styles.flex1, styles.flexRow, styles.overflowHidden, StyleUtils.getCompactContentContainerStyles()] : [styles.flex1];
    const hoveredBackgroundColor = !!styles.sidebarLinkHover && 'backgroundColor' in styles.sidebarLinkHover ? styles.sidebarLinkHover.backgroundColor : theme.sidebar;
    const focusedBackgroundColor = styles.sidebarLinkActive.backgroundColor;
    /**
     * Show the ReportActionContextMenu modal popover.
     *
     * @param [event] - A press event.
     */
    const showPopover = (event) => {
        if (!isScreenFocused && shouldUseNarrowLayout) {
            return;
        }
        setIsContextMenuActive(true);
        (0, ReportActionContextMenu_1.showContextMenu)({
            type: CONST_1.default.CONTEXT_MENU_TYPES.REPORT,
            event,
            selection: '',
            contextMenuAnchor: popoverAnchor.current,
            report: {
                reportID,
                originalReportID: reportID,
                isPinnedChat: optionItem.isPinned,
                isUnreadChat: !!optionItem.isUnread,
            },
            reportAction: {
                reportActionID: '-1',
            },
            callbacks: {
                onHide: () => setIsContextMenuActive(false),
            },
            withoutOverlay: false,
        });
    };
    const emojiCode = optionItem.status?.emojiCode ?? '';
    const statusText = optionItem.status?.text ?? '';
    const statusClearAfterDate = optionItem.status?.clearAfter ?? '';
    const formattedDate = DateUtils_1.default.getStatusUntilDate(statusClearAfterDate);
    const statusContent = formattedDate ? `${statusText ? `${statusText} ` : ''}(${formattedDate})` : statusText;
    const isStatusVisible = !!emojiCode && (0, ReportUtils_1.isOneOnOneChat)(!(0, EmptyObject_1.isEmptyObject)(report) ? report : undefined);
    const subscriptAvatarBorderColor = isOptionFocused ? focusedBackgroundColor : theme.sidebar;
    const firstIcon = optionItem.icons?.at(0);
    const onOptionPress = (event) => {
        Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_REPORT);
        Timing_1.default.start(CONST_1.default.TIMING.OPEN_REPORT);
        event?.preventDefault();
        // Enable Composer to focus on clicking the same chat after opening the context menu.
        ReportActionComposeFocusManager_1.default.focus();
        hideProductTrainingTooltip();
        onSelectRow(optionItem, popoverAnchor);
    };
    return (<OfflineWithFeedback_1.default pendingAction={optionItem.pendingAction} errors={optionItem.allReportErrors} shouldShowErrorMessages={false} needsOffscreenAlphaCompositing>
            <EducationalTooltip_1.default 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    shouldRender={shouldShowProductTrainingTooltip} renderTooltipContent={renderProductTrainingTooltip} anchorAlignment={{
            horizontal: shouldTooltipBeLeftAligned ? CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT : CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
        }} shiftHorizontal={shouldTooltipBeLeftAligned ? variables_1.default.workspaceLHNTooltipShiftHorizontal : variables_1.default.gbrTooltipShiftHorizontal} shiftVertical={shouldTooltipBeLeftAligned ? 0 : variables_1.default.gbrTooltipShiftVertical} wrapperStyle={styles.productTrainingTooltipWrapper} onTooltipPress={onOptionPress} shouldHideOnScroll>
                <react_native_1.View>
                    <Hoverable_1.default>
                        {(hovered) => (<PressableWithSecondaryInteraction_1.default ref={popoverAnchor} onPress={onOptionPress} onMouseDown={(event) => {
                // Allow composer blur on right click
                if (!event) {
                    return;
                }
                // Prevent composer blur on left click
                event.preventDefault();
            }} 
        // reportID may be a number contrary to the type definition
        testID={typeof optionItem.reportID === 'number' ? String(optionItem.reportID) : optionItem.reportID} onSecondaryInteraction={(event) => {
                showPopover(event);
                // Ensure that we blur the composer when opening context menu, so that only one component is focused at a time
                if (DomUtils_1.default.getActiveElement()) {
                    DomUtils_1.default.getActiveElement()?.blur();
                }
            }} withoutFocusOnSecondaryInteraction activeOpacity={variables_1.default.pressDimValue} opacityAnimationDuration={0} style={[
                styles.flexRow,
                styles.alignItemsCenter,
                styles.justifyContentBetween,
                styles.sidebarLink,
                styles.sidebarLinkInnerLHN,
                StyleUtils.getBackgroundColorStyle(theme.sidebar),
                isOptionFocused ? styles.sidebarLinkActive : null,
                (hovered || isContextMenuActive) && !isOptionFocused ? styles.sidebarLinkHover : null,
            ]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={`${translate('accessibilityHints.navigatesToChat')} ${optionItem.text}. ${optionItem.isUnread ? `${translate('common.unread')}.` : ''} ${optionItem.alternateText}`} onLayout={onLayout} needsOffscreenAlphaCompositing={(optionItem?.icons?.length ?? 0) >= 2}>
                                <react_native_1.View style={sidebarInnerRowStyle}>
                                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                                        {!!optionItem.icons?.length && !!firstIcon && (<ReportActionAvatars_1.default subscriptAvatarBorderColor={hovered && !isOptionFocused ? hoveredBackgroundColor : subscriptAvatarBorderColor} useMidSubscriptSizeForMultipleAvatars={isInFocusMode} size={isInFocusMode ? CONST_1.default.AVATAR_SIZE.SMALL : CONST_1.default.AVATAR_SIZE.DEFAULT} secondaryAvatarContainerStyle={[
                    StyleUtils.getBackgroundAndBorderStyle(theme.sidebar),
                    isOptionFocused ? StyleUtils.getBackgroundAndBorderStyle(focusedBackgroundColor) : undefined,
                    hovered && !isOptionFocused ? StyleUtils.getBackgroundAndBorderStyle(hoveredBackgroundColor) : undefined,
                ]} singleAvatarContainerStyle={[styles.actionAvatar, styles.mr3]} shouldShowTooltip={(0, OptionsListUtils_1.shouldOptionShowTooltip)(optionItem)} reportID={optionItem?.reportID}/>)}
                                        <react_native_1.View style={contentContainerStyles}>
                                            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mw100, styles.overflowHidden]}>
                                                <DisplayNames_1.default accessibilityLabel={translate('accessibilityHints.chatUserDisplayNames')} fullTitle={optionItem.text ?? ''} displayNamesWithTooltips={optionItem.displayNamesWithTooltips ?? []} tooltipEnabled numberOfLines={1} textStyles={displayNameStyle} shouldUseFullTitle={!!optionItem.isChatRoom ||
                !!optionItem.isPolicyExpenseChat ||
                !!optionItem.isTaskReport ||
                !!optionItem.isThread ||
                !!optionItem.isMoneyRequestReport ||
                !!optionItem.isInvoiceReport ||
                !!optionItem.private_isArchived ||
                (0, ReportUtils_1.isGroupChat)(report) ||
                (0, ReportUtils_1.isSystemChat)(report)}/>
                                                {isChatUsedForOnboarding && <FreeTrial_1.default badgeStyles={[styles.mnh0, styles.pl2, styles.pr2, styles.ml1, styles.flexShrink1]}/>}
                                                {isStatusVisible && (<Tooltip_1.default text={statusContent} shiftVertical={-4}>
                                                        <Text_1.default style={styles.ml1}>{emojiCode}</Text_1.default>
                                                    </Tooltip_1.default>)}
                                            </react_native_1.View>
                                            {!!optionItem.alternateText && (<Text_1.default style={alternateTextStyle} numberOfLines={1} accessibilityLabel={translate('accessibilityHints.lastChatMessagePreview')} fsClass={CONST_1.default.FULLSTORY.CLASS.MASK}>
                                                    {alternateTextContainsCustomEmojiWithText ? (<TextWithEmojiFragment_1.default message={Parser_1.default.htmlToText(optionItem.alternateText)} style={[alternateTextStyle, styles.mh0]} alignCustomEmoji/>) : (Parser_1.default.htmlToText(optionItem.alternateText))}
                                                </Text_1.default>)}
                                        </react_native_1.View>
                                        {optionItem?.descriptiveText ? (<react_native_1.View style={[styles.flexWrap]} fsClass={CONST_1.default.FULLSTORY.CLASS.MASK}>
                                                <Text_1.default style={[styles.textLabel]}>{optionItem.descriptiveText}</Text_1.default>
                                            </react_native_1.View>) : null}
                                        {brickRoadIndicator === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR && (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentCenter]}>
                                                <Icon_1.default testID="RBR Icon" src={Expensicons.DotIndicator} fill={theme.danger}/>
                                            </react_native_1.View>)}
                                    </react_native_1.View>
                                </react_native_1.View>
                                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]} accessible={false}>
                                    {brickRoadIndicator === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO && (<react_native_1.View style={styles.ml2}>
                                            <Icon_1.default testID="GBR Icon" src={Expensicons.DotIndicator} fill={theme.success}/>
                                        </react_native_1.View>)}
                                    {hasDraftComment && !!optionItem.isAllowedToComment && (<react_native_1.View style={styles.ml2} accessibilityLabel={translate('sidebarScreen.draftedMessage')}>
                                            <Icon_1.default testID="Pencil Icon" fill={theme.icon} src={Expensicons.Pencil}/>
                                        </react_native_1.View>)}
                                    {!brickRoadIndicator && !!optionItem.isPinned && (<react_native_1.View style={styles.ml2} accessibilityLabel={translate('sidebarScreen.chatPinned')}>
                                            <Icon_1.default testID="Pin Icon" fill={theme.icon} src={Expensicons.Pin}/>
                                        </react_native_1.View>)}
                                </react_native_1.View>
                            </PressableWithSecondaryInteraction_1.default>)}
                    </Hoverable_1.default>
                </react_native_1.View>
            </EducationalTooltip_1.default>
        </OfflineWithFeedback_1.default>);
}
OptionRowLHN.displayName = 'OptionRowLHN';
exports.default = react_1.default.memo(OptionRowLHN);
