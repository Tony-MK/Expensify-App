"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CollapsibleSection_1 = require("@components/CollapsibleSection");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils = require("@libs/CurrencyUtils");
const CONST_1 = require("@src/CONST");
function LongTermsForm() {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate, numberFormat } = (0, useLocalize_1.default)();
    const termsData = [
        {
            title: translate('termsStep.longTermsForm.openingAccountTitle'),
            rightText: CurrencyUtils.convertToDisplayString(0, 'USD'),
            details: translate('termsStep.longTermsForm.openingAccountDetails'),
        },
        {
            title: translate('termsStep.monthlyFee'),
            rightText: CurrencyUtils.convertToDisplayString(0, 'USD'),
            details: translate('termsStep.longTermsForm.monthlyFeeDetails'),
        },
        {
            title: translate('termsStep.longTermsForm.customerServiceTitle'),
            subTitle: translate('termsStep.longTermsForm.automated'),
            rightText: CurrencyUtils.convertToDisplayString(0, 'USD'),
            details: translate('termsStep.longTermsForm.customerServiceDetails'),
        },
        {
            title: translate('termsStep.longTermsForm.customerServiceTitle'),
            subTitle: translate('termsStep.longTermsForm.liveAgent'),
            rightText: CurrencyUtils.convertToDisplayString(0, 'USD'),
            details: translate('termsStep.longTermsForm.customerServiceDetails'),
        },
        {
            title: translate('termsStep.inactivity'),
            rightText: CurrencyUtils.convertToDisplayString(0, 'USD'),
            details: translate('termsStep.longTermsForm.inactivityDetails'),
        },
        {
            title: translate('termsStep.longTermsForm.sendingFundsTitle'),
            rightText: CurrencyUtils.convertToDisplayString(0, 'USD'),
            details: translate('termsStep.longTermsForm.sendingFundsDetails'),
        },
        {
            title: translate('termsStep.electronicFundsWithdrawal'),
            subTitle: translate('termsStep.standard'),
            rightText: CurrencyUtils.convertToDisplayString(0, 'USD'),
            details: translate('termsStep.longTermsForm.electronicFundsStandardDetails'),
        },
        {
            title: translate('termsStep.electronicFundsWithdrawal'),
            subTitle: translate('termsStep.longTermsForm.instant'),
            rightText: `${numberFormat(1.5)}%`,
            subRightText: translate('termsStep.longTermsForm.electronicFundsInstantFeeMin', { amount: CurrencyUtils.convertToDisplayString(25, 'USD') }),
            details: translate('termsStep.longTermsForm.electronicFundsInstantDetails', { percentage: numberFormat(1.5), amount: CurrencyUtils.convertToDisplayString(25, 'USD') }),
        },
    ];
    const getLongTermsSections = () => termsData.map((section, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <react_native_1.View key={section.title + index}>
                <react_native_1.View style={[styles.longTermsRow]}>
                    <react_native_1.View style={[styles.flex4]}>
                        <Text_1.default>{section.title}</Text_1.default>
                        {!!section.subTitle && <Text_1.default style={[styles.textMicroSupporting, styles.mt1]}>{section.subTitle}</Text_1.default>}
                    </react_native_1.View>
                    <react_native_1.View style={[styles.flex1, styles.termsCenterRight]}>
                        <Text_1.default style={[styles.textStrong, styles.textAlignRight]}>{section.rightText}</Text_1.default>
                        {!!section.subRightText && <Text_1.default style={[styles.textMicroSupporting, styles.mt1, styles.textAlignRight]}>{section.subRightText}</Text_1.default>}
                    </react_native_1.View>
                </react_native_1.View>
                <Text_1.default style={[styles.textLabelSupporting, styles.mt2]}>{section.details}</Text_1.default>
            </react_native_1.View>));
    return (<>
            <CollapsibleSection_1.default title={translate('termsStep.longTermsForm.listOfAllFees')} shouldShowSectionBorder>
                {getLongTermsSections()}
            </CollapsibleSection_1.default>

            <Text_1.default style={[styles.mb4, styles.mt6, styles.textMicroSupporting]}>
                {translate('termsStep.longTermsForm.fdicInsuranceBancorp', { amount: CurrencyUtils.convertToDisplayString(25000000, 'USD') })} {CONST_1.default.TERMS.FDIC_PREPAID}{' '}
                {translate('termsStep.longTermsForm.fdicInsuranceBancorp2')}
            </Text_1.default>
            <Text_1.default style={[styles.mb4, styles.textMicroSupporting]}>{translate('termsStep.noOverdraftOrCredit')}</Text_1.default>
            <Text_1.default style={[styles.mb4, styles.textMicroSupporting]}>
                {translate('termsStep.longTermsForm.contactExpensifyPayments')} {CONST_1.default.EMAIL.CONCIERGE} {translate('termsStep.longTermsForm.contactExpensifyPayments2')}{' '}
                {CONST_1.default.NEW_EXPENSIFY_URL}.
            </Text_1.default>
            <Text_1.default style={[styles.mb6, styles.textMicroSupporting]}>
                {translate('termsStep.longTermsForm.generalInformation')} {CONST_1.default.TERMS.CFPB_PREPAID}
                {'. '}
                {translate('termsStep.longTermsForm.generalInformation2')} {CONST_1.default.TERMS.CFPB_COMPLAINT}.
            </Text_1.default>

            <react_native_1.View style={styles.flexRow}>
                <Icon_1.default fill={theme.icon} src={Expensicons.Printer}/>
                <TextLink_1.default style={styles.ml1} href={CONST_1.default.FEES_URL}>
                    {translate('termsStep.longTermsForm.printerFriendlyView')}
                </TextLink_1.default>
            </react_native_1.View>
        </>);
}
LongTermsForm.displayName = 'LongTermsForm';
exports.default = LongTermsForm;
