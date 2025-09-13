"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = Default;
exports.WithTextInput = WithTextInput;
exports.WithHeaderMessage = WithHeaderMessage;
exports.WithAlternateText = WithAlternateText;
exports.MultipleSelection = MultipleSelection;
exports.WithSectionHeader = WithSectionHeader;
exports.WithConfirmButton = WithConfirmButton;
const react_1 = require("react");
const Badge_1 = require("@components/Badge");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const withNavigationFallback_1 = require("@components/withNavigationFallback");
// eslint-disable-next-line no-restricted-imports
const index_1 = require("@styles/index");
const CONST_1 = require("@src/CONST");
const SelectionListWithNavigation = (0, withNavigationFallback_1.default)(SelectionList_1.default);
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/SelectionList',
    component: SelectionList_1.default,
    parameters: {
        docs: {
            source: {
                type: 'code',
            },
        },
    },
};
const SECTIONS = [
    {
        data: [
            {
                text: 'Option 1',
                keyForList: 'option-1',
                isSelected: false,
            },
            {
                text: 'Option 2',
                keyForList: 'option-2',
                isSelected: false,
            },
            {
                text: 'Option 3',
                keyForList: 'option-3',
                isSelected: false,
            },
        ],
        isDisabled: false,
    },
    {
        data: [
            {
                text: 'Option 4',
                keyForList: 'option-4',
                isSelected: false,
            },
            {
                text: 'Option 5',
                keyForList: 'option-5',
                isSelected: false,
            },
            {
                text: 'Option 6',
                keyForList: 'option-6',
                isSelected: false,
            },
        ],
        isDisabled: false,
    },
];
function Default(props) {
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(1);
    const sections = props.sections.map((section) => {
        const data = section.data.map((item, index) => {
            const isSelected = selectedIndex === index;
            return { ...item, isSelected };
        });
        return { ...section, data };
    });
    const onSelectRow = (item) => {
        sections.forEach((section) => {
            const newSelectedIndex = section.data.findIndex((option) => option.keyForList === item.keyForList);
            if (newSelectedIndex >= 0) {
                setSelectedIndex(newSelectedIndex);
            }
        });
    };
    return (<SelectionListWithNavigation 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} sections={sections} ListItem={RadioListItem_1.default} onSelectRow={onSelectRow}/>);
}
Default.args = {
    sections: SECTIONS,
    onSelectRow: () => { },
    initiallyFocusedOptionKey: 'option-2',
};
function WithTextInput(props) {
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(1);
    const sections = props.sections.map((section) => {
        const data = section.data.reduce((memo, item, index) => {
            if (!item.text?.toLowerCase().includes(searchText.trim().toLowerCase())) {
                return memo;
            }
            const isSelected = selectedIndex === index;
            memo.push({ ...item, isSelected });
            return memo;
        }, []);
        return { ...section, data };
    });
    const onSelectRow = (item) => {
        sections.forEach((section) => {
            const newSelectedIndex = section.data.findIndex((option) => option.keyForList === item.keyForList);
            if (newSelectedIndex >= 0) {
                setSelectedIndex(newSelectedIndex);
            }
        });
    };
    return (<SelectionListWithNavigation 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} sections={sections} ListItem={RadioListItem_1.default} textInputValue={searchText} onChangeText={setSearchText} onSelectRow={onSelectRow}/>);
}
WithTextInput.args = {
    sections: SECTIONS,
    textInputLabel: 'Option list',
    textInputPlaceholder: 'Search something...',
    textInputMaxLength: 4,
    inputMode: CONST_1.default.INPUT_MODE.NUMERIC,
    initiallyFocusedOptionKey: 'option-2',
    onSelectRow: () => { },
    onChangeText: () => { },
};
function WithHeaderMessage(props) {
    return (<WithTextInput 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
WithHeaderMessage.args = {
    ...WithTextInput.args,
    headerMessage: 'No results found',
    sections: [],
};
function WithAlternateText(props) {
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(1);
    const sections = props.sections.map((section) => {
        const data = section.data.map((item, index) => {
            const isSelected = selectedIndex === index;
            return {
                ...item,
                alternateText: `Alternate ${index + 1}`,
                isSelected,
            };
        });
        return { ...section, data };
    });
    const onSelectRow = (item) => {
        sections.forEach((section) => {
            const newSelectedIndex = section.data.findIndex((option) => option.keyForList === item.keyForList);
            if (newSelectedIndex >= 0) {
                setSelectedIndex(newSelectedIndex);
            }
        });
    };
    return (<SelectionListWithNavigation 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} sections={sections} onSelectRow={onSelectRow} ListItem={RadioListItem_1.default}/>);
}
WithAlternateText.args = {
    ...Default.args,
};
function MultipleSelection(props) {
    const [selectedIds, setSelectedIds] = (0, react_1.useState)(['option-1', 'option-2']);
    const memo = (0, react_1.useMemo)(() => {
        const allIds = [];
        const sections = props.sections.map((section) => {
            const data = section.data.map((item, index) => {
                if (item.keyForList) {
                    allIds.push(item.keyForList);
                }
                const isSelected = item.keyForList ? selectedIds.includes(item.keyForList) : false;
                const isAdmin = index === 0;
                return {
                    ...item,
                    isSelected,
                    alternateText: `${item.keyForList}@email.com`,
                    accountID: Number(item.keyForList),
                    login: item.text,
                    rightElement: isAdmin && (<Badge_1.default text="Admin" textStyles={index_1.defaultStyles.textStrong} badgeStyles={index_1.defaultStyles.badgeBordered}/>),
                };
            });
            return { ...section, data };
        });
        return { sections, allIds };
    }, [props.sections, selectedIds]);
    const onSelectRow = (item) => {
        if (!item.keyForList) {
            return;
        }
        const newSelectedIds = selectedIds.includes(item.keyForList) ? selectedIds.filter((id) => id !== item.keyForList) : [...selectedIds, item.keyForList];
        setSelectedIds(newSelectedIds);
    };
    const onSelectAll = () => {
        if (selectedIds.length === memo.allIds.length) {
            setSelectedIds([]);
        }
        else {
            setSelectedIds(memo.allIds);
        }
    };
    return (<SelectionListWithNavigation 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} sections={memo.sections} ListItem={RadioListItem_1.default} onSelectRow={onSelectRow} onSelectAll={onSelectAll}/>);
}
MultipleSelection.args = {
    ...Default.args,
    canSelectMultiple: true,
    onSelectAll: () => { },
};
function WithSectionHeader(props) {
    const [selectedIds, setSelectedIds] = (0, react_1.useState)(['option-1', 'option-2']);
    const memo = (0, react_1.useMemo)(() => {
        const allIds = [];
        const sections = props.sections.map((section, sectionIndex) => {
            const data = section.data.map((item, itemIndex) => {
                if (item.keyForList) {
                    allIds.push(item.keyForList);
                }
                const isSelected = item.keyForList ? selectedIds.includes(item.keyForList) : false;
                const isAdmin = itemIndex === 0;
                return {
                    ...item,
                    isSelected,
                    alternateText: `${item.keyForList}@email.com`,
                    accountID: Number(item.keyForList),
                    login: item.text,
                    rightElement: isAdmin && (<Badge_1.default text="Admin" textStyles={index_1.defaultStyles.textStrong} badgeStyles={index_1.defaultStyles.badgeBordered}/>),
                };
            });
            return { ...section, data, title: `Section ${sectionIndex + 1}` };
        });
        return { sections, allIds };
    }, [props.sections, selectedIds]);
    const onSelectRow = (item) => {
        if (!item.keyForList) {
            return;
        }
        const newSelectedIds = selectedIds.includes(item.keyForList) ? selectedIds.filter((id) => id !== item.keyForList) : [...selectedIds, item.keyForList];
        setSelectedIds(newSelectedIds);
    };
    const onSelectAll = () => {
        if (selectedIds.length === memo.allIds.length) {
            setSelectedIds([]);
        }
        else {
            setSelectedIds(memo.allIds);
        }
    };
    return (<SelectionListWithNavigation 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} sections={memo.sections} ListItem={RadioListItem_1.default} onSelectRow={onSelectRow} onSelectAll={onSelectAll}/>);
}
WithSectionHeader.args = {
    ...MultipleSelection.args,
};
function WithConfirmButton(props) {
    const [selectedIds, setSelectedIds] = (0, react_1.useState)(['option-1', 'option-2']);
    const memo = (0, react_1.useMemo)(() => {
        const allIds = [];
        const sections = props.sections.map((section, sectionIndex) => {
            const data = section.data.map((item, itemIndex) => {
                if (item.keyForList) {
                    allIds.push(item.keyForList);
                }
                const isSelected = item.keyForList ? selectedIds.includes(item.keyForList) : false;
                const isAdmin = itemIndex === 0;
                return {
                    ...item,
                    isSelected,
                    alternateText: `${item.keyForList}@email.com`,
                    accountID: Number(item.keyForList),
                    login: item.text,
                    rightElement: isAdmin && (<Badge_1.default text="Admin" textStyles={index_1.defaultStyles.textStrong} badgeStyles={index_1.defaultStyles.badgeBordered}/>),
                };
            });
            return { ...section, data, title: `Section ${sectionIndex + 1}` };
        });
        return { sections, allIds };
    }, [props.sections, selectedIds]);
    const onSelectRow = (item) => {
        if (!item.keyForList) {
            return;
        }
        const newSelectedIds = selectedIds.includes(item.keyForList) ? selectedIds.filter((id) => id !== item.keyForList) : [...selectedIds, item.keyForList];
        setSelectedIds(newSelectedIds);
    };
    const onSelectAll = () => {
        if (selectedIds.length === memo.allIds.length) {
            setSelectedIds([]);
        }
        else {
            setSelectedIds(memo.allIds);
        }
    };
    return (<SelectionListWithNavigation 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} sections={memo.sections} ListItem={RadioListItem_1.default} onSelectRow={onSelectRow} onSelectAll={onSelectAll}/>);
}
WithConfirmButton.args = {
    ...MultipleSelection.args,
    onConfirm: () => { },
    confirmButtonText: 'Confirm',
    showConfirmButton: true,
};
exports.default = story;
