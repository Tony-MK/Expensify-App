"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AvatarWithImagePicker_1 = require("@components/AvatarWithImagePicker");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspaceConfirmationAvatar_1 = require("@hooks/useWorkspaceConfirmationAvatar");
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const getFirstAlphaNumericCharacter_1 = require("@libs/getFirstAlphaNumericCharacter");
const ReportUtils_1 = require("@libs/ReportUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspaceDuplicateForm_1 = require("@src/types/form/WorkspaceDuplicateForm");
function WorkspaceDuplicateForm({ policyID }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const defaultWorkspaceName = `${policy?.name} (${translate('workspace.common.duplicateWorkspacePrefix')})`;
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const name = values.name.trim();
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(name)) {
            errors.name = translate('workspace.editor.nameIsRequiredError');
        }
        else if ([...name].length > CONST_1.default.TITLE_CHARACTER_LIMIT) {
            // Uses the spread syntax to count the number of Unicode code points instead of the number of UTF-16
            // code units.
            (0, ErrorUtils_1.addErrorMessage)(errors, 'name', translate('common.error.characterLimitExceedCounter', { length: [...name].length, limit: CONST_1.default.TITLE_CHARACTER_LIMIT }));
        }
        return errors;
    }, [translate]);
    const onSubmit = (0, react_1.useCallback)(({ name, avatarFile }) => {
        if (!policyID) {
            return;
        }
        const newPolicyID = (0, Policy_1.generatePolicyID)();
        (0, Policy_1.setDuplicateWorkspaceData)({ policyID: newPolicyID, name, file: avatarFile });
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_DUPLICATE_SELECT_FEATURES.getRoute(policyID));
    }, [policyID]);
    const [workspaceNameFirstCharacter, setWorkspaceNameFirstCharacter] = (0, react_1.useState)(defaultWorkspaceName ?? '');
    const [workspaceAvatar, setWorkspaceAvatar] = (0, react_1.useState)({
        avatarUri: null,
        avatarFileName: null,
        avatarFileType: null,
    });
    const [avatarFile, setAvatarFile] = (0, react_1.useState)();
    const stashedLocalAvatarImage = workspaceAvatar?.avatarUri ?? undefined;
    const DefaultAvatar = (0, useWorkspaceConfirmationAvatar_1.default)({
        policyID,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing cannot be used if left side can be empty string
        source: stashedLocalAvatarImage || (0, ReportUtils_1.getDefaultWorkspaceAvatar)(workspaceNameFirstCharacter),
        name: workspaceNameFirstCharacter,
    });
    return (<>
            <HeaderWithBackButton_1.default title={translate('workspace.common.duplicateWorkspace')}/>
            <ScrollView_1.default contentContainerStyle={styles.flexGrow1} keyboardShouldPersistTaps="always">
                <react_native_1.View style={[styles.ph5, styles.pv3]}>
                    <Text_1.default style={[styles.mb3, styles.textHeadline]}>{translate('workspace.duplicateWorkspace.title')}</Text_1.default>
                </react_native_1.View>
                <AvatarWithImagePicker_1.default isUsingDefaultAvatar={!stashedLocalAvatarImage} 
    // eslint-disable-next-line react-compiler/react-compiler
    avatarID={policyID} source={stashedLocalAvatarImage} onImageSelected={(image) => {
            setAvatarFile(image);
            setWorkspaceAvatar({ avatarUri: image.uri ?? '', avatarFileName: image.name ?? '', avatarFileType: image.type });
        }} onImageRemoved={() => {
            setAvatarFile(undefined);
            setWorkspaceAvatar({ avatarUri: null, avatarFileName: null, avatarFileType: null });
        }} size={CONST_1.default.AVATAR_SIZE.X_LARGE} avatarStyle={[styles.avatarXLarge, styles.alignSelfCenter]} shouldDisableViewPhoto editIcon={Expensicons.Camera} editIconStyle={styles.smallEditIconAccount} type={CONST_1.default.ICON_TYPE_WORKSPACE} style={[styles.w100, styles.alignItemsCenter, styles.mv4, styles.mb6, styles.alignSelfCenter, styles.ph5]} DefaultAvatar={DefaultAvatar} editorMaskImage={Expensicons.ImageCropSquareMask}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_DUPLICATE_FORM} submitButtonText={translate('common.next')} style={[styles.flexGrow1, styles.ph5]} scrollContextEnabled validate={validate} onSubmit={(val) => onSubmit({
            name: val[WorkspaceDuplicateForm_1.default.NAME],
            avatarFile,
        })} enabledWhenOffline addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} inputID={WorkspaceDuplicateForm_1.default.NAME} label={translate('workspace.common.workspaceName')} accessibilityLabel={translate('workspace.common.workspaceName')} spellCheck={false} defaultValue={defaultWorkspaceName} onChangeText={(str) => {
            if ((0, getFirstAlphaNumericCharacter_1.default)(str) === (0, getFirstAlphaNumericCharacter_1.default)(workspaceNameFirstCharacter)) {
                return;
            }
            setWorkspaceNameFirstCharacter(str);
        }} ref={inputCallbackRef}/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScrollView_1.default>
        </>);
}
WorkspaceDuplicateForm.displayName = 'WorkspaceDuplicateForm';
exports.default = WorkspaceDuplicateForm;
