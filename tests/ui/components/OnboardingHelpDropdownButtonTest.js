"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnboardingHelpDropdownButton_1 = require("@components/OnboardingHelpDropdownButton");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const Link_1 = require("@libs/actions/Link");
const ScheduleCall_1 = require("@libs/actions/ScheduleCall");
const Localize_1 = require("@libs/Localize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const waitForBatchedUpdates_1 = require("../../utils/waitForBatchedUpdates");
// Mock the dependencies
jest.mock('@libs/actions/Link', () => ({
    openExternalLink: jest.fn(),
}));
jest.mock('@libs/Navigation/Navigation', () => ({
    navigate: jest.fn(),
}));
jest.mock('@libs/actions/ScheduleCall', () => ({
    clearBookingDraft: jest.fn(),
    rescheduleBooking: jest.fn(),
    cancelBooking: jest.fn(),
}));
jest.mock('@hooks/useResponsiveLayout', () => () => ({
    isSmallScreenWidth: false,
}));
const mockOpenExternalLink = jest.mocked(Link_1.openExternalLink);
const mockNavigate = jest.mocked(Navigation_1.default.navigate);
const mockClearBookingDraft = jest.mocked(ScheduleCall_1.clearBookingDraft);
const mockRescheduleBooking = jest.mocked(ScheduleCall_1.rescheduleBooking);
const mockCancelBooking = jest.mocked(ScheduleCall_1.cancelBooking);
// Helper function to create mock events for PopoverMenuItem fireEvent.press
function createMockPressEvent(target) {
    return {
        nativeEvent: {},
        type: 'press',
        target,
        currentTarget: target,
    };
}
// Helper function to render OnboardingHelpDropdownButton with props
function renderOnboardingHelpDropdownButton(props) {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider]}>
            <OnboardingHelpDropdownButton_1.default reportID={props.reportID} shouldUseNarrowLayout={props.shouldUseNarrowLayout} shouldShowRegisterForWebinar={props.shouldShowRegisterForWebinar} shouldShowGuideBooking={props.shouldShowGuideBooking} hasActiveScheduledCall={props.hasActiveScheduledCall}/>
        </ComposeProviders_1.default>);
}
const mockScheduledCall = {
    eventTime: '2025-07-05 10:00:00',
    id: 'call-id-123',
    status: CONST_1.default.SCHEDULE_CALL_STATUS.CREATED,
    host: 123,
    eventURI: 'test-uri',
    inserted: '2025-07-04 09:00:00',
};
const currentUserAccountID = 1;
describe('OnboardingHelpDropdownButton', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(() => {
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: currentUserAccountID });
        return (0, waitForBatchedUpdates_1.default)();
    });
    afterEach(() => {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        return (0, waitForBatchedUpdates_1.default)();
    });
    it('should display the schedule call option when guide booking is enabled', () => {
        // Given component configured to show schedule call option only
        const props = {
            reportID: '1',
            shouldUseNarrowLayout: false,
            shouldShowRegisterForWebinar: false,
            shouldShowGuideBooking: true,
            hasActiveScheduledCall: false,
        };
        // When component is rendered
        renderOnboardingHelpDropdownButton(props);
        // Then only schedule call option is visible
        const scheduleCallOption = react_native_1.screen.getByText((0, Localize_1.translateLocal)('getAssistancePage.scheduleACall'));
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
    it('should only display the registerForWebinar option when webinar is enabled', () => {
        // Given component configured to display the registerForWebinar
        const props = {
            reportID: '1',
            shouldUseNarrowLayout: false,
            shouldShowRegisterForWebinar: true,
            shouldShowGuideBooking: false,
            hasActiveScheduledCall: false,
        };
        // When component is rendered
        renderOnboardingHelpDropdownButton(props);
        // Then only webinar registration option is visible
        const registerOption = react_native_1.screen.getByText((0, Localize_1.translateLocal)('getAssistancePage.registerForWebinar'));
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
    it('should display dropdown menu with all options when user has active scheduled call', async () => {
        // Given component configured with active scheduled call and webinar registration
        const props = {
            reportID: '1',
            shouldUseNarrowLayout: false,
            shouldShowRegisterForWebinar: true,
            shouldShowGuideBooking: false,
            hasActiveScheduledCall: true,
        };
        // Given scheduled call data exists in Onyx
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${props.reportID}`, {
            calendlyCalls: [mockScheduledCall],
        });
        // When component is rendered
        renderOnboardingHelpDropdownButton(props);
        // Then dropdown button displays "Call scheduled" text
        const dropdownButton = react_native_1.screen.getByText((0, Localize_1.translateLocal)('scheduledCall.callScheduled'));
        expect(dropdownButton).toBeOnTheScreen();
        // When dropdown menu is opened
        react_native_1.fireEvent.press(dropdownButton);
        // Then all expected menu options are present
        expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.reschedule'))).toBeOnTheScreen();
        expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.cancel'))).toBeOnTheScreen();
        expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('getAssistancePage.registerForWebinar'))).toBeOnTheScreen();
        expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('getAssistancePage.scheduleACall'))).not.toBeOnTheScreen();
    });
    describe('dropdown actions with active scheduled call', () => {
        // Given component configured with active scheduled call and webinar registration enabled
        const props = {
            reportID: '1',
            shouldUseNarrowLayout: false,
            shouldShowRegisterForWebinar: true,
            shouldShowGuideBooking: false,
            hasActiveScheduledCall: true,
        };
        beforeEach(() => {
            react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${props.reportID}`, {
                calendlyCalls: [mockScheduledCall],
            });
            return (0, waitForBatchedUpdates_1.default)();
        });
        it('should open webinar registration URL when webinar option is pressed', async () => {
            // Given scheduled call data exists in Onyx
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${props.reportID}`, {
                calendlyCalls: [mockScheduledCall],
            });
            // When component is rendered and dropdown is opened
            renderOnboardingHelpDropdownButton(props);
            const dropdownButton = react_native_1.screen.getByText((0, Localize_1.translateLocal)('scheduledCall.callScheduled'));
            react_native_1.fireEvent.press(dropdownButton);
            // When webinar menu item is pressed
            const webinarMenuItem = react_native_1.screen.getByText((0, Localize_1.translateLocal)('getAssistancePage.registerForWebinar'));
            react_native_1.fireEvent.press(webinarMenuItem, createMockPressEvent(webinarMenuItem));
            // Then webinar registration URL is opened
            expect(mockOpenExternalLink).toHaveBeenCalledTimes(1);
            expect(mockOpenExternalLink).toHaveBeenCalledWith(CONST_1.default.REGISTER_FOR_WEBINAR_URL);
        });
        it('should call reschedule booking when reschedule option is pressed', () => {
            // When component is rendered and dropdown is opened
            renderOnboardingHelpDropdownButton(props);
            const dropdownButton = react_native_1.screen.getByText((0, Localize_1.translateLocal)('scheduledCall.callScheduled'));
            react_native_1.fireEvent.press(dropdownButton);
            // When reschedule option is pressed
            const rescheduleMenuItem = react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.reschedule'));
            react_native_1.fireEvent.press(rescheduleMenuItem, createMockPressEvent(rescheduleMenuItem));
            // Then reschedule booking action is called with scheduled call data
            expect(mockRescheduleBooking).toHaveBeenCalledTimes(1);
            expect(mockRescheduleBooking).toHaveBeenCalledWith(mockScheduledCall);
        });
        it('should call cancel booking when cancel option is pressed', () => {
            // When component is rendered and dropdown is opened
            renderOnboardingHelpDropdownButton(props);
            const dropdownButton = react_native_1.screen.getByText((0, Localize_1.translateLocal)('scheduledCall.callScheduled'));
            react_native_1.fireEvent.press(dropdownButton);
            // When cancel option is pressed
            const cancelMenuItem = react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.cancel'));
            react_native_1.fireEvent.press(cancelMenuItem, createMockPressEvent(cancelMenuItem));
            // Then cancel booking action is called with scheduled call data
            expect(mockCancelBooking).toHaveBeenCalledTimes(1);
            expect(mockCancelBooking).toHaveBeenCalledWith(mockScheduledCall);
        });
    });
});
