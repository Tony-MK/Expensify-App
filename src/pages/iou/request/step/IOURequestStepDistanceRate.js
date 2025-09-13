"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useShowNotFoundPageInIOUStep_1 = require("@hooks/useShowNotFoundPageInIOUStep");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOU_1 = require("@libs/actions/IOU");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepDistanceRate({ report, reportDraft, route: { params: { action, reportID, backTo, transactionID, iouType, reportActionID }, }, transaction, }) {
    const [policyDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_DRAFTS}${(0, IOU_1.getIOURequestPolicyID)(transaction, reportDraft)}`, { canBeMissing: true });
    /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
    const [policyReal] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`, { canBeMissing: true });
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${report?.policyID}`, { canBeMissing: true });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${report?.policyID}`, { canBeMissing: true });
    /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
    const policy = policyReal ?? policyDraft;
    const styles = (0, useThemeStyles_1.default)();
    const { translate, toLocaleDigit } = (0, useLocalize_1.default)();
    const isDistanceRequest = (0, TransactionUtils_1.isDistanceRequest)(transaction);
    const isPolicyExpenseChat = (0, ReportUtils_1.isReportInGroupPolicy)(report);
    const shouldShowTax = (0, PolicyUtils_1.isTaxTrackingEnabled)(isPolicyExpenseChat, policy, isDistanceRequest);
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const currentRateID = (0, TransactionUtils_1.getRateID)(transaction);
    const transactionCurrency = (0, TransactionUtils_1.getCurrency)(transaction);
    const rates = DistanceRequestUtils_1.default.getMileageRates(policy, false, currentRateID);
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const sections = Object.values(rates).map((rate) => {
        const unit = transaction?.comment?.customUnit?.customUnitRateID === rate.customUnitRateID ? DistanceRequestUtils_1.default.getDistanceUnit(transaction, rate) : rate.unit;
        const isSelected = currentRateID ? currentRateID === rate.customUnitRateID : DistanceRequestUtils_1.default.getDefaultMileageRate(policy)?.customUnitRateID === rate.customUnitRateID;
        const rateForDisplay = DistanceRequestUtils_1.default.getRateForDisplay(unit, rate.rate, isSelected ? transactionCurrency : rate.currency, translate, toLocaleDigit);
        return {
            text: rate.name ?? rateForDisplay,
            alternateText: rate.name ? rateForDisplay : '',
            keyForList: rate.customUnitRateID,
            value: rate.customUnitRateID,
            isDisabled: !rate.enabled,
            isSelected,
        };
    });
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, useShowNotFoundPageInIOUStep_1.default)(action, iouType, reportActionID, report, transaction);
    const initiallyFocusedOption = sections.find((item) => item.isSelected)?.keyForList;
    function selectDistanceRate(customUnitRateID) {
        let taxAmount;
        let taxRateExternalID;
        if (shouldShowTax) {
            const policyCustomUnitRate = (0, PolicyUtils_1.getDistanceRateCustomUnitRate)(policy, customUnitRateID);
            taxRateExternalID = policyCustomUnitRate?.attributes?.taxRateExternalID;
            const unit = DistanceRequestUtils_1.default.getDistanceUnit(transaction, rates[customUnitRateID]);
            const taxableAmount = DistanceRequestUtils_1.default.getTaxableAmount(policy, customUnitRateID, (0, TransactionUtils_1.getDistanceInMeters)(transaction, unit));
            const taxPercentage = taxRateExternalID ? (0, TransactionUtils_1.getTaxValue)(policy, transaction, taxRateExternalID) : undefined;
            taxAmount = (0, CurrencyUtils_1.convertToBackendAmount)((0, TransactionUtils_1.calculateTaxAmount)(taxPercentage, taxableAmount, rates[customUnitRateID].currency ?? CONST_1.default.CURRENCY.USD));
            (0, IOU_1.setMoneyRequestTaxAmount)(transactionID, taxAmount);
            (0, IOU_1.setMoneyRequestTaxRate)(transactionID, taxRateExternalID ?? null);
        }
        if (currentRateID !== customUnitRateID) {
            (0, IOU_1.setMoneyRequestDistanceRate)(transactionID, customUnitRateID, policy, (0, IOUUtils_1.shouldUseTransactionDraft)(action));
            if (isEditing && transaction?.transactionID) {
                (0, IOU_1.updateMoneyRequestDistanceRate)(transaction.transactionID, reportID, customUnitRateID, policy, policyTags, policyCategories, taxAmount, taxRateExternalID);
            }
        }
        navigateBack();
    }
    return (<StepScreenWrapper_1.default headerTitle={translate('common.rate')} onBackButtonPress={navigateBack} shouldShowWrapper testID={IOURequestStepDistanceRate.displayName} shouldShowNotFoundPage={shouldShowNotFoundPage}>
            <Text_1.default style={[styles.mh5, styles.mv4]}>{translate('iou.chooseARate')}</Text_1.default>

            <SelectionList_1.default sections={[{ data: sections }]} ListItem={RadioListItem_1.default} onSelectRow={({ value }) => selectDistanceRate(value ?? '')} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={initiallyFocusedOption}/>
        </StepScreenWrapper_1.default>);
}
IOURequestStepDistanceRate.displayName = 'IOURequestStepDistanceRate';
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepDistanceRateWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepDistanceRate);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepDistanceRateWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepDistanceRateWithWritableReportOrNotFound);
exports.default = IOURequestStepDistanceRateWithFullTransactionOrNotFound;
