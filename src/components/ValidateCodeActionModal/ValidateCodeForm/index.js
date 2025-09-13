"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseValidateCodeForm_1 = require("./BaseValidateCodeForm");
const ValidateCodeForm = (0, react_1.forwardRef)((props, ref) => (<BaseValidateCodeForm_1.default autoComplete="one-time-code" 
// eslint-disable-next-line react/jsx-props-no-spreading
{...props} innerRef={ref}/>));
exports.default = ValidateCodeForm;
