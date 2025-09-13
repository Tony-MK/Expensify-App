"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const DebugReportActions_1 = require("@pages/Debug/Report/DebugReportActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const policies_1 = require("../utils/collections/policies");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_1 = require("../utils/collections/reports");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useIsFocused: () => true,
        useFocusEffect: jest.fn(),
    };
});
jest.mock('@src/libs/Navigation/Navigation', () => ({
    navigate: jest.fn(),
}));
describe('DebugReportActions', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, CONST_1.default.LOCALES.EN);
    });
    afterEach(async () => {
        await react_native_onyx_1.default.clear();
    });
    it('should show no results message when search is empty', async () => {
        const policyID = '12';
        const reportID = '1';
        const reportActionID = '123';
        const policy = (0, policies_1.default)(Number(policyID));
        const report = { ...(0, reports_1.createRandomReport)(Number(reportID)), chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM, policyID };
        const reportActionL = {
            ...(0, reportActions_1.default)(Number(reportActionID)),
            reportID,
            message: {
                html: '',
                text: '',
                type: '',
            },
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.NVP_PREFERRED_LOCALE}`, 'en');
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, policy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, report);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {
            [reportActionID]: reportActionL,
        });
        (0, react_native_1.render)(<OnyxListItemProvider_1.default>
                <LocaleContextProvider_1.LocaleContextProvider>
                    <DebugReportActions_1.default reportID={reportID}/>
                </LocaleContextProvider_1.LocaleContextProvider>
            </OnyxListItemProvider_1.default>);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const input = react_native_1.screen.getByTestId('selection-list-text-input');
        react_native_1.fireEvent.changeText(input, 'Should show no results found');
        expect(await react_native_1.screen.findByText('No results found')).toBeOnTheScreen();
    });
});
