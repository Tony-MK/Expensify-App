"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const Text_1 = require("@components/Text");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MentionUtils_1 = require("@libs/MentionUtils");
const isSearchTopmostFullScreenRoute_1 = require("@libs/Navigation/helpers/isSearchTopmostFullScreenRoute");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const MentionReportContext_1 = require("./MentionReportContext");
function MentionReportRenderer({ style, tnode, TDefaultRenderer, ...defaultRendererProps }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const htmlAttributeReportID = tnode.attributes.reportid;
    const { currentReportID: currentReportIDContext, exactlyMatch } = (0, react_1.useContext)(MentionReportContext_1.default);
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT);
    const currentReportID = (0, useCurrentReportID_1.default)();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const currentReportIDValue = currentReportIDContext || currentReportID?.currentReportID;
    const [currentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${currentReportIDValue}`);
    // When we invite someone to a room they don't have the policy object, but we still want them to be able to see and click on report mentions, so we only check if the policyID in the report is from a workspace
    const isGroupPolicyReport = (0, react_1.useMemo)(() => currentReport && !(0, EmptyObject_1.isEmptyObject)(currentReport) && !!currentReport.policyID && currentReport.policyID !== CONST_1.default.POLICY.ID_FAKE, [currentReport]);
    const mentionDetails = (0, MentionUtils_1.getReportMentionDetails)(htmlAttributeReportID, currentReport, reports, tnode);
    if (!mentionDetails) {
        return null;
    }
    const { reportID, mentionDisplayText } = mentionDetails;
    let navigationRoute = reportID ? ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID) : undefined;
    const backTo = Navigation_1.default.getActiveRoute();
    if ((0, isSearchTopmostFullScreenRoute_1.default)()) {
        navigationRoute = reportID ? ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID, backTo }) : undefined;
    }
    const isCurrentRoomMention = reportID === currentReportIDValue;
    const flattenStyle = react_native_1.StyleSheet.flatten(style);
    const { color, ...styleWithoutColor } = flattenStyle;
    return (<ShowContextMenuContext_1.ShowContextMenuContext.Consumer>
            {() => (<Text_1.default 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...defaultRendererProps} style={isGroupPolicyReport && (!exactlyMatch || navigationRoute)
                ? [styles.link, styleWithoutColor, StyleUtils.getMentionStyle(isCurrentRoomMention), { color: StyleUtils.getMentionTextColor(isCurrentRoomMention) }]
                : [flattenStyle]} suppressHighlighting onPress={navigationRoute && isGroupPolicyReport
                ? (event) => {
                    event.preventDefault();
                    Navigation_1.default.navigate(navigationRoute);
                }
                : undefined} role={isGroupPolicyReport ? CONST_1.default.ROLE.LINK : undefined} accessibilityLabel={isGroupPolicyReport ? `/${navigationRoute}` : undefined}>
                    #{mentionDisplayText}
                </Text_1.default>)}
        </ShowContextMenuContext_1.ShowContextMenuContext.Consumer>);
}
MentionReportRenderer.displayName = 'MentionReportRenderer';
exports.default = MentionReportRenderer;
