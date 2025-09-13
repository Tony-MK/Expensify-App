"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const FullPageOfflineBlockingView_1 = require("./BlockingViews/FullPageOfflineBlockingView");
const CurrencySelectionList_1 = require("./CurrencySelectionList");
const HeaderWithBackButton_1 = require("./HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("./MenuItemWithTopDescription");
const Modal_1 = require("./Modal");
const ScreenWrapper_1 = require("./ScreenWrapper");
function CurrencyPicker({ label, value, errorText, headerContent, excludeCurrencies, disabled = false, shouldShowFullPageOfflineView = false, onInputChange = () => { } }) {
    const { translate } = (0, useLocalize_1.default)();
    const [isPickerVisible, setIsPickerVisible] = (0, react_1.useState)(false);
    const styles = (0, useThemeStyles_1.default)();
    const hidePickerModal = () => {
        setIsPickerVisible(false);
    };
    const updateInput = (item) => {
        onInputChange?.(item.currencyCode);
        hidePickerModal();
    };
    const BlockingComponent = shouldShowFullPageOfflineView ? FullPageOfflineBlockingView_1.default : react_1.Fragment;
    return (<>
            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={value ? `${value} - ${(0, CurrencyUtils_1.getCurrencySymbol)(value)}` : undefined} description={label} onPress={() => setIsPickerVisible(true)} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText} disabled={disabled}/>
            <Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isPickerVisible} onClose={hidePickerModal} onModalHide={hidePickerModal} shouldEnableNewFocusManagement onBackdropPress={Navigation_1.default.dismissModal} shouldUseModalPaddingStyle={false} shouldHandleNavigationBack enableEdgeToEdgeBottomSafeAreaPadding>
                <ScreenWrapper_1.default style={[styles.pb0]} testID={CurrencyPicker.displayName} shouldEnableMaxHeight enableEdgeToEdgeBottomSafeAreaPadding>
                    <HeaderWithBackButton_1.default title={label} shouldShowBackButton onBackButtonPress={hidePickerModal}/>
                    <BlockingComponent>
                        {!!headerContent && headerContent}
                        <CurrencySelectionList_1.default initiallySelectedCurrencyCode={value} onSelect={updateInput} searchInputLabel={translate('common.search')} excludedCurrencies={excludeCurrencies} addBottomSafeAreaPadding/>
                    </BlockingComponent>
                </ScreenWrapper_1.default>
            </Modal_1.default>
        </>);
}
CurrencyPicker.displayName = 'CurrencyPicker';
exports.default = CurrencyPicker;
