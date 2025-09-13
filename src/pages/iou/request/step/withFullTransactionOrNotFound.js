"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const useOnyx_1 = require("@hooks/useOnyx");
const getComponentDisplayName_1 = require("@libs/getComponentDisplayName");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const IOUUtils_1 = require("@libs/IOUUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function default_1(WrappedComponent) {
    // eslint-disable-next-line rulesdir/no-negated-variables
    function WithFullTransactionOrNotFound(props) {
        const { route } = props;
        const transactionID = route.params.transactionID;
        const userAction = 'action' in route.params && route.params.action ? route.params.action : CONST_1.default.IOU.ACTION.CREATE;
        const [transaction, transactionResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
        const [transactionDraft, transactionDraftResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
        const isLoadingTransaction = (0, isLoadingOnyxValue_1.default)(transactionResult, transactionDraftResult);
        const [splitTransactionDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
        const userType = 'iouType' in route.params && route.params.iouType ? route.params.iouType : CONST_1.default.IOU.TYPE.CREATE;
        const isFocused = (0, native_1.useIsFocused)();
        const transactionDraftData = userType === CONST_1.default.IOU.TYPE.SPLIT_EXPENSE ? splitTransactionDraft : transactionDraft;
        // If the transaction does not have a transactionID, then the transaction no longer exists in Onyx as a full transaction and the not-found page should be shown.
        // In addition, the not-found page should be shown only if the component screen's route is active (i.e. is focused).
        // This is to prevent it from showing when the modal is being dismissed while navigating to a different route (e.g. on requesting money).
        if (!transactionID) {
            return <FullPageNotFoundView_1.default shouldShow={isFocused}/>;
        }
        return (<WrappedComponent 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} transaction={(0, IOUUtils_1.shouldUseTransactionDraft)(userAction, userType) ? transactionDraftData : transaction} isLoadingTransaction={isLoadingTransaction}/>);
    }
    WithFullTransactionOrNotFound.displayName = `withFullTransactionOrNotFound(${(0, getComponentDisplayName_1.default)(WrappedComponent)})`;
    return WithFullTransactionOrNotFound;
}
