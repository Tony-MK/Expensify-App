"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const PerDiemRequestUtils_1 = require("@libs/PerDiemRequestUtils");
const CONST_1 = require("@src/CONST");
const PerDiemRequestUtils_2 = require("@src/libs/PerDiemRequestUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const LHNTestUtils_1 = require("../utils/LHNTestUtils");
const policyID = '1';
const report = {
    ...(0, LHNTestUtils_1.getFakeReport)(),
    policyID,
    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
};
const parentReport = {
    ...(0, LHNTestUtils_1.getFakeReport)(),
    policyID,
};
describe('PerDiemRequestUtils', () => {
    beforeAll(() => react_native_onyx_1.default.init({
        keys: ONYXKEYS_1.default,
    }));
    beforeEach(() => {
        react_native_onyx_1.default.clear();
    });
    it('getDestinationListSections()', () => {
        const tokenizeSearch = 'Antigua Barbuda';
        const destinations = [
            {
                currency: 'EUR',
                customUnitRateID: 'Afghanistan',
                enabled: true,
                name: 'Afghanistan',
                rate: 0,
            },
            {
                currency: 'EUR',
                customUnitRateID: 'Antigua and Barbuda',
                enabled: true,
                name: 'Antigua and Barbuda',
                rate: 0,
            },
        ];
        const searchResultList = [
            {
                data: [
                    {
                        currency: 'EUR',
                        isDisabled: false,
                        isSelected: false,
                        keyForList: 'Antigua and Barbuda',
                        searchText: 'Antigua and Barbuda',
                        text: 'Antigua and Barbuda',
                        tooltipText: 'Antigua and Barbuda',
                    },
                ],
                indexOffset: 1,
                shouldShow: true,
                title: '',
            },
        ];
        const tokenizeSearchResult = (0, PerDiemRequestUtils_1.getDestinationListSections)({
            destinations,
            searchValue: tokenizeSearch,
        });
        expect(tokenizeSearchResult).toStrictEqual(searchResultList);
    });
    describe('getCustomUnitID', () => {
        it('should return the correct custom unit ID', async () => {
            const policy = {
                ...(0, LHNTestUtils_1.getFakePolicy)(),
                id: policyID,
                customUnits: {
                    [CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS]: {
                        name: CONST_1.default.CUSTOM_UNITS.NAME_PER_DIEM_INTERNATIONAL,
                        customUnitID: CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS,
                        rates: {},
                    },
                },
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, policy);
            const customUnitID = (0, PerDiemRequestUtils_2.getCustomUnitID)(report, parentReport);
            expect(customUnitID.customUnitID).toBe(CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS);
        });
        it('should return fake P2P ID if the policy does not have a custom unit', async () => {
            const policy = {
                ...(0, LHNTestUtils_1.getFakePolicy)(),
                customUnits: {},
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, policy);
            const customUnitID = (0, PerDiemRequestUtils_2.getCustomUnitID)(report, parentReport);
            expect(customUnitID.customUnitID).toBe(CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID);
        });
    });
});
