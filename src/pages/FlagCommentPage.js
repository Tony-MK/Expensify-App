"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const Report_1 = require("@userActions/Report");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const withReportAndReportActionOrNotFound_1 = require("./home/report/withReportAndReportActionOrNotFound");
/**
 * Get the reportID for the associated chatReport
 */
function getReportID(route) {
    return route.params.reportID.toString();
}
function FlagCommentPage({ parentReportAction, route, report, parentReport, reportAction }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const severities = [
        {
            severity: CONST_1.default.MODERATION.FLAG_SEVERITY_SPAM,
            name: translate('moderation.spam'),
            icon: Expensicons.FlagLevelOne,
            description: translate('moderation.spamDescription'),
            furtherDetails: translate('moderation.levelOneResult'),
            furtherDetailsIcon: Expensicons.FlagLevelOne,
        },
        {
            severity: CONST_1.default.MODERATION.FLAG_SEVERITY_INCONSIDERATE,
            name: translate('moderation.inconsiderate'),
            icon: Expensicons.FlagLevelOne,
            description: translate('moderation.inconsiderateDescription'),
            furtherDetails: translate('moderation.levelOneResult'),
            furtherDetailsIcon: Expensicons.FlagLevelOne,
        },
        {
            severity: CONST_1.default.MODERATION.FLAG_SEVERITY_INTIMIDATION,
            name: translate('moderation.intimidation'),
            icon: Expensicons.FlagLevelTwo,
            description: translate('moderation.intimidationDescription'),
            furtherDetails: translate('moderation.levelTwoResult'),
            furtherDetailsIcon: Expensicons.FlagLevelTwo,
        },
        {
            severity: CONST_1.default.MODERATION.FLAG_SEVERITY_BULLYING,
            name: translate('moderation.bullying'),
            icon: Expensicons.FlagLevelTwo,
            description: translate('moderation.bullyingDescription'),
            furtherDetails: translate('moderation.levelTwoResult'),
            furtherDetailsIcon: Expensicons.FlagLevelTwo,
        },
        {
            severity: CONST_1.default.MODERATION.FLAG_SEVERITY_HARASSMENT,
            name: translate('moderation.harassment'),
            icon: Expensicons.FlagLevelThree,
            description: translate('moderation.harassmentDescription'),
            furtherDetails: translate('moderation.levelThreeResult'),
            furtherDetailsIcon: Expensicons.FlagLevelThree,
        },
        {
            severity: CONST_1.default.MODERATION.FLAG_SEVERITY_ASSAULT,
            name: translate('moderation.assault'),
            icon: Expensicons.FlagLevelThree,
            description: translate('moderation.assaultDescription'),
            furtherDetails: translate('moderation.levelThreeResult'),
            furtherDetailsIcon: Expensicons.FlagLevelThree,
        },
    ];
    const flagComment = (severity) => {
        let reportID = getReportID(route);
        // Handle threads if needed
        if ((0, ReportUtils_1.isChatThread)(report) && reportAction?.reportActionID === parentReportAction?.reportActionID) {
            reportID = parentReport?.reportID;
        }
        if (reportAction && (0, ReportUtils_1.canFlagReportAction)(reportAction, reportID)) {
            (0, Report_1.flagComment)(reportID, reportAction, severity);
        }
        Navigation_1.default.dismissModal();
    };
    const severityMenuItems = severities.map((item) => (<MenuItem_1.default key={`${item.severity}`} shouldShowRightIcon title={item.name} description={item.description} onPress={(0, Session_1.callFunctionIfActionIsAllowed)(() => flagComment(item.severity))} style={[styles.pt2, styles.pb4, styles.ph5, styles.flexRow]} furtherDetails={item.furtherDetails} furtherDetailsIcon={item.furtherDetailsIcon}/>));
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={FlagCommentPage.displayName}>
            {({ safeAreaPaddingBottomStyle }) => (<FullPageNotFoundView_1.default shouldShow={!(0, ReportUtils_1.shouldShowFlagComment)(reportAction, report, isReportArchived)}>
                    <HeaderWithBackButton_1.default title={translate('reportActionContextMenu.flagAsOffensive')} onBackButtonPress={() => Navigation_1.default.goBack(route.params.backTo)}/>
                    <ScrollView_1.default contentContainerStyle={safeAreaPaddingBottomStyle} style={styles.settingsPageBackground}>
                        <react_native_1.View style={styles.pageWrapper}>
                            <react_native_1.View style={styles.settingsPageBody}>
                                <Text_1.default style={styles.webViewStyles.baseFontStyle}>{translate('moderation.flagDescription')}</Text_1.default>
                            </react_native_1.View>
                        </react_native_1.View>
                        <Text_1.default style={[styles.ph5, styles.textLabelSupporting, styles.mb1]}>{translate('moderation.chooseAReason')}</Text_1.default>
                        {severityMenuItems}
                    </ScrollView_1.default>
                </FullPageNotFoundView_1.default>)}
        </ScreenWrapper_1.default>);
}
FlagCommentPage.displayName = 'FlagCommentPage';
exports.default = (0, withReportAndReportActionOrNotFound_1.default)(FlagCommentPage);
