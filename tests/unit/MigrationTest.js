"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const react_native_onyx_1 = require("react-native-onyx");
const Log_1 = require("@src/libs/Log");
const KeyReportActionsDraftByReportActionID_1 = require("@src/libs/migrations/KeyReportActionsDraftByReportActionID");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@src/libs/getPlatform');
let LogSpy;
describe('Migrations', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        LogSpy = jest.spyOn(Log_1.default, 'info');
        Log_1.default.serverLoggingCallback = () => Promise.resolve({ requestID: '123' });
        return (0, waitForBatchedUpdates_1.default)();
    });
    beforeEach(() => {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        return (0, waitForBatchedUpdates_1.default)();
    });
    describe('KeyReportActionsDraftByReportActionID', () => {
        it("Should work even if there's no reportActionsDrafts data in Onyx", () => (0, KeyReportActionsDraftByReportActionID_1.default)().then(() => expect(LogSpy).toHaveBeenCalledWith('[Migrate Onyx] Skipped migration KeyReportActionsDraftByReportActionID because there were no reportActionsDrafts')));
        it('Should move individual draft to a draft collection of report', () => {
            const setQueries = {};
            setQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}1_1`] = 'a';
            setQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}1_2`] = 'b';
            setQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}2`] = { 3: 'c' };
            setQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}2_4`] = 'd';
            return react_native_onyx_1.default.multiSet(setQueries)
                .then(KeyReportActionsDraftByReportActionID_1.default)
                .then(() => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS,
                    waitForCollectionCallback: true,
                    callback: (allReportActionsDrafts) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const expectedReportActionDraft1 = {
                            1: 'a',
                            2: 'b',
                        };
                        const expectedReportActionDraft2 = {
                            3: 'c',
                            4: 'd',
                        };
                        expect(allReportActionsDrafts?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}1_1`]).toBeUndefined();
                        expect(allReportActionsDrafts?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}1_2`]).toBeUndefined();
                        expect(allReportActionsDrafts?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}2_4`]).toBeUndefined();
                        expect(allReportActionsDrafts?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}1`]).toMatchObject(expectedReportActionDraft1);
                        expect(allReportActionsDrafts?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}2`]).toMatchObject(expectedReportActionDraft2);
                    },
                });
            });
        });
        it('Should skip if nothing to migrate', () => {
            const setQueries = {};
            setQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}2`] = {};
            return react_native_onyx_1.default.multiSet(setQueries)
                .then(KeyReportActionsDraftByReportActionID_1.default)
                .then(() => {
                expect(LogSpy).toHaveBeenCalledWith('[Migrate Onyx] Skipped migration KeyReportActionsDraftByReportActionID because there are no actions drafts to migrate');
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS,
                    waitForCollectionCallback: true,
                    callback: (allReportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const expectedReportActionDraft = {};
                        expect(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}1_1`]).toBeUndefined();
                        expect(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}1_2`]).toBeUndefined();
                        expect(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}2_4`]).toBeUndefined();
                        expect(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}2`]).toMatchObject(expectedReportActionDraft);
                    },
                });
            });
        });
        it("Shouldn't move empty individual draft to a draft collection of report", () => {
            const setQueries = {};
            setQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}1_1`] = '';
            setQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}1`] = {};
            return react_native_onyx_1.default.multiSet(setQueries)
                .then(KeyReportActionsDraftByReportActionID_1.default)
                .then(() => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS,
                    waitForCollectionCallback: true,
                    callback: (allReportActionsDrafts) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(allReportActionsDrafts?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}1_1`]).toBeUndefined();
                    },
                });
            });
        });
    });
});
