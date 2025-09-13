"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const SubscriptionPlanDowngradeBlocked_1 = require("@components/SubscriptionPlanDowngradeBlocked");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const utils_1 = require("@pages/settings/Subscription/utils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SubscriptionSizeForm_1 = require("@src/types/form/SubscriptionSizeForm");
function Confirmation({ onNext, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const [subscriptionSizeFormDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SUBSCRIPTION_SIZE_FORM_DRAFT, { canBeMissing: true });
    const subscriptionRenewalDate = (0, utils_1.getNewSubscriptionRenewalDate)();
    const subscriptionSizeDraft = subscriptionSizeFormDraft ? Number(subscriptionSizeFormDraft[SubscriptionSizeForm_1.default.SUBSCRIPTION_SIZE]) : 0;
    const subscriptionSize = subscriptionSizeDraft || (privateSubscription?.userCount ?? 0);
    const isTryingToIncreaseSubscriptionSize = subscriptionSizeDraft > (privateSubscription?.userCount ?? 0);
    const canChangeSubscriptionSize = (account?.canDowngrade ?? false) || (isTryingToIncreaseSubscriptionSize && isEditing);
    const formattedSubscriptionEndDate = (0, utils_1.formatSubscriptionEndDate)(privateSubscription?.endDate);
    const onClosePress = () => {
        Navigation_1.default.goBack();
    };
    if (!canChangeSubscriptionSize) {
        return (<SubscriptionPlanDowngradeBlocked_1.default privateSubscription={privateSubscription} formattedSubscriptionEndDate={formattedSubscriptionEndDate} onClosePress={onClosePress}/>);
    }
    return (<react_native_1.View style={[styles.flexGrow1]}>
            <Text_1.default style={[styles.ph5, styles.pb3]}>{translate('subscription.subscriptionSize.confirmDetails')}</Text_1.default>
            <MenuItemWithTopDescription_1.default interactive={false} description={translate('subscription.subscriptionSize.subscriptionSize')} title={translate('subscription.subscriptionSize.activeMembers', { size: subscriptionSize })}/>
            <MenuItemWithTopDescription_1.default interactive={false} description={translate('subscription.subscriptionSize.subscriptionRenews')} title={subscriptionRenewalDate}/>
            <FixedFooter_1.default style={[styles.mtAuto]}>
                <Button_1.default success large onPress={onNext} text={translate('common.save')}/>
            </FixedFooter_1.default>
        </react_native_1.View>);
}
Confirmation.displayName = 'ConfirmationStep';
exports.default = Confirmation;
