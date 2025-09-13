"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CONST_1 = require("@src/CONST");
const useHandleExceedMaxTaskTitleLength = () => {
    const [hasExceededMaxTaskTitleLength, setHasExceededMaxTitleLength] = (0, react_1.useState)(false);
    const validateTaskTitleMaxLength = (0, react_1.useCallback)((title) => {
        const exceeded = title ? title.length > CONST_1.default.TITLE_CHARACTER_LIMIT : false;
        setHasExceededMaxTitleLength(exceeded);
    }, []);
    return { hasExceededMaxTaskTitleLength, validateTaskTitleMaxLength, setHasExceededMaxTitleLength };
};
exports.default = useHandleExceedMaxTaskTitleLength;
