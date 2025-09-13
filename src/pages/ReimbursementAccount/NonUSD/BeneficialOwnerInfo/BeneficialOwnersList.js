"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
const Expensicons_1 = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const getValuesForBeneficialOwner_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getValuesForBeneficialOwner");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function BeneficialOwnersList({ handleConfirmation, ownerKeys, handleOwnerEdit }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { paddingBottom: safeAreaInsetPaddingBottom } = (0, useSafeAreaPaddings_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: false });
    const error = (0, ErrorUtils_1.getLatestErrorMessage)(reimbursementAccount);
    const owners = reimbursementAccountDraft &&
        ownerKeys.map((ownerKey) => {
            const ownerData = (0, getValuesForBeneficialOwner_1.default)(ownerKey, reimbursementAccountDraft);
            return (<MenuItem_1.default key={ownerKey} title={`${ownerData.firstName} ${ownerData.lastName}`} description={`${ownerData.street}, ${ownerData.city}, ${ownerData.state} ${ownerData.zipCode}`} wrapperStyle={[styles.ph5]} icon={Expensicons_1.FallbackAvatar} iconType={CONST_1.default.ICON_TYPE_AVATAR} onPress={() => {
                    handleOwnerEdit(ownerKey);
                }} iconWidth={40} iconHeight={40} interactive shouldShowRightIcon displayInDefaultIconColor/>);
        });
    const areThereOwners = owners !== undefined && owners?.length > 0;
    return (<ScrollView_1.default style={styles.pt0} contentContainerStyle={[styles.flexGrow1, { paddingBottom: safeAreaInsetPaddingBottom + styles.pb5.paddingBottom }]}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5]}>{translate('beneficialOwnerInfoStep.letsDoubleCheck')}</Text_1.default>
            <Text_1.default style={[styles.p5, styles.textSupporting]}>{translate('beneficialOwnerInfoStep.regulationRequiresUsToVerifyTheIdentity')}</Text_1.default>
            {areThereOwners && (<react_native_1.View>
                    <Text_1.default style={[styles.textSupporting, styles.pv1, styles.ph5]}>{`${translate('beneficialOwnerInfoStep.owners')}:`}</Text_1.default>
                    {owners}
                </react_native_1.View>)}
            <react_native_1.View style={[styles.ph5, styles.mt5, styles.flexGrow1, styles.justifyContentEnd]}>
                {!!error && error.length > 0 && (<DotIndicatorMessage_1.default textStyles={[styles.formError]} type="error" messages={{ error }}/>)}
                <Button_1.default success large isLoading={reimbursementAccount?.isSavingCorpayOnboardingBeneficialOwnersFields} isDisabled={isOffline} style={styles.w100} onPress={() => {
            handleConfirmation({ anyIndividualOwn25PercentOrMore: true });
        }} text={translate('common.confirm')}/>
            </react_native_1.View>
        </ScrollView_1.default>);
}
BeneficialOwnersList.displayName = 'BeneficialOwnersList';
exports.default = BeneficialOwnersList;
