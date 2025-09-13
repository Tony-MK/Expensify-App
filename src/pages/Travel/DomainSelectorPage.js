"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const TravelDomainListItem_1 = require("@components/SelectionList/TravelDomainListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Travel_1 = require("@libs/actions/Travel");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function DomainSelectorPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(activePolicyID);
    const [selectedDomain, setSelectedDomain] = (0, react_1.useState)();
    const domains = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getAdminsPrivateEmailDomains)(policy), [policy]);
    const recommendedDomain = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getMostFrequentEmailDomain)(domains, policy), [policy, domains]);
    const data = (0, react_1.useMemo)(() => {
        return domains.map((domain) => {
            return {
                value: domain,
                isSelected: domain === selectedDomain,
                keyForList: domain,
                text: domain,
                isRecommended: domain === recommendedDomain,
            };
        });
    }, [domains, recommendedDomain, selectedDomain]);
    const provisionTravelForDomain = () => {
        const domain = selectedDomain ?? CONST_1.default.TRAVEL.DEFAULT_DOMAIN;
        if ((0, EmptyObject_1.isEmptyObject)(policy?.address)) {
            // Spotnana requires an address anytime an entity is created for a policy
            Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_WORKSPACE_ADDRESS.getRoute(domain, Navigation_1.default.getActiveRoute()));
        }
        else {
            (0, Travel_1.cleanupTravelProvisioningSession)();
            Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_TCS.getRoute(domain));
        }
    };
    return (<ScreenWrapper_1.default shouldEnableMaxHeight testID={DomainSelectorPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('travel.domainSelector.title')} onBackButtonPress={() => Navigation_1.default.goBack(route.params.backTo)}/>
            <Text_1.default style={[styles.mt3, styles.mr5, styles.mb5, styles.ml5]}>{translate('travel.domainSelector.subtitle')}</Text_1.default>
            <SelectionList_1.default onSelectRow={(option) => setSelectedDomain(option.value)} sections={[{ title: translate('travel.domainSelector.title'), data }]} canSelectMultiple ListItem={TravelDomainListItem_1.default} shouldShowTooltips footerContent={<Button_1.default isDisabled={!selectedDomain} success large style={[styles.w100]} onPress={provisionTravelForDomain} text={translate('common.continue')}/>}/>
        </ScreenWrapper_1.default>);
}
DomainSelectorPage.displayName = 'DomainSelectorPage';
exports.default = DomainSelectorPage;
