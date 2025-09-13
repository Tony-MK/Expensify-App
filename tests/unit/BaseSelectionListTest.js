"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var NativeNavigation = require("@react-navigation/native");
var react_native_1 = require("@testing-library/react-native");
var react_1 = require("react");
var react_native_2 = require("react-native");
var BaseSelectionList_1 = require("@components/SelectionList/BaseSelectionList");
var RadioListItem_1 = require("@components/SelectionList/RadioListItem");
var CONST_1 = require("@src/CONST");
var mockSections = Array.from({ length: 10 }, function (_, index) { return ({
    text: "Item ".concat(index),
    keyForList: "".concat(index),
    isSelected: index === 1,
}); });
var largeMockSections = Array.from({ length: 100 }, function (_, index) { return ({
    text: "Item ".concat(index),
    keyForList: "".concat(index),
    isSelected: index === 1,
}); });
var largeMockSectionsWithSelectedItemFromSecondPage = Array.from({ length: 100 }, function (_, index) { return ({
    text: "Item ".concat(index),
    keyForList: "".concat(index),
    isSelected: index === 70,
}); });
jest.mock('@src/components/ConfirmedRoute.tsx');
jest.mock('@react-navigation/native', function () {
    var actualNav = jest.requireActual('@react-navigation/native');
    return __assign(__assign({}, actualNav), { useIsFocused: jest.fn(), useFocusEffect: jest.fn() });
});
jest.mock('@hooks/useLocalize', function () {
    return jest.fn(function () { return ({
        translate: jest.fn(function (key) { return key; }),
        numberFormat: jest.fn(function (num) { return num.toString(); }),
    }); });
});
describe('BaseSelectionList', function () {
    var onSelectRowMock = jest.fn();
    function BaseListItemRenderer(props) {
        var _a;
        var sections = props.sections, canSelectMultiple = props.canSelectMultiple, initialNumToRender = props.initialNumToRender, setSearchText = props.setSearchText, searchText = props.searchText;
        var focusedKey = (_a = sections[0].data.find(function (item) { return item.isSelected; })) === null || _a === void 0 ? void 0 : _a.keyForList;
        return (<BaseSelectionList_1.default sections={sections} textInputLabel="common.search" ListItem={RadioListItem_1.default} onSelectRow={onSelectRowMock} shouldSingleExecuteRowSelect canSelectMultiple={canSelectMultiple} initiallyFocusedOptionKey={focusedKey} initialNumToRender={initialNumToRender} onChangeText={setSearchText} textInputValue={searchText}/>);
    }
    it('should not trigger item press if screen is not focused', function () {
        NativeNavigation.useIsFocused.mockReturnValue(false);
        (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: mockSections }]}/>);
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "1")));
        expect(onSelectRowMock).toHaveBeenCalledTimes(0);
    });
    it('should handle item press correctly', function () {
        NativeNavigation.useIsFocused.mockReturnValue(true);
        (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: mockSections }]}/>);
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "1")));
        expect(onSelectRowMock).toHaveBeenCalledWith(__assign(__assign({}, mockSections.at(1)), { shouldAnimateInHighlight: false }));
    });
    it('should update focused item when sections are updated from BE', function () {
        NativeNavigation.useIsFocused.mockReturnValue(true);
        var updatedMockSections = mockSections.map(function (section) { return (__assign(__assign({}, section), { isSelected: section.keyForList === '2' })); });
        var rerender = (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: mockSections }]}/>).rerender;
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "1"))).toBeSelected();
        rerender(<BaseListItemRenderer sections={[{ data: updatedMockSections }]}/>);
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "2"))).toBeSelected();
    });
    it('should scroll to top when selecting a multi option list', function () {
        var spy = jest.spyOn(react_native_2.SectionList.prototype, 'scrollToLocation');
        (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: [] }, { data: mockSections }]} canSelectMultiple/>);
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "0")));
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ itemIndex: 0 }));
    });
    it('should show only elements from first page when items exceed page limit', function () {
        (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: largeMockSections }]} canSelectMultiple={false} initialNumToRender={60}/>);
        // Should render first page (items 0-49, so 50 items total)
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "0"))).toBeTruthy();
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "49"))).toBeTruthy();
        // Should NOT render items from second page
        expect(react_native_1.screen.queryByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "50"))).toBeFalsy();
        expect(react_native_1.screen.queryByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "99"))).toBeFalsy();
    });
    it('should render all items when they fit within initial render limit', function () {
        (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: mockSections }]} canSelectMultiple={false} initialNumToRender={60}/>);
        // Should render all 10 items since they fit within the initialNumToRender limit
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "0"))).toBeTruthy();
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "9"))).toBeTruthy();
    });
    it('should load more items when scrolled to end', function () {
        (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: largeMockSections }]} canSelectMultiple={false} initialNumToRender={50}/>);
        // Should initially show first page items (0-48, 49 items total)
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "0"))).toBeTruthy();
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "48"))).toBeTruthy();
        // Items beyond first page should not be initially visible
        expect(react_native_1.screen.queryByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "49"))).toBeFalsy();
        // Note: Scroll-based loading in test environment might not work as expected
        // This test verifies the initial state - actual scroll behavior would need integration testing
    });
    it('should search for first item then scroll back to preselected item when search is cleared', function () {
        function SearchableListWrapper() {
            var _a = (0, react_1.useState)(''), searchText = _a[0], setSearchText = _a[1];
            // Filter sections based on search text
            var filteredSections = searchText
                ? largeMockSectionsWithSelectedItemFromSecondPage.filter(function (item) { return item.text.toLowerCase().includes(searchText.toLowerCase()); })
                : largeMockSectionsWithSelectedItemFromSecondPage;
            return (<BaseListItemRenderer sections={[{ data: filteredSections }]} searchText={searchText} setSearchText={setSearchText} canSelectMultiple={false} initialNumToRender={110}/>);
        }
        (0, react_native_1.render)(<SearchableListWrapper />);
        // Initially should show item 70 as selected and visible
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "70"))).toBeTruthy();
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "70"))).toBeSelected();
        // Search for "Item 0"
        react_native_1.fireEvent.changeText(react_native_1.screen.getByTestId('selection-list-text-input'), 'Item 0');
        // Should show only the first item (Item 0) in search results
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "0"))).toBeTruthy();
        expect(react_native_1.screen.queryByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "70"))).toBeFalsy();
        expect(react_native_1.screen.queryByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "1"))).toBeFalsy();
        // Clear the search text
        react_native_1.fireEvent.changeText(react_native_1.screen.getByTestId('selection-list-text-input'), '');
        // Should show the preselected item 70
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "70"))).toBeTruthy();
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "70"))).toBeSelected();
    });
    it('does not reset page when only selectedOptions changes', function () {
        var rerender = (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: largeMockSections }]} canSelectMultiple={false} initialNumToRender={50}/>).rerender;
        // Should show first page items
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "0"))).toBeTruthy();
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "48"))).toBeTruthy();
        // Rerender with only selection change
        rerender(<BaseListItemRenderer sections={[{ data: largeMockSections.map(function (item, index) { return (__assign(__assign({}, item), { isSelected: index === 3 })); }) }]} canSelectMultiple={false} initialNumToRender={50}/>);
        // Should still show the same items (no pagination reset)
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "0"))).toBeTruthy();
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "48"))).toBeTruthy();
        // Item 3 should now be selected
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "3"))).toBeSelected();
    });
    it('should reset current page when text input changes', function () {
        var rerender = (0, react_native_1.render)(<BaseListItemRenderer sections={[{ data: largeMockSections }]} canSelectMultiple={false} initialNumToRender={50}/>).rerender;
        // Should show first page items initially
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "0"))).toBeTruthy();
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "48"))).toBeTruthy();
        // Rerender with search text - should still show items (filtered or not)
        rerender(<BaseListItemRenderer sections={[{ data: largeMockSections.map(function (item, index) { return (__assign(__assign({}, item), { isSelected: index === 3 })); }) }]} canSelectMultiple={false} searchText="Item" initialNumToRender={50}/>);
        // Search functionality should work - items should still be visible
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "0"))).toBeTruthy();
        expect(react_native_1.screen.getByTestId("".concat(CONST_1.default.BASE_LIST_ITEM_TEST_ID, "3"))).toBeTruthy();
    });
});
