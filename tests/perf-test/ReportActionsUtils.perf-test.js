"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const reassure_1 = require("reassure");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const createCollection_1 = require("../utils/collections/createCollection");
const reportActions_1 = require("../utils/collections/reportActions");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const getMockedReportActionsMap = (reportsLength = 10, actionsPerReportLength = 100) => {
    const mockReportActions = Array.from({ length: actionsPerReportLength }, (v, i) => {
        const reportActionKey = i + 1;
        const reportAction = (0, reportActions_1.default)(reportActionKey);
        return { [reportActionKey]: reportAction };
    });
    const reportKeysMap = Array.from({ length: reportsLength }, (v, i) => {
        const key = i + 1;
        return { [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${key}`]: Object.assign({}, ...mockReportActions) };
    });
    return Object.assign({}, ...reportKeysMap);
};
const mockedReportActionsMap = getMockedReportActionsMap(2, 10000);
const reportActions = (0, createCollection_1.default)((item) => `${item.reportActionID}`, (index) => (0, reportActions_1.default)(index));
const reportId = '1';
describe('ReportActionsUtils', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
        react_native_onyx_1.default.multiSet({
            ...mockedReportActionsMap,
        });
    });
    afterAll(() => {
        react_native_onyx_1.default.clear();
    });
    /**
     * This function will be executed 20 times and the average time will be used on the comparison.
     * It will fail based on the CI configuration around Reassure:
     * @see /.github/workflows/reassurePerformanceTests.yml
     *
     * Max deviation on the duration is set to 20% at the time of writing.
     *
     * More on the measureFunction API:
     * @see https://callstack.github.io/reassure/docs/api#measurefunction-function
     */
    test('[ReportActionsUtils] getLastVisibleAction on 10k reportActions', async () => {
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportActionsUtils_1.getLastVisibleAction)(reportId));
    });
    test('[ReportActionsUtils] getLastVisibleAction on 10k reportActions with actionsToMerge', async () => {
        const parentReportActionId = '1';
        const fakeParentAction = reportActions[parentReportActionId];
        const actionsToMerge = {
            [parentReportActionId]: {
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                previousMessage: fakeParentAction.message,
                message: [
                    {
                        translationKey: '',
                        type: 'COMMENT',
                        html: '',
                        text: '',
                        isEdited: true,
                        isDeletedParentAction: true,
                    },
                ],
                errors: null,
                linkMetaData: [],
            },
        };
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportActionsUtils_1.getLastVisibleAction)(reportId, true, actionsToMerge));
    });
    test('[ReportActionsUtils] getMostRecentIOURequestActionID on 10k ReportActions', async () => {
        const reportActionsArray = (0, ReportActionsUtils_1.getSortedReportActionsForDisplay)(reportActions, true);
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportActionsUtils_1.getMostRecentIOURequestActionID)(reportActionsArray));
    });
    test('[ReportActionsUtils] getLastVisibleMessage on 10k ReportActions', async () => {
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportActionsUtils_1.getLastVisibleMessage)(reportId));
    });
    test('[ReportActionsUtils] getLastVisibleMessage on 10k ReportActions with actionsToMerge', async () => {
        const parentReportActionId = '1';
        const fakeParentAction = reportActions[parentReportActionId];
        const actionsToMerge = {
            [parentReportActionId]: {
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                previousMessage: fakeParentAction.message,
                message: [
                    {
                        translationKey: '',
                        type: 'COMMENT',
                        html: '',
                        text: '',
                        isEdited: true,
                        isDeletedParentAction: true,
                    },
                ],
                errors: null,
                linkMetaData: [],
            },
        };
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportActionsUtils_1.getLastVisibleMessage)(reportId, true, actionsToMerge));
    });
    test('[ReportActionsUtils] getSortedReportActionsForDisplay on 10k ReportActions', async () => {
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportActionsUtils_1.getSortedReportActionsForDisplay)(reportActions, true));
    });
    test('[ReportActionsUtils] getLastClosedReportAction on 10k ReportActions', async () => {
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportActionsUtils_1.getLastClosedReportAction)(reportActions));
    });
});
