"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Session_1 = require("@libs/actions/Session");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function BaseUserDetailsTooltip({ accountID, fallbackUserDetails, icon, delegateAccountID, shiftHorizontal, children }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const isCurrentUserAnonymous = session?.accountID === accountID && (0, Session_1.isAnonymousUser)(session);
    const userDetails = personalDetails?.[accountID] ?? fallbackUserDetails ?? {};
    let userDisplayName = (0, ReportUtils_1.getUserDetailTooltipText)(accountID, userDetails.displayName ? userDetails.displayName.trim() : '');
    let userLogin = !isCurrentUserAnonymous && userDetails.login?.trim() && userDetails.login !== userDetails.displayName ? expensify_common_1.Str.removeSMSDomain(userDetails.login) : '';
    let userAvatar = userDetails.avatar;
    let userAccountID = accountID;
    // We replace the actor's email, name, and avatar with the Copilot manually for now. This will be improved upon when
    // the Copilot feature is implemented.
    if (delegateAccountID && delegateAccountID > 0) {
        const delegateUserDetails = personalDetails?.[delegateAccountID];
        const delegateUserDisplayName = (0, ReportUtils_1.getUserDetailTooltipText)(delegateAccountID);
        userDisplayName = `${delegateUserDisplayName} (${translate('reportAction.asCopilot')} ${userDisplayName})`;
        userLogin = delegateUserDetails?.login ?? '';
        userAvatar = delegateUserDetails?.avatar;
        userAccountID = delegateAccountID;
    }
    let title = String(userDisplayName).trim() ? userDisplayName : '';
    let subtitle = userLogin.trim() && formatPhoneNumber(userLogin) !== userDisplayName ? expensify_common_1.Str.removeSMSDomain(userLogin) : '';
    if (icon && (icon.type === CONST_1.default.ICON_TYPE_WORKSPACE || !title)) {
        title = icon.name ?? '';
        // We need to clear the subtitle for workspaces so that we don't display any user details under the workspace name
        if (icon.type === CONST_1.default.ICON_TYPE_WORKSPACE) {
            subtitle = '';
        }
    }
    if (CONST_1.default.RESTRICTED_ACCOUNT_IDS.includes(userAccountID) || CONST_1.default.RESTRICTED_EMAILS.includes(userLogin.trim())) {
        subtitle = '';
    }
    const renderTooltipContent = (0, react_1.useCallback)(() => (<react_native_1.View style={[styles.alignItemsCenter, styles.ph2, styles.pv2]}>
                <react_native_1.View style={styles.emptyAvatar}>
                    <Avatar_1.default containerStyles={[styles.actionAvatar]} source={icon?.source ?? userAvatar} avatarID={icon?.id ?? userAccountID} type={icon?.type ?? CONST_1.default.ICON_TYPE_AVATAR} name={icon?.name ?? userLogin} fallbackIcon={icon?.fallbackIcon}/>
                </react_native_1.View>
                <Text_1.default style={[styles.mt2, styles.textMicroBold, styles.textReactionSenders, styles.textAlignCenter]}>{title}</Text_1.default>
                <Text_1.default style={[styles.textMicro, styles.fontColorReactionLabel, styles.breakWord, styles.textAlignCenter]}>{subtitle}</Text_1.default>
            </react_native_1.View>), [
        styles.alignItemsCenter,
        styles.ph2,
        styles.pv2,
        styles.emptyAvatar,
        styles.actionAvatar,
        styles.mt2,
        styles.textMicroBold,
        styles.textReactionSenders,
        styles.textAlignCenter,
        styles.textMicro,
        styles.fontColorReactionLabel,
        styles.breakWord,
        icon,
        userAvatar,
        userAccountID,
        userLogin,
        title,
        subtitle,
    ]);
    if (!icon && !userDisplayName && !userLogin) {
        return children;
    }
    return (<Tooltip_1.default shiftHorizontal={shiftHorizontal} renderTooltipContent={renderTooltipContent} renderTooltipContentKey={[userDisplayName, userLogin]} shouldHandleScroll>
            {children}
        </Tooltip_1.default>);
}
BaseUserDetailsTooltip.displayName = 'BaseUserDetailsTooltip';
exports.default = BaseUserDetailsTooltip;
