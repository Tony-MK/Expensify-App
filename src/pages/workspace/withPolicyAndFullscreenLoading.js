"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = withPolicyAndFullscreenLoading;
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const withPolicy_1 = require("./withPolicy");
function withPolicyAndFullscreenLoading(WrappedComponent) {
    function WithPolicyAndFullscreenLoading({ policy = withPolicy_1.policyDefaultProps.policy, policyDraft = withPolicy_1.policyDefaultProps.policyDraft, isLoadingPolicy = withPolicy_1.policyDefaultProps.isLoadingPolicy, ...rest }, ref) {
        const [isLoadingReportData = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_REPORT_DATA);
        const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST);
        if ((isLoadingPolicy || isLoadingReportData) && (0, isEmpty_1.default)(policy) && (0, isEmpty_1.default)(policyDraft)) {
            return <FullscreenLoadingIndicator_1.default />;
        }
        return (<WrappedComponent 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest} isLoadingReportData={isLoadingReportData} personalDetails={personalDetails} policy={policy} policyDraft={policyDraft} ref={ref}/>);
    }
    WithPolicyAndFullscreenLoading.displayName = `WithPolicyAndFullscreenLoading`;
    return (0, withPolicy_1.default)((0, react_1.forwardRef)(WithPolicyAndFullscreenLoading));
}
