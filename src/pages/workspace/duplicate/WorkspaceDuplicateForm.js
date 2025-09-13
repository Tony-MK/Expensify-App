"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var AvatarWithImagePicker_1 = require("@components/AvatarWithImagePicker");
var FormProvider_1 = require("@components/Form/FormProvider");
var InputWrapper_1 = require("@components/Form/InputWrapper");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Expensicons = require("@components/Icon/Expensicons");
var ScrollView_1 = require("@components/ScrollView");
var Text_1 = require("@components/Text");
var TextInput_1 = require("@components/TextInput");
var useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
var useLocalize_1 = require("@hooks/useLocalize");
var usePolicy_1 = require("@hooks/usePolicy");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useWorkspaceConfirmationAvatar_1 = require("@hooks/useWorkspaceConfirmationAvatar");
var Policy_1 = require("@libs/actions/Policy/Policy");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var getFirstAlphaNumericCharacter_1 = require("@libs/getFirstAlphaNumericCharacter");
var ReportUtils_1 = require("@libs/ReportUtils");
var ValidationUtils_1 = require("@libs/ValidationUtils");
var Navigation_1 = require("@navigation/Navigation");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var WorkspaceDuplicateForm_1 = require("@src/types/form/WorkspaceDuplicateForm");
function WorkspaceDuplicateForm(_a) {
    var _b;
    var policyID = _a.policyID;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var inputCallbackRef = (0, useAutoFocusInput_1.default)().inputCallbackRef;
    var policy = (0, usePolicy_1.default)(policyID);
    var defaultWorkspaceName = "".concat(policy === null || policy === void 0 ? void 0 : policy.name, " (").concat(translate('workspace.common.duplicateWorkspacePrefix'), ")");
    var validate = (0, react_1.useCallback)(function (values) {
        var errors = {};
        var name = values.name.trim();
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(name)) {
            errors.name = translate('workspace.editor.nameIsRequiredError');
        }
        else if (__spreadArray([], name, true).length > CONST_1.default.TITLE_CHARACTER_LIMIT) {
            // Uses the spread syntax to count the number of Unicode code points instead of the number of UTF-16
            // code units.
            (0, ErrorUtils_1.addErrorMessage)(errors, 'name', translate('common.error.characterLimitExceedCounter', { length: __spreadArray([], name, true).length, limit: CONST_1.default.TITLE_CHARACTER_LIMIT }));
        }
        return errors;
    }, [translate]);
    var onSubmit = (0, react_1.useCallback)(function (_a) {
        var name = _a.name, avatarFile = _a.avatarFile;
        if (!policyID) {
            return;
        }
        var newPolicyID = (0, Policy_1.generatePolicyID)();
        (0, Policy_1.setDuplicateWorkspaceData)({ policyID: newPolicyID, name: name, file: avatarFile });
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_DUPLICATE_SELECT_FEATURES.getRoute(policyID));
    }, [policyID]);
    var _c = (0, react_1.useState)(defaultWorkspaceName !== null && defaultWorkspaceName !== void 0 ? defaultWorkspaceName : ''), workspaceNameFirstCharacter = _c[0], setWorkspaceNameFirstCharacter = _c[1];
    var _d = (0, react_1.useState)({
        avatarUri: null,
        avatarFileName: null,
        avatarFileType: null,
    }), workspaceAvatar = _d[0], setWorkspaceAvatar = _d[1];
    var _e = (0, react_1.useState)(), avatarFile = _e[0], setAvatarFile = _e[1];
    var stashedLocalAvatarImage = (_b = workspaceAvatar === null || workspaceAvatar === void 0 ? void 0 : workspaceAvatar.avatarUri) !== null && _b !== void 0 ? _b : undefined;
    var DefaultAvatar = (0, useWorkspaceConfirmationAvatar_1.default)({
        policyID: policyID,
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
    avatarID={policyID} source={stashedLocalAvatarImage} onImageSelected={function (image) {
            var _a, _b;
            setAvatarFile(image);
            setWorkspaceAvatar({ avatarUri: (_a = image.uri) !== null && _a !== void 0 ? _a : '', avatarFileName: (_b = image.name) !== null && _b !== void 0 ? _b : '', avatarFileType: image.type });
        }} onImageRemoved={function () {
            setAvatarFile(undefined);
            setWorkspaceAvatar({ avatarUri: null, avatarFileName: null, avatarFileType: null });
        }} size={CONST_1.default.AVATAR_SIZE.X_LARGE} avatarStyle={[styles.avatarXLarge, styles.alignSelfCenter]} shouldDisableViewPhoto editIcon={Expensicons.Camera} editIconStyle={styles.smallEditIconAccount} type={CONST_1.default.ICON_TYPE_WORKSPACE} style={[styles.w100, styles.alignItemsCenter, styles.mv4, styles.mb6, styles.alignSelfCenter, styles.ph5]} DefaultAvatar={DefaultAvatar} editorMaskImage={Expensicons.ImageCropSquareMask}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_DUPLICATE_FORM} submitButtonText={translate('common.next')} style={[styles.flexGrow1, styles.ph5]} scrollContextEnabled validate={validate} onSubmit={function (val) {
            return onSubmit({
                name: val[WorkspaceDuplicateForm_1.default.NAME],
                avatarFile: avatarFile,
            });
        }} enabledWhenOffline addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} inputID={WorkspaceDuplicateForm_1.default.NAME} label={translate('workspace.common.workspaceName')} accessibilityLabel={translate('workspace.common.workspaceName')} spellCheck={false} defaultValue={defaultWorkspaceName} onChangeText={function (str) {
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
