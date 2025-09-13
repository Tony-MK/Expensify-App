"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const NumberWithSymbolForm_1 = require("@components/NumberWithSymbolForm");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function AmountSelectorModal({ value, description = '', onValueSelected, isVisible, onClose, ...rest }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [currentValue, setValue] = (0, react_1.useState)(value);
    const inputRef = (0, react_1.useRef)(null);
    const focusTimeoutRef = (0, react_1.useRef)(null);
    const inputCallbackRef = (ref) => {
        inputRef.current = ref;
    };
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => {
            if (inputRef.current && isVisible) {
                inputRef.current.focus();
            }
            return () => {
                if (!focusTimeoutRef.current || !isVisible) {
                    return;
                }
                clearTimeout(focusTimeoutRef.current);
            };
        }, CONST_1.default.ANIMATED_TRANSITION);
    }, [isVisible, inputRef]));
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={onClose} onModalHide={onClose} enableEdgeToEdgeBottomSafeAreaPadding>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding includePaddingTop={false} testID={AmountSelectorModal.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={description} onBackButtonPress={onClose}/>
                <ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.mb5]} addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.flex1}>
                        <NumberWithSymbolForm_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} value={currentValue} onInputChange={setValue} ref={(ref) => inputCallbackRef(ref)}/>
                        <Button_1.default success large pressOnEnter text={translate('common.save')} onPress={() => onValueSelected?.(currentValue ?? '')} style={styles.mh5}/>
                    </react_native_1.View>
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
AmountSelectorModal.displayName = 'AmountSelectorModal';
exports.default = AmountSelectorModal;
