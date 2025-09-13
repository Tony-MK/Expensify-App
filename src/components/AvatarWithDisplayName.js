"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const utils_1 = require("./Button/utils");
const DisplayNames_1 = require("./DisplayNames");
const ParentNavigationSubtitle_1 = require("./ParentNavigationSubtitle");
const PressableWithoutFeedback_1 = require("./Pressable/PressableWithoutFeedback");
const ReportActionAvatars_1 = require("./ReportActionAvatars");
const Text_1 = require("./Text");
function getCustomDisplayName(shouldUseCustomSearchTitleName, report, title, displayNamesWithTooltips, transactions, shouldUseFullTitle, customSearchDisplayStyle, regularStyle, isAnonymous, isMoneyRequestOrReport) {
    const reportName = report?.reportName ?? CONST_1.default.REPORT.DEFAULT_REPORT_NAME;
    const isIOUOrInvoice = report?.type === CONST_1.default.REPORT.TYPE.IOU || report?.type === CONST_1.default.REPORT.TYPE.INVOICE;
    const hasTransactions = transactions.length > 0;
    function getDisplayProps() {
        const baseProps = {
            displayNamesWithTooltips,
            tooltipEnabled: true,
            numberOfLines: 1,
        };
        if (shouldUseCustomSearchTitleName) {
            const styleProps = {
                textStyles: customSearchDisplayStyle,
            };
            if (!hasTransactions) {
                return {
                    fullTitle: reportName,
                    shouldUseFullTitle,
                    ...baseProps,
                    ...styleProps,
                };
            }
            if (isIOUOrInvoice) {
                return {
                    fullTitle: title,
                    shouldUseFullTitle: true,
                    ...baseProps,
                    ...styleProps,
                };
            }
            return {
                fullTitle: reportName,
                shouldUseFullTitle,
                ...baseProps,
                ...styleProps,
            };
        }
        return {
            fullTitle: title,
            textStyles: regularStyle,
            shouldUseFullTitle: isMoneyRequestOrReport || isAnonymous,
            ...baseProps,
        };
    }
    const { fullTitle, textStyles, displayNamesWithTooltips: displayNamesWithTooltipsProp, tooltipEnabled, numberOfLines, shouldUseFullTitle: shouldUseFullTitleProp } = getDisplayProps();
    return (<DisplayNames_1.default fullTitle={fullTitle} displayNamesWithTooltips={displayNamesWithTooltipsProp} tooltipEnabled={tooltipEnabled} numberOfLines={numberOfLines} textStyles={textStyles} shouldUseFullTitle={shouldUseFullTitleProp}/>);
}
function AvatarWithDisplayName({ report, isAnonymous = false, size = CONST_1.default.AVATAR_SIZE.DEFAULT, shouldEnableDetailPageNavigation = false, shouldEnableAvatarNavigation = true, shouldUseCustomSearchTitleName = false, transactions = [], openParentReportInCurrentTab = false, avatarBorderColor: avatarBorderColorProp, shouldDisplayStatus = false, }) {
    const { localeCompare } = (0, useLocalize_1.default)();
    const [parentReportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report?.parentReportID}`, { canEvict: false, canBeMissing: false });
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false }) ?? CONST_1.default.EMPTY_OBJECT;
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID}`, { canBeMissing: true });
    const [invoiceReceiverPolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${parentReport?.invoiceReceiver && 'policyID' in parentReport.invoiceReceiver ? parentReport.invoiceReceiver.policyID : undefined}`, { canBeMissing: true });
    const [reportAttributes] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { selector: (attributes) => attributes?.reports, canBeMissing: false });
    const parentReportActionParam = report?.parentReportActionID ? parentReportActions?.[report.parentReportActionID] : undefined;
    const title = (0, ReportUtils_1.getReportName)(report, undefined, parentReportActionParam, personalDetails, invoiceReceiverPolicy, reportAttributes);
    const isParentReportArchived = (0, useReportIsArchived_1.default)(report?.parentReportID);
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const subtitle = (0, ReportUtils_1.getChatRoomSubtitle)(report, true, isReportArchived);
    const parentNavigationSubtitleData = (0, ReportUtils_1.getParentNavigationSubtitle)(report, isParentReportArchived);
    const isMoneyRequestOrReport = (0, ReportUtils_1.isMoneyRequestReport)(report) || (0, ReportUtils_1.isMoneyRequest)(report) || (0, ReportUtils_1.isTrackExpenseReport)(report) || (0, ReportUtils_1.isInvoiceReport)(report);
    const ownerPersonalDetails = (0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(report?.ownerAccountID ? [report.ownerAccountID] : [], personalDetails);
    const displayNamesWithTooltips = (0, ReportUtils_1.getDisplayNamesWithTooltips)(Object.values(ownerPersonalDetails), false, localeCompare);
    const avatarBorderColor = avatarBorderColorProp ?? (isAnonymous ? theme.highlightBG : theme.componentBG);
    const statusText = shouldDisplayStatus ? (0, ReportUtils_1.getReportStatusTranslation)(report?.stateNum, report?.statusNum) : undefined;
    const actorAccountID = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!report?.parentReportActionID) {
            return;
        }
        const parentReportAction = parentReportActions?.[report?.parentReportActionID];
        actorAccountID.current = parentReportAction?.actorAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    }, [parentReportActions, report]);
    const goToDetailsPage = (0, react_1.useCallback)(() => {
        (0, ReportUtils_1.navigateToDetailsPage)(report, Navigation_1.default.getActiveRoute());
    }, [report]);
    const showActorDetails = (0, react_1.useCallback)(() => {
        // We should navigate to the details page if the report is a IOU/expense report
        if (shouldEnableDetailPageNavigation) {
            goToDetailsPage();
            return;
        }
        if ((0, ReportUtils_1.isExpenseReport)(report) && report?.ownerAccountID) {
            Navigation_1.default.navigate(ROUTES_1.default.PROFILE.getRoute(report.ownerAccountID));
            return;
        }
        if ((0, ReportUtils_1.isIOUReport)(report) && report?.reportID) {
            Navigation_1.default.navigate(ROUTES_1.default.REPORT_PARTICIPANTS.getRoute(report.reportID));
            return;
        }
        if ((0, ReportUtils_1.isChatThread)(report)) {
            // In an ideal situation account ID won't be 0
            if (actorAccountID.current && actorAccountID.current > 0) {
                Navigation_1.default.navigate(ROUTES_1.default.PROFILE.getRoute(actorAccountID.current));
                return;
            }
        }
        if (report?.reportID) {
            // Report detail route is added as fallback but based on the current implementation this route won't be executed
            Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(report.reportID));
        }
    }, [report, shouldEnableDetailPageNavigation, goToDetailsPage]);
    const shouldUseFullTitle = isMoneyRequestOrReport || isAnonymous;
    const multipleAvatars = (<ReportActionAvatars_1.default singleAvatarContainerStyle={[styles.actionAvatar, styles.mr3]} subscriptAvatarBorderColor={avatarBorderColor} size={size} secondaryAvatarContainerStyle={StyleUtils.getBackgroundAndBorderStyle(avatarBorderColor)} reportID={report?.reportID}/>);
    const headerView = (<react_native_1.View style={[styles.appContentHeaderTitle, styles.flex1]}>
            {!!report && !!title && (<react_native_1.View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween]}>
                    <react_native_1.View accessibilityLabel={title}>
                        {shouldEnableAvatarNavigation ? (<PressableWithoutFeedback_1.default onPress={showActorDetails} accessibilityLabel={title} role={(0, utils_1.getButtonRole)(true)}>
                                {multipleAvatars}
                            </PressableWithoutFeedback_1.default>) : (multipleAvatars)}
                    </react_native_1.View>

                    <react_native_1.View style={[styles.flex1, styles.flexColumn]}>
                        {getCustomDisplayName(shouldUseCustomSearchTitleName, report, title, displayNamesWithTooltips, transactions, shouldUseFullTitle, [styles.headerText, styles.pre], [isAnonymous ? styles.headerAnonymousFooter : styles.headerText, styles.pre], isAnonymous, isMoneyRequestOrReport)}
                        {Object.keys(parentNavigationSubtitleData).length > 0 && (<ParentNavigationSubtitle_1.default parentNavigationSubtitleData={parentNavigationSubtitleData} parentReportID={report?.parentReportID} parentReportActionID={report?.parentReportActionID} pressableStyles={[styles.alignSelfStart, styles.mw100]} openParentReportInCurrentTab={openParentReportInCurrentTab} statusText={statusText}/>)}
                        {!!subtitle && (<Text_1.default style={[styles.sidebarLinkText, styles.optionAlternateText, styles.textLabelSupporting, styles.pre]} numberOfLines={1}>
                                {subtitle}
                            </Text_1.default>)}
                    </react_native_1.View>
                </react_native_1.View>)}
        </react_native_1.View>);
    if (!shouldEnableDetailPageNavigation) {
        return headerView;
    }
    return (<PressableWithoutFeedback_1.default onPress={goToDetailsPage} style={[styles.flexRow, styles.alignItemsCenter, styles.flex1]} accessibilityLabel={title} role={CONST_1.default.ROLE.BUTTON}>
            {headerView}
        </PressableWithoutFeedback_1.default>);
}
AvatarWithDisplayName.displayName = 'AvatarWithDisplayName';
exports.default = AvatarWithDisplayName;
