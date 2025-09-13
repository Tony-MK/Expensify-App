"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const CategorySelector_1 = require("@components/CategorySelector");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Category_1 = require("@userActions/Policy/Category");
const DistanceRate_1 = require("@userActions/Policy/DistanceRate");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const UnitSelector_1 = require("./UnitSelector");
function PolicyDistanceRatesSettingsPage({ route }) {
    const policyID = route.params.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`);
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`);
    const styles = (0, useThemeStyles_1.default)();
    const [isCategoryPickerVisible, setIsCategoryPickerVisible] = (0, react_1.useState)(false);
    const { translate } = (0, useLocalize_1.default)();
    const customUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const isDistanceTrackTaxEnabled = !!customUnit?.attributes?.taxEnabled;
    const isPolicyTrackTaxEnabled = !!policy?.tax?.trackingEnabled;
    const defaultCategory = customUnit?.defaultCategory;
    const defaultUnit = customUnit?.attributes?.unit;
    const errorFields = customUnit?.errorFields;
    const FullPageBlockingView = !customUnit ? FullPageOfflineBlockingView_1.default : react_native_1.View;
    const setNewUnit = (unit) => {
        if (!customUnit) {
            return;
        }
        const attributes = { ...customUnit?.attributes, unit: unit.value };
        (0, DistanceRate_1.setPolicyDistanceRatesUnit)(policyID, customUnit, { ...customUnit, attributes });
    };
    const setNewCategory = (category) => {
        if (!category.searchText || !customUnit || defaultCategory === category.searchText) {
            return;
        }
        (0, Category_1.setPolicyCustomUnitDefaultCategory)(policyID, customUnit.customUnitID, customUnit.defaultCategory, category.searchText);
    };
    const clearErrorFields = (fieldName) => {
        if (!customUnit?.customUnitID) {
            return;
        }
        (0, DistanceRate_1.clearPolicyDistanceRatesErrorFields)(policyID, customUnit.customUnitID, { ...errorFields, [fieldName]: null });
    };
    const onToggleTrackTax = (isOn) => {
        if (!customUnit || !customUnit.attributes) {
            return;
        }
        const attributes = { ...customUnit?.attributes, taxEnabled: isOn };
        (0, Policy_1.enableDistanceRequestTax)(policyID, customUnit.name, customUnit.customUnitID, attributes);
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_DISTANCE_RATES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={PolicyDistanceRatesSettingsPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.common.settings')}/>
                <FullPageBlockingView style={customUnit ? styles.flexGrow1 : []}>
                    <ScrollView_1.default contentContainerStyle={styles.flexGrow1} keyboardShouldPersistTaps="always" addBottomSafeAreaPadding>
                        <react_native_1.View>
                            {!!defaultUnit && (<OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(customUnit ?? {}, 'attributes')} pendingAction={customUnit?.pendingFields?.attributes} errorRowStyles={styles.mh5} onClose={() => clearErrorFields('attributes')}>
                                    <UnitSelector_1.default label={translate('workspace.distanceRates.unit')} defaultValue={defaultUnit} wrapperStyle={[styles.ph5, styles.mt3]} setNewUnit={setNewUnit}/>
                                </OfflineWithFeedback_1.default>)}
                            {!!policy?.areCategoriesEnabled && (0, OptionsListUtils_1.hasEnabledOptions)(policyCategories ?? {}) && (<OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(customUnit ?? {}, 'defaultCategory')} pendingAction={customUnit?.pendingFields?.defaultCategory} errorRowStyles={styles.mh5} onClose={() => clearErrorFields('defaultCategory')}>
                                    <CategorySelector_1.default policyID={policyID} label={translate('workspace.common.defaultCategory')} defaultValue={defaultCategory} wrapperStyle={[styles.ph5, styles.mt3]} setNewCategory={setNewCategory} isPickerVisible={isCategoryPickerVisible} showPickerModal={() => setIsCategoryPickerVisible(true)} hidePickerModal={() => setIsCategoryPickerVisible(false)}/>
                                </OfflineWithFeedback_1.default>)}
                            <OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(customUnit ?? {}, 'taxEnabled')} errorRowStyles={styles.mh5} pendingAction={customUnit?.pendingFields?.taxEnabled}>
                                <react_native_1.View style={[styles.mt2, styles.mh5]}>
                                    <react_native_1.View style={[styles.flexRow, styles.mb2, styles.mr2, styles.alignItemsCenter, styles.justifyContentBetween]}>
                                        <Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('workspace.distanceRates.trackTax')}</Text_1.default>
                                        <Switch_1.default isOn={isDistanceTrackTaxEnabled && isPolicyTrackTaxEnabled} accessibilityLabel={translate('workspace.distanceRates.trackTax')} onToggle={onToggleTrackTax} disabled={!isPolicyTrackTaxEnabled}/>
                                    </react_native_1.View>
                                </react_native_1.View>
                                {!isPolicyTrackTaxEnabled && (<react_native_1.View style={[styles.mh5]}>
                                        <Text_1.default style={styles.colorMuted}>
                                            {translate('workspace.distanceRates.taxFeatureNotEnabledMessage')}
                                            <TextLink_1.default onPress={() => {
                Navigation_1.default.dismissModal();
                Navigation_1.default.isNavigationReady().then(() => {
                    Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID));
                });
            }}>
                                                {translate('workspace.common.moreFeatures')}
                                            </TextLink_1.default>
                                            {translate('workspace.distanceRates.changePromptMessage')}
                                        </Text_1.default>
                                    </react_native_1.View>)}
                            </OfflineWithFeedback_1.default>
                        </react_native_1.View>
                    </ScrollView_1.default>
                </FullPageBlockingView>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
PolicyDistanceRatesSettingsPage.displayName = 'PolicyDistanceRatesSettingsPage';
exports.default = PolicyDistanceRatesSettingsPage;
