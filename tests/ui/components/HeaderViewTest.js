"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const HeaderView_1 = require("@pages/home/HeaderView");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const reports_1 = require("../../utils/collections/reports");
const waitForBatchedUpdates_1 = require("../../utils/waitForBatchedUpdates");
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useRoute: () => jest.fn(),
    };
});
jest.mock('@hooks/useCurrentUserPersonalDetails');
describe('HeaderView', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    beforeAll(() => {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
    });
    it('should update invoice room title when the invoice receiver detail is updated', async () => {
        // Given an invoice room header
        const chatReportID = '1';
        const accountID = 2;
        let displayName = 'test';
        const report = {
            ...(0, reports_1.createRandomReport)(Number(chatReportID)),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.INVOICE,
            invoiceReceiver: {
                accountID,
                type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
            },
        };
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
            [accountID]: {
                displayName,
            },
        });
        (0, react_native_1.render)(<OnyxListItemProvider_1.default>
                <HeaderView_1.default report={report} onNavigationMenuButtonClicked={() => { }} parentReportAction={null} reportID={report.reportID}/>
            </OnyxListItemProvider_1.default>);
        await (0, waitForBatchedUpdates_1.default)();
        expect(react_native_1.screen.getByTestId('DisplayNames')).toHaveTextContent(displayName);
        // When the invoice receiver display name is updated
        displayName = 'test edit';
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
            [accountID]: {
                displayName,
            },
        });
        // Then the header title should be updated using the new display name
        expect(react_native_1.screen.getByTestId('DisplayNames')).toHaveTextContent(displayName);
    });
});
