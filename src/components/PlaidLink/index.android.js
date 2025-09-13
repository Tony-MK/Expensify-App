"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BaseNativePlaidLink_1 = require("./BaseNativePlaidLink");
const { AppStateTracker } = react_native_1.NativeModules;
function PlaidLink({ onExit = () => { }, ...restProps }) {
    const [key, setKey] = (0, react_1.useState)(0);
    return (<BaseNativePlaidLink_1.default key={key} onExit={() => {
            AppStateTracker.getWasAppRelaunchedFromIcon().then((wasAppRelaunchedFromIcon) => {
                if (wasAppRelaunchedFromIcon) {
                    setKey((prevKey) => prevKey + 1);
                    return;
                }
                onExit();
            });
        }} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restProps}/>);
}
exports.default = PlaidLink;
