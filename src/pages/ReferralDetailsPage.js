"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ContextMenuItem_1 = require("@components/ContextMenuItem");
const HeaderPageLayout_1 = require("@components/HeaderPageLayout");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations_1 = require("@components/Icon/Illustrations");
const MenuItem_1 = require("@components/MenuItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSingleExecution_1 = require("@hooks/useSingleExecution");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
const Clipboard_1 = require("@libs/Clipboard");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const ReportActionContextMenu_1 = require("./home/report/ContextMenu/ReportActionContextMenu");
function ReferralDetailsPage({ route }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT);
    const popoverAnchor = (0, react_1.useRef)(null);
    const { isExecuting, singleExecution } = (0, useSingleExecution_1.default)();
    let { contentType } = route.params;
    const { backTo } = route.params;
    if (!Object.values(CONST_1.default.REFERRAL_PROGRAM.CONTENT_TYPES).includes(contentType)) {
        contentType = CONST_1.default.REFERRAL_PROGRAM.CONTENT_TYPES.REFER_FRIEND;
    }
    const contentHeader = translate(`referralProgram.${contentType}.header`);
    const contentBody = translate(`referralProgram.${contentType}.body`);
    const isShareCode = contentType === CONST_1.default.REFERRAL_PROGRAM.CONTENT_TYPES.SHARE_CODE;
    const shouldShowClipboard = contentType === CONST_1.default.REFERRAL_PROGRAM.CONTENT_TYPES.REFER_FRIEND || isShareCode;
    const referralLink = `${CONST_1.default.REFERRAL_PROGRAM.LINK}${account?.primaryLogin ? `/?thanks=${account.primaryLogin}` : ''}`;
    return (<HeaderPageLayout_1.default title={translate('common.referral')} headerContent={<Icon_1.default src={Illustrations_1.PaymentHands} width={589} height={232}/>} headerContainerStyles={[styles.staticHeaderImage, styles.justifyContentEnd]} backgroundColor={theme.PAGE_THEMES[SCREENS_1.default.REFERRAL_DETAILS].backgroundColor} testID={ReferralDetailsPage.displayName} onBackButtonPress={() => {
            if (backTo) {
                Navigation_1.default.goBack(backTo);
                return;
            }
            Navigation_1.default.goBack();
        }}>
            <Text_1.default style={[styles.textHeadline, styles.mb2, styles.ph5]}>{contentHeader}</Text_1.default>
            <Text_1.default style={[styles.webViewStyles.baseFontStyle, styles.ml0, styles.mb5, styles.ph5]}>{contentBody}</Text_1.default>

            {shouldShowClipboard && (<ContextMenuItem_1.default isAnonymousAction text={translate('referralProgram.copyReferralLink')} icon={Expensicons.Copy} successIcon={Expensicons.Checkmark} successText={translate('qrCodes.copied')} onPress={() => Clipboard_1.default.setString(referralLink)}/>)}

            <MenuItem_1.default wrapperStyle={styles.mb4} ref={popoverAnchor} title={translate('requestorStep.learnMore')} icon={Expensicons.QuestionMark} shouldShowRightIcon iconRight={Expensicons.NewWindow} disabled={isExecuting} shouldBlockSelection onPress={singleExecution(() => (0, Link_1.openExternalLink)(CONST_1.default.REFERRAL_PROGRAM.LEARN_MORE_LINK))} onSecondaryInteraction={(e) => (0, ReportActionContextMenu_1.showContextMenu)({
            type: CONST_1.default.CONTEXT_MENU_TYPES.LINK,
            event: e,
            selection: CONST_1.default.REFERRAL_PROGRAM.LEARN_MORE_LINK,
            contextMenuAnchor: popoverAnchor.current,
        })}/>
        </HeaderPageLayout_1.default>);
}
ReferralDetailsPage.displayName = 'ReferralDetailsPage';
exports.default = ReferralDetailsPage;
