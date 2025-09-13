"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const InteractiveStepSubHeader_1 = require("@components/InteractiveStepSubHeader");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSubStep_1 = require("@hooks/useSubStep");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FormActions_1 = require("@libs/actions/FormActions");
const PersonalDetails_1 = require("@libs/actions/PersonalDetails");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MissingPersonalDetailsMagicCodeModal_1 = require("./MissingPersonalDetailsMagicCodeModal");
const Address_1 = require("./substeps/Address");
const Confirmation_1 = require("./substeps/Confirmation");
const DateOfBirth_1 = require("./substeps/DateOfBirth");
const LegalName_1 = require("./substeps/LegalName");
const PhoneNumber_1 = require("./substeps/PhoneNumber");
const utils_1 = require("./utils");
const formSteps = [LegalName_1.default, DateOfBirth_1.default, Address_1.default, PhoneNumber_1.default, Confirmation_1.default];
function MissingPersonalDetailsContent({ privatePersonalDetails, draftValues }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isValidateCodeActionModalVisible, setIsValidateCodeActionModalVisible] = (0, react_1.useState)(false);
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const ref = (0, react_1.useRef)(null);
    const values = (0, react_1.useMemo)(() => (0, utils_1.getSubstepValues)(privatePersonalDetails, draftValues), [privatePersonalDetails, draftValues]);
    const startFrom = (0, react_1.useMemo)(() => (0, utils_1.getInitialSubstep)(values), [values]);
    const handleFinishStep = (0, react_1.useCallback)(() => {
        if (!values) {
            return;
        }
        setIsValidateCodeActionModalVisible(true);
    }, [values]);
    const { componentToRender: SubStep, isEditing, nextScreen, prevScreen, screenIndex, moveTo, goToTheLastStep, lastScreenIndex, } = (0, useSubStep_1.default)({ bodyContent: formSteps, startFrom, onFinished: handleFinishStep });
    const handleBackButtonPress = () => {
        if (isEditing) {
            goToTheLastStep();
            ref.current?.moveTo(lastScreenIndex);
            return;
        }
        // Clicking back on the first screen should dismiss the modal
        if (screenIndex === CONST_1.default.MISSING_PERSONAL_DETAILS_INDEXES.MAPPING.LEGAL_NAME) {
            (0, FormActions_1.clearDraftValues)(ONYXKEYS_1.default.FORMS.PERSONAL_DETAILS_FORM);
            Navigation_1.default.goBack();
            return;
        }
        ref.current?.movePrevious();
        prevScreen();
    };
    const handleSubmitForm = (0, react_1.useCallback)((validateCode) => {
        (0, PersonalDetails_1.updatePersonalDetailsAndShipExpensifyCards)(values, validateCode, countryCode ?? 1);
    }, [countryCode, values]);
    const handleNextScreen = (0, react_1.useCallback)(() => {
        if (isEditing) {
            goToTheLastStep();
            ref.current?.moveTo(lastScreenIndex);
            return;
        }
        ref.current?.moveNext();
        nextScreen();
    }, [goToTheLastStep, isEditing, nextScreen, lastScreenIndex]);
    const handleMoveTo = (0, react_1.useCallback)((step) => {
        ref.current?.moveTo(step);
        moveTo(step);
    }, [moveTo]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableMaxHeight testID={MissingPersonalDetailsContent.displayName}>
            <HeaderWithBackButton_1.default title={translate('workspace.expensifyCard.addShippingDetails')} onBackButtonPress={handleBackButtonPress}/>
            <react_native_1.View style={[styles.ph5, styles.mb3, styles.mt3, { height: CONST_1.default.NETSUITE_FORM_STEPS_HEADER_HEIGHT }]}>
                <InteractiveStepSubHeader_1.default ref={ref} startStepIndex={startFrom} stepNames={CONST_1.default.MISSING_PERSONAL_DETAILS_INDEXES.INDEX_LIST}/>
            </react_native_1.View>
            <SubStep isEditing={isEditing} onNext={handleNextScreen} onMove={handleMoveTo} screenIndex={screenIndex} personalDetailsValues={values}/>

            <MissingPersonalDetailsMagicCodeModal_1.default onClose={() => setIsValidateCodeActionModalVisible(false)} isValidateCodeActionModalVisible={isValidateCodeActionModalVisible} handleSubmitForm={handleSubmitForm}/>
        </ScreenWrapper_1.default>);
}
MissingPersonalDetailsContent.displayName = 'MissingPersonalDetailsContent';
exports.default = MissingPersonalDetailsContent;
