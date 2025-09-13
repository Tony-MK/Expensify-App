"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const reassure_1 = require("reassure");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const variables_1 = require("@styles/variables");
jest.mock('@components/Icon/Expensicons');
jest.mock('@hooks/useLocalize', () => jest.fn(() => ({
    translate: jest.fn(),
    numberFormat: jest.fn(),
})));
jest.mock('@hooks/useNetwork', () => jest.fn(() => ({
    isOffline: false,
})));
jest.mock('@components/withKeyboardState', () => (Component) => {
    function WrappedComponent(props) {
        return (<Component 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} isKeyboardShown={false}/>);
    }
    WrappedComponent.displayName = `WrappedComponent`;
    return WrappedComponent;
});
jest.mock('@react-navigation/stack', () => ({
    useCardAnimation: () => { },
}));
jest.mock('@react-navigation/native', () => ({
    useFocusEffect: () => { },
    useIsFocused: () => true,
    createNavigationContainerRef: jest.fn(),
}));
jest.mock('../../src/hooks/useKeyboardState', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => ({
        isKeyboardShown: false,
        keyboardHeight: 0,
    })),
}));
jest.mock('../../src/hooks/useScreenWrapperTransitionStatus', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => ({
        didScreenTransitionEnd: true,
    })),
}));
jest.mock('@src/components/ConfirmedRoute.tsx');
function SelectionListWrapper({ canSelectMultiple }) {
    const [selectedIds, setSelectedIds] = (0, react_1.useState)([]);
    const sections = [
        {
            data: Array.from({ length: 1000 }, (element, index) => ({
                text: `Item ${index}`,
                keyForList: `item-${index}`,
                isSelected: selectedIds.includes(`item-${index}`),
            })),
            isDisabled: false,
        },
    ];
    const onSelectRow = (item) => {
        if (!item.keyForList) {
            return;
        }
        if (canSelectMultiple) {
            if (selectedIds.includes(item.keyForList)) {
                setSelectedIds(selectedIds.filter((selectedId) => selectedId === item.keyForList));
            }
            else {
                setSelectedIds([...selectedIds, item.keyForList]);
            }
        }
        else {
            setSelectedIds([item.keyForList]);
        }
    };
    return (<SelectionList_1.default textInputLabel="Perf test" sections={sections} onSelectRow={onSelectRow} initiallyFocusedOptionKey="item-0" ListItem={RadioListItem_1.default} canSelectMultiple={canSelectMultiple}/>);
}
test('[SelectionList] should render 1 section and a thousand items', async () => {
    await (0, reassure_1.measureRenders)(<SelectionListWrapper />);
});
test('[SelectionList] should press a list item', async () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const scenario = async (screen) => {
        react_native_1.fireEvent.press(screen.getByText('Item 5'));
    };
    await (0, reassure_1.measureRenders)(<SelectionListWrapper />, { scenario });
});
test('[SelectionList] should render multiple selection and select 3 items', async () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const scenario = async (screen) => {
        react_native_1.fireEvent.press(screen.getByText('Item 1'));
        react_native_1.fireEvent.press(screen.getByText('Item 2'));
        react_native_1.fireEvent.press(screen.getByText('Item 3'));
    };
    await (0, reassure_1.measureRenders)(<SelectionListWrapper canSelectMultiple/>, { scenario });
});
test('[SelectionList] should scroll and select a few items', async () => {
    const eventData = {
        nativeEvent: {
            contentOffset: {
                y: variables_1.default.optionRowHeight * 5,
            },
            contentSize: {
                // Dimensions of the scrollable content
                height: variables_1.default.optionRowHeight * 10,
                width: 100,
            },
            layoutMeasurement: {
                // Dimensions of the device
                height: variables_1.default.optionRowHeight * 5,
                width: 100,
            },
        },
    };
    // eslint-disable-next-line @typescript-eslint/require-await
    const scenario = async (screen) => {
        react_native_1.fireEvent.press(screen.getByText('Item 1'));
        // see https://github.com/callstack/react-native-testing-library/issues/1540
        (0, react_native_1.fireEvent)(screen.getByTestId('selection-list'), 'onContentSizeChange', eventData.nativeEvent.contentSize.width, eventData.nativeEvent.contentSize.height);
        react_native_1.fireEvent.scroll(screen.getByTestId('selection-list'), eventData);
        react_native_1.fireEvent.press(screen.getByText('Item 7'));
        react_native_1.fireEvent.press(screen.getByText('Item 15'));
    };
    await (0, reassure_1.measureRenders)(<SelectionListWrapper canSelectMultiple/>, { scenario });
});
