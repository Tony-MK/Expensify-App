"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LHNOptionsList_1 = require("@components/LHNOptionsList/LHNOptionsList");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const LHNTestUtils_1 = require("../../utils/LHNTestUtils");
// Mock the context menu
jest.mock('@pages/home/report/ContextMenu/ReportActionContextMenu', () => ({
    showContextMenu: jest.fn(),
}));
// Mock the useRootNavigationState hook
jest.mock('@src/hooks/useRootNavigationState');
// Mock navigation hooks
const mockUseIsFocused = jest.fn().mockReturnValue(false);
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        useIsFocused: () => mockUseIsFocused(),
        useRoute: jest.fn(),
        useNavigationState: jest.fn(),
        createNavigationContainerRef: () => ({
            getState: () => jest.fn(),
        }),
    };
});
const getReportItem = (reportID) => {
    return react_native_1.screen.findByTestId(reportID);
};
const getReportItemButton = () => {
    return react_native_1.userEvent.setup();
};
describe('LHNOptionsList', () => {
    const mockReport = (0, LHNTestUtils_1.getFakeReport)([1, 2], 0, false);
    const defaultProps = {
        data: [mockReport],
        onSelectRow: jest.fn(),
        optionMode: CONST_1.default.OPTION_MODE.DEFAULT,
        onFirstItemRendered: jest.fn(),
    };
    const getLHNOptionsListElement = (props = {}) => {
        const mergedProps = {
            data: props.data ?? defaultProps.data,
            onSelectRow: props.onSelectRow ?? defaultProps.onSelectRow,
            optionMode: props.optionMode ?? defaultProps.optionMode,
            onFirstItemRendered: props.onFirstItemRendered ?? defaultProps.onFirstItemRendered,
        };
        return (<native_1.NavigationContainer>
                <ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider]}>
                    <LHNOptionsList_1.default data={mergedProps.data} onSelectRow={mergedProps.onSelectRow} optionMode={mergedProps.optionMode} onFirstItemRendered={mergedProps.onFirstItemRendered}/>
                </ComposeProviders_1.default>
            </native_1.NavigationContainer>);
    };
    beforeEach(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        jest.clearAllMocks();
    });
    afterEach(() => {
        return react_native_onyx_1.default.clear();
    });
    it('shows context menu on long press', async () => {
        // Given the screen is focused.
        mockUseIsFocused.mockReturnValue(true);
        // Given the LHNOptionsList is rendered with a report.
        (0, react_native_1.render)(getLHNOptionsListElement());
        // Then wait for the report to be displayed in the LHNOptionsList.
        const reportItem = await (0, react_native_1.waitFor)(() => getReportItem(mockReport.reportID));
        expect(reportItem).toBeTruthy();
        // When the user long presses the report item.
        const user = getReportItemButton();
        await user.longPress(reportItem);
        // Then wait for all state updates to complete and verify the context menu is shown
        await (0, react_native_1.waitFor)(() => {
            expect(ReportActionContextMenu_1.showContextMenu).toHaveBeenCalledWith(expect.objectContaining({
                type: CONST_1.default.CONTEXT_MENU_TYPES.REPORT,
                report: expect.objectContaining({
                    reportID: mockReport.reportID,
                }),
            }));
        });
    });
    it('does not show context menu when screen is not focused', async () => {
        // Given the screen is not focused.
        mockUseIsFocused.mockReturnValue(false);
        // When the LHNOptionsList is rendered.
        (0, react_native_1.render)(getLHNOptionsListElement());
        // Then wait for the report to be displayed in the LHNOptionsList.
        const reportItem = await (0, react_native_1.waitFor)(() => getReportItem(mockReport.reportID));
        expect(reportItem).toBeTruthy();
        // When the user long presses the report item.
        const user = getReportItemButton();
        await user.longPress(reportItem);
        // Then wait for all state updates to complete and verify the context menu is not shown
        await (0, react_native_1.waitFor)(() => {
            expect(ReportActionContextMenu_1.showContextMenu).not.toHaveBeenCalled();
        });
    });
    it('shows context menu after returning from chat', async () => {
        // Given the screen is focused.
        mockUseIsFocused.mockReturnValue(true);
        // When the LHNOptionsList is rendered.
        const { rerender } = (0, react_native_1.render)(getLHNOptionsListElement());
        // Then wait for the report to be displayed in the LHNOptionsList.
        const reportItem = await (0, react_native_1.waitFor)(() => getReportItem(mockReport.reportID));
        expect(reportItem).toBeTruthy();
        // When the user navigates to chat and back by re-rendering with different focus state
        rerender(getLHNOptionsListElement());
        // When the user re-renders again to simulate returning to the screen
        rerender(getLHNOptionsListElement());
        // When the user long presses the report item.
        const user = getReportItemButton();
        await user.longPress(reportItem);
        // Then wait for all state updates to complete and verify the context menu is shown
        await (0, react_native_1.waitFor)(() => {
            expect(ReportActionContextMenu_1.showContextMenu).toHaveBeenCalledWith(expect.objectContaining({
                type: CONST_1.default.CONTEXT_MENU_TYPES.REPORT,
                report: expect.objectContaining({
                    reportID: mockReport.reportID,
                }),
            }));
        });
    });
});
