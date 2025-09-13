"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const RoomNameInput_1 = require("@components/RoomNameInput");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const RoomNameForm_1 = require("@src/types/form/RoomNameForm");
function RoomNamePage({ report }) {
    const route = (0, native_1.useRoute)();
    const styles = (0, useThemeStyles_1.default)();
    const roomNameInputRef = (0, react_1.useRef)(null);
    const isFocused = (0, native_1.useIsFocused)();
    const { translate } = (0, useLocalize_1.default)();
    const reportID = report?.reportID;
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(reportID, route.params.backTo)));
    }, [reportID, route.params.backTo]);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        // We should skip validation hence we return an empty errors and we skip Form submission on the onSubmit method
        if (values.roomName === report?.reportName) {
            return errors;
        }
        if (!values.roomName || values.roomName === CONST_1.default.POLICY.ROOM_PREFIX) {
            // We error if the user doesn't enter a room name or left blank
            (0, ErrorUtils_1.addErrorMessage)(errors, 'roomName', translate('newRoomPage.pleaseEnterRoomName'));
        }
        else if (!(0, ValidationUtils_1.isValidRoomNameWithoutLimits)(values.roomName)) {
            // We error if the room name has invalid characters
            (0, ErrorUtils_1.addErrorMessage)(errors, 'roomName', translate('newRoomPage.roomNameInvalidError'));
        }
        else if ((0, ValidationUtils_1.isReservedRoomName)(values.roomName)) {
            // Certain names are reserved for default rooms and should not be used for policy rooms.
            (0, ErrorUtils_1.addErrorMessage)(errors, 'roomName', translate('newRoomPage.roomNameReservedError', { reservedName: values.roomName }));
        }
        else if ((0, ValidationUtils_1.isExistingRoomName)(values.roomName, reports, report?.policyID)) {
            // The room name can't be set to one that already exists on the policy
            (0, ErrorUtils_1.addErrorMessage)(errors, 'roomName', translate('newRoomPage.roomAlreadyExistsError'));
        }
        else if (values.roomName.length > CONST_1.default.TITLE_CHARACTER_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'roomName', translate('common.error.characterLimitExceedCounter', { length: values.roomName.length, limit: CONST_1.default.TITLE_CHARACTER_LIMIT }));
        }
        return errors;
    }, [report, reports, translate]);
    const updatePolicyRoomName = (0, react_1.useCallback)((values) => {
        (0, Report_1.updatePolicyRoomName)(report, values.roomName);
        goBack();
    }, [report, goBack]);
    return (<ScreenWrapper_1.default onEntryTransitionEnd={() => roomNameInputRef.current?.focus()} includeSafeAreaPaddingBottom testID={RoomNamePage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={(0, ReportUtils_1.shouldDisableRename)(report, isReportArchived)}>
                <HeaderWithBackButton_1.default title={translate('newRoomPage.roomName')} onBackButtonPress={goBack}/>
                <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.ROOM_NAME_FORM} onSubmit={updatePolicyRoomName} validate={validate} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default InputComponent={RoomNameInput_1.default} ref={roomNameInputRef} inputID={RoomNameForm_1.default.ROOM_NAME} defaultValue={report?.reportName} isFocused={isFocused}/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
RoomNamePage.displayName = 'RoomNamePage';
exports.default = RoomNamePage;
