"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Welcome_1 = require("@userActions/Welcome");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function BaseOnboardingEmployees({ shouldUseNativeStyles, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [onboardingCompanySize] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_COMPANY_SIZE, { canBeMissing: true });
    const [onboardingPurposeSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, { canBeMissing: true });
    const { onboardingIsMediumOrLargerScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [selectedCompanySize, setSelectedCompanySize] = (0, react_1.useState)(onboardingCompanySize);
    const [error, setError] = (0, react_1.useState)('');
    const [onboardingValues] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: true });
    const companySizeOptions = (0, react_1.useMemo)(() => {
        const isSmb = onboardingValues?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.SMB;
        return Object.values(CONST_1.default.ONBOARDING_COMPANY_SIZE)
            .filter((size) => !isSmb || size !== CONST_1.default.ONBOARDING_COMPANY_SIZE.MICRO)
            .map((companySize) => {
            return {
                text: translate(`onboarding.employees.${companySize}`),
                keyForList: companySize,
                isSelected: companySize === selectedCompanySize,
            };
        });
    }, [translate, selectedCompanySize, onboardingValues?.signupQualifier]);
    const footerContent = (<>
            {!!error && (<FormHelpMessage_1.default style={[styles.ph1, styles.mb2]} isError message={error}/>)}
            <Button_1.default success large text={translate('common.continue')} onPress={() => {
            if (!selectedCompanySize) {
                setError(translate('onboarding.errorSelection'));
                return;
            }
            (0, Welcome_1.setOnboardingCompanySize)(selectedCompanySize);
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_ACCOUNTING.getRoute(route.params?.backTo));
        }} pressOnEnter/>
        </>);
    return (<ScreenWrapper_1.default testID="BaseOnboardingEmployees" style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]}>
            <HeaderWithBackButton_1.default shouldShowBackButton progressBarPercentage={onboardingPurposeSelected === CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM ? 80 : 90} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.ONBOARDING_PURPOSE.getRoute());
        }}/>
            <Text_1.default style={[styles.textHeadlineH1, styles.mb5, onboardingIsMediumOrLargerScreenWidth && styles.mt5, onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5]}>
                {translate('onboarding.employees.title')}
            </Text_1.default>
            <SelectionList_1.default sections={[{ data: companySizeOptions }]} onSelectRow={(item) => {
            setSelectedCompanySize(item.keyForList);
            setError('');
        }} initiallyFocusedOptionKey={companySizeOptions.find((item) => item.keyForList === selectedCompanySize)?.keyForList} shouldUpdateFocusedIndex ListItem={RadioListItem_1.default} footerContent={footerContent} listItemWrapperStyle={onboardingIsMediumOrLargerScreenWidth ? [styles.pl8, styles.pr8] : []} includeSafeAreaPaddingBottom={false}/>
        </ScreenWrapper_1.default>);
}
BaseOnboardingEmployees.displayName = 'BaseOnboardingEmployees';
exports.default = BaseOnboardingEmployees;
