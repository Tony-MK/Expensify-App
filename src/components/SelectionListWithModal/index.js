"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const Expensicons_1 = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const Modal_1 = require("@components/Modal");
const SelectionList_1 = require("@components/SelectionList");
const useLocalize_1 = require("@hooks/useLocalize");
const useMobileSelectionMode_1 = require("@hooks/useMobileSelectionMode");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const CONST_1 = require("@src/CONST");
function SelectionListWithModal({ turnOnSelectionModeOnLongPress, onTurnOnSelectionMode, onLongPressRow, isScreenFocused = false, sections, isSelected, selectedItems: selectedItemsProp, ...rest }, ref) {
    const [isModalVisible, setIsModalVisible] = (0, react_1.useState)(false);
    const [longPressedItem, setLongPressedItem] = (0, react_1.useState)(null);
    const { translate } = (0, useLocalize_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout here because there is a race condition that causes shouldUseNarrowLayout to change indefinitely in this component
    // See https://github.com/Expensify/App/issues/48675 for more details
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    // Check if selection should be on when the modal is opened
    const wasSelectionOnRef = (0, react_1.useRef)(false);
    // Keep track of the number of selected items to determine if we should turn off selection mode
    const selectionRef = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        // We can access 0 index safely as we are not displaying multiple sections in table view
        const selectedItems = selectedItemsProp ??
            sections[0].data.filter((item) => {
                if (isSelected) {
                    return isSelected(item);
                }
                return !!item.isSelected;
            });
        selectionRef.current = selectedItems.length;
        if (!isSmallScreenWidth) {
            if (selectedItems.length === 0 && isMobileSelectionModeEnabled) {
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
            }
            return;
        }
        if (!isFocused) {
            return;
        }
        if (!wasSelectionOnRef.current && selectedItems.length > 0) {
            wasSelectionOnRef.current = true;
        }
        if (selectedItems.length > 0 && !isMobileSelectionModeEnabled) {
            (0, MobileSelectionMode_1.turnOnMobileSelectionMode)();
        }
        else if (selectedItems.length === 0 && isMobileSelectionModeEnabled && !wasSelectionOnRef.current) {
            (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
        }
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [sections, selectedItemsProp, isMobileSelectionModeEnabled, isSmallScreenWidth, isSelected, isFocused]);
    (0, react_1.useEffect)(() => () => {
        if (selectionRef.current !== 0) {
            return;
        }
        (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
    }, []);
    const handleLongPressRow = (item) => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (!turnOnSelectionModeOnLongPress || !isSmallScreenWidth || item?.isDisabled || item?.isDisabledCheckbox || (!isFocused && !isScreenFocused)) {
            return;
        }
        if (isSmallScreenWidth && isMobileSelectionModeEnabled) {
            rest?.onCheckboxPress?.(item);
            return;
        }
        setLongPressedItem(item);
        setIsModalVisible(true);
        if (onLongPressRow) {
            onLongPressRow(item);
        }
    };
    const turnOnSelectionMode = () => {
        (0, MobileSelectionMode_1.turnOnMobileSelectionMode)();
        setIsModalVisible(false);
        if (onTurnOnSelectionMode) {
            onTurnOnSelectionMode(longPressedItem);
        }
    };
    return (<>
            <SelectionList_1.default ref={ref} sections={sections} selectedItems={selectedItemsProp} onLongPressRow={handleLongPressRow} isScreenFocused={isScreenFocused} isSmallScreenWidth={isSmallScreenWidth} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>
            <Modal_1.default isVisible={isModalVisible} type={CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED} onClose={() => setIsModalVisible(false)} shouldPreventScrollOnFocus>
                <MenuItem_1.default title={translate('common.select')} icon={Expensicons_1.CheckSquare} onPress={turnOnSelectionMode} pressableTestID={CONST_1.default.SELECTION_LIST_WITH_MODAL_TEST_ID}/>
            </Modal_1.default>
        </>);
}
exports.default = (0, react_1.forwardRef)(SelectionListWithModal);
