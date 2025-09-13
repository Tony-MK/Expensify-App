"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const useHover_1 = require("@hooks/useHover");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useRootNavigationState_1 = require("@hooks/useRootNavigationState");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const Text_1 = require("./Text");
const TextLink_1 = require("./TextLink");
function ParentNavigationSubtitle({ parentNavigationSubtitleData, parentReportActionID, parentReportID = '', pressableStyles, openParentReportInCurrentTab = false, statusText, }) {
    const currentRoute = (0, native_1.useRoute)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { hovered, bind: { onMouseEnter, onMouseLeave }, } = (0, useHover_1.default)();
    const { workspaceName, reportName } = parentNavigationSubtitleData;
    const { translate } = (0, useLocalize_1.default)();
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReportID}`, { canBeMissing: false });
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const canUserPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived);
    const isReportInRHP = currentRoute.name === SCREENS_1.default.SEARCH.REPORT_RHP;
    const currentFullScreenRoute = (0, useRootNavigationState_1.default)((state) => state?.routes?.findLast((route) => (0, isNavigatorName_1.isFullScreenName)(route.name)));
    // We should not display the parent navigation subtitle if the user does not have access to the parent chat (the reportName is empty in this case)
    if (!reportName) {
        return;
    }
    const onPress = () => {
        const parentAction = (0, ReportActionsUtils_1.getReportAction)(parentReportID, parentReportActionID);
        const isVisibleAction = (0, ReportActionsUtils_1.shouldReportActionBeVisible)(parentAction, parentAction?.reportActionID ?? CONST_1.default.DEFAULT_NUMBER_ID, canUserPerformWriteAction);
        if (openParentReportInCurrentTab && isReportInRHP) {
            // If the report is displayed in RHP in Reports tab, we want to stay in the current tab after opening the parent report
            if (currentFullScreenRoute?.name === NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR) {
                const lastRoute = currentFullScreenRoute?.state?.routes.at(-1);
                if (lastRoute?.name === SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT) {
                    const moneyRequestReportID = lastRoute?.params?.reportID;
                    // If the parent report is already displayed underneath RHP, simply dismiss the modal
                    if (moneyRequestReportID === parentReportID) {
                        Navigation_1.default.dismissModal();
                        return;
                    }
                }
                Navigation_1.default.navigate(ROUTES_1.default.SEARCH_MONEY_REQUEST_REPORT.getRoute({ reportID: parentReportID }));
                return;
            }
            // If the parent report is already displayed underneath RHP, simply dismiss the modal
            if (Navigation_1.default.getTopmostReportId() === parentReportID) {
                Navigation_1.default.dismissModal();
                return;
            }
        }
        if (isVisibleAction) {
            Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(parentReportID, parentReportActionID));
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(parentReportID));
        }
    };
    return (<Text_1.default style={[styles.optionAlternateText, styles.textLabelSupporting]} numberOfLines={1}>
            {!!statusText && <Text_1.default style={[styles.optionAlternateText, styles.textLabelSupporting]}>{`${statusText} ${CONST_1.default.DOT_SEPARATOR} `}</Text_1.default>}
            {!!reportName && (<>
                    <Text_1.default style={[styles.optionAlternateText, styles.textLabelSupporting]}>{`${translate('threads.from')} `}</Text_1.default>
                    <TextLink_1.default onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onPress={onPress} accessibilityLabel={translate('threads.parentNavigationSummary', { reportName, workspaceName })} style={[pressableStyles, styles.optionAlternateText, styles.textLabelSupporting, hovered ? StyleUtils.getColorStyle(theme.linkHover) : styles.link]}>
                        {reportName}
                    </TextLink_1.default>
                </>)}
            {!!workspaceName && workspaceName !== reportName && (<Text_1.default style={[styles.optionAlternateText, styles.textLabelSupporting]}>{` ${translate('threads.in')} ${workspaceName}`}</Text_1.default>)}
        </Text_1.default>);
}
ParentNavigationSubtitle.displayName = 'ParentNavigationSubtitle';
exports.default = ParentNavigationSubtitle;
