"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useRootNavigationState_1 = require("@hooks/useRootNavigationState");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const Navigation_1 = require("@navigation/Navigation");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function ConfirmationStep({ policyID, feed, backTo }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [assignCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ASSIGN_CARD, { canBeMissing: false });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const [countryByIp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY, { canBeMissing: false });
    const [currencyList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: true });
    const bankName = assignCard?.data?.bankName ?? feed;
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const data = assignCard?.data;
    const cardholderName = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(data?.email ?? '')?.displayName ?? '';
    const currentFullScreenRoute = (0, useRootNavigationState_1.default)((state) => state?.routes?.findLast((route) => (0, isNavigatorName_1.isFullScreenName)(route.name)));
    (0, react_1.useEffect)(() => {
        if (!assignCard?.isAssigned) {
            return;
        }
        const lastRoute = currentFullScreenRoute?.state?.routes.at(-1);
        if (backTo ?? lastRoute?.name === SCREENS_1.default.WORKSPACE.COMPANY_CARDS) {
            Navigation_1.default.goBack(backTo);
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS.getRoute(policyID), { forceReplace: true });
        }
        react_native_1.InteractionManager.runAfterInteractions(() => (0, CompanyCards_1.clearAssignCardStepAndData)());
    }, [assignCard, backTo, policyID, currentFullScreenRoute?.state?.routes]);
    const submit = () => {
        if (!policyID) {
            return;
        }
        const isFeedExpired = (0, CardUtils_1.isSelectedFeedExpired)(bankName ? cardFeeds?.settings?.oAuthAccountDetails?.[bankName] : undefined);
        const institutionId = !!(0, CardUtils_1.getPlaidInstitutionId)(bankName);
        if (isFeedExpired) {
            if (institutionId) {
                const country = (0, CardUtils_1.getPlaidCountry)(policy?.outputCurrency, currencyList, countryByIp);
                (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
                    data: {
                        selectedCountry: country,
                    },
                });
            }
            (0, CompanyCards_1.setAssignCardStepAndData)({ currentStep: institutionId ? CONST_1.default.COMPANY_CARD.STEP.PLAID_CONNECTION : CONST_1.default.COMPANY_CARD.STEP.BANK_CONNECTION });
            return;
        }
        (0, CompanyCards_1.assignWorkspaceCompanyCard)(policyID, { ...data, bankName });
    };
    const editStep = (step) => {
        (0, CompanyCards_1.setAssignCardStepAndData)({ currentStep: step, isEditing: true });
    };
    const handleBackButtonPress = () => {
        (0, CompanyCards_1.setAssignCardStepAndData)({ currentStep: CONST_1.default.COMPANY_CARD.STEP.TRANSACTION_START_DATE });
    };
    return (<InteractiveStepWrapper_1.default wrapperID={ConfirmationStep.displayName} handleBackButtonPress={handleBackButtonPress} startStepIndex={3} stepNames={CONST_1.default.COMPANY_CARD.STEP_NAMES} headerTitle={translate('workspace.companyCards.assignCard')} headerSubtitle={cardholderName} enableEdgeToEdgeBottomSafeAreaPadding>
            <ScrollView_1.default style={styles.pt0} contentContainerStyle={styles.flexGrow1} addBottomSafeAreaPadding>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mt3]}>{translate('workspace.companyCards.letsDoubleCheck')}</Text_1.default>
                <Text_1.default style={[styles.textSupporting, styles.ph5, styles.mv3]}>{translate('workspace.companyCards.confirmationDescription')}</Text_1.default>
                <MenuItemWithTopDescription_1.default description={translate('workspace.companyCards.cardholder')} title={cardholderName} shouldShowRightIcon onPress={() => editStep(CONST_1.default.COMPANY_CARD.STEP.ASSIGNEE)}/>
                <MenuItemWithTopDescription_1.default description={translate('workspace.companyCards.card')} title={(0, CardUtils_1.maskCardNumber)(data?.cardNumber ?? '', data?.bankName)} hintText={(0, CardUtils_1.lastFourNumbersFromCardName)(data?.cardNumber)} shouldShowRightIcon onPress={() => editStep(CONST_1.default.COMPANY_CARD.STEP.CARD)}/>
                <MenuItemWithTopDescription_1.default description={translate('workspace.moreFeatures.companyCards.transactionStartDate')} title={data?.dateOption === CONST_1.default.COMPANY_CARD.TRANSACTION_START_DATE_OPTIONS.FROM_BEGINNING ? translate('workspace.companyCards.fromTheBeginning') : data?.startDate} shouldShowRightIcon onPress={() => editStep(CONST_1.default.COMPANY_CARD.STEP.TRANSACTION_START_DATE)}/>
                <MenuItemWithTopDescription_1.default description={translate('workspace.companyCards.cardName')} title={data?.cardName} shouldShowRightIcon onPress={() => editStep(CONST_1.default.COMPANY_CARD.STEP.CARD_NAME)}/>
                <react_native_1.View style={[styles.mh5, styles.pb5, styles.mt3, styles.flexGrow1, styles.justifyContentEnd]}>
                    <OfflineWithFeedback_1.default shouldDisplayErrorAbove errors={assignCard?.errors} errorRowStyles={styles.mv2} canDismissError={false}>
                        <Button_1.default isDisabled={isOffline} success large isLoading={assignCard?.isAssigning} style={styles.w100} onPress={submit} testID={CONST_1.default.ASSIGN_CARD_BUTTON_TEST_ID} text={translate('workspace.companyCards.assignCard')}/>
                    </OfflineWithFeedback_1.default>
                </react_native_1.View>
            </ScrollView_1.default>
        </InteractiveStepWrapper_1.default>);
}
ConfirmationStep.displayName = 'ConfirmationStep';
exports.default = ConfirmationStep;
