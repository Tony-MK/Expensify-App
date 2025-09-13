"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const User = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function PriorityModePage() {
    const { translate } = (0, useLocalize_1.default)();
    const [priorityMode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIORITY_MODE, { selector: (mode) => mode ?? CONST_1.default.PRIORITY_MODE.DEFAULT });
    const styles = (0, useThemeStyles_1.default)();
    const priorityModes = Object.values(CONST_1.default.PRIORITY_MODE).map((mode) => ({
        value: mode,
        text: translate(`priorityModePage.priorityModes.${mode}.label`),
        alternateText: translate(`priorityModePage.priorityModes.${mode}.description`),
        keyForList: mode,
        isSelected: priorityMode === mode,
    }));
    const updateMode = (0, react_1.useCallback)((mode) => {
        if (mode.value === priorityMode) {
            Navigation_1.default.goBack();
            return;
        }
        User.updateChatPriorityMode(mode.value);
    }, [priorityMode]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={PriorityModePage.displayName}>
            <HeaderWithBackButton_1.default title={translate('priorityModePage.priorityMode')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <Text_1.default style={[styles.mh5, styles.mv3]}>{translate('priorityModePage.explainerText')}</Text_1.default>
            <SelectionList_1.default sections={[{ data: priorityModes }]} ListItem={RadioListItem_1.default} onSelectRow={updateMode} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={priorityModes.find((mode) => mode.isSelected)?.keyForList}/>
        </ScreenWrapper_1.default>);
}
PriorityModePage.displayName = 'PriorityModePage';
exports.default = PriorityModePage;
