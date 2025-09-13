"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const types_1 = require("@libs/API/types");
const CONST_1 = require("@src/CONST");
const OnyxUpdates = require("@src/libs/actions/OnyxUpdates");
const DateUtils_1 = require("@src/libs/DateUtils");
const NumberUtils = require("@src/libs/NumberUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const getOnyxValue_1 = require("../utils/getOnyxValue");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
describe('OnyxUpdatesTest', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(() => react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default));
    it('applies Airship Onyx updates correctly', () => {
        const reportID = NumberUtils.rand64();
        const reportActionID = NumberUtils.rand64();
        const created = DateUtils_1.default.getDBTime();
        const reportValue = { reportID };
        const reportActionValue = {
            [reportActionID]: {
                reportActionID,
                created,
            },
        };
        // Given an onyx update from an Airship push notification
        const airshipUpdates = {
            type: CONST_1.default.ONYX_UPDATE_TYPES.AIRSHIP,
            previousUpdateID: 0,
            lastUpdateID: 1,
            updates: [
                {
                    eventType: '',
                    data: [
                        {
                            onyxMethod: 'merge',
                            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                            value: reportValue,
                        },
                        {
                            onyxMethod: 'merge',
                            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
                            value: reportActionValue,
                            shouldShowPushNotification: true,
                        },
                    ],
                },
            ],
        };
        // When we apply the updates, then their values are updated correctly
        return OnyxUpdates.apply(airshipUpdates)
            .then(() => getOnyxValues(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`))
            .then(([report, reportAction]) => {
            expect(report).toStrictEqual(reportValue);
            expect(reportAction).toStrictEqual(reportActionValue);
        });
    });
    it('applies full ReconnectApp Onyx updates even if they appear old', async () => {
        // Given the current lastUpdateIDAppliedToClient is merged
        const currentUpdateID = 100;
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.ONYX_UPDATES_LAST_UPDATE_ID_APPLIED_TO_CLIENT, currentUpdateID);
        // And we received onyx updates from a full ReconnectApp request with the same lastUpdateID
        const reportID = NumberUtils.rand64();
        const reportValue = { reportID };
        const fullReconnectUpdates = {
            type: CONST_1.default.ONYX_UPDATE_TYPES.HTTPS,
            request: {
                command: types_1.SIDE_EFFECT_REQUEST_COMMANDS.RECONNECT_APP,
                data: {
                    updateIDFrom: null,
                },
            },
            response: {
                onyxData: [
                    {
                        onyxMethod: 'merge',
                        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                        value: reportValue,
                    },
                ],
            },
            previousUpdateID: currentUpdateID - 2,
            lastUpdateID: currentUpdateID - 1,
        };
        // When we apply the updates, then they are still applied even if the lastUpdateID is old
        await OnyxUpdates.apply(fullReconnectUpdates);
        const report = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`);
        expect(report).toStrictEqual(reportValue);
    });
});
function getOnyxValues(...keys) {
    return Promise.all(keys.map((key) => (0, getOnyxValue_1.default)(key)));
}
