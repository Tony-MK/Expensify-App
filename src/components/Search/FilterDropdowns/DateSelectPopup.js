"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const SearchDatePresetFilterBase_1 = require("@components/Search/SearchDatePresetFilterBase");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function DateSelectPopup({ label, value, presets, closeOverlay, onChange }) {
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const searchDatePresetFilterBaseRef = (0, react_1.useRef)(null);
    const [selectedDateModifier, setSelectedDateModifier] = (0, react_1.useState)(null);
    const applyChanges = (0, react_1.useCallback)(() => {
        if (!searchDatePresetFilterBaseRef.current) {
            return;
        }
        if (selectedDateModifier) {
            searchDatePresetFilterBaseRef.current.setDateValueOfSelectedDateModifier();
            setSelectedDateModifier(null);
            return;
        }
        const dateValues = searchDatePresetFilterBaseRef.current.getDateValues();
        onChange(dateValues);
        closeOverlay();
    }, [closeOverlay, onChange, selectedDateModifier]);
    const resetChanges = (0, react_1.useCallback)(() => {
        if (!searchDatePresetFilterBaseRef.current) {
            return;
        }
        if (selectedDateModifier) {
            searchDatePresetFilterBaseRef.current.clearDateValueOfSelectedDateModifier();
            setSelectedDateModifier(null);
            return;
        }
        searchDatePresetFilterBaseRef.current.clearDateValues();
        onChange({
            [CONST_1.default.SEARCH.DATE_MODIFIERS.ON]: undefined,
            [CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE]: undefined,
            [CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER]: undefined,
        });
        closeOverlay();
    }, [closeOverlay, onChange, selectedDateModifier]);
    return (<react_native_1.View style={[!isSmallScreenWidth && styles.pv4, styles.gap2]}>
            {isSmallScreenWidth && !selectedDateModifier && <Text_1.default style={[styles.textLabel, styles.textSupporting, styles.ph5, styles.pv1]}>{label}</Text_1.default>}
            <react_native_1.View>
                {!!selectedDateModifier && (<HeaderWithBackButton_1.default shouldDisplayHelpButton={false} style={[styles.h10, styles.pb3]} subtitle={translate(`common.${selectedDateModifier.toLowerCase()}`)} onBackButtonPress={() => setSelectedDateModifier(null)}/>)}
                <SearchDatePresetFilterBase_1.default ref={searchDatePresetFilterBaseRef} defaultDateValues={value} selectedDateModifier={selectedDateModifier} onSelectDateModifier={setSelectedDateModifier} presets={presets}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.flexRow, styles.gap2, styles.ph5]}>
                <Button_1.default medium style={[styles.flex1]} text={translate('common.reset')} onPress={resetChanges}/>
                <Button_1.default success medium style={[styles.flex1]} text={translate('common.apply')} onPress={applyChanges}/>
            </react_native_1.View>
        </react_native_1.View>);
}
DateSelectPopup.displayName = 'DateSelectPopup';
exports.default = DateSelectPopup;
