"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const PerDiem_1 = require("@userActions/Policy/PerDiem");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspacePerDiemForm_1 = require("@src/types/form/WorkspacePerDiemForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function EditPerDiemDestinationPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = route.params.policyID;
    const rateID = route.params.rateID;
    const subRateID = route.params.subRateID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`);
    const customUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const selectedRate = customUnit?.rates?.[rateID];
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const destinationTrimmed = values.destination.trim();
        if (!destinationTrimmed) {
            errors.destination = translate('common.error.fieldRequired');
        }
        else if (destinationTrimmed.length > CONST_1.default.MAX_LENGTH_256) {
            errors.destination = translate('common.error.characterLimitExceedCounter', { length: destinationTrimmed.length, limit: CONST_1.default.MAX_LENGTH_256 });
        }
        return errors;
    }, [translate]);
    const editDestination = (0, react_1.useCallback)((values) => {
        const newDestination = values.destination.trim();
        if (newDestination !== selectedRate?.name) {
            (0, PerDiem_1.editPerDiemRateDestination)(policyID, rateID, customUnit, newDestination);
        }
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_PER_DIEM_DETAILS.getRoute(policyID, rateID, subRateID));
    }, [selectedRate?.name, policyID, rateID, subRateID, customUnit]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_PER_DIEM_RATES_ENABLED} shouldBeBlocked={!policyID || !rateID || (0, EmptyObject_1.isEmptyObject)(selectedRate)}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={EditPerDiemDestinationPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('common.destination')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_PER_DIEM_DETAILS.getRoute(policyID, rateID, subRateID))}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_PER_DIEM_FORM} validate={validate} onSubmit={editDestination} submitButtonText={translate('common.save')} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.pb4}>
                        <Text_1.default style={[styles.sidebarLinkText, styles.optionAlternateText]}>
                            {translate('workspace.perDiem.editDestinationSubtitle', { destination: selectedRate?.name ?? '' })}
                        </Text_1.default>
                    </react_native_1.View>
                    <InputWrapper_1.default ref={inputCallbackRef} InputComponent={TextInput_1.default} defaultValue={selectedRate?.name} label={translate('common.destination')} accessibilityLabel={translate('common.destination')} inputID={WorkspacePerDiemForm_1.default.DESTINATION} role={CONST_1.default.ROLE.PRESENTATION}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
EditPerDiemDestinationPage.displayName = 'EditPerDiemDestinationPage';
exports.default = EditPerDiemDestinationPage;
