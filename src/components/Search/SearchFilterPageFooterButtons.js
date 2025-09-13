"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function SearchFilterPageFooterButtons({ resetChanges, applyChanges }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View>
            <Button_1.default large style={[styles.mt3]} text={translate('common.reset')} onPress={resetChanges}/>
            <Button_1.default large success pressOnEnter style={[styles.mt3]} text={translate('common.save')} onPress={applyChanges}/>
        </react_native_1.View>);
}
exports.default = SearchFilterPageFooterButtons;
