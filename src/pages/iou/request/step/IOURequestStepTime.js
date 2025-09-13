"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const DatePicker_1 = require("@components/DatePicker");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const TimeModalPicker_1 = require("@components/TimeModalPicker");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const MoneyRequestTimeForm_1 = require("@src/types/form/MoneyRequestTimeForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepTime({ route: { params: { action, iouType, reportID, transactionID, backTo }, name, }, transaction, report, }) {
    const styles = (0, useThemeStyles_1.default)();
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${(0, IOU_1.getIOURequestPolicyID)(transaction, report)}`, { canBeMissing: true });
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const { translate } = (0, useLocalize_1.default)();
    const currentDateAttributes = transaction?.comment?.customUnit?.attributes?.dates;
    const currentStartDate = currentDateAttributes?.start ? DateUtils_1.default.extractDate(currentDateAttributes.start) : undefined;
    const currentEndDate = currentDateAttributes?.end ? DateUtils_1.default.extractDate(currentDateAttributes.end) : undefined;
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFound = !(0, IOUUtils_1.isValidMoneyRequestType)(iouType) || (0, EmptyObject_1.isEmptyObject)(transaction?.comment?.customUnit) || (0, EmptyObject_1.isEmptyObject)(policy);
    const isEditPage = name === SCREENS_1.default.MONEY_REQUEST.STEP_TIME_EDIT;
    const perDiemCustomUnits = (0, PolicyUtils_1.getPerDiemCustomUnits)(allPolicies, session?.email);
    const moreThanOnePerDiemExist = perDiemCustomUnits.length > 1;
    const navigateBack = () => {
        if (isEditPage) {
            Navigation_1.default.goBack(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(action, iouType, transactionID, reportID));
            return;
        }
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        if (transaction?.isFromGlobalCreate) {
            if (moreThanOnePerDiemExist) {
                Navigation_1.default.goBack(ROUTES_1.default.MONEY_REQUEST_STEP_DESTINATION.getRoute(action, iouType, transactionID, reportID));
                return;
            }
            // If there is only one per diem policy, we can't override the reportID that is already on the stack to make sure we go back to the right screen.
            Navigation_1.default.goBack();
        }
        Navigation_1.default.goBack(ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_PER_DIEM.getRoute(action, iouType, transactionID, reportID));
    };
    const validate = (value) => {
        const errors = {};
        const newStart = DateUtils_1.default.combineDateAndTime(value.startTime, value.startDate);
        const newEnd = DateUtils_1.default.combineDateAndTime(value.endTime, value.endDate);
        const isValid = DateUtils_1.default.isValidStartEndTimeRange({ startTime: newStart, endTime: newEnd });
        if (!isValid) {
            (0, ErrorUtils_1.addErrorMessage)(errors, MoneyRequestTimeForm_1.default.END_TIME, translate('common.error.invalidTimeShouldBeFuture'));
        }
        return errors;
    };
    const updateTime = (value) => {
        const newStart = DateUtils_1.default.combineDateAndTime(value.startTime, value.startDate);
        const newEnd = DateUtils_1.default.combineDateAndTime(value.endTime, value.endDate);
        (0, IOU_1.setMoneyRequestDateAttribute)(transactionID, newStart, newEnd);
        if (isEditPage) {
            navigateBack();
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_SUBRATE.getRoute(action, iouType, transactionID, reportID));
        }
    };
    const tabTitles = {
        [CONST_1.default.IOU.TYPE.REQUEST]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.SUBMIT]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.SEND]: translate('iou.paySomeone', { name: '' }),
        [CONST_1.default.IOU.TYPE.PAY]: translate('iou.paySomeone', { name: '' }),
        [CONST_1.default.IOU.TYPE.SPLIT]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.SPLIT_EXPENSE]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.TRACK]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.INVOICE]: translate('workspace.invoices.sendInvoice'),
        [CONST_1.default.IOU.TYPE.CREATE]: translate('iou.createExpense'),
    };
    return (<StepScreenWrapper_1.default headerTitle={backTo ? translate('iou.time') : tabTitles[iouType]} onBackButtonPress={navigateBack} shouldShowNotFoundPage={shouldShowNotFound} shouldShowWrapper testID={IOURequestStepTime.displayName} includeSafeAreaPaddingBottom>
            <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.MONEY_REQUEST_TIME_FORM} validate={validate} onSubmit={updateTime} submitButtonText={translate('common.save')} enabledWhenOffline>
                <InputWrapper_1.default InputComponent={DatePicker_1.default} inputID={MoneyRequestTimeForm_1.default.START_DATE} label={translate('iou.startDate')} defaultValue={currentStartDate} maxDate={CONST_1.default.CALENDAR_PICKER.MAX_DATE} minDate={CONST_1.default.CALENDAR_PICKER.MIN_DATE}/>
                <react_native_1.View style={[styles.mt2, styles.mhn5]}>
                    <InputWrapper_1.default InputComponent={TimeModalPicker_1.default} inputID={MoneyRequestTimeForm_1.default.START_TIME} label={translate('iou.startTime')} defaultValue={currentDateAttributes?.start}/>
                </react_native_1.View>
                <InputWrapper_1.default InputComponent={DatePicker_1.default} inputID={MoneyRequestTimeForm_1.default.END_DATE} label={translate('iou.endDate')} defaultValue={currentEndDate} maxDate={CONST_1.default.CALENDAR_PICKER.MAX_DATE} minDate={CONST_1.default.CALENDAR_PICKER.MIN_DATE}/>
                <react_native_1.View style={[styles.mt2, styles.mhn5]}>
                    <InputWrapper_1.default InputComponent={TimeModalPicker_1.default} inputID={MoneyRequestTimeForm_1.default.END_TIME} label={translate('iou.endTime')} defaultValue={currentDateAttributes?.end}/>
                </react_native_1.View>
            </FormProvider_1.default>
        </StepScreenWrapper_1.default>);
}
IOURequestStepTime.displayName = 'IOURequestStepTime';
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepTimeWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepTime);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepTimeWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepTimeWithFullTransactionOrNotFound);
exports.default = IOURequestStepTimeWithWritableReportOrNotFound;
