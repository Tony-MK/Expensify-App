"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CollectionDataSet_1 = require("@src/types/utils/CollectionDataSet");
const LHNTestUtils = require("../utils/LHNTestUtils");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const wrapOnyxWithWaitForBatchedUpdates_1 = require("../utils/wrapOnyxWithWaitForBatchedUpdates");
describe('ReportActionItemSingle', () => {
    beforeAll(() => react_native_onyx_1.default.init({
        keys: ONYXKEYS_1.default,
        evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
    }));
    beforeEach(() => {
        // Wrap Onyx each onyx action with waitForBatchedUpdates
        (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
        // Initialize the network key for OfflineWithFeedback
        return react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false });
    });
    // Clear out Onyx after each test so that each test starts with a clean slate
    afterEach(() => {
        react_native_onyx_1.default.clear();
    });
    describe('when the Report is a DM chat', () => {
        describe('component properly renders both avatar & name of the sender', () => {
            const fakeReport = { ...LHNTestUtils.getFakeReportWithPolicy([1, 2]), chatType: undefined };
            const fakeReportAction = LHNTestUtils.getFakeAdvancedReportAction();
            const fakePolicy = LHNTestUtils.getFakePolicy(fakeReport.policyID);
            const faceAccountId = fakeReportAction.actorAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
            const fakePersonalDetails = {
                [faceAccountId]: {
                    accountID: faceAccountId,
                    login: 'email1@test.com',
                    displayName: 'Email One',
                    avatar: 'https://example.com/avatar.png',
                    firstName: 'One',
                },
            };
            function setup() {
                const policyCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.POLICY, [fakePolicy], (item) => item.id);
                return (0, waitForBatchedUpdates_1.default)()
                    .then(() => react_native_onyx_1.default.multiSet({
                    [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: fakePersonalDetails,
                    [ONYXKEYS_1.default.IS_LOADING_REPORT_DATA]: false,
                    [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS]: {
                        [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${fakeReport.reportID}`]: {
                            [fakeReportAction.reportActionID]: fakeReportAction,
                        },
                    },
                    [ONYXKEYS_1.default.COLLECTION.REPORT]: {
                        [fakeReport.reportID]: fakeReport,
                    },
                    ...policyCollectionDataSet,
                }))
                    .then(() => {
                    LHNTestUtils.getDefaultRenderedReportActionItemSingle(fakeReport, fakeReportAction);
                });
            }
            it('renders avatar properly', async () => {
                const expectedIconTestID = 'ReportActionAvatars-SingleAvatar';
                await setup();
                await (0, react_native_1.waitFor)(() => {
                    expect(react_native_1.screen.getByTestId(expectedIconTestID)).toBeOnTheScreen();
                });
            });
            it('renders Person information', async () => {
                const [expectedPerson] = fakeReportAction.person ?? [];
                await setup();
                await (0, react_native_1.waitFor)(() => {
                    expect(react_native_1.screen.getByText(expectedPerson.text ?? '')).toBeOnTheScreen();
                });
            });
        });
    });
});
