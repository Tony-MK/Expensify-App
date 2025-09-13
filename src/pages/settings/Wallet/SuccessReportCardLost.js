"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const Illustrations_1 = require("@components/Icon/Illustrations");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
function SuccessReportCardLost({ cardID }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    return (<ConfirmationPage_1.default heading={translate('reportCardLostOrDamaged.successTitle')} description={translate('reportCardLostOrDamaged.successDescription')} illustration={Illustrations_1.CardReplacementSuccess} shouldShowButton onButtonPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET_DOMAIN_CARD.getRoute(cardID));
        }} buttonText={translate('common.buttonConfirm')} containerStyle={styles.h100} illustrationStyle={[styles.w100, StyleUtils.getSuccessReportCardLostIllustrationStyle()]} innerContainerStyle={styles.ph0} descriptionStyle={[styles.ph4, styles.textSupporting]}/>);
}
SuccessReportCardLost.displayName = 'SuccessReportCardLost';
exports.default = SuccessReportCardLost;
