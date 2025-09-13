"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const CONST_1 = require("@src/CONST");
const keyboard_1 = require("@src/utils/keyboard");
const PushRowModal_1 = require("./PushRowModal");
function PushRowWithModal({ value, optionsList, wrapperStyles, description, modalHeaderTitle, searchInputTitle, shouldAllowChange = true, errorText, onInputChange = () => { }, stateInputIDToReset, onBlur = () => { }, }) {
    const [isModalVisible, setIsModalVisible] = (0, react_1.useState)(false);
    const shouldBlurOnCloseRef = (0, react_1.useRef)(true);
    const handleModalClose = () => {
        if (shouldBlurOnCloseRef.current) {
            onBlur?.();
        }
        keyboard_1.default.dismiss().then(() => {
            setIsModalVisible(false);
        });
    };
    const handleModalOpen = () => {
        setIsModalVisible(true);
    };
    const handleOptionChange = (optionValue) => {
        onInputChange(optionValue);
        shouldBlurOnCloseRef.current = false;
        if (stateInputIDToReset) {
            onInputChange('', stateInputIDToReset);
        }
    };
    return (<>
            <MenuItemWithTopDescription_1.default description={description} title={value ? optionsList[value] : ''} shouldShowRightIcon={shouldAllowChange} onPress={handleModalOpen} wrapperStyle={wrapperStyles} interactive={shouldAllowChange} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText}/>
            <PushRowModal_1.default isVisible={isModalVisible} selectedOption={value ?? ''} onOptionChange={handleOptionChange} onClose={handleModalClose} optionsList={optionsList} headerTitle={modalHeaderTitle} searchInputTitle={searchInputTitle}/>
        </>);
}
PushRowWithModal.displayName = 'PushRowWithModal';
exports.default = PushRowWithModal;
