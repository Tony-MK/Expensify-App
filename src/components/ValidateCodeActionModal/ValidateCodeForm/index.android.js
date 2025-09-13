"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const BaseValidateCodeForm_1 = require("./BaseValidateCodeForm");
const ValidateCodeForm = (0, react_1.forwardRef)((props, ref) => (<BaseValidateCodeForm_1.default autoComplete="sms-otp" 
// eslint-disable-next-line react/jsx-props-no-spreading
{...props} innerRef={ref}/>));
exports.default = (0, react_native_gesture_handler_1.gestureHandlerRootHOC)(ValidateCodeForm);
