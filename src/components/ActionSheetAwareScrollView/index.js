"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actions = exports.ActionSheetAwareScrollViewProvider = exports.ActionSheetAwareScrollViewContext = exports.renderScrollComponent = void 0;
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const ActionSheetAwareScrollViewContext_1 = require("./ActionSheetAwareScrollViewContext");
Object.defineProperty(exports, "Actions", { enumerable: true, get: function () { return ActionSheetAwareScrollViewContext_1.Actions; } });
Object.defineProperty(exports, "ActionSheetAwareScrollViewContext", { enumerable: true, get: function () { return ActionSheetAwareScrollViewContext_1.ActionSheetAwareScrollViewContext; } });
Object.defineProperty(exports, "ActionSheetAwareScrollViewProvider", { enumerable: true, get: function () { return ActionSheetAwareScrollViewContext_1.ActionSheetAwareScrollViewProvider; } });
const ActionSheetAwareScrollView = (0, react_1.forwardRef)((props, ref) => (<react_native_1.ScrollView ref={ref} 
// eslint-disable-next-line react/jsx-props-no-spreading
{...props}>
        {props.children}
    </react_native_1.ScrollView>));
exports.default = ActionSheetAwareScrollView;
/**
 * This is only used on iOS. On other platforms it's just undefined to be pass a prop to FlatList
 *
 * This function should be used as renderScrollComponent prop for FlatList
 * @param {Object} props - props that will be passed to the ScrollView from FlatList
 * @returns {React.ReactElement} - ActionSheetAwareScrollView
 */
const renderScrollComponent = undefined;
exports.renderScrollComponent = renderScrollComponent;
