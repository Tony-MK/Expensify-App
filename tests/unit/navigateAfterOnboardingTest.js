"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const navigateAfterOnboarding_1 = require("@libs/navigateAfterOnboarding");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OnyxDerived_1 = require("@userActions/OnyxDerived");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const ONBOARDING_ADMINS_CHAT_REPORT_ID = '1';
const ONBOARDING_POLICY_ID = '2';
const REPORT_ID = '3';
const USER_ID = '4';
const mockFindLastAccessedReport = jest.fn();
const mockShouldOpenOnAdminRoom = jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useIsFocused: jest.fn(),
        triggerTransitionEnd: jest.fn(),
    };
});
jest.mock('@libs/ReportUtils', () => ({
    findLastAccessedReport: () => mockFindLastAccessedReport(),
    parseReportRouteParams: jest.fn(() => ({})),
    isConciergeChatReport: jest.requireActual('@libs/ReportUtils').isConciergeChatReport,
    isArchivedReport: jest.requireActual('@libs/ReportUtils').isArchivedReport,
    isThread: jest.requireActual('@libs/ReportUtils').isThread,
    generateReportName: jest.requireActual('@libs/ReportUtils').generateReportName,
    getAllPolicyReports: jest.requireActual('@libs/ReportUtils').getAllPolicyReports,
    isValidReport: jest.requireActual('@libs/ReportUtils').isValidReport,
    generateReportAttributes: jest.requireActual('@libs/ReportUtils').generateReportAttributes,
    getAllReportActionsErrorsAndReportActionThatRequiresAttention: jest.requireActual('@libs/ReportUtils').getAllReportActionsErrorsAndReportActionThatRequiresAttention,
    getAllReportErrors: jest.requireActual('@libs/ReportUtils').getAllReportErrors,
    shouldDisplayViolationsRBRInLHN: jest.requireActual('@libs/ReportUtils').shouldDisplayViolationsRBRInLHN,
    generateIsEmptyReport: jest.requireActual('@libs/ReportUtils').generateIsEmptyReport,
    isExpenseReport: jest.requireActual('@libs/ReportUtils').isExpenseReport,
}));
jest.mock('@libs/Navigation/helpers/shouldOpenOnAdminRoom', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: () => mockShouldOpenOnAdminRoom(),
}));
describe('navigateAfterOnboarding', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        (0, OnyxDerived_1.default)();
        return (0, waitForBatchedUpdates_1.default)();
    });
    beforeEach(async () => {
        jest.clearAllMocks();
        return react_native_onyx_1.default.clear();
    });
    it('should navigate to the admin room report if onboardingAdminsChatReportID is provided', () => {
        const navigate = jest.spyOn(Navigation_1.default, 'navigate');
        const testSession = { email: 'realaccount@gmail.com' };
        (0, navigateAfterOnboarding_1.navigateAfterOnboarding)(false, true, undefined, ONBOARDING_ADMINS_CHAT_REPORT_ID, (testSession?.email ?? '').includes('+'));
        expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.REPORT_WITH_ID.getRoute(ONBOARDING_ADMINS_CHAT_REPORT_ID));
    });
    it('should not navigate to the admin room report if onboardingAdminsChatReportID is not provided on larger screens', () => {
        (0, navigateAfterOnboarding_1.navigateAfterOnboarding)(false, true, undefined, undefined);
        expect(Navigation_1.default.navigate).not.toHaveBeenCalledWith(ROUTES_1.default.REPORT_WITH_ID.getRoute(undefined));
    });
    it('should not navigate to last accessed report if it is a concierge chat on small screens', async () => {
        const navigate = jest.spyOn(Navigation_1.default, 'navigate');
        const lastAccessedReport = {
            reportID: REPORT_ID,
            participants: {
                [CONST_1.default.ACCOUNT_ID.CONCIERGE.toString()]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                [USER_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
            },
            reportName: 'Concierge',
            type: CONST_1.default.REPORT.TYPE.CHAT,
        };
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.CONCIERGE_REPORT_ID, REPORT_ID);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, lastAccessedReport);
        mockFindLastAccessedReport.mockReturnValue(lastAccessedReport);
        mockShouldOpenOnAdminRoom.mockReturnValue(false);
        (0, navigateAfterOnboarding_1.navigateAfterOnboarding)(true, true, ONBOARDING_POLICY_ID, ONBOARDING_ADMINS_CHAT_REPORT_ID);
        expect(navigate).not.toHaveBeenCalledWith(ROUTES_1.default.REPORT_WITH_ID.getRoute(REPORT_ID));
    });
    it('should not navigate to last accessed report if it is onboarding expense chat on small screens', () => {
        const lastAccessedReport = { reportID: REPORT_ID, policyID: ONBOARDING_POLICY_ID };
        mockFindLastAccessedReport.mockReturnValue(lastAccessedReport);
        mockShouldOpenOnAdminRoom.mockReturnValue(false);
        (0, navigateAfterOnboarding_1.navigateAfterOnboarding)(true, true, ONBOARDING_POLICY_ID, ONBOARDING_ADMINS_CHAT_REPORT_ID);
        expect(Navigation_1.default.navigate).not.toHaveBeenCalledWith(ROUTES_1.default.REPORT_WITH_ID.getRoute(REPORT_ID));
    });
    it('should navigate to last accessed report if shouldOpenOnAdminRoom is true on small screens', () => {
        const navigate = jest.spyOn(Navigation_1.default, 'navigate');
        const lastAccessedReport = { reportID: REPORT_ID };
        mockFindLastAccessedReport.mockReturnValue(lastAccessedReport);
        mockShouldOpenOnAdminRoom.mockReturnValue(true);
        (0, navigateAfterOnboarding_1.navigateAfterOnboarding)(true, true, ONBOARDING_POLICY_ID, ONBOARDING_ADMINS_CHAT_REPORT_ID);
        expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.REPORT_WITH_ID.getRoute(REPORT_ID));
    });
    it('should navigate to Concierge room if user uses a test email', () => {
        const navigate = jest.spyOn(Navigation_1.default, 'navigate');
        const lastAccessedReport = { reportID: REPORT_ID };
        mockFindLastAccessedReport.mockReturnValue(lastAccessedReport);
        mockShouldOpenOnAdminRoom.mockReturnValue(true);
        const testSession = { email: 'test+account@gmail.com' };
        (0, navigateAfterOnboarding_1.navigateAfterOnboarding)(true, true, ONBOARDING_POLICY_ID, ONBOARDING_ADMINS_CHAT_REPORT_ID, (testSession?.email ?? '').includes('+'));
        expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.REPORT_WITH_ID.getRoute(REPORT_ID));
    });
    it('should navigate to Test Drive Modal if user wants to manage a small team', async () => {
        const navigate = jest.spyOn(Navigation_1.default, 'navigate');
        jest.spyOn(Navigation_1.default, 'isNavigationReady').mockReturnValue(Promise.resolve());
        (0, navigateAfterOnboarding_1.navigateAfterOnboarding)(true, true);
        await (0, react_native_1.waitFor)(() => expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.TEST_DRIVE_MODAL_ROOT.route));
    });
});
