"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const Illustrations_1 = require("@components/Icon/Illustrations");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PolicyUtils_1 = require("@libs/PolicyUtils");
function DowngradeConfirmation({ onConfirmDowngrade, policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const hasOtherControlWorkspaces = (0, PolicyUtils_1.hasOtherControlWorkspaces)(policyID);
    return (<ConfirmationPage_1.default heading={translate('workspace.downgrade.completed.headline')} description={hasOtherControlWorkspaces ? translate('workspace.downgrade.completed.description') : undefined} illustration={Illustrations_1.MushroomTopHat} shouldShowButton onButtonPress={onConfirmDowngrade} buttonText={translate('workspace.downgrade.completed.gotIt')} containerStyle={styles.h100}/>);
}
exports.default = DowngradeConfirmation;
