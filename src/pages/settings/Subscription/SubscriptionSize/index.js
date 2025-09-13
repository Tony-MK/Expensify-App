"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useSubStep_1 = require("@hooks/useSubStep");
const FormActions_1 = require("@libs/actions/FormActions");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Subscription_1 = require("@userActions/Subscription");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SubscriptionSizeForm_1 = require("@src/types/form/SubscriptionSizeForm");
const Confirmation_1 = require("./substeps/Confirmation");
const Size_1 = require("./substeps/Size");
const bodyContent = [Size_1.default, Confirmation_1.default];
function SubscriptionSizePage({ route }) {
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const [subscriptionSizeFormDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SUBSCRIPTION_SIZE_FORM_DRAFT, { canBeMissing: false });
    const { translate } = (0, useLocalize_1.default)();
    const canChangeSubscriptionSize = !!(route.params?.canChangeSize ?? 1);
    const startFrom = canChangeSubscriptionSize ? 0 : 1;
    const onFinished = () => {
        (0, Subscription_1.updateSubscriptionSize)(subscriptionSizeFormDraft ? Number(subscriptionSizeFormDraft[SubscriptionSizeForm_1.default.SUBSCRIPTION_SIZE]) : 0, privateSubscription?.userCount ?? 0);
        Navigation_1.default.goBack();
    };
    const { componentToRender: SubStep, screenIndex, nextScreen, prevScreen, moveTo } = (0, useSubStep_1.default)({ bodyContent, startFrom, onFinished });
    const onBackButtonPress = () => {
        if (screenIndex !== 0 && startFrom === 0) {
            prevScreen();
            return;
        }
        Navigation_1.default.goBack();
    };
    (0, react_1.useEffect)(() => () => {
        (0, FormActions_1.clearDraftValues)(ONYXKEYS_1.default.FORMS.SUBSCRIPTION_SIZE_FORM);
    }, []);
    return (<ScreenWrapper_1.default testID={SubscriptionSizePage.displayName} includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight shouldShowOfflineIndicatorInWideScreen>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={translate('subscription.subscriptionSize.title')} onBackButtonPress={onBackButtonPress}/>
                <SubStep isEditing={canChangeSubscriptionSize} onNext={nextScreen} onMove={moveTo}/>
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
SubscriptionSizePage.displayName = 'SubscriptionSizePage';
exports.default = SubscriptionSizePage;
