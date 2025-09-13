"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const expensify_logo_round_transparent_png_1 = require("@assets/images/expensify-logo-round-transparent.png");
const ContextMenuItem_1 = require("@components/ContextMenuItem");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const QRShareWithDownload_1 = require("@components/QRShare/QRShareWithDownload");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Clipboard_1 = require("@libs/Clipboard");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const shouldAllowDownloadQRCode_1 = require("@libs/shouldAllowDownloadQRCode");
const UrlUtils_1 = require("@libs/UrlUtils");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const AccessOrNotFoundWrapper_1 = require("./AccessOrNotFoundWrapper");
const withPolicy_1 = require("./withPolicy");
function WorkspaceOverviewSharePage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const qrCodeRef = (0, react_1.useRef)(null);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const session = (0, OnyxListItemProvider_1.useSession)();
    const policyName = policy?.name ?? '';
    const policyID = policy?.id;
    const adminEmail = session?.email ?? '';
    const urlWithTrailingSlash = (0, UrlUtils_1.default)(environmentURL);
    const url = policyID ? `${urlWithTrailingSlash}${ROUTES_1.default.WORKSPACE_JOIN_USER.getRoute(policyID, adminEmail)}` : '';
    const hasAvatar = !!policy?.avatarURL;
    const logo = hasAvatar ? policy?.avatarURL : undefined;
    const defaultWorkspaceAvatar = (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policyName) || Expensicons.FallbackAvatar;
    const defaultWorkspaceAvatarColors = policyID ? StyleUtils.getDefaultWorkspaceAvatarColor(policyID) : StyleUtils.getDefaultWorkspaceAvatarColor('');
    const svgLogo = !hasAvatar ? defaultWorkspaceAvatar : undefined;
    const logoBackgroundColor = !hasAvatar ? defaultWorkspaceAvatarColors.backgroundColor?.toString() : undefined;
    const svgLogoFillColor = !hasAvatar ? defaultWorkspaceAvatarColors.fill : undefined;
    const adminRoom = (0, react_1.useMemo)(() => {
        if (!policy?.id) {
            return undefined;
        }
        return (0, ReportUtils_1.getRoom)(CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS, policy?.id);
    }, [policy?.id]);
    const adminsRoomLink = adminRoom ? `${urlWithTrailingSlash}${ROUTES_1.default.REPORT_WITH_ID.getRoute(adminRoom.reportID)}` : '';
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]}>
            <ScreenWrapper_1.default testID={WorkspaceOverviewSharePage.displayName} shouldShowOfflineIndicatorInWideScreen enableEdgeToEdgeBottomSafeAreaPadding>
                <HeaderWithBackButton_1.default title={translate('common.share')} onBackButtonPress={Navigation_1.default.goBack}/>
                <ScrollView_1.default style={[styles.flex1, styles.pt3]} addBottomSafeAreaPadding>
                    <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                        <react_native_1.View style={[styles.mh5]}>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mb2]}>{translate('workspace.common.shareNote.header')}</Text_1.default>
                        </react_native_1.View>
                        <react_native_1.View style={[styles.renderHTML, styles.mh5, styles.mb9]}>
                            <RenderHTML_1.default html={translate('workspace.common.shareNote.content', { adminsRoomLink })}/>
                        </react_native_1.View>

                        <react_native_1.View style={[styles.workspaceSectionMobile, styles.ph9]}>
                            <QRShareWithDownload_1.default ref={qrCodeRef} url={url} title={policyName} logo={logo ?? expensify_logo_round_transparent_png_1.default} svgLogo={svgLogo} svgLogoFillColor={svgLogoFillColor} logoBackgroundColor={logoBackgroundColor} logoRatio={CONST_1.default.QR.DEFAULT_LOGO_SIZE_RATIO} logoMarginRatio={CONST_1.default.QR.DEFAULT_LOGO_MARGIN_RATIO}/>
                        </react_native_1.View>
                        <react_native_1.View style={[styles.mt3, styles.ph4]}>
                            <ContextMenuItem_1.default isAnonymousAction text={translate('qrCodes.copy')} icon={Expensicons.Copy} successIcon={Expensicons.Checkmark} successText={translate('qrCodes.copied')} onPress={() => Clipboard_1.default.setString(url)} shouldLimitWidth={false} wrapperStyle={styles.sectionMenuItemTopDescription}/>
                            {/* Remove this once https://github.com/Expensify/App/issues/19834 is done.
        We shouldn't introduce platform specific code in our codebase.
        This is a temporary solution while Web is not supported for the QR code download feature */}
                            {shouldAllowDownloadQRCode_1.default && (<MenuItem_1.default isAnonymousAction title={translate('common.download')} icon={Expensicons.Download} onPress={() => qrCodeRef.current?.download?.()} wrapperStyle={styles.sectionMenuItemTopDescription}/>)}
                        </react_native_1.View>
                    </react_native_1.View>
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceOverviewSharePage.displayName = 'WorkspaceOverviewSharePage';
exports.default = (0, withPolicy_1.default)(WorkspaceOverviewSharePage);
