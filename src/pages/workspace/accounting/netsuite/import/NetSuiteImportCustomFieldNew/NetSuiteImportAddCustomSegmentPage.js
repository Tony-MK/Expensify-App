"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const NetSuiteImportAddCustomSegmentContent_1 = require("./NetSuiteImportAddCustomSegmentContent");
function NetSuiteImportAddCustomSegmentPage({ policy }) {
    const [draftValues, draftValuesMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.NETSUITE_CUSTOM_SEGMENT_ADD_FORM_DRAFT);
    const isLoading = (0, isLoadingOnyxValue_1.default)(draftValuesMetadata);
    if (isLoading) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<NetSuiteImportAddCustomSegmentContent_1.default policy={policy} draftValues={draftValues}/>);
}
NetSuiteImportAddCustomSegmentPage.displayName = 'NetSuiteImportAddCustomSegmentPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteImportAddCustomSegmentPage);
