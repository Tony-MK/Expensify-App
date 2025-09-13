"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const date_fns_1 = require("date-fns");
const CalendarPicker_1 = require("@components/DatePicker/CalendarPicker");
const DateUtils_1 = require("@libs/DateUtils");
const monthNames = DateUtils_1.default.getMonthNames();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({ navigate: jest.fn() }),
    createNavigationContainerRef: jest.fn(),
}));
jest.mock('../../src/hooks/useLocalize', () => jest.fn(() => ({
    translate: jest.fn(),
})));
jest.mock('@src/components/ConfirmedRoute.tsx');
describe('CalendarPicker', () => {
    test('renders calendar component', () => {
        (0, react_native_1.render)(<CalendarPicker_1.default />);
    });
    test('displays the current month and year', () => {
        const currentDate = new Date();
        const maxDate = (0, date_fns_1.addYears)(new Date(currentDate), 1);
        const minDate = (0, date_fns_1.subYears)(new Date(currentDate), 1);
        (0, react_native_1.render)(<CalendarPicker_1.default maxDate={maxDate} minDate={minDate}/>);
        expect(react_native_1.screen.getByText(monthNames[currentDate.getMonth()])).toBeTruthy();
        expect(react_native_1.screen.getByText(currentDate.getFullYear().toString())).toBeTruthy();
    });
    test('clicking next month arrow updates the displayed month', () => {
        const minDate = new Date('2022-01-01');
        const maxDate = new Date('2030-01-01');
        (0, react_native_1.render)(<CalendarPicker_1.default minDate={minDate} maxDate={maxDate}/>);
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId('next-month-arrow'));
        const nextMonth = (0, date_fns_1.addMonths)(new Date(), 1).getMonth();
        expect(react_native_1.screen.getByText(monthNames.at(nextMonth) ?? '')).toBeTruthy();
    });
    test('clicking previous month arrow updates the displayed month', () => {
        (0, react_native_1.render)(<CalendarPicker_1.default />);
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId('prev-month-arrow'));
        const prevMonth = (0, date_fns_1.subMonths)(new Date(), 1).getMonth();
        expect(react_native_1.screen.getByText(monthNames.at(prevMonth) ?? '')).toBeTruthy();
    });
    test('clicking a day updates the selected date', () => {
        const onSelectedMock = jest.fn();
        const minDate = new Date('2022-01-01');
        const maxDate = new Date('2030-01-01');
        const value = '2023-01-01';
        (0, react_native_1.render)(<CalendarPicker_1.default value={value} minDate={minDate} maxDate={maxDate} onSelected={onSelectedMock}/>);
        react_native_1.fireEvent.press(react_native_1.screen.getByText('15'));
        expect(onSelectedMock).toHaveBeenCalledWith('2023-01-15');
        expect(onSelectedMock).toHaveBeenCalledTimes(1);
    });
    test('clicking previous month arrow and selecting day updates the selected date', () => {
        const onSelectedMock = jest.fn();
        const value = '2022-01-01';
        const minDate = new Date('2022-01-01');
        const maxDate = new Date('2030-01-01');
        (0, react_native_1.render)(<CalendarPicker_1.default value={value} minDate={minDate} maxDate={maxDate} onSelected={onSelectedMock}/>);
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId('next-month-arrow'));
        react_native_1.fireEvent.press(react_native_1.screen.getByText('15'));
        expect(onSelectedMock).toHaveBeenCalledWith('2022-02-15');
    });
    test('should block the back arrow when there is no available dates in the previous month', async () => {
        const minDate = new Date('2003-02-01');
        const value = new Date('2003-02-17');
        // given the min date is 1
        (0, react_native_1.render)(<CalendarPicker_1.default minDate={minDate} value={value}/>);
        // When the previous month arrow is pressed
        const user = react_native_1.userEvent.setup();
        await user.press(react_native_1.screen.getByTestId('prev-month-arrow'));
        // Then the previous month should not be called as the previous month button is disabled
        const prevMonth = (0, date_fns_1.subMonths)(value, 1).getMonth();
        expect(react_native_1.screen.queryByText(monthNames.at(prevMonth) ?? '')).not.toBeOnTheScreen();
    });
    test('should block the next arrow when there is no available dates in the next month', async () => {
        const maxDate = new Date('2003-02-24');
        const value = new Date('2003-02-17');
        (0, react_native_1.render)(<CalendarPicker_1.default maxDate={maxDate} value={value}/>);
        // When the next month arrow is pressed
        const user = react_native_1.userEvent.setup();
        await user.press(react_native_1.screen.getByTestId('next-month-arrow'));
        // Then the next month should not be called as the next month button is disabled
        const nextMonth = (0, date_fns_1.addMonths)(value, 1).getMonth();
        expect(react_native_1.screen.queryByText(monthNames.at(nextMonth) ?? '')).not.toBeOnTheScreen();
    });
    test('should allow navigating to the month of the max date when it has less days than the selected date', () => {
        const maxDate = new Date('2003-11-27'); // This month has 30 days
        const value = '2003-10-31';
        // given the max date is 27
        (0, react_native_1.render)(<CalendarPicker_1.default maxDate={maxDate} value={value}/>);
        // then the next arrow should be enabled
        expect(react_native_1.screen.getByTestId('next-month-arrow')).toBeEnabled();
    });
    test('should open the calendar on a month from max date if it is earlier than current month', () => {
        const onSelectedMock = jest.fn();
        const maxDate = new Date('2011-03-01');
        (0, react_native_1.render)(<CalendarPicker_1.default onSelected={onSelectedMock} maxDate={maxDate}/>);
        react_native_1.fireEvent.press(react_native_1.screen.getByText('1'));
        expect(onSelectedMock).toHaveBeenCalledWith('2011-03-01');
    });
    test('should open the calendar on a year from max date if it is earlier than current year', () => {
        const maxDate = new Date('2011-03-01');
        (0, react_native_1.render)(<CalendarPicker_1.default maxDate={maxDate}/>);
        expect((0, react_native_1.within)(react_native_1.screen.getByTestId('currentYearText')).getByText('2011')).toBeTruthy();
    });
    test('should open the calendar on a month from min date if it is later than current month', () => {
        const minDate = new Date('2035-02-16');
        const maxDate = new Date('2040-02-16');
        (0, react_native_1.render)(<CalendarPicker_1.default minDate={minDate} maxDate={maxDate}/>);
        expect((0, react_native_1.within)(react_native_1.screen.getByTestId('currentYearText')).getByText(minDate.getFullYear().toString())).toBeTruthy();
    });
    test('should not allow to press earlier day than minDate', () => {
        const value = '2003-02-17';
        const minDate = new Date('2003-02-16');
        const onSelectedMock = jest.fn();
        // given the min date is 16
        (0, react_native_1.render)(<CalendarPicker_1.default minDate={minDate} value={value} onSelected={onSelectedMock}/>);
        //  When the day 15 is pressed
        react_native_1.fireEvent.press(react_native_1.screen.getByLabelText('15'));
        // Then the onSelected should not be called as the label 15 is disabled
        expect(onSelectedMock).not.toHaveBeenCalled();
        // When the day 16 is pressed
        react_native_1.fireEvent.press(react_native_1.screen.getByLabelText('16'));
        // Then the onSelected should be called as the label 16 is enabled
        expect(onSelectedMock).toHaveBeenCalledWith('2003-02-16');
    });
    test('should not allow to press later day than max', () => {
        const value = '2003-02-17';
        const maxDate = new Date('2003-02-24');
        const onSelectedMock = jest.fn();
        // given the max date is 24
        (0, react_native_1.render)(<CalendarPicker_1.default maxDate={maxDate} value={value} onSelected={onSelectedMock}/>);
        //  When the day 25 is pressed
        react_native_1.fireEvent.press(react_native_1.screen.getByLabelText('25'));
        // Then the onSelected should not be called as the label 15 is disabled
        expect(onSelectedMock).not.toHaveBeenCalled();
        // When the day 24 is pressed
        react_native_1.fireEvent.press(react_native_1.screen.getByLabelText('24'));
        // Then the onSelected should be called as the label 24 is enabled
        expect(onSelectedMock).toHaveBeenCalledWith('2003-02-24');
    });
    test('should allow to press min date', () => {
        const value = '2003-02-17';
        const minDate = new Date('2003-02-16');
        // given the min date is 16
        (0, react_native_1.render)(<CalendarPicker_1.default minDate={minDate} value={value}/>);
        // then the label 16 should be clickable
        expect(react_native_1.screen.getByLabelText('16')).toBeEnabled();
    });
    test('should allow to press max date', () => {
        const value = '2003-02-17';
        const maxDate = new Date('2003-02-24');
        // given the max date is 24
        (0, react_native_1.render)(<CalendarPicker_1.default maxDate={maxDate} value={value}/>);
        // then the label 24 should be clickable
        expect(react_native_1.screen.getByLabelText('24')).toBeEnabled();
    });
});
