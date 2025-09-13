"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PopoverReactionList_1 = require("./report/ReactionList/PopoverReactionList");
const ReportScreenContext_1 = require("./ReportScreenContext");
function ReactionListWrapper({ children }) {
    const reactionListRef = (0, react_1.useRef)(null);
    return (<ReportScreenContext_1.ReactionListContext.Provider value={reactionListRef}>
            {children}
            <PopoverReactionList_1.default ref={reactionListRef}/>
        </ReportScreenContext_1.ReactionListContext.Provider>);
}
exports.default = ReactionListWrapper;
