"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const BaseListItem_1 = require("@components/SelectionList/BaseListItem");
const useHover_1 = require("@hooks/useHover");
const CONST_1 = require("@src/CONST");
jest.mock('@hooks/useHover', () => jest.fn());
const mockedUseHover = useHover_1.default;
describe('BaseListItem', () => {
    it('hover should work correctly', () => {
        const mouseEnterMock = jest.fn();
        const mouseLeaveMock = jest.fn();
        mockedUseHover.mockReturnValue({
            hovered: false,
            bind: {
                onMouseEnter: mouseEnterMock,
                onMouseLeave: mouseLeaveMock,
            },
        });
        (0, react_native_1.render)(<BaseListItem_1.default item={{ keyForList: '1' }} onSelectRow={() => { }} showTooltip={false} isFocused={false}/>);
        const testID = `${CONST_1.default.BASE_LIST_ITEM_TEST_ID}1`;
        (0, react_native_1.fireEvent)(react_native_1.screen.getByTestId(testID), 'mouseEnter');
        expect(mouseEnterMock).toBeCalled();
        (0, react_native_1.fireEvent)(react_native_1.screen.getByTestId(testID), 'mouseLeave', { stopPropagation: jest.fn() });
        expect(mouseLeaveMock).toBeCalled();
    });
});
