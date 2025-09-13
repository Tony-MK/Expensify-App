"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ConfirmModal_1 = require("@components/ConfirmModal");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const ValuePicker_1 = require("@components/ValuePicker");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function getSubrateOptions(subRates, filledSubRates, currentSubrateID) {
    const filledSubRatesIDs = new Set(filledSubRates.map(({ id }) => id));
    return subRates
        .filter(({ id }) => currentSubrateID === id || !filledSubRatesIDs.has(id))
        .map(({ id, name }) => ({
        value: id,
        label: name,
    }));
}
function IOURequestStepSubrate({ route: { params: { action, backTo, iouType, pageIndex, reportID, transactionID }, }, transaction, report, }) {
    const styles = (0, useThemeStyles_1.default)();
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const customUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const [isDeleteStopModalOpen, setIsDeleteStopModalOpen] = (0, react_1.useState)(false);
    const [restoreFocusType, setRestoreFocusType] = (0, react_1.useState)();
    const navigation = (0, native_1.useNavigation)();
    const isFocused = navigation.isFocused();
    const { translate } = (0, useLocalize_1.default)();
    const textInputRef = (0, react_1.useRef)(null);
    const parsedIndex = parseInt(pageIndex, 10);
    const selectedDestination = transaction?.comment?.customUnit?.customUnitRateID;
    const allSubrates = transaction?.comment?.customUnit?.subRates ?? [];
    const allPossibleSubrates = selectedDestination ? (customUnit?.rates?.[selectedDestination]?.subRates ?? []) : [];
    const currentSubrate = allSubrates.at(parsedIndex) ?? undefined;
    const totalSubrateCount = allPossibleSubrates.length;
    const filledSubrateCount = allSubrates.length;
    const [subrateValue, setSubrateValue] = (0, react_1.useState)(currentSubrate?.id);
    const [quantityValue, setQuantityValue] = (0, react_1.useState)(() => (currentSubrate?.quantity ? String(currentSubrate.quantity) : undefined));
    const onChangeQuantity = (0, react_1.useCallback)((newValue) => {
        // replace all characters that are not spaces or digits
        let validQuantity = newValue.replace(/[^0-9]/g, '');
        validQuantity = validQuantity.match(/(?:\d *){1,12}/)?.[0] ?? '';
        setQuantityValue(validQuantity);
    }, []);
    (0, react_1.useEffect)(() => {
        setSubrateValue(currentSubrate?.id);
        setQuantityValue(currentSubrate?.quantity ? String(currentSubrate.quantity) : undefined);
    }, [currentSubrate?.id, currentSubrate?.quantity]);
    // Hide the menu when there is only one subrate
    const shouldShowThreeDotsButton = filledSubrateCount > 1 && !(0, EmptyObject_1.isEmptyObject)(currentSubrate);
    const shouldDisableEditor = isFocused && (Number.isNaN(parsedIndex) || parsedIndex < 0 || parsedIndex >= totalSubrateCount || parsedIndex > filledSubrateCount);
    const validOptions = getSubrateOptions(allPossibleSubrates, allSubrates, currentSubrate?.id);
    const goBack = () => {
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        Navigation_1.default.goBack(ROUTES_1.default.MONEY_REQUEST_STEP_TIME.getRoute(action, iouType, transactionID, reportID));
    };
    const validate = (values) => {
        const errors = {};
        const quantityVal = String(values[`quantity${pageIndex}`] ?? '');
        const subrateVal = values[`subrate${pageIndex}`] ?? '';
        const quantityInt = parseInt(quantityVal, 10);
        if (subrateVal === '' || !validOptions.some(({ value }) => value === subrateVal)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, `subrate${pageIndex}`, translate('common.error.fieldRequired'));
        }
        if (quantityVal === '') {
            (0, ErrorUtils_1.addErrorMessage)(errors, `quantity${pageIndex}`, translate('common.error.fieldRequired'));
        }
        else if (Number.isNaN(quantityInt)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, `quantity${pageIndex}`, translate('iou.error.invalidQuantity'));
        }
        else if (quantityInt <= 0) {
            (0, ErrorUtils_1.addErrorMessage)(errors, `quantity${pageIndex}`, translate('iou.error.quantityGreaterThanZero'));
        }
        return errors;
    };
    const submit = (values) => {
        const quantityVal = String(values[`quantity${pageIndex}`] ?? '');
        const subrateVal = String(values[`subrate${pageIndex}`] ?? '');
        const quantityInt = parseInt(quantityVal, 10);
        const selectedSubrate = allPossibleSubrates.find(({ id }) => id === subrateVal);
        const name = selectedSubrate?.name ?? '';
        const rate = selectedSubrate?.rate ?? 0;
        if (parsedIndex === filledSubrateCount) {
            (0, IOU_1.addSubrate)(transaction, pageIndex, quantityInt, subrateVal, name, rate);
        }
        else {
            (0, IOU_1.updateSubrate)(transaction, pageIndex, quantityInt, subrateVal, name, rate);
        }
        if (backTo) {
            goBack();
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(action, iouType, transactionID, reportID));
        }
    };
    const deleteSubrateAndHideModal = () => {
        (0, IOU_1.removeSubrate)(transaction, pageIndex);
        setRestoreFocusType(CONST_1.default.MODAL.RESTORE_FOCUS_TYPE.DELETE);
        setIsDeleteStopModalOpen(false);
        goBack();
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
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={IOURequestStepSubrate.displayName}>
            <FullPageNotFoundView_1.default shouldShow={shouldDisableEditor}>
                <HeaderWithBackButton_1.default title={backTo ? translate('common.subrate') : tabTitles[iouType]} shouldShowBackButton onBackButtonPress={goBack} shouldShowThreeDotsButton={shouldShowThreeDotsButton} shouldSetModalVisibility={false} threeDotsMenuItems={[
            {
                icon: Expensicons.Trashcan,
                text: translate('iou.deleteSubrate'),
                onSelected: () => {
                    setRestoreFocusType(undefined);
                    setIsDeleteStopModalOpen(true);
                },
                shouldCallAfterModalHide: true,
            },
        ]}/>
                <ConfirmModal_1.default title={translate('iou.deleteSubrate')} isVisible={isDeleteStopModalOpen} onConfirm={deleteSubrateAndHideModal} onCancel={() => setIsDeleteStopModalOpen(false)} shouldSetModalVisibility={false} prompt={translate('iou.deleteSubrateConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} shouldEnableNewFocusManagement danger restoreFocusType={restoreFocusType}/>
                <FormProvider_1.default style={[styles.flexGrow1, styles.mh5]} formID={ONYXKEYS_1.default.FORMS.MONEY_REQUEST_SUBRATE_FORM} enabledWhenOffline validate={validate} onSubmit={submit} shouldValidateOnChange shouldValidateOnBlur={false} submitButtonText={translate('common.save')}>
                    <Text_1.default style={[styles.pv3]}>{translate('iou.subrateSelection')}</Text_1.default>
                    <react_native_1.View style={[styles.mhn5]}>
                        <InputWrapper_1.default InputComponent={ValuePicker_1.default} inputID={`subrate${pageIndex}`} label={translate('common.subrate')} value={subrateValue} defaultValue={currentSubrate?.id} items={validOptions} onValueChange={(value) => {
            setSubrateValue(value);
            react_native_1.InteractionManager.runAfterInteractions(() => {
                textInputRef.current?.focus();
            });
        }}/>
                    </react_native_1.View>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={`quantity${pageIndex}`} ref={textInputRef} containerStyles={[styles.mt4]} label={translate('iou.quantity')} value={quantityValue} inputMode={CONST_1.default.INPUT_MODE.NUMERIC} maxLength={CONST_1.default.IOU.QUANTITY_MAX_LENGTH} onChangeText={onChangeQuantity}/>
                </FormProvider_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
IOURequestStepSubrate.displayName = 'IOURequestStepSubrate';
exports.default = (0, withWritableReportOrNotFound_1.default)((0, withFullTransactionOrNotFound_1.default)(IOURequestStepSubrate));
