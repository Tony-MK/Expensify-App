"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Policy_1 = require("@src/libs/actions/Policy/Policy");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function PayAndDowngradePage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [billingDetails, metadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BILLING_RECEIPT_DETAILS, { canBeMissing: true });
    const prevIsLoading = (0, usePrevious_1.default)(billingDetails?.isLoading);
    const errorMessage = billingDetails?.errors;
    const items = (0, react_1.useMemo)(() => {
        if ((0, EmptyObject_1.isEmptyObject)(billingDetails)) {
            return [];
        }
        const results = [...billingDetails.receiptsWithoutDiscount, ...billingDetails.discounts].map((item) => {
            return {
                key: item.description,
                value: item.formattedAmount,
                isTotal: false,
            };
        });
        results.push({
            key: translate('common.total'),
            value: billingDetails.formattedSubtotal,
            isTotal: true,
        });
        return results;
    }, [billingDetails, translate]);
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (billingDetails?.isLoading || !prevIsLoading || billingDetails?.errors) {
            return;
        }
        Navigation_1.default.dismissModal();
    }, [billingDetails?.isLoading, prevIsLoading, billingDetails?.errors]);
    (0, react_1.useEffect)(() => {
        (0, Policy_1.clearBillingReceiptDetailsErrors)();
    }, []);
    if ((0, isLoadingOnyxValue_1.default)(metadata)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default shouldShowOfflineIndicator testID="PayAndDowngradePage" offlineIndicatorStyle={styles.mtAuto}>
            <FullPageNotFoundView_1.default shouldShow={(0, EmptyObject_1.isEmptyObject)(billingDetails)}>
                <HeaderWithBackButton_1.default title={translate('workspace.payAndDowngrade.title')}/>
                <FullPageOfflineBlockingView_1.default>
                    <ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.ph5, styles.pt3]}>
                        <Text_1.default style={[styles.textHeadlineH1, styles.mb5]}>{translate('workspace.payAndDowngrade.headline')}</Text_1.default>
                        <react_native_1.View style={[styles.renderHTML]}>
                            <RenderHTML_1.default html={translate('workspace.payAndDowngrade.description1', {
            formattedAmount: billingDetails?.formattedSubtotal ?? '',
        })}/>
                        </react_native_1.View>
                        <Text_1.default style={[styles.mb5]}>
                            {translate('workspace.payAndDowngrade.description2', {
            date: billingDetails?.billingMonth ?? '',
        })}
                        </Text_1.default>

                        <react_native_1.View style={[styles.borderedContentCard, styles.ph5, styles.pv2, styles.mb5]}>
                            {items.map((item) => (<react_native_1.View key={item.key} style={[styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter, styles.gap8, styles.pv3, !item.isTotal ? styles.borderBottom : undefined]}>
                                    {!item.isTotal ? <RenderHTML_1.default html={item.key}/> : <Text_1.default style={styles.textBold}>{item.key}</Text_1.default>}
                                    <Text_1.default style={item.isTotal ? styles.textBold : undefined}>{item.value}</Text_1.default>
                                </react_native_1.View>))}
                        </react_native_1.View>
                        <Text_1.default style={[styles.textLabelSupportingNormal]}>{translate('workspace.payAndDowngrade.subscription')}</Text_1.default>
                    </ScrollView_1.default>
                    <FixedFooter_1.default style={[styles.mtAuto, styles.pt5]}>
                        {!!errorMessage && (<react_native_1.View style={[styles.mb3]}>
                                <FormHelpMessage_1.default isError message={errorMessage}/>
                            </react_native_1.View>)}
                        <Button_1.default large danger text={translate('workspace.payAndDowngrade.title')} onPress={Policy_1.payAndDowngrade} pressOnEnter isLoading={billingDetails?.isLoading}/>
                    </FixedFooter_1.default>
                </FullPageOfflineBlockingView_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
exports.default = PayAndDowngradePage;
