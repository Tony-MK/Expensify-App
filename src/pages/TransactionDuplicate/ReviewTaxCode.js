"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReviewDuplicatesNavigation_1 = require("@hooks/useReviewDuplicatesNavigation");
const Transaction_1 = require("@libs/actions/Transaction");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReviewDescription_1 = require("./ReviewDescription");
const ReviewFields_1 = require("./ReviewFields");
function ReviewTaxRate() {
    const route = (0, native_1.useRoute)();
    const { translate } = (0, useLocalize_1.default)();
    const [reviewDuplicates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REVIEW_DUPLICATES, { canBeMissing: true });
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reviewDuplicates?.reportID ?? route.params.threadReportID}`, { canBeMissing: true });
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = (0, PolicyUtils_1.getPolicy)(report?.policyID);
    const transactionID = (0, TransactionUtils_1.getTransactionID)(route.params.threadReportID);
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
    const [transactionViolations] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`, {
        canBeMissing: false,
    });
    const allDuplicateIDs = (0, react_1.useMemo)(() => transactionViolations?.find((violation) => violation.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION)?.data?.duplicates ?? [], [transactionViolations]);
    const [allDuplicates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: (allTransactions) => allDuplicateIDs.map((id) => allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${id}`]),
        canBeMissing: true,
    }, [allDuplicateIDs]);
    const compareResult = (0, TransactionUtils_1.compareDuplicateTransactionFields)(transaction, allDuplicates, reviewDuplicates?.reportID);
    const stepNames = Object.keys(compareResult.change ?? {}).map((key, index) => (index + 1).toString());
    const { currentScreenIndex, goBack, navigateToNextScreen } = (0, useReviewDuplicatesNavigation_1.default)(Object.keys(compareResult.change ?? {}), 'taxCode', route.params.threadReportID, route.params.backTo);
    const options = (0, react_1.useMemo)(() => compareResult.change.taxCode?.map((taxID) => !taxID
        ? { text: translate('violations.none'), value: (0, TransactionUtils_1.getDefaultTaxCode)(policy, transaction) ?? '' }
        : {
            text: (0, PolicyUtils_1.getTaxByID)(policy, taxID)?.name ?? '',
            value: taxID,
        }), [compareResult.change.taxCode, policy, transaction, translate]);
    const getTaxAmount = (0, react_1.useCallback)((taxID) => {
        const taxPercentage = (0, TransactionUtils_1.getTaxValue)(policy, transaction, taxID);
        return (0, CurrencyUtils_1.convertToBackendAmount)((0, TransactionUtils_1.calculateTaxAmount)(taxPercentage ?? '', (0, TransactionUtils_1.getAmount)(transaction), transaction?.currency ?? ''));
    }, [policy, transaction]);
    const setTaxCode = (0, react_1.useCallback)((data) => {
        if (data.value !== undefined) {
            (0, Transaction_1.setReviewDuplicatesKey)({ taxCode: data.value, taxAmount: getTaxAmount(data.value) });
        }
        navigateToNextScreen();
    }, [getTaxAmount, navigateToNextScreen]);
    return (<ScreenWrapper_1.default testID={ReviewDescription_1.default.displayName}>
            <HeaderWithBackButton_1.default title={translate('iou.reviewDuplicates')} onBackButtonPress={goBack}/>
            <ReviewFields_1.default stepNames={stepNames} label={translate('violations.taxCodeToKeep')} options={options} index={currentScreenIndex} onSelectRow={setTaxCode}/>
        </ScreenWrapper_1.default>);
}
ReviewTaxRate.displayName = 'ReviewTaxRate';
exports.default = ReviewTaxRate;
