"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortBy_1 = require("lodash/sortBy");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const Icon_1 = require("@components/Icon");
const WorkspaceDefaultAvatars_1 = require("@components/Icon/WorkspaceDefaultAvatars");
const PressableWithoutFocus_1 = require("@components/Pressable/PressableWithoutFocus");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
const UserDetailsTooltip_1 = require("@components/UserDetailsTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Navigation_1 = require("@navigation/Navigation");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ProfileAvatar(props) {
    const { translate } = (0, useLocalize_1.default)();
    const { avatarID, useProfileNavigationWrapper, type, name, reportID } = props;
    if (!useProfileNavigationWrapper) {
        return (
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        <Avatar_1.default {...{ ...props, useProfileNavigationWrapper: undefined }}/>);
    }
    const isWorkspace = type === CONST_1.default.ICON_TYPE_WORKSPACE;
    const firstLetter = (name?.at(0) ?? 'A').toUpperCase();
    const onPress = () => {
        if (isWorkspace) {
            if (reportID) {
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_AVATAR.getRoute(reportID, String(avatarID)));
                return;
            }
            return Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_AVATAR.getRoute(String(avatarID), firstLetter));
        }
        return Navigation_1.default.navigate(ROUTES_1.default.PROFILE_AVATAR.getRoute(Number(avatarID), Navigation_1.default.getActiveRoute()));
    };
    return (<PressableWithoutFocus_1.default onPress={onPress} accessibilityLabel={translate(isWorkspace ? 'common.workspaces' : 'common.profile')} accessibilityRole={CONST_1.default.ROLE.BUTTON}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Avatar_1.default {...{ ...props, useProfileNavigationWrapper: undefined }}/>
        </PressableWithoutFocus_1.default>);
}
function ReportActionAvatarSingle({ avatar, size, containerStyles, shouldShowTooltip, delegateAccountID, accountID, fallbackIcon, isInReportAction, useProfileNavigationWrapper, fallbackDisplayName, reportID, }) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const avatarContainerStyles = StyleUtils.getContainerStyles(size, isInReportAction);
    return (<UserDetailsTooltip_1.default accountID={accountID} delegateAccountID={delegateAccountID} icon={avatar} fallbackUserDetails={{
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            displayName: fallbackDisplayName || avatar?.name,
        }} shouldRender={shouldShowTooltip}>
            <react_native_1.View>
                <ProfileAvatar useProfileNavigationWrapper={useProfileNavigationWrapper} containerStyles={containerStyles ?? avatarContainerStyles} source={avatar?.source} type={avatar?.type ?? CONST_1.default.ICON_TYPE_AVATAR} name={avatar?.name} avatarID={avatar?.id} size={size} fill={avatar?.fill} fallbackIcon={fallbackIcon} testID="ReportActionAvatars-SingleAvatar" reportID={reportID}/>
            </react_native_1.View>
        </UserDetailsTooltip_1.default>);
}
function ReportActionAvatarSubscript({ primaryAvatar, secondaryAvatar, size, shouldShowTooltip, noRightMarginOnContainer, subscriptAvatarBorderColor, subscriptCardFeed, fallbackDisplayName, useProfileNavigationWrapper, reportID, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const isSmall = size === CONST_1.default.AVATAR_SIZE.SMALL;
    const containerStyle = StyleUtils.getContainerStyles(size);
    const subscriptAvatarStyle = (0, react_1.useMemo)(() => {
        if (size === CONST_1.default.AVATAR_SIZE.SMALL) {
            return styles.secondAvatarSubscriptCompact;
        }
        if (size === CONST_1.default.AVATAR_SIZE.SMALL_NORMAL) {
            return styles.secondAvatarSubscriptSmallNormal;
        }
        if (size === CONST_1.default.AVATAR_SIZE.X_LARGE) {
            return styles.secondAvatarSubscriptXLarge;
        }
        return styles.secondAvatarSubscript;
    }, [size, styles]);
    const subscriptAvatarSize = size === CONST_1.default.AVATAR_SIZE.X_LARGE ? CONST_1.default.AVATAR_SIZE.HEADER : CONST_1.default.AVATAR_SIZE.SUBSCRIPT;
    return (<react_native_1.View style={[containerStyle, noRightMarginOnContainer ? styles.mr0 : {}]} testID="ReportActionAvatars-Subscript">
            <UserDetailsTooltip_1.default shouldRender={shouldShowTooltip} accountID={Number(primaryAvatar.id ?? CONST_1.default.DEFAULT_NUMBER_ID)} icon={primaryAvatar} fallbackUserDetails={{
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            displayName: fallbackDisplayName || primaryAvatar.name,
        }}>
                <react_native_1.View>
                    <ProfileAvatar useProfileNavigationWrapper={useProfileNavigationWrapper} containerStyles={StyleUtils.getWidthAndHeightStyle(StyleUtils.getAvatarSize(size || CONST_1.default.AVATAR_SIZE.DEFAULT))} source={primaryAvatar.source} size={size} name={primaryAvatar.name} avatarID={primaryAvatar.id} type={primaryAvatar.type} fallbackIcon={primaryAvatar.fallbackIcon} testID="ReportActionAvatars-Subscript-MainAvatar" reportID={reportID}/>
                </react_native_1.View>
            </UserDetailsTooltip_1.default>
            {!!secondaryAvatar && !subscriptCardFeed && (<UserDetailsTooltip_1.default shouldRender={shouldShowTooltip} accountID={Number(secondaryAvatar.id ?? CONST_1.default.DEFAULT_NUMBER_ID)} icon={secondaryAvatar}>
                    <react_native_1.View style={[size === CONST_1.default.AVATAR_SIZE.SMALL_NORMAL ? styles.flex1 : {}, subscriptAvatarStyle]} 
        // Hover on overflowed part of icon will not work on Electron if dragArea is true
        // https://stackoverflow.com/questions/56338939/hover-in-css-is-not-working-with-electron
        dataSet={{ dragArea: false }}>
                        <ProfileAvatar useProfileNavigationWrapper={useProfileNavigationWrapper} iconAdditionalStyles={[
                StyleUtils.getAvatarBorderWidth(isSmall ? CONST_1.default.AVATAR_SIZE.SMALL_SUBSCRIPT : subscriptAvatarSize),
                StyleUtils.getBorderColorStyle(subscriptAvatarBorderColor ?? theme.componentBG),
            ]} source={secondaryAvatar.source} size={isSmall ? CONST_1.default.AVATAR_SIZE.SMALL_SUBSCRIPT : subscriptAvatarSize} fill={secondaryAvatar.fill} name={secondaryAvatar.name} avatarID={secondaryAvatar.id} type={secondaryAvatar.type} fallbackIcon={secondaryAvatar.fallbackIcon} testID="ReportActionAvatars-Subscript-SecondaryAvatar" reportID={reportID}/>
                    </react_native_1.View>
                </UserDetailsTooltip_1.default>)}
            {!!subscriptCardFeed && (<react_native_1.View style={[
                size === CONST_1.default.AVATAR_SIZE.SMALL_NORMAL ? styles.flex1 : {},
                // Nullish coalescing thinks that empty strings are truthy, thus I'm using OR operator
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                StyleUtils.getBorderColorStyle(subscriptAvatarBorderColor || theme.sidebar),
                StyleUtils.getAvatarSubscriptIconContainerStyle(variables_1.default.cardAvatarWidth, variables_1.default.cardAvatarHeight),
                styles.dFlex,
                styles.justifyContentCenter,
            ]} 
        // Hover on overflowed part of icon will not work on Electron if dragArea is true
        // https://stackoverflow.com/questions/56338939/hover-in-css-is-not-working-with-electron
        dataSet={{ dragArea: false }}>
                    <Icon_1.default src={(0, CardUtils_1.getCardFeedIcon)(subscriptCardFeed, illustrations)} width={variables_1.default.cardAvatarWidth} height={variables_1.default.cardAvatarHeight} additionalStyles={styles.alignSelfCenter} testID="ReportActionAvatars-Subscript-CardIcon"/>
                </react_native_1.View>)}
        </react_native_1.View>);
}
function ReportActionAvatarMultipleHorizontal({ isHovered = false, isActive = false, isPressed = false, maxAvatarsInRow = CONST_1.default.AVATAR_ROW_SIZE.DEFAULT, displayInRows: shouldDisplayAvatarsInRows = false, useCardBG: shouldUseCardBackground = false, overlapDivider = 3, size, shouldShowTooltip, icons: unsortedIcons, isInReportAction, sort: sortAvatars, useProfileNavigationWrapper, fallbackDisplayName, reportID, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { localeCompare } = (0, useLocalize_1.default)();
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
        canBeMissing: true,
    });
    const oneAvatarSize = StyleUtils.getAvatarStyle(size);
    const overlapSize = oneAvatarSize.width / overlapDivider;
    const oneAvatarBorderWidth = StyleUtils.getAvatarBorderWidth(size).borderWidth ?? 0;
    const height = oneAvatarSize.height + 2 * oneAvatarBorderWidth;
    const avatarContainerStyles = StyleUtils.combineStyles([styles.alignItemsCenter, styles.flexRow, StyleUtils.getHeight(height)]);
    const icons = (0, react_1.useMemo)(() => {
        let avatars = unsortedIcons;
        if (sortAvatars?.includes(CONST_1.default.REPORT_ACTION_AVATARS.SORT_BY.NAME)) {
            avatars = (0, ReportUtils_1.sortIconsByName)(unsortedIcons, personalDetails, localeCompare);
        }
        else if (sortAvatars?.includes(CONST_1.default.REPORT_ACTION_AVATARS.SORT_BY.ID)) {
            avatars = (0, sortBy_1.default)(unsortedIcons, (icon) => icon.id);
        }
        return sortAvatars?.includes(CONST_1.default.REPORT_ACTION_AVATARS.SORT_BY.REVERSE) ? avatars.reverse() : avatars;
    }, [unsortedIcons, personalDetails, sortAvatars, localeCompare]);
    const avatarRows = (0, react_1.useMemo)(() => {
        // If we're not displaying avatars in rows or the number of icons is less than or equal to the max avatars in a row, return a single row
        if (!shouldDisplayAvatarsInRows || icons.length <= maxAvatarsInRow) {
            return [icons];
        }
        // Calculate the size of each row
        const rowSize = Math.min(Math.ceil(icons.length / 2), maxAvatarsInRow);
        // Slice the icons array into two rows
        const firstRow = icons.slice(0, rowSize);
        const secondRow = icons.slice(rowSize);
        // Update the state with the two rows as an array
        return [firstRow, secondRow];
    }, [icons, maxAvatarsInRow, shouldDisplayAvatarsInRows]);
    const tooltipTexts = (0, react_1.useMemo)(() => (shouldShowTooltip ? icons.map((icon) => (0, ReportUtils_1.getUserDetailTooltipText)(Number(icon.id), icon.name)) : ['']), [shouldShowTooltip, icons]);
    return avatarRows.map((avatars, rowIndex) => (<react_native_1.View style={avatarContainerStyles} 
    /* eslint-disable-next-line react/no-array-index-key */
    key={`avatarRow-${rowIndex}`} testID="ReportActionAvatars-MultipleAvatars-StackedHorizontally-Row">
            {[...avatars].splice(0, maxAvatarsInRow).map((icon, index) => (<UserDetailsTooltip_1.default key={`stackedAvatars-${icon.id}`} accountID={Number(icon.id)} icon={icon} fallbackUserDetails={{
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                displayName: fallbackDisplayName || icon.name,
            }} shouldRender={shouldShowTooltip}>
                    <react_native_1.View style={[StyleUtils.getHorizontalStackedAvatarStyle(index, overlapSize), StyleUtils.getAvatarBorderRadius(size, icon.type)]}>
                        <ProfileAvatar useProfileNavigationWrapper={useProfileNavigationWrapper} iconAdditionalStyles={[
                StyleUtils.getHorizontalStackedAvatarBorderStyle({
                    theme,
                    isHovered,
                    isPressed,
                    isInReportAction,
                    shouldUseCardBackground,
                    isActive,
                }),
                StyleUtils.getAvatarBorderWidth(size),
            ]} source={icon.source ?? WorkspaceDefaultAvatars_1.WorkspaceBuilding} size={size} name={icon.name} avatarID={icon.id} type={icon.type} fallbackIcon={icon.fallbackIcon} testID="ReportActionAvatars-MultipleAvatars-StackedHorizontally-Avatar" reportID={reportID}/>
                    </react_native_1.View>
                </UserDetailsTooltip_1.default>))}
            {avatars.length > maxAvatarsInRow && (<Tooltip_1.default 
        // We only want to cap tooltips to only 10 users or so since some reports have hundreds of users, causing performance to degrade.
        text={tooltipTexts.slice(avatarRows.length * maxAvatarsInRow - 1, avatarRows.length * maxAvatarsInRow + 9).join(', ')} shouldRender={shouldShowTooltip}>
                    <react_native_1.View testID="ReportActionAvatars-MultipleAvatars-StackedHorizontally-LimitReached" style={[
                styles.alignItemsCenter,
                styles.justifyContentCenter,
                StyleUtils.getHorizontalStackedAvatarBorderStyle({
                    theme,
                    isHovered,
                    isPressed,
                    isInReportAction,
                    shouldUseCardBackground,
                }),
                // Set overlay background color with RGBA value so that the text will not inherit opacity
                StyleUtils.getBackgroundColorWithOpacityStyle(theme.overlay, variables_1.default.overlayOpacity),
                StyleUtils.getHorizontalStackedOverlayAvatarStyle(oneAvatarSize, oneAvatarBorderWidth),
                icons.at(3)?.type === CONST_1.default.ICON_TYPE_WORKSPACE && StyleUtils.getAvatarBorderRadius(size, icons.at(3)?.type),
            ]}>
                        <react_native_1.View style={[styles.justifyContentCenter, styles.alignItemsCenter, StyleUtils.getHeight(oneAvatarSize.height), StyleUtils.getWidthStyle(oneAvatarSize.width)]}>
                            <Text_1.default style={[styles.avatarInnerTextSmall, StyleUtils.getAvatarExtraFontSizeStyle(size), styles.userSelectNone]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>{`+${avatars.length - maxAvatarsInRow}`}</Text_1.default>
                        </react_native_1.View>
                    </react_native_1.View>
                </Tooltip_1.default>)}
        </react_native_1.View>));
}
function ReportActionAvatarMultipleDiagonal({ size, shouldShowTooltip, icons, isInReportAction, useMidSubscriptSize, secondaryAvatarContainerStyle, isHovered = false, useProfileNavigationWrapper, fallbackDisplayName, reportID, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const tooltipTexts = (0, react_1.useMemo)(() => (shouldShowTooltip ? icons.map((icon) => (0, ReportUtils_1.getUserDetailTooltipText)(Number(icon.id), icon.name)) : ['']), [shouldShowTooltip, icons]);
    const removeRightMargin = icons.length === 2 && size === CONST_1.default.AVATAR_SIZE.X_LARGE;
    const avatarContainerStyles = StyleUtils.getContainerStyles(size, isInReportAction);
    const avatarSizeToStylesMap = (0, react_1.useMemo)(() => ({
        [CONST_1.default.AVATAR_SIZE.SMALL]: {
            singleAvatarStyle: styles.singleAvatarSmall,
            secondAvatarStyles: styles.secondAvatarSmall,
        },
        [CONST_1.default.AVATAR_SIZE.LARGE]: {
            singleAvatarStyle: styles.singleAvatarMedium,
            secondAvatarStyles: styles.secondAvatarMedium,
        },
        [CONST_1.default.AVATAR_SIZE.X_LARGE]: {
            singleAvatarStyle: styles.singleAvatarMediumLarge,
            secondAvatarStyles: styles.secondAvatarMediumLarge,
        },
        [CONST_1.default.AVATAR_SIZE.DEFAULT]: {
            singleAvatarStyle: styles.singleAvatar,
            secondAvatarStyles: styles.secondAvatar,
        },
    }), [styles]);
    const avatarSize = (0, react_1.useMemo)(() => {
        if (useMidSubscriptSize) {
            return CONST_1.default.AVATAR_SIZE.MID_SUBSCRIPT;
        }
        if (size === CONST_1.default.AVATAR_SIZE.LARGE) {
            return CONST_1.default.AVATAR_SIZE.MEDIUM;
        }
        if (size === CONST_1.default.AVATAR_SIZE.X_LARGE) {
            return CONST_1.default.AVATAR_SIZE.MEDIUM_LARGE;
        }
        return CONST_1.default.AVATAR_SIZE.SMALLER;
    }, [useMidSubscriptSize, size]);
    const { singleAvatarStyle, secondAvatarStyles } = (0, react_1.useMemo)(() => avatarSizeToStylesMap[size] ?? avatarSizeToStylesMap.default, [size, avatarSizeToStylesMap]);
    const secondaryAvatarContainerStyles = secondaryAvatarContainerStyle ?? [StyleUtils.getBackgroundAndBorderStyle(isHovered ? theme.activeComponentBG : theme.componentBG)];
    return (<react_native_1.View style={[avatarContainerStyles, removeRightMargin && styles.mr0]}>
            <react_native_1.View style={[singleAvatarStyle, icons.at(0)?.type === CONST_1.default.ICON_TYPE_WORKSPACE && StyleUtils.getAvatarBorderRadius(size, icons.at(0)?.type)]} testID="ReportActionAvatars-MultipleAvatars">
                <UserDetailsTooltip_1.default accountID={Number(icons.at(0)?.id)} icon={icons.at(0)} fallbackUserDetails={{
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            displayName: fallbackDisplayName || icons.at(0)?.name,
        }} shouldRender={shouldShowTooltip}>
                    {/* View is necessary for tooltip to show for multiple avatars in LHN */}
                    <react_native_1.View>
                        <ProfileAvatar useProfileNavigationWrapper={useProfileNavigationWrapper} source={icons.at(0)?.source ?? WorkspaceDefaultAvatars_1.WorkspaceBuilding} size={avatarSize} imageStyles={[singleAvatarStyle]} name={icons.at(0)?.name} type={icons.at(0)?.type ?? CONST_1.default.ICON_TYPE_AVATAR} avatarID={icons.at(0)?.id} fallbackIcon={icons.at(0)?.fallbackIcon} testID="ReportActionAvatars-MultipleAvatars-MainAvatar" reportID={reportID}/>
                    </react_native_1.View>
                </UserDetailsTooltip_1.default>
                <react_native_1.View style={[
            secondAvatarStyles,
            secondaryAvatarContainerStyles,
            icons.at(1)?.type === CONST_1.default.ICON_TYPE_WORKSPACE ? StyleUtils.getAvatarBorderRadius(size, icons.at(1)?.type) : {},
        ]}>
                    {icons.length === 2 ? (<UserDetailsTooltip_1.default accountID={Number(icons.at(1)?.id)} icon={icons.at(1)} fallbackUserDetails={{
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                displayName: fallbackDisplayName || icons.at(1)?.name,
            }} shouldRender={shouldShowTooltip}>
                            <react_native_1.View>
                                <ProfileAvatar useProfileNavigationWrapper={useProfileNavigationWrapper} source={icons.at(1)?.source ?? WorkspaceDefaultAvatars_1.WorkspaceBuilding} size={avatarSize} imageStyles={[singleAvatarStyle]} name={icons.at(1)?.name} avatarID={icons.at(1)?.id} type={icons.at(1)?.type ?? CONST_1.default.ICON_TYPE_AVATAR} fallbackIcon={icons.at(1)?.fallbackIcon} testID="ReportActionAvatars-MultipleAvatars-SecondaryAvatar" reportID={reportID}/>
                            </react_native_1.View>
                        </UserDetailsTooltip_1.default>) : (<Tooltip_1.default text={tooltipTexts.slice(1).join(', ')} shouldRender={shouldShowTooltip}>
                            <react_native_1.View style={[singleAvatarStyle, styles.alignItemsCenter, styles.justifyContentCenter]} testID="ReportActionAvatars-MultipleAvatars-LimitReached">
                                <Text_1.default style={[styles.userSelectNone, size === CONST_1.default.AVATAR_SIZE.SMALL ? styles.avatarInnerTextSmall : styles.avatarInnerText]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                                    {`+${icons.length - 1}`}
                                </Text_1.default>
                            </react_native_1.View>
                        </Tooltip_1.default>)}
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
/**
 * This component should not be used outside ReportActionAvatars; its sole purpose is to render the ReportActionAvatars UI.
 * To render user avatars, use ReportActionAvatars.
 */
exports.default = {
    Single: ReportActionAvatarSingle,
    Subscript: ReportActionAvatarSubscript,
    Multiple: {
        Diagonal: ReportActionAvatarMultipleDiagonal,
        Horizontal: ReportActionAvatarMultipleHorizontal,
    },
};
