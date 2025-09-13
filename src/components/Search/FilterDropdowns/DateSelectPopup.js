"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var SearchDatePresetFilterBase_1 = require("@components/Search/SearchDatePresetFilterBase");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CONST_1 = require("@src/CONST");
function DateSelectPopup(_a) {
    var label = _a.label, value = _a.value, presets = _a.presets, closeOverlay = _a.closeOverlay, onChange = _a.onChange;
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var searchDatePresetFilterBaseRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(null), selectedDateModifier = _b[0], setSelectedDateModifier = _b[1];
    var applyChanges = (0, react_1.useCallback)(function () {
        if (!searchDatePresetFilterBaseRef.current) {
            return;
        }
        if (selectedDateModifier) {
            searchDatePresetFilterBaseRef.current.setDateValueOfSelectedDateModifier();
            setSelectedDateModifier(null);
            return;
        }
        var dateValues = searchDatePresetFilterBaseRef.current.getDateValues();
        onChange(dateValues);
        closeOverlay();
    }, [closeOverlay, onChange, selectedDateModifier]);
    var resetChanges = (0, react_1.useCallback)(function () {
        var _a;
        if (!searchDatePresetFilterBaseRef.current) {
            return;
        }
        if (selectedDateModifier) {
            searchDatePresetFilterBaseRef.current.clearDateValueOfSelectedDateModifier();
            setSelectedDateModifier(null);
            return;
        }
        searchDatePresetFilterBaseRef.current.clearDateValues();
        onChange((_a = {},
            _a[CONST_1.default.SEARCH.DATE_MODIFIERS.ON] = undefined,
            _a[CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE] = undefined,
            _a[CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER] = undefined,
            _a));
        closeOverlay();
    }, [closeOverlay, onChange, selectedDateModifier]);
    return (<react_native_1.View style={[!isSmallScreenWidth && styles.pv4, styles.gap2]}>
            {isSmallScreenWidth && !selectedDateModifier && <Text_1.default style={[styles.textLabel, styles.textSupporting, styles.ph5, styles.pv1]}>{label}</Text_1.default>}
            <react_native_1.View>
                {!!selectedDateModifier && (<HeaderWithBackButton_1.default shouldDisplayHelpButton={false} style={[styles.h10, styles.pb3]} subtitle={translate("common.".concat(selectedDateModifier.toLowerCase()))} onBackButtonPress={function () { return setSelectedDateModifier(null); }}/>)}
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
