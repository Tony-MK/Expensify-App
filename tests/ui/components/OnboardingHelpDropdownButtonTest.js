"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("@testing-library/react-native");
var react_1 = require("react");
var react_native_onyx_1 = require("react-native-onyx");
var ComposeProviders_1 = require("@components/ComposeProviders");
var LocaleContextProvider_1 = require("@components/LocaleContextProvider");
var OnboardingHelpDropdownButton_1 = require("@components/OnboardingHelpDropdownButton");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var Link_1 = require("@libs/actions/Link");
var ScheduleCall_1 = require("@libs/actions/ScheduleCall");
var Localize_1 = require("@libs/Localize");
var Navigation_1 = require("@libs/Navigation/Navigation");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var waitForBatchedUpdates_1 = require("../../utils/waitForBatchedUpdates");
// Mock the dependencies
jest.mock('@libs/actions/Link', function () { return ({
    openExternalLink: jest.fn(),
}); });
jest.mock('@libs/Navigation/Navigation', function () { return ({
    navigate: jest.fn(),
}); });
jest.mock('@libs/actions/ScheduleCall', function () { return ({
    clearBookingDraft: jest.fn(),
    rescheduleBooking: jest.fn(),
    cancelBooking: jest.fn(),
}); });
jest.mock('@hooks/useResponsiveLayout', function () { return function () { return ({
    isSmallScreenWidth: false,
}); }; });
var mockOpenExternalLink = jest.mocked(Link_1.openExternalLink);
var mockNavigate = jest.mocked(Navigation_1.default.navigate);
var mockClearBookingDraft = jest.mocked(ScheduleCall_1.clearBookingDraft);
var mockRescheduleBooking = jest.mocked(ScheduleCall_1.rescheduleBooking);
var mockCancelBooking = jest.mocked(ScheduleCall_1.cancelBooking);
// Helper function to create mock events for PopoverMenuItem fireEvent.press
function createMockPressEvent(target) {
    return {
        nativeEvent: {},
        type: 'press',
        target: target,
        currentTarget: target,
    };
}
// Helper function to render OnboardingHelpDropdownButton with props
function renderOnboardingHelpDropdownButton(props) {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider]}>
            <OnboardingHelpDropdownButton_1.default reportID={props.reportID} shouldUseNarrowLayout={props.shouldUseNarrowLayout} shouldShowRegisterForWebinar={props.shouldShowRegisterForWebinar} shouldShowGuideBooking={props.shouldShowGuideBooking} hasActiveScheduledCall={props.hasActiveScheduledCall}/>
        </ComposeProviders_1.default>);
}
var mockScheduledCall = {
    eventTime: '2025-07-05 10:00:00',
    id: 'call-id-123',
    status: CONST_1.default.SCHEDULE_CALL_STATUS.CREATED,
    host: 123,
    eventURI: 'test-uri',
    inserted: '2025-07-04 09:00:00',
};
var currentUserAccountID = 1;
describe('OnboardingHelpDropdownButton', function () {
    beforeAll(function () {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(function () {
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: currentUserAccountID });
        return (0, waitForBatchedUpdates_1.default)();
    });
    afterEach(function () {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        return (0, waitForBatchedUpdates_1.default)();
    });
    it('should display the schedule call option when guide booking is enabled', function () {
        // Given component configured to show schedule call option only
        var props = {
            reportID: '1',
            shouldUseNarrowLayout: false,
            shouldShowRegisterForWebinar: false,
            shouldShowGuideBooking: true,
            hasActiveScheduledCall: false,
        };
        // When component is rendered
        renderOnboardingHelpDropdownButton(props);
        // Then only schedule call option is visible
        var scheduleCallOption = react_native_1.screen.getByText((0, Localize_1.translateLocal)('getAssistancePage.scheduleACall'));
        expect(scheduleCallOption).toBeOnTheScreen();
        expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('getAssistancePage.registerForWebinar'))).not.toBeOnTheScreen();
        expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('common.reschedule'))).not.toBeOnTheScreen();
        expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('common.cancel'))).not.toBeOnTheScreen();
        // When schedule call option is pressed
        react_native_1.fireEvent.press(scheduleCallOption);
        // Then booking draft is cleared and navigation occurs
        expect(mockClearBookingDraft).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES_1.default.SCHEDULE_CALL_BOOK.getRoute(props.reportID));
    });
    it('should only display the registerForWebinar option when webinar is enabled', function () {
        // Given component configured to display the registerForWebinar
        var props = {
            reportID: '1',
            shouldUseNarrowLayout: false,
            shouldShowRegisterForWebinar: true,
            shouldShowGuideBooking: false,
            hasActiveScheduledCall: false,
        };
        // When component is rendered
        renderOnboardingHelpDropdownButton(props);
        // Then only webinar registration option is visible
        var registerOption = react_native_1.screen.getByText((0, Localize_1.translateLocal)('getAssistancePage.registerForWebinar'));
        expect(registerOption).toBeOnTheScreen();
        expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('getAssistancePage.scheduleACall'))).not.toBeOnTheScreen();
        expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('common.reschedule'))).not.toBeOnTheScreen();
        expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('common.cancel'))).not.toBeOnTheScreen();
        // When webinar registration option is pressed
        react_native_1.fireEvent.press(registerOption);
        // Then webinar registration URL is opened
        expect(mockOpenExternalLink).toHaveBeenCalledTimes(1);
        expect(mockOpenExternalLink).toHaveBeenCalledWith(CONST_1.default.REGISTER_FOR_WEBINAR_URL);
    });
    it('should display dropdown menu with all options when user has active scheduled call', function () { return __awaiter(void 0, void 0, void 0, function () {
        var props, dropdownButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    props = {
                        reportID: '1',
                        shouldUseNarrowLayout: false,
                        shouldShowRegisterForWebinar: true,
                        shouldShowGuideBooking: false,
                        hasActiveScheduledCall: true,
                    };
                    // Given scheduled call data exists in Onyx
                    return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(props.reportID), {
                            calendlyCalls: [mockScheduledCall],
                        })];
                case 1:
                    // Given scheduled call data exists in Onyx
                    _a.sent();
                    // When component is rendered
                    renderOnboardingHelpDropdownButton(props);
                    dropdownButton = react_native_1.screen.getByText((0, Localize_1.translateLocal)('scheduledCall.callScheduled'));
                    expect(dropdownButton).toBeOnTheScreen();
                    // When dropdown menu is opened
                    react_native_1.fireEvent.press(dropdownButton);
                    // Then all expected menu options are present
                    expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.reschedule'))).toBeOnTheScreen();
                    expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.cancel'))).toBeOnTheScreen();
                    expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('getAssistancePage.registerForWebinar'))).toBeOnTheScreen();
                    expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('getAssistancePage.scheduleACall'))).not.toBeOnTheScreen();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('dropdown actions with active scheduled call', function () {
        // Given component configured with active scheduled call and webinar registration enabled
        var props = {
            reportID: '1',
            shouldUseNarrowLayout: false,
            shouldShowRegisterForWebinar: true,
            shouldShowGuideBooking: false,
            hasActiveScheduledCall: true,
        };
        beforeEach(function () {
            react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(props.reportID), {
                calendlyCalls: [mockScheduledCall],
            });
            return (0, waitForBatchedUpdates_1.default)();
        });
        it('should open webinar registration URL when webinar option is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dropdownButton, webinarMenuItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Given scheduled call data exists in Onyx
                    return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(props.reportID), {
                            calendlyCalls: [mockScheduledCall],
                        })];
                    case 1:
                        // Given scheduled call data exists in Onyx
                        _a.sent();
                        // When component is rendered and dropdown is opened
                        renderOnboardingHelpDropdownButton(props);
                        dropdownButton = react_native_1.screen.getByText((0, Localize_1.translateLocal)('scheduledCall.callScheduled'));
                        react_native_1.fireEvent.press(dropdownButton);
                        webinarMenuItem = react_native_1.screen.getByText((0, Localize_1.translateLocal)('getAssistancePage.registerForWebinar'));
                        react_native_1.fireEvent.press(webinarMenuItem, createMockPressEvent(webinarMenuItem));
                        // Then webinar registration URL is opened
                        expect(mockOpenExternalLink).toHaveBeenCalledTimes(1);
                        expect(mockOpenExternalLink).toHaveBeenCalledWith(CONST_1.default.REGISTER_FOR_WEBINAR_URL);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call reschedule booking when reschedule option is pressed', function () {
            // When component is rendered and dropdown is opened
            renderOnboardingHelpDropdownButton(props);
            var dropdownButton = react_native_1.screen.getByText((0, Localize_1.translateLocal)('scheduledCall.callScheduled'));
            react_native_1.fireEvent.press(dropdownButton);
            // When reschedule option is pressed
            var rescheduleMenuItem = react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.reschedule'));
            react_native_1.fireEvent.press(rescheduleMenuItem, createMockPressEvent(rescheduleMenuItem));
            // Then reschedule booking action is called with scheduled call data
            expect(mockRescheduleBooking).toHaveBeenCalledTimes(1);
            expect(mockRescheduleBooking).toHaveBeenCalledWith(mockScheduledCall);
        });
        it('should call cancel booking when cancel option is pressed', function () {
            // When component is rendered and dropdown is opened
            renderOnboardingHelpDropdownButton(props);
            var dropdownButton = react_native_1.screen.getByText((0, Localize_1.translateLocal)('scheduledCall.callScheduled'));
            react_native_1.fireEvent.press(dropdownButton);
            // When cancel option is pressed
            var cancelMenuItem = react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.cancel'));
            react_native_1.fireEvent.press(cancelMenuItem, createMockPressEvent(cancelMenuItem));
            // Then cancel booking action is called with scheduled call data
            expect(mockCancelBooking).toHaveBeenCalledTimes(1);
            expect(mockCancelBooking).toHaveBeenCalledWith(mockScheduledCall);
        });
    });
});
