"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function TransactionStartDateStep({ policyID, feed, backTo }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [assignCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ASSIGN_CARD);
    const isEditing = assignCard?.isEditing;
    const data = assignCard?.data;
    const assigneeDisplayName = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(data?.email ?? '')?.displayName ?? '';
    const [dateOptionSelected, setDateOptionSelected] = (0, react_1.useState)(data?.dateOption ?? CONST_1.default.COMPANY_CARD.TRANSACTION_START_DATE_OPTIONS.FROM_BEGINNING);
    const startDate = assignCard?.startDate ?? data?.startDate ?? (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING);
    const handleBackButtonPress = () => {
        if (isEditing) {
            (0, CompanyCards_1.setAssignCardStepAndData)({
                currentStep: CONST_1.default.COMPANY_CARD.STEP.CONFIRMATION,
                isEditing: false,
            });
            return;
        }
        (0, CompanyCards_1.setAssignCardStepAndData)({ currentStep: CONST_1.default.COMPANY_CARD.STEP.CARD });
    };
    const handleSelectDateOption = (dateOption) => {
        setDateOptionSelected(dateOption);
    };
    const submit = () => {
        const date90DaysBack = (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), 90), CONST_1.default.DATE.FNS_FORMAT_STRING);
        (0, CompanyCards_1.setAssignCardStepAndData)({
            currentStep: CONST_1.default.COMPANY_CARD.STEP.CONFIRMATION,
            data: {
                dateOption: dateOptionSelected,
                startDate: dateOptionSelected === CONST_1.default.COMPANY_CARD.TRANSACTION_START_DATE_OPTIONS.FROM_BEGINNING ? date90DaysBack : startDate,
            },
            isEditing: false,
        });
    };
    const dateOptions = (0, react_1.useMemo)(() => [
        {
            value: CONST_1.default.COMPANY_CARD.TRANSACTION_START_DATE_OPTIONS.FROM_BEGINNING,
            text: translate('workspace.companyCards.fromTheBeginning'),
            keyForList: CONST_1.default.COMPANY_CARD.TRANSACTION_START_DATE_OPTIONS.FROM_BEGINNING,
            isSelected: dateOptionSelected === CONST_1.default.COMPANY_CARD.TRANSACTION_START_DATE_OPTIONS.FROM_BEGINNING,
        },
        {
            value: CONST_1.default.COMPANY_CARD.TRANSACTION_START_DATE_OPTIONS.CUSTOM,
            text: translate('workspace.companyCards.customStartDate'),
            keyForList: CONST_1.default.COMPANY_CARD.TRANSACTION_START_DATE_OPTIONS.CUSTOM,
            isSelected: dateOptionSelected === CONST_1.default.COMPANY_CARD.TRANSACTION_START_DATE_OPTIONS.CUSTOM,
        },
    ], [dateOptionSelected, translate]);
    return (<InteractiveStepWrapper_1.default wrapperID={TransactionStartDateStep.displayName} handleBackButtonPress={handleBackButtonPress} startStepIndex={2} stepNames={CONST_1.default.COMPANY_CARD.STEP_NAMES} headerTitle={translate('workspace.companyCards.assignCard')} headerSubtitle={assigneeDisplayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mt3]}>{translate('workspace.companyCards.chooseTransactionStartDate')}</Text_1.default>
            <Text_1.default style={[styles.textSupporting, styles.ph5, styles.mv3]}>{translate('workspace.companyCards.startDateDescription')}</Text_1.default>
            <react_native_1.View style={styles.flex1}>
                <SelectionList_1.default ListItem={RadioListItem_1.default} onSelectRow={({ value }) => handleSelectDateOption(value)} sections={[{ data: dateOptions }]} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={dateOptionSelected} shouldUpdateFocusedIndex addBottomSafeAreaPadding footerContent={<Button_1.default success large pressOnEnter text={translate(isEditing ? 'common.confirm' : 'common.next')} onPress={submit}/>} listFooterContent={dateOptionSelected === CONST_1.default.COMPANY_CARD.TRANSACTION_START_DATE_OPTIONS.CUSTOM ? (<MenuItemWithTopDescription_1.default description={translate('common.date')} title={startDate} shouldShowRightIcon onPress={() => {
                if (!policyID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_TRANSACTION_START_DATE.getRoute(policyID, feed, backTo));
            }}/>) : null}/>
            </react_native_1.View>
        </InteractiveStepWrapper_1.default>);
}
TransactionStartDateStep.displayName = 'TransactionStartDateStep';
exports.default = TransactionStartDateStep;
