"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const CheckboxWithLabel_1 = require("@components/CheckboxWithLabel");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
const Travel_1 = require("@libs/actions/Travel");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function TravelTerms({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const isBlockedFromSpotnanaTravel = isBetaEnabled(CONST_1.default.BETAS.PREVENT_SPOTNANA_TRAVEL);
    const [hasAcceptedTravelTerms, setHasAcceptedTravelTerms] = (0, react_1.useState)(false);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)('');
    const [travelProvisioning] = (0, useOnyx_1.default)(ONYXKEYS_1.default.TRAVEL_PROVISIONING, { canBeMissing: true });
    const isLoading = travelProvisioning?.isLoading;
    const domain = route.params.domain === CONST_1.default.TRAVEL.DEFAULT_DOMAIN ? undefined : route.params.domain;
    (0, react_1.useEffect)(() => {
        if (travelProvisioning?.error === CONST_1.default.TRAVEL.PROVISIONING.ERROR_PERMISSION_DENIED && domain) {
            Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_DOMAIN_PERMISSION_INFO.getRoute(domain));
            (0, Travel_1.cleanupTravelProvisioningSession)();
        }
        if (travelProvisioning?.spotnanaToken) {
            Navigation_1.default.closeRHPFlow();
            (0, Travel_1.cleanupTravelProvisioningSession)();
            // TravelDot is a standalone white-labeled implementation of Spotnana so it has to be opened in a new tab
            react_native_1.Linking.openURL((0, Link_1.buildTravelDotURL)(travelProvisioning.spotnanaToken, travelProvisioning.isTestAccount ?? false));
        }
        if (travelProvisioning?.errors && !travelProvisioning?.error) {
            setErrorMessage((0, ErrorUtils_1.getLatestErrorMessage)(travelProvisioning));
        }
    }, [travelProvisioning, domain]);
    const toggleTravelTerms = () => {
        setHasAcceptedTravelTerms(!hasAcceptedTravelTerms);
    };
    (0, react_1.useEffect)(() => {
        if (!hasAcceptedTravelTerms) {
            return;
        }
        setErrorMessage('');
    }, [hasAcceptedTravelTerms]);
    // Add beta support for FullPageNotFound that is universal across travel pages
    return (<ScreenWrapper_1.default shouldEnableMaxHeight testID={TravelTerms.displayName}>
            <FullPageNotFoundView_1.default shouldShow={!CONFIG_1.default.IS_HYBRID_APP && isBlockedFromSpotnanaTravel}>
                <HeaderWithBackButton_1.default title={translate('travel.termsAndConditions.header')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <react_native_gesture_handler_1.ScrollView contentContainerStyle={[styles.flexGrow1, styles.ph5, styles.pb5]}>
                    <react_native_1.View style={styles.flex1}>
                        <Text_1.default style={styles.headerAnonymousFooter}>{`${translate('travel.termsAndConditions.title')}`}</Text_1.default>
                        <react_native_1.View style={[styles.renderHTML, styles.mt4]}>
                            <RenderHTML_1.default html={translate('travel.termsAndConditions.subtitle')}/>
                        </react_native_1.View>
                        <CheckboxWithLabel_1.default style={styles.mt6} accessibilityLabel={translate('travel.termsAndConditions.label')} onInputChange={toggleTravelTerms} label={translate('travel.termsAndConditions.label')}/>
                    </react_native_1.View>

                    <FormAlertWithSubmitButton_1.default buttonText={translate('common.continue')} isDisabled={!hasAcceptedTravelTerms} onSubmit={() => {
            if (!hasAcceptedTravelTerms) {
                setErrorMessage(translate('travel.termsAndConditions.error'));
                return;
            }
            if (errorMessage) {
                setErrorMessage('');
            }
            (0, Travel_1.acceptSpotnanaTerms)(domain);
        }} message={errorMessage} isAlertVisible={!!errorMessage} containerStyles={[styles.mh0, styles.mt5]} isLoading={isLoading}/>
                </react_native_gesture_handler_1.ScrollView>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
TravelTerms.displayName = 'TravelMenu';
exports.default = TravelTerms;
