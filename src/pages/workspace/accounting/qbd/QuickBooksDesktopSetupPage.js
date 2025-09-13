"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const laptop_with_second_screen_sync_svg_1 = require("@assets/images/laptop-with-second-screen-sync.svg");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const Button_1 = require("@components/Button");
const CopyTextToClipboard_1 = require("@components/CopyTextToClipboard");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Illustrations = require("@components/Icon/Illustrations");
const ImageSVG_1 = require("@components/ImageSVG");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const connections_1 = require("@userActions/connections");
const QuickbooksDesktop_1 = require("@userActions/connections/QuickbooksDesktop");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function RequireQuickBooksDesktopModal({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const policyID = route.params.policyID;
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const [codatSetupLink, setCodatSetupLink] = (0, react_1.useState)('');
    const hasResultOfFetchingSetupLink = !!codatSetupLink || hasError;
    const ContentWrapper = hasResultOfFetchingSetupLink
        ? ({ children }) => children
        : ({ children }) => <FullPageOfflineBlockingView_1.default addBottomSafeAreaPadding>{children}</FullPageOfflineBlockingView_1.default>;
    const fetchSetupLink = (0, react_1.useCallback)(() => {
        setHasError(false);
        // eslint-disable-next-line rulesdir/no-thenable-actions-in-views
        (0, QuickbooksDesktop_1.getQuickbooksDesktopCodatSetupLink)(policyID).then((response) => {
            if (!response?.jsonCode) {
                return;
            }
            if (response.jsonCode === CONST_1.default.JSON_CODE.SUCCESS) {
                setCodatSetupLink(String(response?.setupUrl ?? ''));
            }
            else {
                (0, connections_1.setConnectionError)(policyID, CONST_1.default.POLICY.CONNECTIONS.NAME.QBD, translate('workspace.qbd.setupPage.setupErrorTitle'));
                setHasError(true);
            }
        });
    }, [policyID, translate]);
    (0, react_1.useEffect)(() => {
        // Since QBD doesn't support Taxes, we should disable them from the LHN when connecting to QBD
        (0, Policy_1.enablePolicyTaxes)(policyID, false);
        fetchSetupLink();
        // disabling this rule, as we want this to run only on the first render
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    (0, useNetwork_1.default)({
        onReconnect: () => {
            if (hasResultOfFetchingSetupLink) {
                return;
            }
            fetchSetupLink();
        },
    });
    const shouldShowError = hasError;
    return (<ScreenWrapper_1.default shouldEnablePickerAvoiding={false} shouldShowOfflineIndicatorInWideScreen testID={RequireQuickBooksDesktopModal.displayName}>
            <HeaderWithBackButton_1.default title={translate('workspace.qbd.qbdSetup')} shouldShowBackButton onBackButtonPress={() => Navigation_1.default.dismissModal()}/>
            <ContentWrapper>
                {shouldShowError && (<react_native_1.View style={[styles.flex1, styles.justifyContentCenter, styles.alignItemsCenter, styles.ph5, styles.mb9]}>
                        <Icon_1.default src={Illustrations.BrokenMagnifyingGlass} width={116} height={168}/>
                        <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mt3]}>{translate('workspace.qbd.setupPage.setupErrorTitle')}</Text_1.default>
                        <react_native_1.View style={[styles.renderHTML, styles.ph5, styles.mv3]}>
                            <RenderHTML_1.default html={translate('workspace.qbd.setupPage.setupErrorBody', { conciergeLink: `${environmentURL}/${ROUTES_1.default.CONCIERGE}` })}/>
                        </react_native_1.View>
                    </react_native_1.View>)}
                {!shouldShowError && (<react_native_1.View style={[styles.flex1, styles.ph5]}>
                        <react_native_1.View style={[styles.alignSelfCenter, styles.computerIllustrationContainer, styles.pv6]}>
                            <ImageSVG_1.default src={laptop_with_second_screen_sync_svg_1.default}/>
                        </react_native_1.View>

                        <Text_1.default style={[styles.textHeadlineH1, styles.pt5]}>{translate('workspace.qbd.setupPage.title')}</Text_1.default>
                        <Text_1.default style={[styles.textSupporting, styles.textNormal, styles.pt4]}>{translate('workspace.qbd.setupPage.body')}</Text_1.default>
                        <react_native_1.View style={[styles.qbdSetupLinkBox, styles.mt5]}>
                            {!hasResultOfFetchingSetupLink ? (<react_native_1.ActivityIndicator color={theme.spinner} size="small"/>) : (<CopyTextToClipboard_1.default text={codatSetupLink} textStyles={[styles.textSupporting]}/>)}
                        </react_native_1.View>
                        <FixedFooter_1.default style={[styles.mtAuto, styles.ph0]} addBottomSafeAreaPadding>
                            <Button_1.default success text={translate('common.done')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_TRIGGER_FIRST_SYNC.getRoute(policyID))} pressOnEnter large/>
                        </FixedFooter_1.default>
                    </react_native_1.View>)}
            </ContentWrapper>
        </ScreenWrapper_1.default>);
}
RequireQuickBooksDesktopModal.displayName = 'RequireQuickBooksDesktopModal';
exports.default = RequireQuickBooksDesktopModal;
