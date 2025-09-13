"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@react-navigation/core");
const react_1 = require("react");
const react_native_1 = require("react-native");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Button_1 = require("@components/Button");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Illustrations = require("@components/Icon/Illustrations");
const RoomNameInput_1 = require("@components/RoomNameInput");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const ValuePicker_1 = require("@components/ValuePicker");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const variables_1 = require("@styles/variables");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const NewRoomForm_1 = require("@src/types/form/NewRoomForm");
function EmptyWorkspaceView() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const bottomSafeAreaPaddingStyle = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({ addBottomSafeAreaPadding: true, additionalPaddingBottom: styles.mb5.marginBottom, styleProperty: 'marginBottom' });
    return (<>
            <BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.emptyWorkspace.notFound')} subtitle={translate('workspace.emptyWorkspace.description')} addBottomSafeAreaPadding/>
            <Button_1.default success large text={translate('footer.learnMore')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACES_LIST.getRoute(Navigation_1.default.getActiveRoute()))} style={[styles.mh5, bottomSafeAreaPaddingStyle]}/>
        </>);
}
function WorkspaceNewRoomPage(_, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const isFocused = (0, core_1.useIsFocused)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [shouldEnableValidation, setShouldEnableValidation] = (0, react_1.useState)(false);
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: false });
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to show offline indicator on small screen only
    const { top } = (0, useSafeAreaInsets_1.default)();
    const [visibility, setVisibility] = (0, react_1.useState)(CONST_1.default.REPORT.VISIBILITY.RESTRICTED);
    const [writeCapability, setWriteCapability] = (0, react_1.useState)(CONST_1.default.REPORT.WRITE_CAPABILITIES.ALL);
    const visibilityDescription = (0, react_1.useMemo)(() => translate(`newRoomPage.${visibility}Description`), [translate, visibility]);
    const roomPageInputRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => ({
        focus: () => roomPageInputRef.current?.focus(),
    }));
    const workspaceOptions = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getActivePolicies)(policies, session?.email)
        ?.filter((policy) => policy.type !== CONST_1.default.POLICY.TYPE.PERSONAL)
        .map((policy) => ({
        label: policy.name,
        value: policy.id,
    }))
        .sort((a, b) => localeCompare(a.label, b.label)) ?? [], [policies, session?.email, localeCompare]);
    const [policyID, setPolicyID] = (0, react_1.useState)(() => {
        if (!!activePolicyID && workspaceOptions.some((option) => option.value === activePolicyID)) {
            return activePolicyID;
        }
        return '';
    });
    const isAdminPolicy = (0, react_1.useMemo)(() => {
        if (!policyID) {
            return false;
        }
        return (0, ReportUtils_1.isPolicyAdmin)(policyID, policies);
    }, [policyID, policies]);
    /**
     * @param values - form input values passed by the Form component
     */
    const submit = (values) => {
        (0, Report_1.setNewRoomFormLoading)();
        const participants = [session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID];
        const parsedDescription = (0, ReportUtils_1.getParsedComment)(values.reportDescription ?? '', { policyID });
        const policyReport = (0, ReportUtils_1.buildOptimisticChatReport)({
            participantList: participants,
            reportName: values.roomName,
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
            policyID,
            ownerAccountID: CONST_1.default.REPORT.OWNER_ACCOUNT_ID_FAKE,
            visibility,
            writeCapability: writeCapability || CONST_1.default.REPORT.WRITE_CAPABILITIES.ALL,
            notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.DAILY,
            description: parsedDescription,
        });
        react_native_1.InteractionManager.runAfterInteractions(() => {
            requestAnimationFrame(() => {
                (0, Report_1.addPolicyReport)(policyReport);
            });
        });
    };
    (0, react_1.useEffect)(() => {
        if (!isFocused) {
            return;
        }
        setShouldEnableValidation(false);
        (0, Report_1.clearNewRoomFormError)().then(() => setShouldEnableValidation(true));
    }, [isFocused]);
    (0, react_1.useEffect)(() => {
        if (policyID) {
            if (!workspaceOptions.some((opt) => opt.value === policyID)) {
                setPolicyID('');
            }
            return;
        }
        if (!!activePolicyID && workspaceOptions.some((opt) => opt.value === activePolicyID)) {
            setPolicyID(activePolicyID);
        }
        else {
            setPolicyID('');
        }
    }, [activePolicyID, policyID, workspaceOptions]);
    (0, react_1.useEffect)(() => {
        if (isAdminPolicy) {
            return;
        }
        setWriteCapability(CONST_1.default.REPORT.WRITE_CAPABILITIES.ALL);
    }, [isAdminPolicy]);
    /**
     * @param values - form input values passed by the Form component
     * @returns an object containing validation errors, if any were found during validation
     */
    const validate = (0, react_1.useCallback)((values) => {
        if (!shouldEnableValidation) {
            return {};
        }
        const errors = {};
        if (!values.roomName || values.roomName === CONST_1.default.POLICY.ROOM_PREFIX) {
            // We error if the user doesn't enter a room name or left blank
            (0, ErrorUtils_1.addErrorMessage)(errors, 'roomName', translate('newRoomPage.pleaseEnterRoomName'));
        }
        else if (values.roomName !== CONST_1.default.POLICY.ROOM_PREFIX && !(0, ValidationUtils_1.isValidRoomNameWithoutLimits)(values.roomName)) {
            // We error if the room name has invalid characters
            (0, ErrorUtils_1.addErrorMessage)(errors, 'roomName', translate('newRoomPage.roomNameInvalidError'));
        }
        else if ((0, ValidationUtils_1.isReservedRoomName)(values.roomName)) {
            // Certain names are reserved for default rooms and should not be used for policy rooms.
            (0, ErrorUtils_1.addErrorMessage)(errors, 'roomName', translate('newRoomPage.roomNameReservedError', { reservedName: values.roomName }));
        }
        else if ((0, ValidationUtils_1.isExistingRoomName)(values.roomName, reports, values.policyID)) {
            // Certain names are reserved for default rooms and should not be used for policy rooms.
            (0, ErrorUtils_1.addErrorMessage)(errors, 'roomName', translate('newRoomPage.roomAlreadyExistsError'));
        }
        else if (values.roomName.length > CONST_1.default.TITLE_CHARACTER_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'roomName', translate('common.error.characterLimitExceedCounter', { length: values.roomName.length, limit: CONST_1.default.TITLE_CHARACTER_LIMIT }));
        }
        const descriptionLength = (0, ReportUtils_1.getCommentLength)(values.reportDescription, { policyID });
        if (descriptionLength > CONST_1.default.REPORT_DESCRIPTION.MAX_LENGTH) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'reportDescription', translate('common.error.characterLimitExceedCounter', { length: descriptionLength, limit: CONST_1.default.REPORT_DESCRIPTION.MAX_LENGTH }));
        }
        if (!values.policyID) {
            errors.policyID = translate('newRoomPage.pleaseSelectWorkspace');
        }
        return errors;
    }, [reports, policyID, translate, shouldEnableValidation]);
    const writeCapabilityOptions = (0, react_1.useMemo)(() => Object.values(CONST_1.default.REPORT.WRITE_CAPABILITIES).map((value) => ({
        value,
        label: translate(`writeCapabilityPage.writeCapability.${value}`),
    })), [translate]);
    const visibilityOptions = (0, react_1.useMemo)(() => Object.values(CONST_1.default.REPORT.VISIBILITY)
        .filter((visibilityOption) => visibilityOption !== CONST_1.default.REPORT.VISIBILITY.PUBLIC_ANNOUNCE)
        .map((visibilityOption) => ({
        label: translate(`newRoomPage.visibilityOptions.${visibilityOption}`),
        value: visibilityOption,
        description: translate(`newRoomPage.${visibilityOption}Description`),
    })), [translate]);
    return (<ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding includePaddingTop={false} shouldShowOfflineIndicator shouldEnablePickerAvoiding={false} shouldEnableKeyboardAvoidingView={workspaceOptions.length !== 0} keyboardVerticalOffset={variables_1.default.contentHeaderHeight + variables_1.default.tabSelectorButtonHeight + variables_1.default.tabSelectorButtonPadding + top} 
    // Disable the focus trap of this page to activate the parent focus trap in `NewChatSelectorPage`.
    focusTrapSettings={{ active: false }} testID={WorkspaceNewRoomPage.displayName}>
            {workspaceOptions.length === 0 ? (<EmptyWorkspaceView />) : (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.NEW_ROOM_FORM} submitButtonText={translate('newRoomPage.createRoom')} style={[styles.h100, styles.mh5, styles.flexGrow1]} validate={validate} onSubmit={submit} enabledWhenOffline addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb5}>
                        <InputWrapper_1.default ref={roomPageInputRef} InputComponent={RoomNameInput_1.default} inputID={NewRoomForm_1.default.ROOM_NAME} isFocused={isFocused}/>
                    </react_native_1.View>
                    <react_native_1.View style={styles.mb5}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={NewRoomForm_1.default.REPORT_DESCRIPTION} label={translate('reportDescriptionPage.roomDescriptionOptional')} accessibilityLabel={translate('reportDescriptionPage.roomDescriptionOptional')} role={CONST_1.default.ROLE.PRESENTATION} autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} autoCapitalize="none" shouldInterceptSwipe type="markdown"/>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.mhn5]}>
                        <InputWrapper_1.default InputComponent={ValuePicker_1.default} inputID={NewRoomForm_1.default.POLICY_ID} label={translate('workspace.common.workspace')} items={workspaceOptions} value={policyID} onValueChange={(value) => setPolicyID(value)}/>
                    </react_native_1.View>
                    {isAdminPolicy && (<react_native_1.View style={styles.mhn5}>
                            <InputWrapper_1.default InputComponent={ValuePicker_1.default} inputID={NewRoomForm_1.default.WRITE_CAPABILITY} label={translate('writeCapabilityPage.label')} items={writeCapabilityOptions} value={writeCapability} onValueChange={(value) => setWriteCapability(value)}/>
                        </react_native_1.View>)}
                    <react_native_1.View style={[styles.mb1, styles.mhn5]}>
                        <InputWrapper_1.default InputComponent={ValuePicker_1.default} inputID={NewRoomForm_1.default.VISIBILITY} label={translate('newRoomPage.visibility')} items={visibilityOptions} onValueChange={(value) => setVisibility(value)} value={visibility} furtherDetails={visibilityDescription} shouldShowTooltips={false}/>
                    </react_native_1.View>
                </FormProvider_1.default>)}
        </ScreenWrapper_1.default>);
}
WorkspaceNewRoomPage.displayName = 'WorkspaceNewRoomPage';
exports.default = (0, react_1.forwardRef)(WorkspaceNewRoomPage);
