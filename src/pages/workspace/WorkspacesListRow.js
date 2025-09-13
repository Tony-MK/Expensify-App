"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const Avatar_1 = require("@components/Avatar");
const Badge_1 = require("@components/Badge");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const Text_1 = require("@components/Text");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
const Tooltip_1 = require("@components/Tooltip");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const WorkspacesListRowDisplayName_1 = require("@components/WorkspacesListRowDisplayName");
const useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const workspaceTypeIcon = (workspaceType) => {
    switch (workspaceType) {
        case CONST_1.default.POLICY.TYPE.CORPORATE:
            return Illustrations.ShieldYellow;
        case CONST_1.default.POLICY.TYPE.TEAM:
            return Illustrations.Mailbox;
        default:
            return Illustrations.Mailbox;
    }
};
function BrickRoadIndicatorIcon({ brickRoadIndicator }) {
    const theme = (0, useTheme_1.default)();
    return brickRoadIndicator ? (<Icon_1.default src={Expensicons.DotIndicator} fill={brickRoadIndicator === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR ? theme.danger : theme.iconSuccessFill}/>) : null;
}
function WorkspacesListRow({ title, menuItems, workspaceIcon, fallbackWorkspaceIcon, ownerAccountID, workspaceType, currentUserPersonalDetails, layoutWidth = CONST_1.default.LAYOUT_WIDTH.NONE, rowStyles, style, brickRoadIndicator, shouldAnimateInHighlight, shouldDisableThreeDotsMenu, isJoinRequestPending, policyID, isDefault, isLoadingBill, resetLoadingSpinnerIconIndex, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const theme = (0, useTheme_1.default)();
    const isNarrow = layoutWidth === CONST_1.default.LAYOUT_WIDTH.NARROW;
    const ownerDetails = ownerAccountID && (0, PersonalDetailsUtils_1.getPersonalDetailsByIDs)({ accountIDs: [ownerAccountID], currentUserAccountID: currentUserPersonalDetails.accountID }).at(0);
    const threeDotsMenuRef = (0, react_1.useRef)(null);
    const animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: variables_1.default.componentBorderRadius,
        shouldHighlight: !!shouldAnimateInHighlight,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.transparent,
    });
    (0, react_1.useEffect)(() => {
        if (isLoadingBill) {
            return;
        }
        resetLoadingSpinnerIconIndex?.();
        if (!threeDotsMenuRef.current?.isPopupMenuVisible) {
            return;
        }
        threeDotsMenuRef?.current?.hidePopoverMenu();
    }, [isLoadingBill, resetLoadingSpinnerIconIndex]);
    if (layoutWidth === CONST_1.default.LAYOUT_WIDTH.NONE) {
        // To prevent layout from jumping or rendering for a split second, when
        // isWide is undefined we don't assume anything and simply return null.
        return null;
    }
    const isWide = layoutWidth === CONST_1.default.LAYOUT_WIDTH.WIDE;
    const isDeleted = style && Array.isArray(style) ? style.includes(styles.offlineFeedback.deleted) : false;
    const ThreeDotMenuOrPendingIcon = (<react_native_1.View style={[styles.flexRow, !shouldUseNarrowLayout && styles.workspaceThreeDotMenu]}>
            {!!isJoinRequestPending && (<react_native_1.View style={[styles.flexRow, styles.gap2, styles.alignItemsCenter, styles.justifyContentEnd]}>
                    <Badge_1.default text={translate('workspace.common.requested')} textStyles={styles.textStrong} badgeStyles={[styles.alignSelfCenter, styles.badgeBordered]} icon={Expensicons.Hourglass}/>
                </react_native_1.View>)}
            {!!isDefault && (<Tooltip_1.default maxWidth={variables_1.default.w184} text={translate('workspace.common.defaultNote')} numberOfLines={4}>
                    <react_native_1.View style={[styles.flexRow, styles.gap2, styles.alignItemsCenter, styles.justifyContentEnd]}>
                        <Badge_1.default text={translate('common.default')} textStyles={styles.textStrong} badgeStyles={[styles.alignSelfCenter, styles.badgeBordered, styles.badgeSuccess]}/>
                    </react_native_1.View>
                </Tooltip_1.default>)}
            {!isJoinRequestPending && (<react_native_1.View style={[styles.flexRow, styles.ml2, styles.gap1]}>
                    <react_native_1.View style={[styles.flexRow, styles.gap2, styles.alignItemsCenter, isNarrow && styles.workspaceListRBR]}>
                        <BrickRoadIndicatorIcon brickRoadIndicator={brickRoadIndicator}/>
                    </react_native_1.View>
                    <ThreeDotsMenu_1.default shouldSelfPosition menuItems={menuItems} anchorAlignment={{ horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT, vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP }} shouldOverlay disabled={shouldDisableThreeDotsMenu} isNested threeDotsMenuRef={threeDotsMenuRef}/>
                </react_native_1.View>)}
        </react_native_1.View>);
    return (<react_native_1.View style={[styles.flexRow, styles.highlightBG, rowStyles, style, styles.br3]}>
            <react_native_reanimated_1.default.View style={[styles.flex1, styles.flexRow, styles.bgTransparent, isWide && styles.gap5, styles.p5, animatedHighlightStyle]}>
                <react_native_1.View style={[isWide ? styles.flexRow : styles.flexColumn, styles.flex1, isWide && styles.gap5]}>
                    <react_native_1.View style={[styles.flexRow, styles.justifyContentBetween, styles.flex2, isNarrow && styles.mb3, styles.alignItemsCenter]}>
                        <react_native_1.View style={[styles.flexRow, styles.gap3, styles.flex1, styles.alignItemsCenter]}>
                            <Avatar_1.default imageStyles={[styles.alignSelfCenter]} size={CONST_1.default.AVATAR_SIZE.DEFAULT} source={workspaceIcon} fallbackIcon={fallbackWorkspaceIcon} avatarID={policyID} name={title} type={CONST_1.default.ICON_TYPE_WORKSPACE}/>
                            <TextWithTooltip_1.default text={title} shouldShowTooltip style={[styles.flex1, styles.flexGrow1, styles.textStrong, isDeleted ? styles.offlineFeedback.deleted : {}]}/>
                        </react_native_1.View>
                        {isNarrow && ThreeDotMenuOrPendingIcon}
                    </react_native_1.View>
                    <react_native_1.View style={[styles.flexRow, isWide && styles.flex1, isWide && styles.workspaceOwnerSectionMinWidth, styles.gap2, styles.alignItemsCenter]}>
                        {!!ownerDetails && (<>
                                <Avatar_1.default source={ownerDetails.avatar} avatarID={ownerDetails.accountID} type={CONST_1.default.ICON_TYPE_AVATAR} size={CONST_1.default.AVATAR_SIZE.SMALL} containerStyles={styles.workspaceOwnerAvatarWrapper}/>
                                <react_native_1.View style={styles.flex1}>
                                    <WorkspacesListRowDisplayName_1.default isDeleted={isDeleted} ownerName={(0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(ownerDetails)}/>
                                    <Text_1.default numberOfLines={1} style={[styles.textMicro, styles.textSupporting, isDeleted ? styles.offlineFeedback.deleted : {}]}>
                                        {expensify_common_1.Str.removeSMSDomain(ownerDetails?.login ?? '')}
                                    </Text_1.default>
                                </react_native_1.View>
                            </>)}
                    </react_native_1.View>
                    <react_native_1.View style={[styles.flexRow, isWide && styles.flex1, styles.gap2, styles.alignItemsCenter]}>
                        <Icon_1.default src={workspaceTypeIcon(workspaceType)} width={variables_1.default.workspaceTypeIconWidth} height={variables_1.default.workspaceTypeIconWidth} additionalStyles={styles.workspaceTypeWrapper}/>
                        <react_native_1.View>
                            {!!workspaceType && (<Text_1.default numberOfLines={1} style={[styles.labelStrong, isDeleted ? styles.offlineFeedback.deleted : {}]}>
                                    {(0, PolicyUtils_1.getUserFriendlyWorkspaceType)(workspaceType)}
                                </Text_1.default>)}
                            <Text_1.default numberOfLines={1} style={[styles.textMicro, styles.textSupporting, isDeleted ? styles.offlineFeedback.deleted : {}]}>
                                {translate('workspace.common.plan')}
                            </Text_1.default>
                        </react_native_1.View>
                    </react_native_1.View>
                </react_native_1.View>

                {!isNarrow && ThreeDotMenuOrPendingIcon}
            </react_native_reanimated_1.default.View>
        </react_native_1.View>);
}
WorkspacesListRow.displayName = 'WorkspacesListRow';
exports.default = (0, withCurrentUserPersonalDetails_1.default)(WorkspacesListRow);
