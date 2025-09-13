"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SelectionList_1 = require("@components/SelectionList");
var RadioListItem_1 = require("@components/SelectionList/RadioListItem");
var useLocalize_1 = require("@hooks/useLocalize");
function ReportFieldsInitialListValuePicker(_a) {
    var _b, _c, _d;
    var listValues = _a.listValues, disabledOptions = _a.disabledOptions, value = _a.value, onValueChange = _a.onValueChange;
    var localeCompare = (0, useLocalize_1.default)().localeCompare;
    var listValueSections = (0, react_1.useMemo)(function () { return [
        {
            data: Object.values(listValues !== null && listValues !== void 0 ? listValues : {})
                .filter(function (listValue, index) { return !disabledOptions.at(index); })
                .sort(localeCompare)
                .map(function (listValue) { return ({
                keyForList: listValue,
                value: listValue,
                isSelected: value === listValue,
                text: listValue,
            }); }),
        },
    ]; }, [value, listValues, disabledOptions, localeCompare]);
    return (<SelectionList_1.default sections={listValueSections} ListItem={RadioListItem_1.default} onSelectRow={function (item) { return onValueChange(item.value); }} initiallyFocusedOptionKey={(_d = (_c = (_b = listValueSections.at(0)) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.find(function (listValue) { return listValue.isSelected; })) === null || _d === void 0 ? void 0 : _d.keyForList} addBottomSafeAreaPadding/>);
}
ReportFieldsInitialListValuePicker.displayName = 'ReportFieldsInitialListValuePicker';
exports.default = ReportFieldsInitialListValuePicker;
