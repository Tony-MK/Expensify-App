"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ShareTabParticipantsSelector_1 = require("@components/Share/ShareTabParticipantsSelector");
var ROUTES_1 = require("@src/ROUTES");
function SubmitTabComponent(_props, ref) {
    return (<ShareTabParticipantsSelector_1.default ref={ref} detailsPageRouteObject={ROUTES_1.default.SHARE_SUBMIT_DETAILS}/>);
}
var SubmitTab = (0, react_1.forwardRef)(SubmitTabComponent);
exports.default = SubmitTab;
