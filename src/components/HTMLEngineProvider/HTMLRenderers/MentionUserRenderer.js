"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const cloneDeep_1 = require("lodash/cloneDeep");
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_render_html_1 = require("react-native-render-html");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const Text_1 = require("@components/Text");
const UserDetailsTooltip_1 = require("@components/UserDetailsTooltip");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const asMutable_1 = require("@src/types/utils/asMutable");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function MentionUserRenderer({ style, tnode, TDefaultRenderer, currentUserPersonalDetails, ...defaultRendererProps }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { formatPhoneNumber } = (0, useLocalize_1.default)();
    const htmlAttribAccountID = tnode.attributes.accountid;
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: true });
    const htmlAttributeAccountID = tnode.attributes.accountid;
    let accountID;
    let mentionDisplayText;
    let navigationRoute;
    let tnodeClone;
    if (!(0, isEmpty_1.default)(htmlAttribAccountID) && personalDetails?.[htmlAttribAccountID]) {
        const user = personalDetails[htmlAttribAccountID];
        accountID = parseInt(htmlAttribAccountID, 10);
        mentionDisplayText = formatPhoneNumber(user?.login ?? '') || (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(user);
        mentionDisplayText = (0, PersonalDetailsUtils_1.getShortMentionIfFound)(mentionDisplayText, htmlAttributeAccountID, currentUserPersonalDetails, user?.login ?? '') ?? '';
        navigationRoute = ROUTES_1.default.PROFILE.getRoute(accountID, Navigation_1.default.getReportRHPActiveRoute());
    }
    else if ('data' in tnode && !(0, EmptyObject_1.isEmptyObject)(tnode.data)) {
        tnodeClone = (0, cloneDeep_1.default)(tnode);
        // We need to remove the LTR unicode and leading @ from data as it is not part of the login
        mentionDisplayText = tnodeClone.data.replace(CONST_1.default.UNICODE.LTR, '').slice(1);
        // We need to replace tnode.data here because we will pass it to TNodeChildrenRenderer below
        (0, asMutable_1.default)(tnodeClone).data = tnodeClone.data.replace(mentionDisplayText, expensify_common_1.Str.removeSMSDomain((0, PersonalDetailsUtils_1.getShortMentionIfFound)(mentionDisplayText, htmlAttributeAccountID, currentUserPersonalDetails) ?? ''));
        accountID = (0, PersonalDetailsUtils_1.getAccountIDsByLogins)([mentionDisplayText])?.at(0) ?? -1;
        navigationRoute = ROUTES_1.default.PROFILE.getRoute(accountID, Navigation_1.default.getReportRHPActiveRoute(), mentionDisplayText);
        mentionDisplayText = expensify_common_1.Str.removeSMSDomain(mentionDisplayText);
    }
    else {
        // If neither an account ID or email is provided, don't render anything
        return null;
    }
    const isOurMention = accountID === currentUserPersonalDetails.accountID;
    const flattenStyle = react_native_1.StyleSheet.flatten(style);
    const { color, ...styleWithoutColor } = flattenStyle;
    return (<ShowContextMenuContext_1.ShowContextMenuContext.Consumer>
            {({ onShowContextMenu, anchor, report, isReportArchived, action, checkIfContextMenuActive, isDisabled, shouldDisplayContextMenu }) => (<Text_1.default suppressHighlighting onLongPress={(event) => {
                if (isDisabled || !shouldDisplayContextMenu) {
                    return;
                }
                return onShowContextMenu(() => (0, ShowContextMenuContext_1.showContextMenuForReport)(event, anchor, report?.reportID, action, checkIfContextMenuActive, (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived)));
            }} onPress={(event) => {
                event.preventDefault();
                if (!(0, isEmpty_1.default)(htmlAttribAccountID)) {
                    Navigation_1.default.navigate(ROUTES_1.default.PROFILE.getRoute(parseInt(htmlAttribAccountID, 10), Navigation_1.default.getReportRHPActiveRoute()));
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.PROFILE.getRoute(accountID, Navigation_1.default.getReportRHPActiveRoute(), mentionDisplayText));
            }} role={CONST_1.default.ROLE.LINK} accessibilityLabel={`/${navigationRoute}`}>
                    <UserDetailsTooltip_1.default accountID={accountID} fallbackUserDetails={{
                displayName: mentionDisplayText,
            }}>
                        <Text_1.default 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...defaultRendererProps} style={[
                styles.link,
                styleWithoutColor,
                StyleUtils.getMentionStyle(isOurMention),
                { color: StyleUtils.getMentionTextColor(isOurMention) },
                styles.breakWord,
                styles.textWrap,
            ]} role={CONST_1.default.ROLE.LINK} testID="mention-user" href={`/${navigationRoute}`}>
                            {htmlAttribAccountID ? `@${mentionDisplayText}` : <react_native_render_html_1.TNodeChildrenRenderer tnode={tnodeClone ?? tnode}/>}
                        </Text_1.default>
                    </UserDetailsTooltip_1.default>
                </Text_1.default>)}
        </ShowContextMenuContext_1.ShowContextMenuContext.Consumer>);
}
MentionUserRenderer.displayName = 'MentionUserRenderer';
exports.default = (0, withCurrentUserPersonalDetails_1.default)(MentionUserRenderer);
