"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var sortBy_1 = require("lodash/sortBy");
var react_1 = require("react");
var react_native_1 = require("react-native");
var Avatar_1 = require("@components/Avatar");
var Icon_1 = require("@components/Icon");
var WorkspaceDefaultAvatars_1 = require("@components/Icon/WorkspaceDefaultAvatars");
var PressableWithoutFocus_1 = require("@components/Pressable/PressableWithoutFocus");
var Text_1 = require("@components/Text");
var Tooltip_1 = require("@components/Tooltip");
var UserDetailsTooltip_1 = require("@components/UserDetailsTooltip");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CardUtils_1 = require("@libs/CardUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var Navigation_1 = require("@navigation/Navigation");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
function ProfileAvatar(props) {
    var _a;
    var translate = (0, useLocalize_1.default)().translate;
    var avatarID = props.avatarID, useProfileNavigationWrapper = props.useProfileNavigationWrapper, type = props.type, name = props.name, reportID = props.reportID;
    if (!useProfileNavigationWrapper) {
        return (
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        <Avatar_1.default {...__assign(__assign({}, props), { useProfileNavigationWrapper: undefined })}/>);
    }
    var isWorkspace = type === CONST_1.default.ICON_TYPE_WORKSPACE;
    var firstLetter = ((_a = name === null || name === void 0 ? void 0 : name.at(0)) !== null && _a !== void 0 ? _a : 'A').toUpperCase();
    var onPress = function () {
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
            <Avatar_1.default {...__assign(__assign({}, props), { useProfileNavigationWrapper: undefined })}/>
        </PressableWithoutFocus_1.default>);
}
function ReportActionAvatarSingle(_a) {
    var _b;
    var avatar = _a.avatar, size = _a.size, containerStyles = _a.containerStyles, shouldShowTooltip = _a.shouldShowTooltip, delegateAccountID = _a.delegateAccountID, accountID = _a.accountID, fallbackIcon = _a.fallbackIcon, isInReportAction = _a.isInReportAction, useProfileNavigationWrapper = _a.useProfileNavigationWrapper, fallbackDisplayName = _a.fallbackDisplayName, reportID = _a.reportID;
    var StyleUtils = (0, useStyleUtils_1.default)();
    var avatarContainerStyles = StyleUtils.getContainerStyles(size, isInReportAction);
    return (<UserDetailsTooltip_1.default accountID={accountID} delegateAccountID={delegateAccountID} icon={avatar} fallbackUserDetails={{
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            displayName: fallbackDisplayName || (avatar === null || avatar === void 0 ? void 0 : avatar.name),
        }} shouldRender={shouldShowTooltip}>
            <react_native_1.View>
                <ProfileAvatar useProfileNavigationWrapper={useProfileNavigationWrapper} containerStyles={containerStyles !== null && containerStyles !== void 0 ? containerStyles : avatarContainerStyles} source={avatar === null || avatar === void 0 ? void 0 : avatar.source} type={(_b = avatar === null || avatar === void 0 ? void 0 : avatar.type) !== null && _b !== void 0 ? _b : CONST_1.default.ICON_TYPE_AVATAR} name={avatar === null || avatar === void 0 ? void 0 : avatar.name} avatarID={avatar === null || avatar === void 0 ? void 0 : avatar.id} size={size} fill={avatar === null || avatar === void 0 ? void 0 : avatar.fill} fallbackIcon={fallbackIcon} testID="ReportActionAvatars-SingleAvatar" reportID={reportID}/>
            </react_native_1.View>
        </UserDetailsTooltip_1.default>);
}
function ReportActionAvatarSubscript(_a) {
    var _b, _c;
    var primaryAvatar = _a.primaryAvatar, secondaryAvatar = _a.secondaryAvatar, size = _a.size, shouldShowTooltip = _a.shouldShowTooltip, noRightMarginOnContainer = _a.noRightMarginOnContainer, subscriptAvatarBorderColor = _a.subscriptAvatarBorderColor, subscriptCardFeed = _a.subscriptCardFeed, fallbackDisplayName = _a.fallbackDisplayName, useProfileNavigationWrapper = _a.useProfileNavigationWrapper, reportID = _a.reportID;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var illustrations = (0, useThemeIllustrations_1.default)();
    var isSmall = size === CONST_1.default.AVATAR_SIZE.SMALL;
    var containerStyle = StyleUtils.getContainerStyles(size);
    var subscriptAvatarStyle = (0, react_1.useMemo)(function () {
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
    var subscriptAvatarSize = size === CONST_1.default.AVATAR_SIZE.X_LARGE ? CONST_1.default.AVATAR_SIZE.HEADER : CONST_1.default.AVATAR_SIZE.SUBSCRIPT;
    return (<react_native_1.View style={[containerStyle, noRightMarginOnContainer ? styles.mr0 : {}]} testID="ReportActionAvatars-Subscript">
            <UserDetailsTooltip_1.default shouldRender={shouldShowTooltip} accountID={Number((_b = primaryAvatar.id) !== null && _b !== void 0 ? _b : CONST_1.default.DEFAULT_NUMBER_ID)} icon={primaryAvatar} fallbackUserDetails={{
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            displayName: fallbackDisplayName || primaryAvatar.name,
        }}>
                <react_native_1.View>
                    <ProfileAvatar useProfileNavigationWrapper={useProfileNavigationWrapper} containerStyles={StyleUtils.getWidthAndHeightStyle(StyleUtils.getAvatarSize(size || CONST_1.default.AVATAR_SIZE.DEFAULT))} source={primaryAvatar.source} size={size} name={primaryAvatar.name} avatarID={primaryAvatar.id} type={primaryAvatar.type} fallbackIcon={primaryAvatar.fallbackIcon} testID="ReportActionAvatars-Subscript-MainAvatar" reportID={reportID}/>
                </react_native_1.View>
            </UserDetailsTooltip_1.default>
            {!!secondaryAvatar && !subscriptCardFeed && (<UserDetailsTooltip_1.default shouldRender={shouldShowTooltip} accountID={Number((_c = secondaryAvatar.id) !== null && _c !== void 0 ? _c : CONST_1.default.DEFAULT_NUMBER_ID)} icon={secondaryAvatar}>
                    <react_native_1.View style={[size === CONST_1.default.AVATAR_SIZE.SMALL_NORMAL ? styles.flex1 : {}, subscriptAvatarStyle]} 
        // Hover on overflowed part of icon will not work on Electron if dragArea is true
        // https://stackoverflow.com/questions/56338939/hover-in-css-is-not-working-with-electron
        dataSet={{ dragArea: false }}>
                        <ProfileAvatar useProfileNavigationWrapper={useProfileNavigationWrapper} iconAdditionalStyles={[
                StyleUtils.getAvatarBorderWidth(isSmall ? CONST_1.default.AVATAR_SIZE.SMALL_SUBSCRIPT : subscriptAvatarSize),
                StyleUtils.getBorderColorStyle(subscriptAvatarBorderColor !== null && subscriptAvatarBorderColor !== void 0 ? subscriptAvatarBorderColor : theme.componentBG),
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
function ReportActionAvatarMultipleHorizontal(_a) {
    var _b;
    var _c = _a.isHovered, isHovered = _c === void 0 ? false : _c, _d = _a.isActive, isActive = _d === void 0 ? false : _d, _e = _a.isPressed, isPressed = _e === void 0 ? false : _e, _f = _a.maxAvatarsInRow, maxAvatarsInRow = _f === void 0 ? CONST_1.default.AVATAR_ROW_SIZE.DEFAULT : _f, _g = _a.displayInRows, shouldDisplayAvatarsInRows = _g === void 0 ? false : _g, _h = _a.useCardBG, shouldUseCardBackground = _h === void 0 ? false : _h, _j = _a.overlapDivider, overlapDivider = _j === void 0 ? 3 : _j, size = _a.size, shouldShowTooltip = _a.shouldShowTooltip, unsortedIcons = _a.icons, isInReportAction = _a.isInReportAction, sortAvatars = _a.sort, useProfileNavigationWrapper = _a.useProfileNavigationWrapper, fallbackDisplayName = _a.fallbackDisplayName, reportID = _a.reportID;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var localeCompare = (0, useLocalize_1.default)().localeCompare;
    var personalDetails = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
        canBeMissing: true,
    })[0];
    var oneAvatarSize = StyleUtils.getAvatarStyle(size);
    var overlapSize = oneAvatarSize.width / overlapDivider;
    var oneAvatarBorderWidth = (_b = StyleUtils.getAvatarBorderWidth(size).borderWidth) !== null && _b !== void 0 ? _b : 0;
    var height = oneAvatarSize.height + 2 * oneAvatarBorderWidth;
    var avatarContainerStyles = StyleUtils.combineStyles([styles.alignItemsCenter, styles.flexRow, StyleUtils.getHeight(height)]);
    var icons = (0, react_1.useMemo)(function () {
        var avatars = unsortedIcons;
        if (sortAvatars === null || sortAvatars === void 0 ? void 0 : sortAvatars.includes(CONST_1.default.REPORT_ACTION_AVATARS.SORT_BY.NAME)) {
            avatars = (0, ReportUtils_1.sortIconsByName)(unsortedIcons, personalDetails, localeCompare);
        }
        else if (sortAvatars === null || sortAvatars === void 0 ? void 0 : sortAvatars.includes(CONST_1.default.REPORT_ACTION_AVATARS.SORT_BY.ID)) {
            avatars = (0, sortBy_1.default)(unsortedIcons, function (icon) { return icon.id; });
        }
        return (sortAvatars === null || sortAvatars === void 0 ? void 0 : sortAvatars.includes(CONST_1.default.REPORT_ACTION_AVATARS.SORT_BY.REVERSE)) ? avatars.reverse() : avatars;
    }, [unsortedIcons, personalDetails, sortAvatars, localeCompare]);
    var avatarRows = (0, react_1.useMemo)(function () {
        // If we're not displaying avatars in rows or the number of icons is less than or equal to the max avatars in a row, return a single row
        if (!shouldDisplayAvatarsInRows || icons.length <= maxAvatarsInRow) {
            return [icons];
        }
        // Calculate the size of each row
        var rowSize = Math.min(Math.ceil(icons.length / 2), maxAvatarsInRow);
        // Slice the icons array into two rows
        var firstRow = icons.slice(0, rowSize);
        var secondRow = icons.slice(rowSize);
        // Update the state with the two rows as an array
        return [firstRow, secondRow];
    }, [icons, maxAvatarsInRow, shouldDisplayAvatarsInRows]);
    var tooltipTexts = (0, react_1.useMemo)(function () { return (shouldShowTooltip ? icons.map(function (icon) { return (0, ReportUtils_1.getUserDetailTooltipText)(Number(icon.id), icon.name); }) : ['']); }, [shouldShowTooltip, icons]);
    return avatarRows.map(function (avatars, rowIndex) {
        var _a;
        var _b, _c;
        return (<react_native_1.View style={avatarContainerStyles} 
        /* eslint-disable-next-line react/no-array-index-key */
        key={"avatarRow-".concat(rowIndex)} testID="ReportActionAvatars-MultipleAvatars-StackedHorizontally-Row">
            {__spreadArray([], avatars, true).splice(0, maxAvatarsInRow).map(function (icon, index) {
                var _a;
                return (<UserDetailsTooltip_1.default key={"stackedAvatars-".concat(icon.id)} accountID={Number(icon.id)} icon={icon} fallbackUserDetails={{
                        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                        displayName: fallbackDisplayName || icon.name,
                    }} shouldRender={shouldShowTooltip}>
                    <react_native_1.View style={[StyleUtils.getHorizontalStackedAvatarStyle(index, overlapSize), StyleUtils.getAvatarBorderRadius(size, icon.type)]}>
                        <ProfileAvatar useProfileNavigationWrapper={useProfileNavigationWrapper} iconAdditionalStyles={[
                        StyleUtils.getHorizontalStackedAvatarBorderStyle({
                            theme: theme,
                            isHovered: isHovered,
                            isPressed: isPressed,
                            isInReportAction: isInReportAction,
                            shouldUseCardBackground: shouldUseCardBackground,
                            isActive: isActive,
                        }),
                        StyleUtils.getAvatarBorderWidth(size),
                    ]} source={(_a = icon.source) !== null && _a !== void 0 ? _a : WorkspaceDefaultAvatars_1.WorkspaceBuilding} size={size} name={icon.name} avatarID={icon.id} type={icon.type} fallbackIcon={icon.fallbackIcon} testID="ReportActionAvatars-MultipleAvatars-StackedHorizontally-Avatar" reportID={reportID}/>
                    </react_native_1.View>
                </UserDetailsTooltip_1.default>);
            })}
            {avatars.length > maxAvatarsInRow && (<Tooltip_1.default 
            // We only want to cap tooltips to only 10 users or so since some reports have hundreds of users, causing performance to degrade.
            text={tooltipTexts.slice(avatarRows.length * maxAvatarsInRow - 1, avatarRows.length * maxAvatarsInRow + 9).join(', ')} shouldRender={shouldShowTooltip}>
                    <react_native_1.View testID="ReportActionAvatars-MultipleAvatars-StackedHorizontally-LimitReached" style={[
                    styles.alignItemsCenter,
                    styles.justifyContentCenter,
                    StyleUtils.getHorizontalStackedAvatarBorderStyle({
                        theme: theme,
                        isHovered: isHovered,
                        isPressed: isPressed,
                        isInReportAction: isInReportAction,
                        shouldUseCardBackground: shouldUseCardBackground,
                    }),
                    // Set overlay background color with RGBA value so that the text will not inherit opacity
                    StyleUtils.getBackgroundColorWithOpacityStyle(theme.overlay, variables_1.default.overlayOpacity),
                    StyleUtils.getHorizontalStackedOverlayAvatarStyle(oneAvatarSize, oneAvatarBorderWidth),
                    ((_b = icons.at(3)) === null || _b === void 0 ? void 0 : _b.type) === CONST_1.default.ICON_TYPE_WORKSPACE && StyleUtils.getAvatarBorderRadius(size, (_c = icons.at(3)) === null || _c === void 0 ? void 0 : _c.type),
                ]}>
                        <react_native_1.View style={[styles.justifyContentCenter, styles.alignItemsCenter, StyleUtils.getHeight(oneAvatarSize.height), StyleUtils.getWidthStyle(oneAvatarSize.width)]}>
                            <Text_1.default style={[styles.avatarInnerTextSmall, StyleUtils.getAvatarExtraFontSizeStyle(size), styles.userSelectNone]} dataSet={_a = {}, _a[CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT] = true, _a}>{"+".concat(avatars.length - maxAvatarsInRow)}</Text_1.default>
                        </react_native_1.View>
                    </react_native_1.View>
                </Tooltip_1.default>)}
        </react_native_1.View>);
    });
}
function ReportActionAvatarMultipleDiagonal(_a) {
    var _b;
    var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    var size = _a.size, shouldShowTooltip = _a.shouldShowTooltip, icons = _a.icons, isInReportAction = _a.isInReportAction, useMidSubscriptSize = _a.useMidSubscriptSize, secondaryAvatarContainerStyle = _a.secondaryAvatarContainerStyle, _0 = _a.isHovered, isHovered = _0 === void 0 ? false : _0, useProfileNavigationWrapper = _a.useProfileNavigationWrapper, fallbackDisplayName = _a.fallbackDisplayName, reportID = _a.reportID;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var tooltipTexts = (0, react_1.useMemo)(function () { return (shouldShowTooltip ? icons.map(function (icon) { return (0, ReportUtils_1.getUserDetailTooltipText)(Number(icon.id), icon.name); }) : ['']); }, [shouldShowTooltip, icons]);
    var removeRightMargin = icons.length === 2 && size === CONST_1.default.AVATAR_SIZE.X_LARGE;
    var avatarContainerStyles = StyleUtils.getContainerStyles(size, isInReportAction);
    var avatarSizeToStylesMap = (0, react_1.useMemo)(function () {
        var _a;
        return (_a = {},
            _a[CONST_1.default.AVATAR_SIZE.SMALL] = {
                singleAvatarStyle: styles.singleAvatarSmall,
                secondAvatarStyles: styles.secondAvatarSmall,
            },
            _a[CONST_1.default.AVATAR_SIZE.LARGE] = {
                singleAvatarStyle: styles.singleAvatarMedium,
                secondAvatarStyles: styles.secondAvatarMedium,
            },
            _a[CONST_1.default.AVATAR_SIZE.X_LARGE] = {
                singleAvatarStyle: styles.singleAvatarMediumLarge,
                secondAvatarStyles: styles.secondAvatarMediumLarge,
            },
            _a[CONST_1.default.AVATAR_SIZE.DEFAULT] = {
                singleAvatarStyle: styles.singleAvatar,
                secondAvatarStyles: styles.secondAvatar,
            },
            _a);
    }, [styles]);
    var avatarSize = (0, react_1.useMemo)(function () {
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
    var _1 = (0, react_1.useMemo)(function () { var _a; return (_a = avatarSizeToStylesMap[size]) !== null && _a !== void 0 ? _a : avatarSizeToStylesMap.default; }, [size, avatarSizeToStylesMap]), singleAvatarStyle = _1.singleAvatarStyle, secondAvatarStyles = _1.secondAvatarStyles;
    var secondaryAvatarContainerStyles = secondaryAvatarContainerStyle !== null && secondaryAvatarContainerStyle !== void 0 ? secondaryAvatarContainerStyle : [StyleUtils.getBackgroundAndBorderStyle(isHovered ? theme.activeComponentBG : theme.componentBG)];
    return (<react_native_1.View style={[avatarContainerStyles, removeRightMargin && styles.mr0]}>
            <react_native_1.View style={[singleAvatarStyle, ((_c = icons.at(0)) === null || _c === void 0 ? void 0 : _c.type) === CONST_1.default.ICON_TYPE_WORKSPACE && StyleUtils.getAvatarBorderRadius(size, (_d = icons.at(0)) === null || _d === void 0 ? void 0 : _d.type)]} testID="ReportActionAvatars-MultipleAvatars">
                <UserDetailsTooltip_1.default accountID={Number((_e = icons.at(0)) === null || _e === void 0 ? void 0 : _e.id)} icon={icons.at(0)} fallbackUserDetails={{
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            displayName: fallbackDisplayName || ((_f = icons.at(0)) === null || _f === void 0 ? void 0 : _f.name),
        }} shouldRender={shouldShowTooltip}>
                    {/* View is necessary for tooltip to show for multiple avatars in LHN */}
                    <react_native_1.View>
                        <ProfileAvatar useProfileNavigationWrapper={useProfileNavigationWrapper} source={(_h = (_g = icons.at(0)) === null || _g === void 0 ? void 0 : _g.source) !== null && _h !== void 0 ? _h : WorkspaceDefaultAvatars_1.WorkspaceBuilding} size={avatarSize} imageStyles={[singleAvatarStyle]} name={(_j = icons.at(0)) === null || _j === void 0 ? void 0 : _j.name} type={(_l = (_k = icons.at(0)) === null || _k === void 0 ? void 0 : _k.type) !== null && _l !== void 0 ? _l : CONST_1.default.ICON_TYPE_AVATAR} avatarID={(_m = icons.at(0)) === null || _m === void 0 ? void 0 : _m.id} fallbackIcon={(_o = icons.at(0)) === null || _o === void 0 ? void 0 : _o.fallbackIcon} testID="ReportActionAvatars-MultipleAvatars-MainAvatar" reportID={reportID}/>
                    </react_native_1.View>
                </UserDetailsTooltip_1.default>
                <react_native_1.View style={[
            secondAvatarStyles,
            secondaryAvatarContainerStyles,
            ((_p = icons.at(1)) === null || _p === void 0 ? void 0 : _p.type) === CONST_1.default.ICON_TYPE_WORKSPACE ? StyleUtils.getAvatarBorderRadius(size, (_q = icons.at(1)) === null || _q === void 0 ? void 0 : _q.type) : {},
        ]}>
                    {icons.length === 2 ? (<UserDetailsTooltip_1.default accountID={Number((_r = icons.at(1)) === null || _r === void 0 ? void 0 : _r.id)} icon={icons.at(1)} fallbackUserDetails={{
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                displayName: fallbackDisplayName || ((_s = icons.at(1)) === null || _s === void 0 ? void 0 : _s.name),
            }} shouldRender={shouldShowTooltip}>
                            <react_native_1.View>
                                <ProfileAvatar useProfileNavigationWrapper={useProfileNavigationWrapper} source={(_u = (_t = icons.at(1)) === null || _t === void 0 ? void 0 : _t.source) !== null && _u !== void 0 ? _u : WorkspaceDefaultAvatars_1.WorkspaceBuilding} size={avatarSize} imageStyles={[singleAvatarStyle]} name={(_v = icons.at(1)) === null || _v === void 0 ? void 0 : _v.name} avatarID={(_w = icons.at(1)) === null || _w === void 0 ? void 0 : _w.id} type={(_y = (_x = icons.at(1)) === null || _x === void 0 ? void 0 : _x.type) !== null && _y !== void 0 ? _y : CONST_1.default.ICON_TYPE_AVATAR} fallbackIcon={(_z = icons.at(1)) === null || _z === void 0 ? void 0 : _z.fallbackIcon} testID="ReportActionAvatars-MultipleAvatars-SecondaryAvatar" reportID={reportID}/>
                            </react_native_1.View>
                        </UserDetailsTooltip_1.default>) : (<Tooltip_1.default text={tooltipTexts.slice(1).join(', ')} shouldRender={shouldShowTooltip}>
                            <react_native_1.View style={[singleAvatarStyle, styles.alignItemsCenter, styles.justifyContentCenter]} testID="ReportActionAvatars-MultipleAvatars-LimitReached">
                                <Text_1.default style={[styles.userSelectNone, size === CONST_1.default.AVATAR_SIZE.SMALL ? styles.avatarInnerTextSmall : styles.avatarInnerText]} dataSet={_b = {}, _b[CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT] = true, _b}>
                                    {"+".concat(icons.length - 1)}
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
