"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const expensify_logo_round_transparent_png_1 = require("@assets/images/expensify-logo-round-transparent.png");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const QRShare_1 = require("@components/QRShare");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const CONST_1 = require("@src/CONST");
function AppDownloadLinksPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const popoverAnchor = (0, react_1.useRef)(null);
    const menuItems = [
        {
            translationKey: 'initialSettingsPage.appDownloadLinks.android.label',
            action: () => {
                (0, Link_1.openExternalLink)(CONST_1.default.APP_DOWNLOAD_LINKS.ANDROID);
            },
            link: CONST_1.default.APP_DOWNLOAD_LINKS.ANDROID,
            icon: Expensicons.Android,
            iconRight: Expensicons.NewWindow,
        },
        {
            translationKey: 'initialSettingsPage.appDownloadLinks.ios.label',
            action: () => {
                (0, Link_1.openExternalLink)(CONST_1.default.APP_DOWNLOAD_LINKS.IOS, true);
            },
            link: CONST_1.default.APP_DOWNLOAD_LINKS.IOS,
            icon: Expensicons.Apple,
            iconRight: Expensicons.NewWindow,
        },
        {
            translationKey: 'initialSettingsPage.appDownloadLinks.desktop.label',
            action: () => {
                (0, Link_1.openExternalLink)(CONST_1.default.APP_DOWNLOAD_LINKS.DESKTOP, true);
            },
            link: CONST_1.default.APP_DOWNLOAD_LINKS.DESKTOP,
            icon: Expensicons.Monitor,
            iconRight: Expensicons.NewWindow,
        },
    ];
    return (<ScreenWrapper_1.default testID={AppDownloadLinksPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('initialSettingsPage.aboutPage.appDownloadLinks')} onBackButtonPress={() => Navigation_1.default.goBack()}/>

            <QRShare_1.default url={CONST_1.default.EXPENSIFY_MOBILE_URL} logo={expensify_logo_round_transparent_png_1.default} logoRatio={CONST_1.default.QR.EXPENSIFY_LOGO_SIZE_RATIO} logoMarginRatio={CONST_1.default.QR.EXPENSIFY_LOGO_MARGIN_RATIO} shouldShowExpensifyLogo={false} additionalStyles={[styles.qrCodeAppDownloadLinksStyles, styles.shareCodeContainerDownloadPadding]} size={CONST_1.default.QR_CODE_SIZE.APP_DOWNLOAD_LINKS}/>

            <ScrollView_1.default style={[styles.mt3]}>
                {menuItems.map((item) => (<MenuItem_1.default key={item.translationKey} onPress={item.action} onSecondaryInteraction={(e) => (0, ReportActionContextMenu_1.showContextMenu)({
                type: CONST_1.default.CONTEXT_MENU_TYPES.LINK,
                event: e,
                selection: item.link,
                contextMenuAnchor: popoverAnchor.current,
            })} ref={popoverAnchor} title={translate(item.translationKey)} icon={item.icon} iconRight={item.iconRight} shouldBlockSelection shouldShowRightIcon/>))}
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
AppDownloadLinksPage.displayName = 'AppDownloadLinksPage';
exports.default = AppDownloadLinksPage;
