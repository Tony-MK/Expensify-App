"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const Localize_1 = require("@libs/Localize");
const ReportDetailsPage_1 = require("@pages/ReportDetailsPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_1 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@src/components/ConfirmedRoute.tsx');
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useIsFocused: jest.fn(),
        useRoute: jest.fn(),
        usePreventRemove: jest.fn(),
    };
});
describe('ReportDetailsPage', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
    });
    afterEach(async () => {
        await react_native_onyx_1.default.clear();
    });
    it('self DM track options should disappear when report moved to workspace', async () => {
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.BETAS, [CONST_1.default.BETAS.TRACK_FLOWS]);
        const selfDMReportID = '1';
        const trackExpenseReportID = '2';
        const trackExpenseActionID = '123';
        const transactionID = '3';
        const transaction = (0, transaction_1.default)(1);
        const trackExpenseReport = {
            ...(0, reports_1.createRandomReport)(Number(trackExpenseReportID)),
            chatType: '',
            parentReportID: selfDMReportID,
            parentReportActionID: trackExpenseActionID,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${selfDMReportID}`, {
            ...(0, reports_1.createRandomReport)(Number(selfDMReportID)),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
        });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${trackExpenseReportID}`, trackExpenseReport);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, transaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReportID}`, {
            [trackExpenseActionID]: {
                ...(0, reportActions_1.default)(Number(trackExpenseActionID)),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK,
                },
            },
        });
        const { rerender } = (0, react_native_1.render)(<OnyxListItemProvider_1.default>
                <LocaleContextProvider_1.LocaleContextProvider>
                    <ReportDetailsPage_1.default betas={[]} isLoadingReportData={false} navigation={{}} policy={undefined} report={trackExpenseReport} reportMetadata={undefined} route={{ params: { reportID: trackExpenseReportID } }}/>
                </LocaleContextProvider_1.LocaleContextProvider>
            </OnyxListItemProvider_1.default>);
        await (0, waitForBatchedUpdates_1.default)();
        const submitText = (0, Localize_1.translateLocal)('actionableMentionTrackExpense.submit');
        const categorizeText = (0, Localize_1.translateLocal)('actionableMentionTrackExpense.categorize');
        const shareText = (0, Localize_1.translateLocal)('actionableMentionTrackExpense.share');
        await react_native_1.screen.findByText(submitText);
        await react_native_1.screen.findByText(categorizeText);
        await react_native_1.screen.findByText(shareText);
        const movedTrackExpenseReport = {
            ...trackExpenseReport,
            parentReportID: '3',
            parentReportActionID: '234',
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${trackExpenseReportID}`, movedTrackExpenseReport);
        rerender(<OnyxListItemProvider_1.default>
                <LocaleContextProvider_1.LocaleContextProvider>
                    <ReportDetailsPage_1.default betas={[]} isLoadingReportData={false} navigation={{}} policy={undefined} report={movedTrackExpenseReport} reportMetadata={undefined} route={{ params: { reportID: trackExpenseReportID } }}/>
                </LocaleContextProvider_1.LocaleContextProvider>
            </OnyxListItemProvider_1.default>);
        expect(react_native_1.screen.queryByText(submitText)).not.toBeVisible();
        expect(react_native_1.screen.queryByText(categorizeText)).not.toBeVisible();
        expect(react_native_1.screen.queryByText(shareText)).not.toBeVisible();
    });
});
