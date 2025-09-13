"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Badge_1 = require("@components/Badge");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceOwnerRestrictedAction() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const addPaymentCard = () => {
        Navigation_1.default.closeRHPFlow();
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_ADD_PAYMENT_CARD);
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={WorkspaceOwnerRestrictedAction.displayName}>
            <HeaderWithBackButton_1.default title={translate('workspace.restrictedAction.restricted')} onBackButtonPress={Navigation_1.default.goBack}/>
            <ScrollView_1.default contentContainerStyle={[styles.ph5, styles.pt3]}>
                <react_native_1.View style={[styles.cardSectionContainer, styles.p5, styles.mb0, styles.mh0]}>
                    <react_native_1.View style={[styles.flexRow, styles.justifyContentBetween, styles.alignItemsStart, styles.mb3]}>
                        <Icon_1.default src={Illustrations.LockClosedOrange} height={variables_1.default.iconHeader} width={variables_1.default.iconHeader}/>
                        <Badge_1.default icon={Expensicons.Unlock} success text={translate('workspace.restrictedAction.addPaymentCardToUnlock')} badgeStyles={styles.alignSelfStart}/>
                    </react_native_1.View>
                    <Text_1.default style={[styles.textHeadlineH1, styles.mb4]}>{translate('workspace.restrictedAction.addPaymentCardToContinueUsingWorkspace')}</Text_1.default>
                    <Text_1.default style={[styles.textLabelSupportingEmptyValue, styles.mb5]}>{translate('workspace.restrictedAction.youWillNeedToAddOrUpdatePaymentCard')}</Text_1.default>
                    <Button_1.default text={translate('workspace.restrictedAction.addPaymentCard')} onPress={addPaymentCard} success large/>
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
WorkspaceOwnerRestrictedAction.displayName = 'WorkspaceOwnerRestrictedAction';
exports.default = WorkspaceOwnerRestrictedAction;
