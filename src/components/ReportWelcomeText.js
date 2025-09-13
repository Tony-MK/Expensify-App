"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SidebarUtils_1 = require("@libs/SidebarUtils");
const TextWithEmojiFragment_1 = require("@pages/home/report/comment/TextWithEmojiFragment");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const mapOnyxCollectionItems_1 = require("@src/utils/mapOnyxCollectionItems");
const RenderHTML_1 = require("./RenderHTML");
const Text_1 = require("./Text");
const UserDetailsTooltip_1 = require("./UserDetailsTooltip");
const personalDetailsSelector = (personalDetail) => personalDetail && {
    accountID: personalDetail.accountID,
    login: personalDetail.login,
    avatar: personalDetail.avatar,
    pronouns: personalDetail.pronouns,
};
function ReportWelcomeText({ report, policy }) {
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { selector: (c) => (0, mapOnyxCollectionItems_1.default)(c, personalDetailsSelector), canBeMissing: false });
    const isPolicyExpenseChat = (0, ReportUtils_1.isPolicyExpenseChat)(report);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const [reportMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID || undefined}`, { canBeMissing: true });
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const isChatRoom = (0, ReportUtils_1.isChatRoom)(report);
    const isSelfDM = (0, ReportUtils_1.isSelfDM)(report);
    const isInvoiceRoom = (0, ReportUtils_1.isInvoiceRoom)(report);
    const isSystemChat = (0, ReportUtils_1.isSystemChat)(report);
    const isDefault = !(isChatRoom || isPolicyExpenseChat || isSelfDM || isSystemChat);
    const participantAccountIDs = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, undefined, true, true, reportMetadata);
    const isMultipleParticipant = participantAccountIDs.length > 1;
    const displayNamesWithTooltips = (0, ReportUtils_1.getDisplayNamesWithTooltips)((0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(participantAccountIDs, personalDetails), isMultipleParticipant, localeCompare);
    const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, policy, participantAccountIDs, isReportArchived);
    const policyName = (0, ReportUtils_1.getPolicyName)({ report });
    const filteredOptions = moneyRequestOptions.filter((item) => item !== CONST_1.default.IOU.TYPE.INVOICE);
    const additionalText = filteredOptions
        .map((item, index) => `${index === filteredOptions.length - 1 && index > 0 ? `${translate('common.or')} ` : ''}${translate(item === 'submit' ? `reportActionsView.create` : `reportActionsView.iouTypes.${item}`)}`)
        .join(', ');
    const reportName = (0, ReportUtils_1.getReportName)(report);
    const shouldShowUsePlusButtonText = moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.PAY) ||
        moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT) ||
        moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.TRACK) ||
        moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SPLIT);
    const reportDetailsLink = (0, react_1.useMemo)(() => {
        if (!report?.reportID) {
            return '';
        }
        return `${environmentURL}/${ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(report.reportID, Navigation_1.default.getReportRHPActiveRoute())}`;
    }, [environmentURL, report?.reportID]);
    const welcomeHeroText = (0, react_1.useMemo)(() => {
        if (isInvoiceRoom) {
            return translate('reportActionsView.sayHello');
        }
        if (isChatRoom) {
            return translate('reportActionsView.welcomeToRoom', { roomName: reportName });
        }
        if (isSelfDM) {
            return translate('reportActionsView.yourSpace');
        }
        if (isSystemChat) {
            return reportName;
        }
        if (isPolicyExpenseChat) {
            return translate('reportActionsView.welcomeToRoom', { roomName: policyName });
        }
        return translate('reportActionsView.sayHello');
    }, [isChatRoom, isInvoiceRoom, isPolicyExpenseChat, isSelfDM, isSystemChat, translate, policyName, reportName]);
    const participantAccountIDsExcludeCurrentUser = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, undefined, undefined, true);
    const participantPersonalDetailListExcludeCurrentUser = Object.values((0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(participantAccountIDsExcludeCurrentUser, personalDetails));
    const welcomeMessage = SidebarUtils_1.default.getWelcomeMessage(report, policy, participantPersonalDetailListExcludeCurrentUser, localeCompare, isReportArchived, reportDetailsLink);
    return (<>
            <react_native_1.View>
                <Text_1.default style={[styles.textHero]}>{welcomeHeroText}</Text_1.default>
            </react_native_1.View>
            <react_native_1.View style={[styles.mt3, styles.mw100]}>
                {(isChatRoom || isPolicyExpenseChat) && !!welcomeMessage.messageHtml && (<react_native_1.View style={[styles.renderHTML, styles.cursorText]}>
                        <RenderHTML_1.default html={welcomeMessage.messageHtml}/>
                    </react_native_1.View>)}
                {isSelfDM && (<Text_1.default>
                        <Text_1.default>{welcomeMessage.messageText}</Text_1.default>
                        {shouldShowUsePlusButtonText && <TextWithEmojiFragment_1.default message={translate('reportActionsView.usePlusButton', { additionalText })}/>}
                    </Text_1.default>)}
                {isSystemChat && (<Text_1.default>
                        <Text_1.default>{welcomeMessage.messageText}</Text_1.default>
                    </Text_1.default>)}
                {isDefault && displayNamesWithTooltips.length > 0 && (<Text_1.default>
                        <Text_1.default>{welcomeMessage.phrase1}</Text_1.default>
                        {displayNamesWithTooltips.map(({ displayName, accountID }, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Text_1.default key={`${displayName}${index}`}>
                                <UserDetailsTooltip_1.default accountID={accountID}>
                                    {(0, ReportUtils_1.isOptimisticPersonalDetail)(accountID) ? (<Text_1.default style={[styles.textStrong]}>{displayName}</Text_1.default>) : (<Text_1.default style={[styles.textStrong]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.PROFILE.getRoute(accountID, Navigation_1.default.getActiveRoute()))} suppressHighlighting>
                                            {displayName}
                                        </Text_1.default>)}
                                </UserDetailsTooltip_1.default>
                                {index === displayNamesWithTooltips.length - 1 && <Text_1.default>.</Text_1.default>}
                                {index === displayNamesWithTooltips.length - 2 && <Text_1.default>{` ${translate('common.and')} `}</Text_1.default>}
                                {index < displayNamesWithTooltips.length - 2 && <Text_1.default>, </Text_1.default>}
                            </Text_1.default>))}
                        {shouldShowUsePlusButtonText && <TextWithEmojiFragment_1.default message={translate('reportActionsView.usePlusButton', { additionalText })}/>}
                        {(0, ReportUtils_1.isConciergeChatReport)(report) && <Text_1.default>{translate('reportActionsView.askConcierge')}</Text_1.default>}
                    </Text_1.default>)}
            </react_native_1.View>
        </>);
}
ReportWelcomeText.displayName = 'ReportWelcomeText';
exports.default = ReportWelcomeText;
