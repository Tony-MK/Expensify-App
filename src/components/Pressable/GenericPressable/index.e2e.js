"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPressableProps = getPressableProps;
const react_1 = require("react");
const react_native_1 = require("react-native");
const implementation_1 = require("./implementation");
const pressableRegistry = new Map();
function getPressableProps(testId) {
    return pressableRegistry.get(testId);
}
function E2EGenericPressableWrapper({ ref, ...props }) {
    (0, react_1.useEffect)(() => {
        const testId = props.testID;
        if (!testId) {
            return;
        }
        console.debug(`[E2E] E2EGenericPressableWrapper: Registering pressable with testID: ${testId}`);
        pressableRegistry.set(testId, props);
        react_native_1.DeviceEventEmitter.emit('onBecameVisible', testId);
    }, [props]);
    return (<implementation_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref}/>);
}
E2EGenericPressableWrapper.displayName = 'E2EGenericPressableWrapper';
exports.default = E2EGenericPressableWrapper;
