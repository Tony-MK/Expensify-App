"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePolicy_1 = require("@hooks/usePolicy");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Travel_1 = require("@libs/actions/Travel");
const Navigation_1 = require("@libs/Navigation/Navigation");
const openTravelDotLink_1 = require("@libs/openTravelDotLink");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const colors_1 = require("@styles/theme/colors");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const Button_1 = require("./Button");
const ConfirmModal_1 = require("./ConfirmModal");
const DotIndicatorMessage_1 = require("./DotIndicatorMessage");
const Illustrations_1 = require("./Icon/Illustrations");
const RenderHTML_1 = require("./RenderHTML");
const navigateToAcceptTerms = (domain, isUserValidated) => {
    // Remove the previous provision session information if any is cached.
    (0, Travel_1.cleanupTravelProvisioningSession)();
    if (isUserValidated) {
        Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_TCS.getRoute(domain));
        return;
    }
    Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONTACT_METHOD_VERIFY_ACCOUNT.getRoute(Navigation_1.default.getActiveRoute(), ROUTES_1.default.TRAVEL_TCS.getRoute(domain)));
};
function BookTravelButton({ text, shouldRenderErrorMessageBelowButton = false, setShouldScrollToBottom }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const phoneErrorMethodsRoute = `${environmentURL}/${ROUTES_1.default.SETTINGS_CONTACT_METHODS.getRoute(Navigation_1.default.getActiveRoute())}`;
    const [activePolicyID, activePolicyIDMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const isUserValidated = account?.validated ?? false;
    const primaryLogin = account?.primaryLogin ?? '';
    const isLoading = (0, isLoadingOnyxValue_1.default)(activePolicyIDMetadata);
    const policy = (0, usePolicy_1.default)(activePolicyID);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)('');
    const [travelSettings] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRAVEL_SETTINGS, { canBeMissing: true });
    const [sessionEmail] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email, canBeMissing: false });
    const primaryContactMethod = primaryLogin ?? sessionEmail ?? '';
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [isPreventionModalVisible, setPreventionModalVisibility] = (0, react_1.useState)(false);
    const [isVerificationModalVisible, setVerificationModalVisibility] = (0, react_1.useState)(false);
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const { login: currentUserLogin } = (0, useCurrentUserPersonalDetails_1.default)();
    const activePolicies = (0, PolicyUtils_1.getActivePolicies)(policies, currentUserLogin);
    const groupPaidPolicies = activePolicies.filter((activePolicy) => activePolicy.type !== CONST_1.default.POLICY.TYPE.PERSONAL && (0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy));
    const hidePreventionModal = () => setPreventionModalVisibility(false);
    const hideVerificationModal = () => setVerificationModalVisibility(false);
    (0, react_1.useEffect)(() => {
        if (!errorMessage) {
            return;
        }
        setShouldScrollToBottom?.(true);
    }, [errorMessage, setShouldScrollToBottom]);
    const bookATrip = (0, react_1.useCallback)(() => {
        setErrorMessage('');
        if (isBetaEnabled(CONST_1.default.BETAS.PREVENT_SPOTNANA_TRAVEL)) {
            setPreventionModalVisibility(true);
            return;
        }
        // The primary login of the user is where Spotnana sends the emails with booking confirmations, itinerary etc. It can't be a phone number.
        if (!primaryContactMethod || expensify_common_1.Str.isSMSLogin(primaryContactMethod)) {
            setErrorMessage(<RenderHTML_1.default html={translate('travel.phoneError', { phoneErrorMethodsRoute })}/>);
            return;
        }
        const adminDomains = (0, PolicyUtils_1.getAdminsPrivateEmailDomains)(policy);
        if (adminDomains.length === 0) {
            Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_PUBLIC_DOMAIN_ERROR.getRoute(Navigation_1.default.getActiveRoute()));
            return;
        }
        if (groupPaidPolicies.length < 1) {
            Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_UPGRADE.getRoute(Navigation_1.default.getActiveRoute()));
            return;
        }
        if (!(0, PolicyUtils_1.isPaidGroupPolicy)(policy)) {
            setErrorMessage(translate('travel.termsAndConditions.defaultWorkspaceError'));
            return;
        }
        const isPolicyProvisioned = policy?.travelSettings?.spotnanaCompanyID ?? policy?.travelSettings?.associatedTravelDomainAccountID;
        if (policy?.travelSettings?.hasAcceptedTerms ?? (travelSettings?.hasAcceptedTerms && isPolicyProvisioned)) {
            (0, openTravelDotLink_1.openTravelDotLink)(policy?.id);
        }
        else if (isPolicyProvisioned) {
            navigateToAcceptTerms(CONST_1.default.TRAVEL.DEFAULT_DOMAIN);
        }
        else if (!isBetaEnabled(CONST_1.default.BETAS.IS_TRAVEL_VERIFIED)) {
            setVerificationModalVisibility(true);
            if (!travelSettings?.lastTravelSignupRequestTime) {
                (0, Travel_1.requestTravelAccess)();
            }
        }
        // Determine the domain to associate with the workspace during provisioning in Spotnana.
        // - If all admins share the same private domain, the workspace is tied to it automatically.
        // - If admins have multiple private domains, the user must select one.
        // - Public domains are not allowed; an error page is shown in that case.
        else if (adminDomains.length === 1) {
            const domain = adminDomains.at(0) ?? CONST_1.default.TRAVEL.DEFAULT_DOMAIN;
            if ((0, EmptyObject_1.isEmptyObject)(policy?.address)) {
                // Spotnana requires an address anytime an entity is created for a policy
                Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_WORKSPACE_ADDRESS.getRoute(domain, Navigation_1.default.getActiveRoute()));
            }
            else {
                navigateToAcceptTerms(domain, !!isUserValidated);
            }
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_DOMAIN_SELECTOR.getRoute(Navigation_1.default.getActiveRoute()));
        }
    }, [
        primaryContactMethod,
        policy,
        groupPaidPolicies.length,
        travelSettings?.hasAcceptedTerms,
        travelSettings?.lastTravelSignupRequestTime,
        isBetaEnabled,
        styles.flexRow,
        StyleUtils,
        translate,
        isUserValidated,
        phoneErrorMethodsRoute,
    ]);
    return (<>
            {!shouldRenderErrorMessageBelowButton && !!errorMessage && (<DotIndicatorMessage_1.default style={styles.mb1} messages={{ error: errorMessage }} type="error"/>)}
            <Button_1.default text={text} onPress={bookATrip} accessibilityLabel={translate('travel.bookTravel')} style={styles.w100} isLoading={isLoading} isDisabled={!isLoading && !activePolicyID} success large/>
            {shouldRenderErrorMessageBelowButton && !!errorMessage && (<DotIndicatorMessage_1.default style={[styles.mb1, styles.pt3]} messages={{ error: errorMessage }} type="error"/>)}
            <ConfirmModal_1.default title={translate('travel.blockedFeatureModal.title')} titleStyles={styles.textHeadlineH1} titleContainerStyles={styles.mb2} onConfirm={hidePreventionModal} onCancel={hidePreventionModal} image={Illustrations_1.RocketDude} imageStyles={StyleUtils.getBackgroundColorStyle(colors_1.default.ice600)} isVisible={isPreventionModalVisible} prompt={translate('travel.blockedFeatureModal.message')} promptStyles={styles.mb2} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
            <ConfirmModal_1.default title={translate('travel.verifyCompany.title')} titleStyles={styles.textHeadlineH1} titleContainerStyles={styles.mb2} onConfirm={hideVerificationModal} onCancel={hideVerificationModal} image={Illustrations_1.RocketDude} imageStyles={StyleUtils.getBackgroundColorStyle(colors_1.default.ice600)} isVisible={isVerificationModalVisible} prompt={translate('travel.verifyCompany.message')} promptStyles={styles.mb2} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
        </>);
}
BookTravelButton.displayName = 'BookTravelButton';
exports.default = BookTravelButton;
