"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isBoolean_1 = require("lodash/isBoolean");
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const PolicyConnections_1 = require("@libs/actions/PolicyConnections");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const withPolicy_1 = require("./withPolicy");
/**
 * Higher-order component that fetches the connections data and populates
 * the corresponding field of the policy object if the field is empty. It then passes the policy object
 * to the wrapped component.
 *
 * Use this HOC when you need the policy object with its connections field populated.
 *
 * Only the active policy gets the complete policy data upon app start that includes the connections data.
 * For other policies, the connections data needs to be fetched when it's needed.
 */
function withPolicyConnections(WrappedComponent, shouldBlockView = true) {
    function WithPolicyConnections(props) {
        const { isOffline } = (0, useNetwork_1.default)();
        const [hasConnectionsDataBeenFetched, hasConnectionsDataBeenFetchedResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_HAS_CONNECTIONS_DATA_BEEN_FETCHED}${props.policy?.id ?? '-1'}`);
        const isOnyxDataLoading = (0, isLoadingOnyxValue_1.default)(hasConnectionsDataBeenFetchedResult);
        const isConnectionDataFetchNeeded = !isOnyxDataLoading && !isOffline && !!props.policy && (!!props.policy.areConnectionsEnabled || !(0, EmptyObject_1.isEmptyObject)(props.policy.connections)) && !hasConnectionsDataBeenFetched;
        const [isFetchingData, setIsFetchingData] = (0, react_1.useState)(false);
        const prevHasConnectionsDataBeenFetched = (0, usePrevious_1.default)(hasConnectionsDataBeenFetched);
        (0, react_1.useEffect)(() => {
            if (prevHasConnectionsDataBeenFetched !== undefined || !(0, isBoolean_1.default)(hasConnectionsDataBeenFetched)) {
                return;
            }
            setIsFetchingData(false);
        }, [hasConnectionsDataBeenFetched, prevHasConnectionsDataBeenFetched]);
        (0, react_1.useEffect)(() => {
            // When the accounting feature is not enabled, or if the connections data already exists,
            // there is no need to fetch the connections data.
            if (!isConnectionDataFetchNeeded || !props.policy?.id) {
                return;
            }
            setIsFetchingData(true);
            (0, PolicyConnections_1.openPolicyAccountingPage)(props.policy.id);
        }, [props.policy?.id, isConnectionDataFetchNeeded]);
        if ((isConnectionDataFetchNeeded || isFetchingData || isOnyxDataLoading) && shouldBlockView) {
            return <FullscreenLoadingIndicator_1.default />;
        }
        return (<WrappedComponent 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} isConnectionDataFetchNeeded={isConnectionDataFetchNeeded}/>);
    }
    return (0, withPolicy_1.default)(WithPolicyConnections);
}
exports.default = withPolicyConnections;
