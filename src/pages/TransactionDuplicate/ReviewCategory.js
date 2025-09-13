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
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReviewFields_1 = require("./ReviewFields");
function ReviewCategory() {
    const route = (0, native_1.useRoute)();
    const { translate } = (0, useLocalize_1.default)();
    const transactionID = (0, TransactionUtils_1.getTransactionID)(route.params.threadReportID);
    const [reviewDuplicates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REVIEW_DUPLICATES, { canBeMissing: true });
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
    const { currentScreenIndex, goBack, navigateToNextScreen } = (0, useReviewDuplicatesNavigation_1.default)(Object.keys(compareResult.change ?? {}), 'category', route.params.threadReportID, route.params.backTo);
    const options = (0, react_1.useMemo)(() => compareResult.change.category?.map((category) => !category
        ? { text: translate('violations.none'), value: '' }
        : {
            text: category,
            value: category,
        }), [compareResult.change.category, translate]);
    const setCategory = (data) => {
        if (data.value !== undefined) {
            (0, Transaction_1.setReviewDuplicatesKey)({ category: data.value });
        }
        navigateToNextScreen();
    };
    return (<ScreenWrapper_1.default testID={ReviewCategory.displayName}>
            <HeaderWithBackButton_1.default title={translate('iou.reviewDuplicates')} onBackButtonPress={goBack}/>
            <ReviewFields_1.default stepNames={stepNames} label={translate('violations.categoryToKeep')} options={options} index={currentScreenIndex} onSelectRow={setCategory}/>
        </ScreenWrapper_1.default>);
}
ReviewCategory.displayName = 'ReviewCategory';
exports.default = ReviewCategory;
