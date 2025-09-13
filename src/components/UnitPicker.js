"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const WorkspacesSettingsUtils_1 = require("@libs/WorkspacesSettingsUtils");
const CONST_1 = require("@src/CONST");
const SelectionList_1 = require("./SelectionList");
const RadioListItem_1 = require("./SelectionList/RadioListItem");
const units = [CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS, CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES];
function UnitPicker({ defaultValue, onOptionSelected }) {
    const { translate } = (0, useLocalize_1.default)();
    const unitOptions = (0, react_1.useMemo)(() => units.map((unit) => ({
        value: unit,
        text: expensify_common_1.Str.recapitalize(translate((0, WorkspacesSettingsUtils_1.getUnitTranslationKey)(unit))),
        keyForList: unit,
        isSelected: defaultValue === unit,
    })), [defaultValue, translate]);
    return (<SelectionList_1.default sections={[{ data: unitOptions }]} ListItem={RadioListItem_1.default} onSelectRow={onOptionSelected} initiallyFocusedOptionKey={unitOptions.find((unit) => unit.isSelected)?.keyForList}/>);
}
exports.default = UnitPicker;
