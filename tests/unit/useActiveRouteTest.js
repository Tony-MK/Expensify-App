"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const useActiveRoute_1 = require("@hooks/useActiveRoute");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
describe('useActiveRoute', () => {
    it('should return the same active route', () => {
        // Given an active route
        const navigation = jest.spyOn(Navigation_1.default, 'getReportRHPActiveRoute');
        const { result } = (0, react_native_1.renderHook)(() => (0, useActiveRoute_1.default)());
        const expectedActiveRoute = ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID: '1' });
        navigation.mockReturnValueOnce(expectedActiveRoute);
        const actualActiveRoute = result.current.getReportRHPActiveRoute();
        expect(actualActiveRoute).toBe(expectedActiveRoute);
        // When getting the active route multiple times
        navigation.mockReturnValueOnce(ROUTES_1.default.MONEY_REQUEST_STEP_DESCRIPTION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.CREATE, '1', '1'));
        const actualActiveRoute2 = result.current.getReportRHPActiveRoute();
        // Then it should return the first active route value
        expect(actualActiveRoute2).toBe(expectedActiveRoute);
    });
});
