"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NAICS_1 = require("@src/NAICS");
function IndustryCodeSelector({ onInputChange, value, errorText }) {
    const styles = (0, useThemeStyles_1.default)();
    const [searchValue, setSearchValue] = (0, react_1.useState)(value);
    const [shouldDisplayChildItems, setShouldDisplayChildItems] = (0, react_1.useState)(false);
    const { translate } = (0, useLocalize_1.default)();
    const sections = (0, react_1.useMemo)(() => {
        if (!searchValue) {
            return [
                {
                    data: NAICS_1.NAICS.map((item) => {
                        return {
                            value: `${item.id}`,
                            text: `${item.id} - ${item.value}`,
                            keyForList: `${item.id}`,
                        };
                    }),
                },
            ];
        }
        if (shouldDisplayChildItems) {
            return [
                {
                    data: (NAICS_1.NAICS_MAPPING_WITH_ID[searchValue] ?? []).map((item) => {
                        return {
                            value: `${item.id}`,
                            text: `${item.id} - ${item.value}`,
                            keyForList: `${item.id}`,
                        };
                    }),
                },
            ];
        }
        return [
            {
                data: NAICS_1.ALL_NAICS.filter((item) => item.id.toString().toLowerCase().startsWith(searchValue.toLowerCase())).map((item) => {
                    return {
                        value: `${item.id}`,
                        text: `${item.id} - ${item.value}`,
                        keyForList: `${item.id}`,
                    };
                }),
            },
        ];
    }, [searchValue, shouldDisplayChildItems]);
    (0, react_1.useEffect)(() => {
        setSearchValue(value);
    }, [value]);
    return (<react_native_1.View style={styles.flexGrow1}>
            <SelectionList_1.default sections={sections} ListItem={RadioListItem_1.default} onSelectRow={(item) => {
            setSearchValue(item.value);
            setShouldDisplayChildItems(true);
            onInputChange?.(item.value);
        }} shouldStopPropagation textInputLabel={translate('companyStep.industryClassificationCodePlaceholder')} onChangeText={(val) => {
            setSearchValue(val);
            setShouldDisplayChildItems(false);
            onInputChange?.(val);
        }} textInputValue={searchValue} errorText={errorText}/>
        </react_native_1.View>);
}
IndustryCodeSelector.displayName = 'IndustryCodeSelector';
exports.default = (0, react_1.forwardRef)(IndustryCodeSelector);
