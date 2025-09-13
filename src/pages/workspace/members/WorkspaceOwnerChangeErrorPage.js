"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Member_1 = require("@userActions/Policy/Member");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceOwnerChangeErrorPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const accountID = Number(route.params.accountID) ?? -1;
    const policyID = route.params.policyID;
    const backTo = route.params.backTo;
    const closePage = (0, react_1.useCallback)(() => {
        (0, Member_1.clearWorkspaceOwnerChangeFlow)(policyID);
        if (backTo) {
            Navigation_1.default.goBack(backTo);
        }
        else {
            Navigation_1.default.goBack();
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MEMBER_DETAILS.getRoute(policyID, accountID));
        }
    }, [accountID, backTo, policyID]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID}>
            <ScreenWrapper_1.default testID={WorkspaceOwnerChangeErrorPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
                <HeaderWithBackButton_1.default title={translate('workspace.changeOwner.changeOwnerPageTitle')} onBackButtonPress={closePage}/>
                <react_native_1.View style={[styles.screenCenteredContainer, styles.alignItemsCenter]}>
                    <Icon_1.default src={Expensicons.MoneyWaving} width={187} height={173} fill="" additionalStyles={styles.mb3}/>
                    <Text_1.default style={[styles.textHeadline, styles.textAlignCenter, styles.mv2]}>{translate('workspace.changeOwner.errorTitle')}</Text_1.default>
                    <react_native_1.View style={[styles.renderHTML, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('workspace.changeOwner.errorDescription')}/>
                    </react_native_1.View>
                </react_native_1.View>
                <FixedFooter_1.default addBottomSafeAreaPadding>
                    <Button_1.default success large text={translate('common.buttonConfirm')} style={styles.mt6} pressOnEnter onPress={closePage}/>
                </FixedFooter_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceOwnerChangeErrorPage.displayName = 'WorkspaceOwnerChangeErrorPage';
exports.default = WorkspaceOwnerChangeErrorPage;
