"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const WorkspaceReportFieldUtils_1 = require("@libs/WorkspaceReportFieldUtils");
const CONST_1 = require("@src/CONST");
function ReportFieldTypePicker({ defaultValue, onOptionSelected }) {
    const { translate } = (0, useLocalize_1.default)();
    const typeSections = (0, react_1.useMemo)(() => {
        const data = Object.values(CONST_1.default.REPORT_FIELD_TYPES).map((reportFieldType) => ({
            keyForList: reportFieldType,
            value: reportFieldType,
            isSelected: defaultValue === reportFieldType,
            text: translate((0, WorkspaceReportFieldUtils_1.getReportFieldTypeTranslationKey)(reportFieldType)),
            alternateText: translate((0, WorkspaceReportFieldUtils_1.getReportFieldAlternativeTextTranslationKey)(reportFieldType)),
        }));
        return [{ data }];
    }, [defaultValue, translate]);
    return (<SelectionList_1.default sections={typeSections} ListItem={RadioListItem_1.default} onSelectRow={onOptionSelected} addBottomSafeAreaPadding initiallyFocusedOptionKey={typeSections.at(0)?.data?.find((reportField) => reportField.isSelected)?.keyForList}/>);
}
ReportFieldTypePicker.displayName = 'ReportFieldTypePicker';
exports.default = ReportFieldTypePicker;
