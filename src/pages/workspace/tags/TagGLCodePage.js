"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Tag_1 = require("@userActions/Policy/Tag");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const WorkspaceTagForm_1 = require("@src/types/form/WorkspaceTagForm");
function TagGLCodePage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const backTo = route.params.backTo;
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const tagName = route.params.tagName;
    const orderWeight = route.params.orderWeight;
    const { tags } = (0, PolicyUtils_1.getTagListByOrderWeight)(policyTags, orderWeight);
    const glCode = tags?.[route.params.tagName]?.['GL Code'];
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_GL_CODE;
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAG_SETTINGS.getRoute(policyID, orderWeight, tagName, backTo) : ROUTES_1.default.WORKSPACE_TAG_SETTINGS.getRoute(policyID, orderWeight, tagName));
    }, [orderWeight, policyID, tagName, isQuickSettingsFlow, backTo]);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const tagGLCode = values.glCode.trim();
        if (tagGLCode.length > CONST_1.default.MAX_LENGTH_256) {
            errors.glCode = translate('common.error.characterLimitExceedCounter', { length: tagGLCode.length, limit: CONST_1.default.MAX_LENGTH_256 });
        }
        return errors;
    }, [translate]);
    const editGLCode = (0, react_1.useCallback)((values) => {
        const newGLCode = values.glCode.trim();
        if (newGLCode !== glCode) {
            (0, Tag_1.setPolicyTagGLCode)(policyID, tagName, orderWeight, newGLCode);
        }
        goBack();
    }, [glCode, policyID, tagName, orderWeight, goBack]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED} shouldBeBlocked={(0, PolicyUtils_1.hasAccountingConnections)(policy)}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={TagGLCodePage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.tags.glCode')} onBackButtonPress={goBack}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_TAG_FORM} validate={validate} onSubmit={editGLCode} submitButtonText={translate('common.save')} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <InputWrapper_1.default ref={inputCallbackRef} InputComponent={TextInput_1.default} defaultValue={glCode} label={translate('workspace.tags.glCode')} accessibilityLabel={translate('workspace.tags.glCode')} inputID={WorkspaceTagForm_1.default.TAG_GL_CODE} role={CONST_1.default.ROLE.PRESENTATION}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
TagGLCodePage.displayName = 'TagGLCodePage';
exports.default = TagGLCodePage;
