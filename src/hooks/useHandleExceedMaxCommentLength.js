"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ReportUtils = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const useHandleExceedMaxCommentLength = () => {
    const [hasExceededMaxCommentLength, setHasExceededMaxCommentLength] = (0, react_1.useState)(false);
    const validateCommentMaxLength = (0, react_1.useCallback)((value, parsingDetails) => {
        if (ReportUtils.getCommentLength(value, parsingDetails) <= CONST_1.default.MAX_COMMENT_LENGTH) {
            if (hasExceededMaxCommentLength) {
                setHasExceededMaxCommentLength(false);
            }
            return;
        }
        setHasExceededMaxCommentLength(true);
    }, [hasExceededMaxCommentLength]);
    return { hasExceededMaxCommentLength, validateCommentMaxLength, setHasExceededMaxCommentLength };
};
exports.default = useHandleExceedMaxCommentLength;
