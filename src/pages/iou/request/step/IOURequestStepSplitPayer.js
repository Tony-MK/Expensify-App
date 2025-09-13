"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useScreenWrapperTransitionStatus_1 = require("@hooks/useScreenWrapperTransitionStatus");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepSplitPayer({ route: { params: { iouType, transactionID, action, backTo }, }, transaction, report, }) {
    const { translate } = (0, useLocalize_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const { didScreenTransitionEnd } = (0, useScreenWrapperTransitionStatus_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const currentUserOption = (0, react_1.useMemo)(() => ({
        accountID: currentUserPersonalDetails.accountID,
        searchText: currentUserPersonalDetails.login,
        selected: true,
    }), [currentUserPersonalDetails]);
    const sections = (0, react_1.useMemo)(() => {
        const participants = transaction?.participants ?? [];
        const participantOptions = [currentUserOption, ...participants]?.filter((participant) => !!participant.accountID)?.map((participant) => (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails)) ?? [];
        return [
            {
                title: '',
                data: participantOptions.map((participantOption) => ({
                    ...participantOption,
                    isSelected: !!transaction?.splitPayerAccountIDs && transaction?.splitPayerAccountIDs?.includes(participantOption.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID),
                })),
            },
        ];
    }, [transaction?.participants, personalDetails, transaction?.splitPayerAccountIDs, currentUserOption]);
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const setSplitPayerAction = (item) => {
        (0, IOU_1.setSplitPayer)(transactionID, item.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID);
        navigateBack();
    };
    return (<StepScreenWrapper_1.default headerTitle={translate('moneyRequestConfirmationList.paidBy')} onBackButtonPress={navigateBack} shouldShowNotFoundPage={!(0, IOUUtils_1.isValidMoneyRequestType)(iouType) || (0, ReportUtils_1.isPolicyExpenseChat)(report) || action !== CONST_1.default.IOU.ACTION.CREATE || iouType !== CONST_1.default.IOU.TYPE.SPLIT} shouldShowWrapper testID={IOURequestStepSplitPayer.displayName}>
            <SelectionList_1.default sections={sections} ListItem={UserListItem_1.default} onSelectRow={setSplitPayerAction} shouldSingleExecuteRowSelect showLoadingPlaceholder={!didScreenTransitionEnd}/>
        </StepScreenWrapper_1.default>);
}
IOURequestStepSplitPayer.displayName = 'IOURequestStepSplitPayer';
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepSplitPayerWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepSplitPayer);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepSplitPayerWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepSplitPayerWithWritableReportOrNotFound);
exports.default = IOURequestStepSplitPayerWithFullTransactionOrNotFound;
