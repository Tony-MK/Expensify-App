"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const MissingPersonalDetailsContent_1 = require("./MissingPersonalDetailsContent");
function MissingPersonalDetails() {
    const [privatePersonalDetails, privatePersonalDetailsMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS);
    const [draftValues, draftValuesMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.PERSONAL_DETAILS_FORM_DRAFT);
    const isLoading = (0, isLoadingOnyxValue_1.default)(privatePersonalDetailsMetadata, draftValuesMetadata);
    if (isLoading) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<MissingPersonalDetailsContent_1.default privatePersonalDetails={privatePersonalDetails} draftValues={draftValues}/>);
}
MissingPersonalDetails.displayName = 'MissingPersonalDetails';
exports.default = MissingPersonalDetails;
