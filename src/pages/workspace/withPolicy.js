"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.policyDefaultProps = void 0;
exports.default = default_1;
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const Policy_1 = require("@userActions/Policy/Policy");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function getPolicyIDFromRoute(route) {
    return route?.params?.policyID;
}
const policyDefaultProps = {
    policy: {},
    policyDraft: {},
    isLoadingPolicy: false,
};
exports.policyDefaultProps = policyDefaultProps;
/*
 * HOC for connecting a policy in Onyx corresponding to the policyID in route params
 */
function default_1(WrappedComponent) {
    function WithPolicy(props, ref) {
        const policyID = getPolicyIDFromRoute(props.route);
        const [hasLoadedApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.HAS_LOADED_APP, { canBeMissing: true });
        const [policy, policyResults] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
        const [policyDraft, policyDraftResults] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_DRAFTS}${policyID}`, { canBeMissing: true });
        /* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */
        const isLoadingPolicy = !hasLoadedApp || (0, isLoadingOnyxValue_1.default)(policyResults, policyDraftResults);
        if (policyID && policyID.length > 0) {
            (0, Policy_1.updateLastAccessedWorkspace)(policyID);
        }
        return (<WrappedComponent 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} policy={policy} policyDraft={policyDraft} isLoadingPolicy={isLoadingPolicy} ref={ref}/>);
    }
    WithPolicy.displayName = `WithPolicy`;
    return (0, react_1.forwardRef)(WithPolicy);
}
