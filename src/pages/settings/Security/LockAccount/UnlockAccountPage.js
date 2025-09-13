"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
function UnlockAccountPage() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<ScreenWrapper_1.default testID={UnlockAccountPage.displayName} includeSafeAreaPaddingBottom>
            <HeaderWithBackButton_1.default onBackButtonPress={() => Navigation_1.default.dismissModal()} title={translate('unlockAccountPage.accountLocked')}/>
            <ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
                <ConfirmationPage_1.default illustration={Expensicons.EmptyStateSpyPigeon} heading={translate('unlockAccountPage.yourAccountIsLocked')} description={translate('unlockAccountPage.chatToConciergeToUnlock')} shouldShowButton descriptionStyle={styles.colorMuted} buttonText={translate('unlockAccountPage.chatWithConcierge')} onButtonPress={() => Navigation_1.default.navigate(ROUTES_1.default.CONCIERGE)} containerStyle={styles.h100}/>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
UnlockAccountPage.displayName = 'UnlockAccountPage';
exports.default = UnlockAccountPage;
