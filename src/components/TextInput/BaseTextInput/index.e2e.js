"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const implementation_1 = require("./implementation");
function BaseTextInputE2E({ ref, ...props }) {
    (0, react_1.useEffect)(() => {
        const testId = props.testID;
        if (!testId) {
            return;
        }
        console.debug(`[E2E] BaseTextInput: text-input with testID: ${testId} changed text to ${props.value}`);
        react_native_1.DeviceEventEmitter.emit('onChangeText', { testID: testId, value: props.value });
    }, [props.value, props.testID]);
    return (<implementation_1.default ref={ref} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
exports.default = BaseTextInputE2E;
