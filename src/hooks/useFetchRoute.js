"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useFetchRoute;
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const Transaction_1 = require("@libs/actions/Transaction");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const useNetwork_1 = require("./useNetwork");
const usePrevious_1 = require("./usePrevious");
function useFetchRoute(transaction, waypoints, action, transactionState = CONST_1.default.TRANSACTION.STATE.CURRENT) {
    const { isOffline } = (0, useNetwork_1.default)();
    const hasRouteError = !!transaction?.errorFields?.route;
    const hasRoute = (0, TransactionUtils_1.hasRoute)(transaction);
    const isRouteAbsentWithoutErrors = !hasRoute && !hasRouteError;
    const isLoadingRoute = transaction?.comment?.isLoading ?? false;
    const validatedWaypoints = (0, TransactionUtils_1.getValidWaypoints)(waypoints);
    const previousValidatedWaypoints = (0, usePrevious_1.default)(validatedWaypoints);
    const haveValidatedWaypointsChanged = !(0, fast_equals_1.deepEqual)(previousValidatedWaypoints, validatedWaypoints);
    const isMapDistanceRequest = (0, TransactionUtils_1.isDistanceRequest)(transaction) && !(0, TransactionUtils_1.isManualDistanceRequest)(transaction);
    const shouldFetchRoute = isMapDistanceRequest && (isRouteAbsentWithoutErrors || haveValidatedWaypointsChanged) && !isLoadingRoute && Object.keys(validatedWaypoints).length > 1;
    (0, react_1.useEffect)(() => {
        if (isOffline || !shouldFetchRoute || !transaction?.transactionID) {
            return;
        }
        (0, Transaction_1.getRoute)(transaction.transactionID, validatedWaypoints, transactionState);
    }, [shouldFetchRoute, transaction?.transactionID, validatedWaypoints, isOffline, action, transactionState]);
    return { shouldFetchRoute, validatedWaypoints };
}
