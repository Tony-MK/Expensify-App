"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var AttachmentCarouselView_1 = require("@components/Attachments/AttachmentCarousel/AttachmentCarouselView");
var useCarouselArrows_1 = require("@components/Attachments/AttachmentCarousel/useCarouselArrows");
var useAttachmentErrors_1 = require("@components/Attachments/AttachmentView/useAttachmentErrors");
var Button_1 = require("@components/Button");
var ConfirmModal_1 = require("@components/ConfirmModal");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Expensicons = require("@components/Icon/Expensicons");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Navigation_1 = require("@libs/Navigation/Navigation");
var TransactionEdit_1 = require("@userActions/TransactionEdit");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var getEmptyArray_1 = require("@src/types/utils/getEmptyArray");
function ReceiptView(_a) {
    var _b, _c, _d;
    var route = _a.route;
    var translate = (0, useLocalize_1.default)().translate;
    var setAttachmentError = (0, useAttachmentErrors_1.default)().setAttachmentError;
    var _e = (0, useCarouselArrows_1.default)(), shouldShowArrows = _e.shouldShowArrows, setShouldShowArrows = _e.setShouldShowArrows, autoHideArrows = _e.autoHideArrows, cancelAutoHideArrows = _e.cancelAutoHideArrows;
    var styles = (0, useThemeStyles_1.default)();
    var _f = (0, react_1.useState)(), currentReceipt = _f[0], setCurrentReceipt = _f[1];
    var _g = (0, react_1.useState)(-1), page = _g[0], setPage = _g[1];
    var _h = (0, react_1.useState)(false), isDeleteReceiptConfirmModalVisible = _h[0], setIsDeleteReceiptConfirmModalVisible = _h[1];
    var _j = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT, {
        selector: function (items) {
            return Object.values(items !== null && items !== void 0 ? items : {})
                .map(function (transaction) { return ((transaction === null || transaction === void 0 ? void 0 : transaction.receipt) ? __assign(__assign({}, transaction === null || transaction === void 0 ? void 0 : transaction.receipt), { transactionID: transaction.transactionID }) : undefined); })
                .filter(function (receipt) { return !!receipt; });
        },
        canBeMissing: true,
    })[0], receipts = _j === void 0 ? (0, getEmptyArray_1.default)() : _j;
    var secondTransactionID = (_b = receipts.at(1)) === null || _b === void 0 ? void 0 : _b.transactionID;
    var secondTransaction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(secondTransactionID), { canBeMissing: true })[0];
    (0, react_1.useEffect)(function () {
        if (!receipts || receipts.length === 0) {
            return;
        }
        var activeReceipt = receipts.find(function (receipt) { var _a; return receipt.transactionID === ((_a = route === null || route === void 0 ? void 0 : route.params) === null || _a === void 0 ? void 0 : _a.transactionID); });
        var activeReceiptIndex = receipts.findIndex(function (receipt) { return receipt.transactionID === (activeReceipt === null || activeReceipt === void 0 ? void 0 : activeReceipt.transactionID); });
        setCurrentReceipt(activeReceipt);
        setPage(activeReceiptIndex);
    }, [receipts, (_c = route === null || route === void 0 ? void 0 : route.params) === null || _c === void 0 ? void 0 : _c.transactionID]);
    var handleDeleteReceipt = (0, react_1.useCallback)(function () {
        if (!currentReceipt) {
            return;
        }
        react_native_1.InteractionManager.runAfterInteractions(function () {
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
    var handleCloseConfirmModal = function () {
        setIsDeleteReceiptConfirmModalVisible(false);
    };
    var deleteReceipt = (0, react_1.useCallback)(function () {
        handleCloseConfirmModal();
        handleDeleteReceipt();
    }, [handleDeleteReceipt]);
    var handleGoBack = (0, react_1.useCallback)(function () {
        Navigation_1.default.goBack(route.params.backTo);
    }, [route.params.backTo]);
    return (<ScreenWrapper_1.default testID={ReceiptView.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('common.receipt')} shouldDisplayHelpButton={false} onBackButtonPress={handleGoBack} onCloseButtonPress={handleCloseConfirmModal}>
                <Button_1.default shouldShowRightIcon iconRight={Expensicons.Trashcan} onPress={function () { return setIsDeleteReceiptConfirmModalVisible(true); }} innerStyles={styles.bgTransparent} large/>
            </HeaderWithBackButton_1.default>
            <AttachmentCarouselView_1.default attachments={receipts} source={(_d = currentReceipt === null || currentReceipt === void 0 ? void 0 : currentReceipt.source) !== null && _d !== void 0 ? _d : ''} page={page} setPage={setPage} attachmentID={currentReceipt === null || currentReceipt === void 0 ? void 0 : currentReceipt.transactionID} onClose={handleGoBack} autoHideArrows={autoHideArrows} cancelAutoHideArrow={cancelAutoHideArrows} setShouldShowArrows={setShouldShowArrows} onAttachmentError={setAttachmentError} shouldShowArrows={shouldShowArrows}/>
            <ConfirmModal_1.default title={translate('receipt.deleteReceipt')} isVisible={isDeleteReceiptConfirmModalVisible} onConfirm={deleteReceipt} onCancel={handleCloseConfirmModal} prompt={translate('receipt.deleteConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} onBackdropPress={handleCloseConfirmModal} danger/>
        </ScreenWrapper_1.default>);
}
ReceiptView.displayName = 'ReceiptView';
exports.default = ReceiptView;
