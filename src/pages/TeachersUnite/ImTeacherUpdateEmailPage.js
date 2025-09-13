"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations = require("@components/Icon/Illustrations");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const ROUTES_1 = require("@src/ROUTES");
function ImTeacherUpdateEmailPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const contactMethodsRoute = `${environmentURL}/${ROUTES_1.default.SETTINGS_CONTACT_METHODS.getRoute(ROUTES_1.default.I_AM_A_TEACHER)}`;
    return (<ScreenWrapper_1.default testID={ImTeacherUpdateEmailPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('teachersUnitePage.iAmATeacher')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <BlockingView_1.default linkTranslationKey="notFound.goBackHome" shouldEmbedLinkWithSubtitle icon={Illustrations.EmailAddress} title={translate('teachersUnitePage.updateYourEmail')} CustomSubtitle={<Text_1.default style={[styles.textAlignCenter]}>
                        <RenderHTML_1.default html={translate('teachersUnitePage.schoolMailAsDefault', { contactMethodsRoute })}/>
                    </Text_1.default>} iconWidth={variables_1.default.signInLogoWidthLargeScreen} iconHeight={variables_1.default.signInLogoHeightLargeScreen}/>
            <FixedFooter_1.default style={[styles.flexGrow0]}>
                <Button_1.default success large accessibilityLabel={translate('teachersUnitePage.updateEmail')} text={translate('teachersUnitePage.updateEmail')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONTACT_METHODS.getRoute(Navigation_1.default.getActiveRouteWithoutParams()))}/>
            </FixedFooter_1.default>
        </ScreenWrapper_1.default>);
}
ImTeacherUpdateEmailPage.displayName = 'ImTeacherUpdateEmailPage';
exports.default = ImTeacherUpdateEmailPage;
