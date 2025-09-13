"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const ImageSVG_1 = require("@components/ImageSVG");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
function ReportVirtualCardFraudConfirmationPage({ route: { params: { cardID = '' }, }, }) {
    const themeStyles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const close = (0, react_1.useCallback)(() => {
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET_DOMAIN_CARD.getRoute(cardID));
    }, [cardID]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom includePaddingTop shouldEnableMaxHeight testID={ReportVirtualCardFraudConfirmationPage.displayName} offlineIndicatorStyle={themeStyles.mtAuto}>
            <HeaderWithBackButton_1.default title={translate('reportFraudConfirmationPage.title')} onBackButtonPress={close}/>

            <react_native_1.View style={[themeStyles.ph5, themeStyles.mt3, themeStyles.mb5, themeStyles.flex1]}>
                <react_native_1.View style={[themeStyles.justifyContentCenter, themeStyles.flex1]}>
                    <ImageSVG_1.default contentFit="contain" src={Expensicons.MagnifyingGlassSpyMouthClosed} style={themeStyles.alignSelfCenter} width={184} height={290}/>

                    <Text_1.default style={[themeStyles.textHeadlineH1, themeStyles.alignSelfCenter, themeStyles.mt5]}>{translate('reportFraudConfirmationPage.title')}</Text_1.default>
                    <Text_1.default style={[themeStyles.textSupporting, themeStyles.alignSelfCenter, themeStyles.mt2, themeStyles.textAlignCenter]}>
                        {translate('reportFraudConfirmationPage.description')}
                    </Text_1.default>
                </react_native_1.View>

                <Button_1.default text={translate('reportFraudConfirmationPage.buttonText')} onPress={close} style={themeStyles.justifyContentEnd} success large/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
ReportVirtualCardFraudConfirmationPage.displayName = 'ReportVirtualCardFraudConfirmationPage';
exports.default = ReportVirtualCardFraudConfirmationPage;
