"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_permissions_1 = require("react-native-permissions");
const ConfirmModal_1 = require("@components/ConfirmModal");
const Illustrations = require("@components/Icon/Illustrations");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ContactPermission_1 = require("@libs/ContactPermission");
let hasShownContactImportPromptThisSession = false;
function ContactPermissionModal({ onDeny, onGrant, onFocusTextInput }) {
    const [isModalVisible, setIsModalVisible] = (0, react_1.useState)(false);
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    (0, react_1.useEffect)(() => {
        if (hasShownContactImportPromptThisSession) {
            onFocusTextInput();
            return;
        }
        (0, ContactPermission_1.getContactPermission)().then((status) => {
            // Permission hasn't been asked yet, show the soft permission modal
            if (status !== react_native_permissions_1.RESULTS.DENIED) {
                onFocusTextInput();
                return;
            }
            hasShownContactImportPromptThisSession = true;
            setIsModalVisible(true);
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const handleGrantPermission = () => {
        setIsModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            (0, ContactPermission_1.requestContactPermission)().then((status) => {
                onFocusTextInput();
                if (status !== react_native_permissions_1.RESULTS.GRANTED) {
                    return;
                }
                onGrant();
            });
        });
    };
    const handleCloseModal = () => {
        setIsModalVisible(false);
        onDeny(react_native_permissions_1.RESULTS.DENIED);
        // Sometimes, the input gains focus when the modal closes, but the keyboard doesn't appear.
        // To fix this, we need to call the focus function after the modal has finished closing.
        react_native_1.InteractionManager.runAfterInteractions(() => {
            onFocusTextInput();
        });
    };
    return (<ConfirmModal_1.default isVisible={isModalVisible} onConfirm={handleGrantPermission} onCancel={handleCloseModal} onBackdropPress={handleCloseModal} confirmText={translate('common.continue')} cancelText={translate('common.notNow')} prompt={translate('contact.importContactsText')} promptStyles={[styles.textLabelSupportingEmptyValue, styles.mb4]} title={translate('contact.importContactsTitle')} titleContainerStyles={[styles.mt2, styles.mb0]} titleStyles={[styles.textHeadline]} iconSource={Illustrations.ToddWithPhones} iconFill={false} iconWidth={176} iconHeight={178} shouldCenterIcon shouldReverseStackedButtons/>);
}
ContactPermissionModal.displayName = 'ContactPermissionModal';
exports.default = ContactPermissionModal;
