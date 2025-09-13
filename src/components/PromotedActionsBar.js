"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotedActions = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const HeaderUtils_1 = require("@libs/HeaderUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Report_1 = require("@userActions/Report");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const Button_1 = require("./Button");
const Expensicons = require("./Icon/Expensicons");
const PromotedActions = {
    pin: (report) => ({
        key: CONST_1.default.PROMOTED_ACTIONS.PIN,
        ...(0, HeaderUtils_1.getPinMenuItem)(report),
    }),
    share: (report, backTo) => ({
        key: CONST_1.default.PROMOTED_ACTIONS.SHARE,
        ...(0, HeaderUtils_1.getShareMenuItem)(report, backTo),
    }),
    join: (report) => ({
        key: CONST_1.default.PROMOTED_ACTIONS.JOIN,
        icon: Expensicons.ChatBubbles,
        translationKey: 'common.join',
        onSelected: (0, Session_1.callFunctionIfActionIsAllowed)(() => {
            Navigation_1.default.dismissModal();
            (0, Report_1.joinRoom)(report);
        }),
    }),
    message: ({ reportID, accountID, login }) => ({
        key: CONST_1.default.PROMOTED_ACTIONS.MESSAGE,
        icon: Expensicons.CommentBubbles,
        translationKey: 'common.message',
        onSelected: () => {
            if (reportID) {
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID));
                return;
            }
            // The accountID might be optimistic, so we should use the login if we have it
            if (login) {
                (0, Report_1.navigateToAndOpenReport)([login], false);
                return;
            }
            if (accountID) {
                (0, Report_1.navigateToAndOpenReportWithAccountIDs)([accountID]);
            }
        },
    }),
};
exports.PromotedActions = PromotedActions;
function PromotedActionsBar({ promotedActions, containerStyle }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    if (promotedActions.length === 0) {
        return null;
    }
    return (<react_native_1.View style={[styles.flexRow, styles.ph5, styles.mb5, styles.gap2, styles.mw100, styles.w100, styles.justifyContentCenter, containerStyle]}>
            {promotedActions.map(({ key, onSelected, translationKey, ...props }) => (<react_native_1.View style={[styles.flex1, styles.mw50]} key={key}>
                    <Button_1.default onPress={onSelected} iconFill={theme.icon} text={translate(translationKey)} 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}/>
                </react_native_1.View>))}
        </react_native_1.View>);
}
PromotedActionsBar.displayName = 'PromotedActionsBar';
exports.default = PromotedActionsBar;
