"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NativeNavigation = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_2 = require("react-native");
const BaseSelectionList_1 = require("@components/SelectionList/BaseSelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const CONST_1 = require("@src/CONST");
const mockSections = Array.from({ length: 10 }, (_, index) => ({
    text: `Item ${index}`,
    keyForList: `${index}`,
    isSelected: index === 1,
}));
const largeMockSections = Array.from({ length: 100 }, (_, index) => ({
    text: `Item ${index}`,
    keyForList: `${index}`,
    isSelected: index === 1,
}));
const largeMockSectionsWithSelectedItemFromSecondPage = Array.from({ length: 100 }, (_, index) => ({
    text: `Item ${index}`,
    keyForList: `${index}`,
    isSelected: index === 70,
}));
jest.mock('@src/components/ConfirmedRoute.tsx');
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useIsFocused: jest.fn(),
        useFocusEffect: jest.fn(),
    };
});
jest.mock('@hooks/useLocalize', () => jest.fn(() => ({
    translate: jest.fn((key) => key),
    numberFormat: jest.fn((num) => num.toString()),
})));
describe('BaseSelectionList', () => {
    const onSelectRowMock = jest.fn();
    function BaseListItemRenderer(props) {
        const { sections, canSelectMultiple, initialNumToRender, setSearchText, searchText } = props;
        const focusedKey = sections[0].data.find((item) => item.isSelected)?.keyForList;
        return (<BaseSelectionList_1.default sections={sections} textInputLabel="common.search" ListItem={RadioListItem_1.default} onSelectRow={onSelectRowMock} shouldSingleExecuteRowSelect canSelectMultiple={canSelectMultiple} initiallyFocusedOptionKey={focusedKey} initialNumToRender={initialNumToRender} onChangeText={setSearchText} textInputValue={searchText}/>);
    }
    it('should not trigger item press if screen is not focused', () => {
        NativeNavigation.useIsFocused.mockReturnValue(false);
        (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: mockSections }]}/>);
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}1`));
        expect(onSelectRowMock).toHaveBeenCalledTimes(0);
    });
    it('should handle item press correctly', () => {
        NativeNavigation.useIsFocused.mockReturnValue(true);
        (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: mockSections }]}/>);
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}1`));
        expect(onSelectRowMock).toHaveBeenCalledWith({
            ...mockSections.at(1),
            shouldAnimateInHighlight: false,
        });
    });
    it('should update focused item when sections are updated from BE', () => {
        NativeNavigation.useIsFocused.mockReturnValue(true);
        const updatedMockSections = mockSections.map((section) => ({
            ...section,
            isSelected: section.keyForList === '2',
        }));
        const { rerender } = (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: mockSections }]}/>);
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}1`)).toBeSelected();
        rerender(<BaseListItemRenderer sections={[{ data: updatedMockSections }]}/>);
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}2`)).toBeSelected();
    });
    it('should scroll to top when selecting a multi option list', () => {
        const spy = jest.spyOn(react_native_2.SectionList.prototype, 'scrollToLocation');
        (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: [] }, { data: mockSections }]} canSelectMultiple/>);
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}0`));
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ itemIndex: 0 }));
    });
    it('should show only elements from first page when items exceed page limit', () => {
        (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: largeMockSections }]} canSelectMultiple={false} initialNumToRender={60}/>);
        // Should render first page (items 0-49, so 50 items total)
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}0`)).toBeTruthy();
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}49`)).toBeTruthy();
        // Should NOT render items from second page
        expect(react_native_1.screen.queryByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}50`)).toBeFalsy();
        expect(react_native_1.screen.queryByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}99`)).toBeFalsy();
    });
    it('should render all items when they fit within initial render limit', () => {
        (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: mockSections }]} canSelectMultiple={false} initialNumToRender={60}/>);
        // Should render all 10 items since they fit within the initialNumToRender limit
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}0`)).toBeTruthy();
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}9`)).toBeTruthy();
    });
    it('should load more items when scrolled to end', () => {
        (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: largeMockSections }]} canSelectMultiple={false} initialNumToRender={50}/>);
        // Should initially show first page items (0-48, 49 items total)
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}0`)).toBeTruthy();
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}48`)).toBeTruthy();
        // Items beyond first page should not be initially visible
        expect(react_native_1.screen.queryByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}49`)).toBeFalsy();
        // Note: Scroll-based loading in test environment might not work as expected
        // This test verifies the initial state - actual scroll behavior would need integration testing
    });
    it('should search for first item then scroll back to preselected item when search is cleared', () => {
        function SearchableListWrapper() {
            const [searchText, setSearchText] = (0, react_1.useState)('');
            // Filter sections based on search text
            const filteredSections = searchText
                ? largeMockSectionsWithSelectedItemFromSecondPage.filter((item) => item.text.toLowerCase().includes(searchText.toLowerCase()))
                : largeMockSectionsWithSelectedItemFromSecondPage;
            return (<BaseListItemRenderer sections={[{ data: filteredSections }]} searchText={searchText} setSearchText={setSearchText} canSelectMultiple={false} initialNumToRender={110}/>);
        }
        (0, react_native_1.render)(<SearchableListWrapper />);
        // Initially should show item 70 as selected and visible
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}70`)).toBeTruthy();
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}70`)).toBeSelected();
        // Search for "Item 0"
        react_native_1.fireEvent.changeText(react_native_1.screen.getByTestId('selection-list-text-input'), 'Item 0');
        // Should show only the first item (Item 0) in search results
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}0`)).toBeTruthy();
        expect(react_native_1.screen.queryByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}70`)).toBeFalsy();
        expect(react_native_1.screen.queryByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}1`)).toBeFalsy();
        // Clear the search text
        react_native_1.fireEvent.changeText(react_native_1.screen.getByTestId('selection-list-text-input'), '');
        // Should show the preselected item 70
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}70`)).toBeTruthy();
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}70`)).toBeSelected();
    });
    it('does not reset page when only selectedOptions changes', () => {
        const { rerender } = (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: largeMockSections }]} canSelectMultiple={false} initialNumToRender={50}/>);
        // Should show first page items
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}0`)).toBeTruthy();
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}48`)).toBeTruthy();
        // Rerender with only selection change
        rerender(<BaseListItemRenderer sections={[{ data: largeMockSections.map((item, index) => ({ ...item, isSelected: index === 3 })) }]} canSelectMultiple={false} initialNumToRender={50}/>);
        // Should still show the same items (no pagination reset)
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}0`)).toBeTruthy();
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}48`)).toBeTruthy();
        // Item 3 should now be selected
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}3`)).toBeSelected();
    });
    it('should reset current page when text input changes', () => {
        const { rerender } = (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: largeMockSections }]} canSelectMultiple={false} initialNumToRender={50}/>);
        // Should show first page items initially
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}0`)).toBeTruthy();
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}48`)).toBeTruthy();
        // Rerender with search text - should still show items (filtered or not)
        rerender(<BaseListItemRenderer sections={[{ data: largeMockSections.map((item, index) => ({ ...item, isSelected: index === 3 })) }]} canSelectMultiple={false} searchText="Item" initialNumToRender={50}/>);
        // Search functionality should work - items should still be visible
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}0`)).toBeTruthy();
        expect(react_native_1.screen.getByTestId(`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}3`)).toBeTruthy();
    });
});
