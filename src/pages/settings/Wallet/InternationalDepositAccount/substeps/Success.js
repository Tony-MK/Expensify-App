"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function Confirmation({ onNext }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
            <ConfirmationPage_1.default heading={translate('addPersonalBankAccountPage.successTitle')} description={translate('addPersonalBankAccountPage.successMessage')} shouldShowButton buttonText={translate('common.continue')} onButtonPress={onNext} containerStyle={styles.h100}/>
        </ScrollView_1.default>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
