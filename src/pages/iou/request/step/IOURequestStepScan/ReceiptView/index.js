"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AttachmentCarouselView_1 = require("@components/Attachments/AttachmentCarousel/AttachmentCarouselView");
const useCarouselArrows_1 = require("@components/Attachments/AttachmentCarousel/useCarouselArrows");
const useAttachmentErrors_1 = require("@components/Attachments/AttachmentView/useAttachmentErrors");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const TransactionEdit_1 = require("@userActions/TransactionEdit");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const getEmptyArray_1 = require("@src/types/utils/getEmptyArray");
function ReceiptView({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const { setAttachmentError } = (0, useAttachmentErrors_1.default)();
    const { shouldShowArrows, setShouldShowArrows, autoHideArrows, cancelAutoHideArrows } = (0, useCarouselArrows_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [currentReceipt, setCurrentReceipt] = (0, react_1.useState)();
    const [page, setPage] = (0, react_1.useState)(-1);
    const [isDeleteReceiptConfirmModalVisible, setIsDeleteReceiptConfirmModalVisible] = (0, react_1.useState)(false);
    const [receipts = (0, getEmptyArray_1.default)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT, {
        selector: (items) => Object.values(items ?? {})
            .map((transaction) => (transaction?.receipt ? { ...transaction?.receipt, transactionID: transaction.transactionID } : undefined))
            .filter((receipt) => !!receipt),
        canBeMissing: true,
    });
    const secondTransactionID = receipts.at(1)?.transactionID;
    const [secondTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${secondTransactionID}`, { canBeMissing: true });
    (0, react_1.useEffect)(() => {
        if (!receipts || receipts.length === 0) {
            return;
        }
        const activeReceipt = receipts.find((receipt) => receipt.transactionID === route?.params?.transactionID);
        const activeReceiptIndex = receipts.findIndex((receipt) => receipt.transactionID === activeReceipt?.transactionID);
        setCurrentReceipt(activeReceipt);
        setPage(activeReceiptIndex);
    }, [receipts, route?.params?.transactionID]);
    const handleDeleteReceipt = (0, react_1.useCallback)(() => {
        if (!currentReceipt) {
            return;
        }
        react_native_1.InteractionManager.runAfterInteractions(() => {
            if (currentReceipt.transactionID === CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID) {
                if (receipts.length === 1) {
                    (0, TransactionEdit_1.removeTransactionReceipt)(currentReceipt.transactionID);
                    return;
                }
                (0, TransactionEdit_1.replaceDefaultDraftTransaction)(secondTransactionID ? secondTransaction : undefined);
                return;
            }
            (0, TransactionEdit_1.removeDraftTransaction)(currentReceipt.transactionID);
        });
        Navigation_1.default.goBack();
    }, [currentReceipt, receipts.length, secondTransaction, secondTransactionID]);
    const handleCloseConfirmModal = () => {
        setIsDeleteReceiptConfirmModalVisible(false);
    };
    const deleteReceipt = (0, react_1.useCallback)(() => {
        handleCloseConfirmModal();
        handleDeleteReceipt();
    }, [handleDeleteReceipt]);
    const handleGoBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(route.params.backTo);
    }, [route.params.backTo]);
    return (<ScreenWrapper_1.default testID={ReceiptView.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('common.receipt')} shouldDisplayHelpButton={false} onBackButtonPress={handleGoBack} onCloseButtonPress={handleCloseConfirmModal}>
                <Button_1.default shouldShowRightIcon iconRight={Expensicons.Trashcan} onPress={() => setIsDeleteReceiptConfirmModalVisible(true)} innerStyles={styles.bgTransparent} large/>
            </HeaderWithBackButton_1.default>
            <AttachmentCarouselView_1.default attachments={receipts} source={currentReceipt?.source ?? ''} page={page} setPage={setPage} attachmentID={currentReceipt?.transactionID} onClose={handleGoBack} autoHideArrows={autoHideArrows} cancelAutoHideArrow={cancelAutoHideArrows} setShouldShowArrows={setShouldShowArrows} onAttachmentError={setAttachmentError} shouldShowArrows={shouldShowArrows}/>
            <ConfirmModal_1.default title={translate('receipt.deleteReceipt')} isVisible={isDeleteReceiptConfirmModalVisible} onConfirm={deleteReceipt} onCancel={handleCloseConfirmModal} prompt={translate('receipt.deleteConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} onBackdropPress={handleCloseConfirmModal} danger/>
        </ScreenWrapper_1.default>);
}
ReceiptView.displayName = 'ReceiptView';
exports.default = ReceiptView;
