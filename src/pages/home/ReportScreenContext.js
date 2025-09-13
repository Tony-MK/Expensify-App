"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionListContext = exports.ActionListContext = void 0;
const react_1 = require("react");
const ActionListContext = (0, react_1.createContext)({ flatListRef: null, scrollPosition: null, setScrollPosition: () => { } });
exports.ActionListContext = ActionListContext;
const ReactionListContext = (0, react_1.createContext)(null);
exports.ReactionListContext = ReactionListContext;
