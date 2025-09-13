"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const OnyxUpdateManager_1 = require("@libs/actions/OnyxUpdateManager");
const Task_1 = require("@libs/actions/Task");
const Tour_1 = require("@libs/actions/Tour");
const Localize_1 = require("@libs/Localize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const OnyxDerived_1 = require("@userActions/OnyxDerived");
const CONST_1 = require("@src/CONST");
const SequentialQueue = require("@src/libs/Network/SequentialQueue");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const LHNTestUtils = require("../utils/LHNTestUtils");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@libs/Navigation/Navigation', () => ({
    navigate: jest.fn(),
}));
(0, OnyxUpdateManager_1.default)();
describe('actions/Tour', () => {
    beforeAll(async () => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        (0, OnyxDerived_1.default)();
        await (0, waitForBatchedUpdates_1.default)();
    });
    beforeEach(async () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        SequentialQueue.resetQueue();
        await react_native_onyx_1.default.clear();
        await (0, waitForBatchedUpdates_1.default)();
    });
    describe('startTestDrive', () => {
        describe('migrated users', () => {
            it('should show the Test Drive demo if user has been nudged to migrate', async () => {
                (0, Tour_1.startTestDrive)(undefined, false, true, false);
                await (0, waitForBatchedUpdates_1.default)();
                expect(Navigation_1.default.navigate).toBeCalledWith(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT);
            });
            it("should show the Test Drive demo if user doesn't have the nudge flag but is member of a paid policy", async () => {
                (0, Tour_1.startTestDrive)(undefined, false, false, true);
                await (0, waitForBatchedUpdates_1.default)();
                expect(Navigation_1.default.navigate).toBeCalledWith(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT);
            });
        });
        describe('NewDot users', () => {
            const onboardingChoices = Object.values(CONST_1.default.ONBOARDING_CHOICES);
            const onboardingDemoChoices = [CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM, CONST_1.default.ONBOARDING_CHOICES.TEST_DRIVE_RECEIVER, CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE];
            const setTestDriveTaskData = async () => {
                const accountID = 2;
                const conciergeChatReport = LHNTestUtils.getFakeReport([accountID, CONST_1.default.ACCOUNT_ID.CONCIERGE]);
                const testDriveTaskReport = { ...LHNTestUtils.getFakeReport(), ownerAccountID: accountID };
                const testDriveTaskAction = {
                    ...LHNTestUtils.getFakeReportAction(),
                    childType: CONST_1.default.REPORT.TYPE.TASK,
                    childReportName: Parser_1.default.replace((0, Localize_1.translateLocal)('onboarding.testDrive.name', { testDriveURL: `${CONST_1.default.STAGING_NEW_EXPENSIFY_URL}/${ROUTES_1.default.TEST_DRIVE_DEMO_ROOT}` })),
                    childReportID: testDriveTaskReport.reportID,
                };
                const reportCollectionDataSet = {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT}${testDriveTaskReport.reportID}`]: testDriveTaskReport,
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT}${conciergeChatReport.reportID}`]: conciergeChatReport,
                };
                const reportActionsCollectionDataSet = {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${conciergeChatReport.reportID}`]: {
                        [testDriveTaskAction.reportActionID]: testDriveTaskAction,
                    },
                };
                await react_native_onyx_1.default.multiSet({
                    ...reportCollectionDataSet,
                    ...reportActionsCollectionDataSet,
                    [ONYXKEYS_1.default.NVP_INTRO_SELECTED]: {
                        viewTour: testDriveTaskReport.reportID,
                    },
                    [ONYXKEYS_1.default.SESSION]: {
                        accountID,
                    },
                });
            };
            it.each(onboardingChoices.filter((choice) => onboardingDemoChoices.includes(choice)))('should show the Test Drive demo if user has "%s" onboarding choice', async (choice) => {
                await setTestDriveTaskData();
                (0, Tour_1.startTestDrive)({ choice }, false, false, false);
                await (0, waitForBatchedUpdates_1.default)();
                expect(Navigation_1.default.navigate).toHaveBeenCalledWith(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT);
                // An empty object means the task was completed.
                expect(Object.values((0, Task_1.getFinishOnboardingTaskOnyxData)(CONST_1.default.ONBOARDING_TASK_TYPE.VIEW_TOUR)).length).toBe(0);
            });
            it.each(onboardingChoices.filter((choice) => !onboardingDemoChoices.includes(choice)))('should show the Test Drive modal if user has "%s" onboarding choice', async (choice) => {
                (0, Tour_1.startTestDrive)({ choice }, false, false, false);
                await (0, waitForBatchedUpdates_1.default)();
                expect(Navigation_1.default.navigate).toHaveBeenCalledWith(ROUTES_1.default.TEST_DRIVE_MODAL_ROOT.route);
            });
            it('should show the Test Drive demo if user is an invited employee', async () => {
                await setTestDriveTaskData();
                (0, Tour_1.startTestDrive)({ choice: CONST_1.default.ONBOARDING_CHOICES.SUBMIT, inviteType: CONST_1.default.ONBOARDING_INVITE_TYPES.WORKSPACE }, false, false, false);
                await (0, waitForBatchedUpdates_1.default)();
                expect(Navigation_1.default.navigate).toBeCalledWith(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT);
                // An empty object means the task was completed.
                expect(Object.values((0, Task_1.getFinishOnboardingTaskOnyxData)(CONST_1.default.ONBOARDING_TASK_TYPE.VIEW_TOUR)).length).toBe(0);
            });
            it('should show the Test Drive demo if user is member of a paid policy', async () => {
                (0, Tour_1.startTestDrive)({ choice: CONST_1.default.ONBOARDING_CHOICES.LOOKING_AROUND }, false, false, true);
                await (0, waitForBatchedUpdates_1.default)();
                expect(Navigation_1.default.navigate).toBeCalledWith(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT);
            });
        });
    });
});
