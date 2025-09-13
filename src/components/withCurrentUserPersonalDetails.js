"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
var react_1 = require("react");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var getComponentDisplayName_1 = require("@libs/getComponentDisplayName");
function default_1(WrappedComponent) {
    function WithCurrentUserPersonalDetails(props) {
        var currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
        return (<WrappedComponent 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} currentUserPersonalDetails={currentUserPersonalDetails}/>);
    }
    WithCurrentUserPersonalDetails.displayName = "WithCurrentUserPersonalDetails(".concat((0, getComponentDisplayName_1.default)(WrappedComponent), ")");
    return WithCurrentUserPersonalDetails;
}
