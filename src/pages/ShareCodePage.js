"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const expensify_logo_round_transparent_png_1 = require("@assets/images/expensify-logo-round-transparent.png");
const ContextMenuItem_1 = require("@components/ContextMenuItem");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const QRShareWithDownload_1 = require("@components/QRShare/QRShareWithDownload");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Clipboard_1 = require("@libs/Clipboard");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const shouldAllowDownloadQRCode_1 = require("@libs/shouldAllowDownloadQRCode");
const UrlUtils_1 = require("@libs/UrlUtils");
const UserUtils_1 = require("@libs/UserUtils");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
/**
 * When sharing a policy (workspace) only return user avatar that is user defined. Default ws avatars have separate logic.
 * In any other case default to expensify logo
 */
function getLogoForWorkspace(report, policy) {
    if (!policy || !policy.id || report?.type !== 'chat') {
        return expensify_logo_round_transparent_png_1.default;
    }
    if (!policy.avatarURL) {
        return undefined;
    }
    return policy.avatarURL;
}
function ShareCodePage({ report, policy, backTo }) {
    const themeStyles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const qrCodeRef = (0, react_1.useRef)(null);
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const isParentReportArchived = (0, useReportIsArchived_1.default)(report?.parentReportID);
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const isReport = !!report?.reportID;
    const subtitle = (0, react_1.useMemo)(() => {
        if (isReport) {
            if ((0, ReportUtils_1.isExpenseReport)(report)) {
                return (0, ReportUtils_1.getPolicyName)({ report });
            }
            if ((0, ReportUtils_1.isMoneyRequestReport)(report)) {
                // generate subtitle from participants
                return (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, true)
                    .map((accountID) => (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID }))
                    .join(' & ');
            }
            return (0, ReportUtils_1.getParentNavigationSubtitle)(report, isParentReportArchived).workspaceName ?? (0, ReportUtils_1.getChatRoomSubtitle)(report, false, isReportArchived);
        }
        return currentUserPersonalDetails.login;
    }, [report, currentUserPersonalDetails.login, isReport, isReportArchived, isParentReportArchived]);
    const title = isReport ? (0, ReportUtils_1.getReportName)(report) : (currentUserPersonalDetails.displayName ?? '');
    const urlWithTrailingSlash = (0, UrlUtils_1.default)(environmentURL);
    const url = isReport
        ? `${urlWithTrailingSlash}${ROUTES_1.default.REPORT_WITH_ID.getRoute(report.reportID)}`
        : `${urlWithTrailingSlash}${ROUTES_1.default.PROFILE.getRoute(currentUserPersonalDetails.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID)}`;
    const logo = isReport ? getLogoForWorkspace(report, policy) : (0, UserUtils_1.getAvatarUrl)(currentUserPersonalDetails?.avatar, currentUserPersonalDetails?.accountID);
    // Default logos (avatars) are SVG and they require some special logic to display correctly
    let svgLogo;
    let logoBackgroundColor;
    let svgLogoFillColor;
    if (!logo && policy && !policy.avatarURL) {
        svgLogo = (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy.name) || Expensicons.FallbackAvatar;
        const defaultWorkspaceAvatarColors = StyleUtils.getDefaultWorkspaceAvatarColor(policy.id);
        logoBackgroundColor = defaultWorkspaceAvatarColors.backgroundColor?.toString();
        svgLogoFillColor = defaultWorkspaceAvatarColors.fill;
    }
    return (<ScreenWrapper_1.default testID={ShareCodePage.displayName}>
            <HeaderWithBackButton_1.default title={translate('common.shareCode')} onBackButtonPress={() => Navigation_1.default.goBack(isReport ? ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(report?.reportID, backTo) : undefined)} shouldShowBackButton/>
            <ScrollView_1.default style={[themeStyles.flex1, themeStyles.pt3]}>
                <react_native_1.View style={[themeStyles.workspaceSectionMobile, themeStyles.ph5]}>
                    <QRShareWithDownload_1.default ref={qrCodeRef} url={url} title={title} subtitle={subtitle} logo={isReport ? expensify_logo_round_transparent_png_1.default : (0, UserUtils_1.getAvatarUrl)(currentUserPersonalDetails?.avatar, currentUserPersonalDetails?.accountID)} logoRatio={isReport ? CONST_1.default.QR.EXPENSIFY_LOGO_SIZE_RATIO : CONST_1.default.QR.DEFAULT_LOGO_SIZE_RATIO} logoMarginRatio={isReport ? CONST_1.default.QR.EXPENSIFY_LOGO_MARGIN_RATIO : CONST_1.default.QR.DEFAULT_LOGO_MARGIN_RATIO} svgLogo={svgLogo} svgLogoFillColor={svgLogoFillColor} logoBackgroundColor={logoBackgroundColor}/>
                </react_native_1.View>

                <react_native_1.View style={themeStyles.mt9}>
                    <ContextMenuItem_1.default isAnonymousAction text={translate('qrCodes.copy')} icon={Expensicons.Copy} successIcon={Expensicons.Checkmark} successText={translate('qrCodes.copied')} onPress={() => Clipboard_1.default.setString(url)} shouldLimitWidth={false}/>
                    {/* Remove this platform specific condition once https://github.com/Expensify/App/issues/19834 is done.
        We shouldn't introduce platform specific code in our codebase.
        This is a temporary solution while Web is not supported for the QR code download feature */}
                    {shouldAllowDownloadQRCode_1.default && (<MenuItem_1.default isAnonymousAction title={translate('common.download')} icon={Expensicons.Download} 
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onPress={() => qrCodeRef.current?.download?.()}/>)}

                    <MenuItem_1.default title={translate(`referralProgram.${CONST_1.default.REFERRAL_PROGRAM.CONTENT_TYPES.SHARE_CODE}.buttonText`)} icon={Expensicons.Cash} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REFERRAL_DETAILS_MODAL.getRoute(CONST_1.default.REFERRAL_PROGRAM.CONTENT_TYPES.SHARE_CODE, Navigation_1.default.getActiveRoute()))} shouldShowRightIcon/>
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
ShareCodePage.displayName = 'ShareCodePage';
exports.default = ShareCodePage;
