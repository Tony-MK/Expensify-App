"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Banner_1 = require("@components/Banner");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PolicyUtils = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const ReportInstance = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SystemChatReportFooterMessage() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email });
    const [choice] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED);
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY);
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID);
    const adminChatReportID = (0, react_1.useMemo)(() => {
        const adminPolicy = activePolicyID
            ? // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
                // eslint-disable-next-line deprecation/deprecation
                PolicyUtils.getPolicy(activePolicyID)
            : Object.values(policies ?? {}).find((policy) => PolicyUtils.shouldShowPolicy(policy, false, currentUserLogin) && policy?.role === CONST_1.default.POLICY.ROLE.ADMIN && policy?.chatReportIDAdmins);
        return String(adminPolicy?.chatReportIDAdmins ?? -1);
    }, [activePolicyID, policies, currentUserLogin]);
    const [adminChatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${adminChatReportID}`);
    const content = (0, react_1.useMemo)(() => {
        switch (choice) {
            case CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM:
                return (<>
                        {translate('systemChatFooterMessage.newDotManageTeam.phrase1')}
                        <TextLink_1.default onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(adminChatReport?.reportID ?? '-1'))}>
                            {adminChatReport?.reportName ?? CONST_1.default.REPORT.WORKSPACE_CHAT_ROOMS.ADMINS}
                        </TextLink_1.default>
                        {translate('systemChatFooterMessage.newDotManageTeam.phrase2')}
                    </>);
            default:
                return (<>
                        {translate('systemChatFooterMessage.default.phrase1')}
                        <TextLink_1.default onPress={() => ReportInstance.navigateToConciergeChat()}>{CONST_1.default?.CONCIERGE_CHAT_NAME}</TextLink_1.default>
                        {translate('systemChatFooterMessage.default.phrase2')}
                    </>);
        }
    }, [adminChatReport?.reportName, adminChatReport?.reportID, choice, translate]);
    return (<Banner_1.default containerStyles={[styles.chatFooterBanner]} shouldShowIcon icon={Expensicons.Lightbulb} content={<Text_1.default suppressHighlighting style={styles.flex1}>
                    {content}
                </Text_1.default>}/>);
}
SystemChatReportFooterMessage.displayName = 'SystemChatReportFooterMessage';
exports.default = SystemChatReportFooterMessage;
