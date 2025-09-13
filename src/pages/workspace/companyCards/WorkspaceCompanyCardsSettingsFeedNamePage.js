"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspaceTaxCustomName_1 = require("@src/types/form/WorkspaceTaxCustomName");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function WorkspaceCompanyCardsSettingsFeedNamePage({ route: { params: { policyID }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [lastSelectedFeed, lastSelectedFeedResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_FEED}${policyID}`, { canBeMissing: true });
    const [cardFeeds, cardFeedsResult] = (0, useCardFeeds_1.default)(policyID);
    const selectedFeed = (0, CardUtils_1.getSelectedFeed)(lastSelectedFeed, cardFeeds);
    const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    const feedName = (0, CardUtils_1.getCustomOrFormattedFeedName)(selectedFeed, cardFeeds?.settings?.companyCardNicknames);
    const domainOrWorkspaceAccountID = (0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, selectedFeed ? companyFeeds[selectedFeed] : undefined);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const value = values[WorkspaceTaxCustomName_1.default.NAME];
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(value)) {
            errors.name = translate('workspace.moreFeatures.companyCards.error.feedNameRequired');
        }
        else if (value.length > CONST_1.default.NAME.MAX_LENGTH) {
            errors.name = translate('common.error.characterLimitExceedCounter', {
                length: value.length,
                limit: CONST_1.default.NAME.MAX_LENGTH,
            });
        }
        return errors;
    }, [translate]);
    const submit = ({ name }) => {
        if (selectedFeed) {
            (0, CompanyCards_1.setWorkspaceCompanyCardFeedName)(policyID, domainOrWorkspaceAccountID, selectedFeed, name);
        }
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SETTINGS.getRoute(policyID));
    };
    if ((0, isLoadingOnyxValue_1.default)(cardFeedsResult) || (0, isLoadingOnyxValue_1.default)(lastSelectedFeedResult)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={WorkspaceCompanyCardsSettingsFeedNamePage.displayName} style={styles.defaultModalContainer}>
                <HeaderWithBackButton_1.default title={translate('workspace.moreFeatures.companyCards.cardFeedName')}/>
                <Text_1.default style={[styles.flexRow, styles.alignItemsCenter, styles.mt3, styles.mh5, styles.mb5]}>
                    <Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('workspace.moreFeatures.companyCards.setFeedNameDescription')}</Text_1.default>
                </Text_1.default>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_COMPANY_CARD_FEED_NAME} submitButtonText={translate('workspace.editor.save')} style={[styles.flexGrow1, styles.ph5]} scrollContextEnabled enabledWhenOffline validate={validate} onSubmit={submit} shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} inputID={WorkspaceTaxCustomName_1.default.NAME} label={translate('workspace.editor.nameInputLabel')} accessibilityLabel={translate('workspace.editor.nameInputLabel')} defaultValue={feedName} multiline={false} ref={inputCallbackRef}/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCompanyCardsSettingsFeedNamePage.displayName = 'WorkspaceCompanyCardsSettingsFeedNamePage';
exports.default = WorkspaceCompanyCardsSettingsFeedNamePage;
