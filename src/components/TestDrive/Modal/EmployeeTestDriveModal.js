"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const date_fns_1 = require("date-fns");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const fake_test_drive_employee_receipt_jpg_1 = require("@assets/images/fake-test-drive-employee-receipt.jpg");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnboardingMessages_1 = require("@hooks/useOnboardingMessages");
const useOnyx_1 = require("@hooks/useOnyx");
const IOU_1 = require("@libs/actions/IOU");
const Onboarding_1 = require("@libs/actions/Onboarding");
const setTestReceipt_1 = require("@libs/actions/setTestReceipt");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const UserUtils_1 = require("@libs/UserUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const BaseTestDriveModal_1 = require("./BaseTestDriveModal");
function EmployeeTestDriveModal() {
    const { translate } = (0, useLocalize_1.default)();
    const reportID = (0, ReportUtils_1.generateReportID)();
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: true });
    const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID}`, { canBeMissing: true });
    const [currentDate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENT_DATE, { canBeMissing: true });
    const route = (0, native_1.useRoute)();
    const [bossEmail, setBossEmail] = (0, react_1.useState)(route.params?.bossEmail ?? '');
    const [formError, setFormError] = (0, react_1.useState)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const { testDrive } = (0, useOnboardingMessages_1.default)();
    const onBossEmailChange = (0, react_1.useCallback)((value) => {
        setBossEmail(value);
        setFormError(undefined);
    }, []);
    const navigate = () => {
        Log_1.default.hmmm('[EmployeeTestDriveModal] Navigate function called', { bossEmail });
        const loginTrim = bossEmail.trim();
        if (!loginTrim || !expensify_common_1.Str.isValidEmail(loginTrim)) {
            setFormError(translate('common.error.email'));
            return;
        }
        setIsLoading(true);
        (0, Onboarding_1.verifyTestDriveRecipient)(bossEmail)
            .then(() => {
            Log_1.default.hmmm('[EmployeeTestDriveModal] Test drive recipient verified');
            (0, setTestReceipt_1.default)(fake_test_drive_employee_receipt_jpg_1.default, 'jpg', (source, _, filename) => {
                const transactionID = CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID;
                (0, IOU_1.initMoneyRequest)({
                    reportID,
                    isFromGlobalCreate: false,
                    newIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN,
                    report,
                    parentReport,
                    currentDate,
                });
                (0, IOU_1.setMoneyRequestReceipt)(transactionID, source, filename, true, CONST_1.default.TEST_RECEIPT.FILE_TYPE, false, true);
                (0, IOU_1.setMoneyRequestParticipants)(transactionID, [
                    {
                        accountID: (0, UserUtils_1.generateAccountID)(bossEmail),
                        login: bossEmail,
                        displayName: bossEmail,
                        selected: true,
                    },
                ]);
                (0, IOU_1.setMoneyRequestAmount)(transactionID, testDrive.EMPLOYEE_FAKE_RECEIPT.AMOUNT, testDrive.EMPLOYEE_FAKE_RECEIPT.CURRENCY);
                (0, IOU_1.setMoneyRequestDescription)(transactionID, testDrive.EMPLOYEE_FAKE_RECEIPT.DESCRIPTION, true);
                (0, IOU_1.setMoneyRequestMerchant)(transactionID, testDrive.EMPLOYEE_FAKE_RECEIPT.MERCHANT, true);
                (0, IOU_1.setMoneyRequestCreated)(transactionID, (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING), true);
                Log_1.default.hmmm('[EmployeeTestDriveModal] Running after interactions');
                react_native_1.InteractionManager.runAfterInteractions(() => {
                    Log_1.default.hmmm('[EmployeeTestDriveModal] Calling Navigation.goBack() and Navigation.navigate()');
                    Navigation_1.default.goBack();
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.SUBMIT, transactionID, reportID));
                });
            }, () => {
                Log_1.default.hmmm('[EmployeeTestDriveModal] Error setting test receipt');
                setIsLoading(false);
                setFormError(translate('common.genericErrorMessage'));
            });
        })
            .catch((e) => {
            Log_1.default.hmmm('[EmployeeTestDriveModal] Error verifying test drive recipient', { error: e });
            setIsLoading(false);
            setFormError(e.translationKey ? translate(e.translationKey) : 'common.genericErrorMessage');
        });
    };
    const skipTestDrive = () => {
        Navigation_1.default.dismissModal();
    };
    return (<BaseTestDriveModal_1.default description={translate('testDrive.modal.employee.description')} onConfirm={navigate} onHelp={skipTestDrive} shouldCloseOnConfirm={false} shouldRenderHTMLDescription avoidKeyboard shouldShowConfirmationLoader={isLoading} canConfirmWhileOffline={false} shouldCallOnHelpWhenModalHidden>
            <TextInput_1.default placeholder={translate('testDrive.modal.employee.email')} accessibilityLabel={translate('testDrive.modal.employee.email')} value={bossEmail} onChangeText={onBossEmailChange} autoCapitalize="none" errorText={formError} inputMode={CONST_1.default.INPUT_MODE.EMAIL}/>
        </BaseTestDriveModal_1.default>);
}
EmployeeTestDriveModal.displayName = 'EmployeeTestDriveModal';
exports.default = EmployeeTestDriveModal;
