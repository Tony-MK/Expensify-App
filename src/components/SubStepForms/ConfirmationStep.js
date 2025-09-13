"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function ConfirmationStep({ pageTitle, summaryItems, showOnfidoLinks, onfidoLinksTitle, isLoading, error, onNext, shouldApplySafeAreaPaddingBottom = true }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { paddingBottom: safeAreaInsetPaddingBottom } = (0, useSafeAreaPaddings_1.default)();
    return (<ScrollView_1.default style={styles.flex1} contentContainerStyle={[styles.flexGrow1, shouldApplySafeAreaPaddingBottom && { paddingBottom: safeAreaInsetPaddingBottom + styles.pb5.paddingBottom }]}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{pageTitle}</Text_1.default>
            {summaryItems.map(({ description, title, shouldShowRightIcon, onPress }) => (<MenuItemWithTopDescription_1.default key={`${title}_${description}`} description={description} title={title} shouldShowRightIcon={shouldShowRightIcon} onPress={onPress}/>))}

            {showOnfidoLinks && (<Text_1.default style={[styles.mt3, styles.ph5, styles.textMicroSupporting]}>
                    {onfidoLinksTitle}
                    <TextLink_1.default href={CONST_1.default.ONFIDO_FACIAL_SCAN_POLICY_URL} style={[styles.textMicro]}>
                        {translate('onfidoStep.facialScan')}
                    </TextLink_1.default>
                    {', '}
                    <TextLink_1.default href={CONST_1.default.ONFIDO_PRIVACY_POLICY_URL} style={[styles.textMicro]}>
                        {translate('common.privacy')}
                    </TextLink_1.default>
                    {` ${translate('common.and')} `}
                    <TextLink_1.default href={CONST_1.default.ONFIDO_TERMS_OF_SERVICE_URL} style={[styles.textMicro]}>
                        {translate('common.termsOfService')}
                    </TextLink_1.default>
                </Text_1.default>)}

            <react_native_1.View style={[styles.ph5, styles.mt5, styles.flexGrow1, styles.justifyContentEnd]}>
                {!!error && error.length > 0 && (<DotIndicatorMessage_1.default textStyles={[styles.formError]} type="error" messages={{ error }}/>)}
                <Button_1.default isDisabled={isOffline} success large isLoading={isLoading} style={[styles.w100]} onPress={onNext} text={translate('common.confirm')}/>
            </react_native_1.View>
        </ScrollView_1.default>);
}
ConfirmationStep.displayName = 'ConfirmationStep';
exports.default = ConfirmationStep;
