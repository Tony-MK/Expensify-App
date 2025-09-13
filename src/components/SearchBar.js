"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const Expensicons_1 = require("./Icon/Expensicons");
const Text_1 = require("./Text");
const TextInput_1 = require("./TextInput");
function SearchBar({ label, style, icon = Expensicons_1.MagnifyingGlass, inputValue, onChangeText, onSubmitEditing, shouldShowEmptyState }) {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<>
            <react_native_1.View style={[styles.getSearchBarStyle(shouldUseNarrowLayout), style]}>
                <TextInput_1.default label={label} accessibilityLabel={label} role={CONST_1.default.ROLE.PRESENTATION} value={inputValue} onChangeText={onChangeText} inputMode={CONST_1.default.INPUT_MODE.TEXT} selectTextOnFocus spellCheck={false} icon={inputValue?.length ? undefined : icon} iconContainerStyle={styles.p0} onSubmitEditing={() => onSubmitEditing?.(inputValue)} shouldShowClearButton shouldHideClearButton={!inputValue?.length}/>
            </react_native_1.View>
            {!!shouldShowEmptyState && inputValue.length !== 0 && (<react_native_1.View style={[styles.ph5, styles.pt3, styles.pb5]}>
                    <Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('common.noResultsFoundMatching', { searchString: inputValue })}</Text_1.default>
                </react_native_1.View>)}
        </>);
}
SearchBar.displayName = 'SearchBar';
exports.default = SearchBar;
