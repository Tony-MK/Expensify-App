"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const IOURequestStartPage_1 = require("@pages/iou/request/IOURequestStartPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@userActions/Tab');
jest.mock('@rnmapbox/maps', () => ({
    default: jest.fn(),
    MarkerView: jest.fn(),
    setAccessToken: jest.fn(),
}));
jest.mock('react-native-tab-view', () => ({
    TabView: 'TabView',
    SceneMap: jest.fn(),
    TabBar: 'TabBar',
}));
jest.mock('@react-native-community/geolocation', () => ({
    setRNConfiguration: jest.fn(),
}));
jest.mock('react-native-vision-camera', () => ({
    useCameraDevice: jest.fn(),
}));
describe('IOURequestStartPage', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    afterEach(async () => {
        await react_native_onyx_1.default.clear();
    });
    it('self DM track options should disappear when report moved to workspace', async () => {
        // Given no selected tab data in Onyx
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SELECTED_TAB}${CONST_1.default.TAB.IOU_REQUEST_TYPE}`, null);
        // When the page is mounted with MANUAL tab
        (0, react_native_1.render)(<OnyxListItemProvider_1.default>
                <LocaleContextProvider_1.LocaleContextProvider>
                    <native_1.NavigationContainer>
                        <IOURequestStartPage_1.default route={{ params: { iouType: CONST_1.default.IOU.TYPE.SUBMIT, reportID: '1', transactionID: '' } }} report={undefined} reportDraft={undefined} navigation={{}} defaultSelectedTab={CONST_1.default.TAB_REQUEST.MANUAL}/>
                    </native_1.NavigationContainer>
                </LocaleContextProvider_1.LocaleContextProvider>
            </OnyxListItemProvider_1.default>);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the iou type should be MANUAL
        const iouRequestType = await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID}`,
                callback: (val) => {
                    resolve(val?.iouRequestType);
                    react_native_onyx_1.default.disconnect(connection);
                },
            });
        });
        expect(iouRequestType).toBe(CONST_1.default.IOU.REQUEST_TYPE.MANUAL);
    });
});
