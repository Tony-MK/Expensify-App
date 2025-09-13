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
const getValuesForBeneficialOwner_1 = require("@pages/ReimbursementAccount/USD/utils/getValuesForBeneficialOwner");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const REQUESTOR_PERSONAL_INFO_KEYS = ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP;
function CompanyOwnersListUBO({ isAnyoneElseUBO, isUserUBO, handleUBOsConfirmation, beneficialOwnerKeys, handleUBOEdit }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { paddingBottom: safeAreaInsetPaddingBottom } = (0, useSafeAreaPaddings_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT);
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const isLoading = reimbursementAccount?.isLoading ?? false;
    const requestorData = (0, getSubStepValues_1.default)(REQUESTOR_PERSONAL_INFO_KEYS, undefined, reimbursementAccount);
    const error = (0, ErrorUtils_1.getLatestErrorMessage)(reimbursementAccount);
    const extraBeneficialOwners = isAnyoneElseUBO &&
        reimbursementAccountDraft &&
        beneficialOwnerKeys.map((ownerKey) => {
            const beneficialOwnerData = (0, getValuesForBeneficialOwner_1.default)(ownerKey, reimbursementAccountDraft);
            return (<MenuItem_1.default key={ownerKey} title={`${beneficialOwnerData.firstName} ${beneficialOwnerData.lastName}`} description={`${beneficialOwnerData.street}, ${beneficialOwnerData.city}, ${beneficialOwnerData.state} ${beneficialOwnerData.zipCode}`} wrapperStyle={[styles.ph5]} icon={Expensicons_1.FallbackAvatar} iconType={CONST_1.default.ICON_TYPE_AVATAR} onPress={() => {
                    handleUBOEdit(ownerKey);
                }} iconWidth={40} iconHeight={40} interactive shouldShowRightIcon displayInDefaultIconColor/>);
        });
    return (<ScrollView_1.default style={styles.pt0} contentContainerStyle={[styles.flexGrow1, { paddingBottom: safeAreaInsetPaddingBottom + styles.pb5.paddingBottom }]}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5]}>{translate('beneficialOwnerInfoStep.letsDoubleCheck')}</Text_1.default>
            <Text_1.default style={[styles.p5, styles.textSupporting]}>{translate('beneficialOwnerInfoStep.regulationRequiresUsToVerifyTheIdentity')}</Text_1.default>
            <react_native_1.View>
                <Text_1.default style={[styles.textSupporting, styles.pv1, styles.ph5]}>{`${translate('beneficialOwnerInfoStep.owners')}:`}</Text_1.default>
                {isUserUBO && (<MenuItem_1.default title={`${requestorData.firstName} ${requestorData.lastName}`} description={`${requestorData.requestorAddressStreet}, ${requestorData.requestorAddressCity}, ${requestorData.requestorAddressState} ${requestorData.requestorAddressZipCode}`} wrapperStyle={[styles.ph5]} icon={Expensicons_1.FallbackAvatar} iconType={CONST_1.default.ICON_TYPE_AVATAR} iconWidth={40} iconHeight={40} interactive={false} shouldShowRightIcon={false} displayInDefaultIconColor/>)}
                {extraBeneficialOwners}
            </react_native_1.View>

            <react_native_1.View style={[styles.ph5, styles.mt5, styles.flexGrow1, styles.justifyContentEnd]}>
                {!!error && error.length > 0 && (<DotIndicatorMessage_1.default textStyles={[styles.formError]} type="error" messages={{ error }}/>)}
                <Button_1.default success large isLoading={isLoading} isDisabled={isOffline} style={[styles.w100]} onPress={handleUBOsConfirmation} text={translate('common.confirm')}/>
            </react_native_1.View>
        </ScrollView_1.default>);
}
CompanyOwnersListUBO.displayName = 'CompanyOwnersListUBO';
exports.default = CompanyOwnersListUBO;
